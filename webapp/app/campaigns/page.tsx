'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Search, TrendingUp, Pause, Play, Archive } from 'lucide-react';
import { campaignsApi } from '@/lib/api';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignsApi.getAll();
      setCampaigns(response.data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Kampagnen:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || campaign.state === filter;
    return matchesSearch && matchesFilter;
  });

  const getStateColor = (state: string) => {
    switch (state) {
      case 'ENABLED':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'PAUSED':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'ARCHIVED':
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'ENABLED':
        return <Play className="h-4 w-4" />;
      case 'PAUSED':
        return <Pause className="h-4 w-4" />;
      case 'ARCHIVED':
        return <Archive className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.state === 'ENABLED').length,
    paused: campaigns.filter(c => c.state === 'PAUSED').length,
    archived: campaigns.filter(c => c.state === 'ARCHIVED').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Lade Kampagnen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white flex items-center gap-3 mb-2">
          <span>📊</span>
          Kampagnen
        </h1>
        <p className="text-gray-400 text-xl">Verwalte alle deine Amazon Advertising Kampagnen</p>
      </div>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-xl border border-blue-500">
          <div className="text-blue-200 text-sm font-semibold mb-2">GESAMT</div>
          <div className="text-4xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-600 to-green-800 p-6 shadow-xl border border-green-500">
          <div className="text-green-200 text-sm font-semibold mb-2">AKTIV</div>
          <div className="text-4xl font-bold text-white">{stats.active}</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 shadow-xl border border-yellow-500">
          <div className="text-yellow-200 text-sm font-semibold mb-2">PAUSIERT</div>
          <div className="text-4xl font-bold text-white">{stats.paused}</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 p-6 shadow-xl border border-gray-500">
          <div className="text-gray-200 text-sm font-semibold mb-2">ARCHIVIERT</div>
          <div className="text-4xl font-bold text-white">{stats.archived}</div>
        </div>
      </div>

      {/* Filter & Suche */}
      <div className="rounded-xl bg-gray-800 border border-gray-700 p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Suchfeld */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Kampagne suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter-Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                filter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => setFilter('ENABLED')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                filter === 'ENABLED'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Aktiv
            </button>
            <button
              onClick={() => setFilter('PAUSED')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                filter === 'PAUSED'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Pausiert
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadCampaigns}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold"
          >
            <RefreshCw className="h-5 w-5" />
            Aktualisieren
          </button>
        </div>
      </div>

      {/* Kampagnen-Tabelle */}
      <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Kampagnenname
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Budget-Typ
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Targeting
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-lg">
                      {searchTerm || filter !== 'ALL' 
                        ? 'Keine Kampagnen gefunden' 
                        : 'Keine Kampagnen vorhanden'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign, index) => (
                  <tr
                    key={campaign.campaignId || index}
                    className="hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="text-white font-semibold">{campaign.name || 'Unbenannt'}</div>
                      <div className="text-gray-400 text-sm">ID: {campaign.campaignId || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStateColor(
                          campaign.state
                        )}`}
                      >
                        {getStateIcon(campaign.state)}
                        {campaign.state || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-semibold">
                        €{campaign.budget?.budget?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {campaign.budget?.budgetType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500">
                        {campaign.targetingType || 'AUTO'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ergebnisse Anzeige */}
      {filteredCampaigns.length > 0 && (
        <div className="mt-6 text-center text-gray-400">
          {filteredCampaigns.length} von {campaigns.length} Kampagnen angezeigt
        </div>
      )}
    </div>
  );
}
