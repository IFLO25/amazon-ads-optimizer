'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

interface Campaign {
  campaignId: string;
  name: string;
  status: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  sales: number;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/campaigns`);
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Fehler beim Laden der Kampagnen:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncCampaigns = async () => {
    try {
      setSyncing(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/campaigns/sync`, {
        method: 'POST',
      });
      const data = await res.json();
      alert(`✅ ${data.count} Kampagnen synchronisiert!`);
      await fetchCampaigns();
    } catch (error) {
      console.error('Fehler beim Synchronisieren:', error);
      alert('❌ Fehler beim Synchronisieren!');
    } finally {
      setSyncing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'enabled':
        return 'text-green-400';
      case 'paused':
        return 'text-yellow-400';
      case 'archived':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'enabled':
        return '✅';
      case 'paused':
        return '⏸️';
      case 'archived':
        return '📦';
      default:
        return '❓';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                📊 Kampagnen
              </h1>
              <p className="text-gray-400">
                Übersicht aller Amazon Advertising Kampagnen
              </p>
            </div>
            <button
              onClick={syncCampaigns}
              disabled={syncing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {syncing ? '🔄 Synchronisiere...' : '🔄 Synchronisieren'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Gesamt</div>
              <div className="text-3xl font-bold text-white">{campaigns.length}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Aktiv</div>
              <div className="text-3xl font-bold text-green-400">
                {campaigns.filter(c => c.status === 'enabled').length}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Pausiert</div>
              <div className="text-3xl font-bold text-yellow-400">
                {campaigns.filter(c => c.status === 'paused').length}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Budget gesamt</div>
              <div className="text-3xl font-bold text-purple-400">
                {campaigns.reduce((sum, c) => sum + (c.budget || 0), 0).toFixed(2)}€
              </div>
            </div>
          </div>

          {/* Campaigns Table */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Lade Kampagnen...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-white mb-2">Keine Kampagnen gefunden</h3>
              <p className="text-gray-400 mb-6">Synchronisieren Sie Ihre Kampagnen von Amazon</p>
              <button
                onClick={syncCampaigns}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🔄 Jetzt synchronisieren
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="text-left p-4 text-gray-400 font-semibold">Status</th>
                      <th className="text-left p-4 text-gray-400 font-semibold">Name</th>
                      <th className="text-right p-4 text-gray-400 font-semibold">Budget</th>
                      <th className="text-right p-4 text-gray-400 font-semibold">Ausgaben</th>
                      <th className="text-right p-4 text-gray-400 font-semibold">Impressionen</th>
                      <th className="text-right p-4 text-gray-400 font-semibold">Klicks</th>
                      <th className="text-right p-4 text-gray-400 font-semibold">Umsatz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.campaignId} className="border-t border-gray-700 hover:bg-gray-750">
                        <td className="p-4">
                          <span className={`${getStatusColor(campaign.status)} font-semibold`}>
                            {getStatusIcon(campaign.status)} {campaign.status}
                          </span>
                        </td>
                        <td className="p-4 text-white font-medium">{campaign.name}</td>
                        <td className="p-4 text-right text-white">{campaign.budget?.toFixed(2) || '0.00'}€</td>
                        <td className="p-4 text-right text-white">{campaign.spent?.toFixed(2) || '0.00'}€</td>
                        <td className="p-4 text-right text-gray-300">{campaign.impressions?.toLocaleString() || 0}</td>
                        <td className="p-4 text-right text-gray-300">{campaign.clicks?.toLocaleString() || 0}</td>
                        <td className="p-4 text-right text-green-400 font-semibold">
                          {campaign.sales?.toFixed(2) || '0.00'}€
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
