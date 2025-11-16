'use client';

import { useEffect, useState } from 'react';
import { Target, TrendingUp, RefreshCw, Play, Pause } from 'lucide-react';
import { campaignsApi } from '@/lib/api';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await campaignsApi.getAll();
      setCampaigns(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Fehler beim Laden der Kampagnen:', err);
      setError(err.response?.data?.message || 'Fehler beim Laden der Kampagnen');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const syncCampaigns = async () => {
    try {
      setSyncing(true);
      setError('');
      await campaignsApi.sync();
      await loadCampaigns();
    } catch (err: any) {
      console.error('Fehler beim Synchronisieren:', err);
      setError(err.response?.data?.message || 'Fehler beim Synchronisieren');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl">Kampagnen werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold text-white flex items-center gap-3 mb-2">
            <span>🎯</span>
            Kampagnen
          </h1>
          <p className="text-gray-400 text-xl">Übersicht aller Amazon Advertising Kampagnen</p>
        </div>
        <button
          onClick={syncCampaigns}
          disabled={syncing}
          className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
            syncing
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-xl'
          }`}
        >
          <RefreshCw className={`h-5 w-5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Synchronisiere...' : 'Synchronisieren'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-700 rounded-xl p-4">
          <p className="text-red-400">⚠️ {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-blue-900/50 to-blue-700/50 border border-blue-600 p-6">
          <h3 className="text-blue-300 text-sm font-medium mb-1">GESAMT</h3>
          <p className="text-4xl font-bold text-white">{campaigns.length}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-900/50 to-green-700/50 border border-green-600 p-6">
          <h3 className="text-green-300 text-sm font-medium mb-1">AKTIV</h3>
          <p className="text-4xl font-bold text-white">
            {campaigns.filter(c => c.state === 'ENABLED' || c.state === 'enabled').length}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-orange-900/50 to-orange-700/50 border border-orange-600 p-6">
          <h3 className="text-orange-300 text-sm font-medium mb-1">PAUSIERT</h3>
          <p className="text-4xl font-bold text-white">
            {campaigns.filter(c => c.state === 'PAUSED' || c.state === 'paused').length}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-gray-800 border border-gray-700 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Budget</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Typ</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Targeting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    Keine Kampagnen gefunden
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign: any) => (
                  <tr key={campaign.campaignId} className="hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4 text-white font-medium">{campaign.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          campaign.state === 'ENABLED' || campaign.state === 'enabled'
                            ? 'bg-green-900/50 text-green-400 border border-green-700'
                            : 'bg-orange-900/50 text-orange-400 border border-orange-700'
                        }`}
                      >
                        {campaign.state === 'ENABLED' || campaign.state === 'enabled' ? (
                          <><Play className="h-3 w-3" /> Aktiv</>
                        ) : (
                          <><Pause className="h-3 w-3" /> Pausiert</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">
                      €{parseFloat(campaign.budget?.budget || campaign.dailyBudget || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{campaign.targetingType || 'AUTO'}</td>
                    <td className="px-6 py-4 text-gray-300">{campaign.biddingStrategy || 'AUTO'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
