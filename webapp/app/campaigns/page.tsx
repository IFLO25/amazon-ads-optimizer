'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { campaignsApi } from '@/lib/api';

interface Campaign {
  campaignId: string;
  name: string;
  state: string;
  targetingType: string;
  budget?: {
    budget: number;
    budgetType: string;
  };
  startDate?: string;
  endDate?: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setError(null);
      const response = await campaignsApi.getAll();
      const data = response.data.campaigns || response.data || [];
      setCampaigns(data);
    } catch (error: any) {
      console.error('Fehler beim Laden der Kampagnen:', error);
      setError(error.message || 'Fehler beim Laden der Kampagnen');
    } finally {
      setLoading(false);
    }
  };

  const syncCampaigns = async () => {
    setSyncing(true);
    try {
      await campaignsApi.sync();
      await loadCampaigns();
    } catch (error) {
      console.error('Fehler beim Synchronisieren:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xl text-gray-300">Lade Kampagnen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <span>📊</span>
            Kampagnen
          </h1>
          <p className="mt-2 text-gray-400 text-lg">
            {campaigns.length} Amazon Advertising Kampagnen
          </p>
        </div>
        <button
          onClick={syncCampaigns}
          disabled={syncing}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 shadow-lg"
        >
          <RefreshCw className={`h-5 w-5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Synchronisiere...' : 'Synchronisieren'}
        </button>
      </div>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border border-blue-700 shadow-xl">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-3xl font-bold text-white">{campaigns.length}</div>
          <div className="text-sm text-blue-300 mt-1">Gesamt</div>
        </div>
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border border-green-700 shadow-xl">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-bold text-white">
            {campaigns.filter(c => c.state === 'ENABLED').length}
          </div>
          <div className="text-sm text-green-300 mt-1">Aktiv</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-xl p-6 border border-yellow-700 shadow-xl">
          <div className="text-3xl mb-2">⏸️</div>
          <div className="text-3xl font-bold text-white">
            {campaigns.filter(c => c.state === 'PAUSED').length}
          </div>
          <div className="text-sm text-yellow-300 mt-1">Pausiert</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border border-purple-700 shadow-xl">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-3xl font-bold text-white">
            {campaigns.filter(c => c.targetingType === 'AUTO').length}
          </div>
          <div className="text-sm text-purple-300 mt-1">Automatisch</div>
        </div>
      </div>

      {/* Tabelle */}
      <div className="rounded-xl bg-gray-800 border border-gray-700 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Kampagnenname
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Targeting
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Budget
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Startdatum
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-gray-400 text-lg">
                      {error ? error : 'Keine Kampagnen gefunden. Klicke auf "Synchronisieren" um Daten zu laden.'}
                    </p>
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign, index) => (
                  <tr 
                    key={campaign.campaignId} 
                    className="hover:bg-gray-700 transition group"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">#{index + 1}</span>
                        <div className="font-semibold text-white group-hover:text-blue-400 transition">
                          {campaign.name}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        campaign.state === 'ENABLED' 
                          ? 'bg-green-900 text-green-300 border border-green-700' 
                          : campaign.state === 'PAUSED'
                          ? 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                          : 'bg-gray-700 text-gray-400 border border-gray-600'
                      }`}>
                        {campaign.state === 'ENABLED' && '✓'}
                        {campaign.state === 'PAUSED' && '⏸'}
                        {campaign.state === 'ARCHIVED' && '📦'}
                        {campaign.state}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        campaign.targetingType === 'AUTO'
                          ? 'bg-purple-900 text-purple-300 border border-purple-700'
                          : 'bg-blue-900 text-blue-300 border border-blue-700'
                      }`}>
                        {campaign.targetingType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-white font-semibold">
                        €{campaign.budget?.budget?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {campaign.budget?.budgetType || 'DAILY'}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                      {campaign.startDate || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <code className="text-xs bg-gray-900 px-2 py-1 rounded text-gray-400 font-mono">
                        {campaign.campaignId}
                      </code>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner */}
      {campaigns.length > 0 && (
        <div className="mt-8 bg-blue-900/30 rounded-xl p-6 border border-blue-700">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="text-lg font-bold text-blue-300 mb-2">Kampagnen-Optimierung</h3>
              <p className="text-blue-200">
                Das System überwacht kontinuierlich alle {campaigns.length} Kampagnen und optimiert 
                automatisch Gebote, Budgets und Keywords für beste Performance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
