'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface Campaign {
  campaignId: string;
  name: string;
  state: string;
  budget: number;
  budgetType: string;
  targetingType: string;
  impressions: number;
  clicks: number;
  spend: number;
  sales: number;
  orders: number;
  acos: number;
  ctr: number;
  conversionRate: number;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_URL}/campaigns`);
      setCampaigns(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Kampagnen:', error);
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true;
    if (filter === 'enabled') return campaign.state === 'ENABLED';
    if (filter === 'paused') return campaign.state === 'PAUSED';
    if (filter === 'archived') return campaign.state === 'ARCHIVED';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Lade Kampagnen...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block">
              ← Zurück zum Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">📊 Kampagnen-Übersicht</h1>
            <p className="text-gray-400 mt-1">{campaigns.length} Kampagnen gefunden</p>
          </div>
          <button 
            onClick={fetchCampaigns}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔄 Aktualisieren
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-8 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Alle ({campaigns.length})
          </button>
          <button
            onClick={() => setFilter('enabled')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'enabled' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Aktiv ({campaigns.filter(c => c.state === 'ENABLED').length})
          </button>
          <button
            onClick={() => setFilter('paused')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'paused' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Pausiert ({campaigns.filter(c => c.state === 'PAUSED').length})
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'archived' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Archiviert ({campaigns.filter(c => c.state === 'ARCHIVED').length})
          </button>
        </div>
      </div>

      {/* Campaigns Table */}
      <main className="px-8 py-6">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Keine Kampagnen gefunden
            </h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'Es wurden noch keine Kampagnen erstellt.' 
                : `Keine ${filter === 'enabled' ? 'aktiven' : filter === 'paused' ? 'pausierten' : 'archivierten'} Kampagnen vorhanden.`}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Kampagne
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ausgaben
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Umsatz
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ACoS
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Klicks
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    CTR
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Conv. Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.campaignId} className="hover:bg-gray-750 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{campaign.name}</div>
                      <div className="text-xs text-gray-400">{campaign.targetingType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        campaign.state === 'ENABLED' 
                          ? 'bg-green-900 text-green-300' 
                          : campaign.state === 'PAUSED'
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-red-900 text-red-300'
                      }`}>
                        {campaign.state === 'ENABLED' ? '✓ Aktiv' : campaign.state === 'PAUSED' ? '⏸ Pausiert' : '📦 Archiviert'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-300">
                      €{campaign.budget.toFixed(2)}
                      <div className="text-xs text-gray-500">{campaign.budgetType}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-white font-medium">
                      €{campaign.spend.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-green-400 font-medium">
                      €{campaign.sales.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-semibold ${
                        campaign.acos <= 15 ? 'text-green-400' : 
                        campaign.acos <= 25 ? 'text-yellow-400' : 
                        'text-red-400'
                      }`}>
                        {campaign.acos.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-300">
                      {campaign.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-300">
                      {campaign.ctr.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-300">
                      {campaign.conversionRate.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
