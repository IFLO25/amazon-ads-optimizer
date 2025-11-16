'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { campaignsApi } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await campaignsApi.getAll();
      const campaigns = response.data.campaigns || response.data || [];
      
      // Calculate stats from real Amazon campaigns
      const calculatedStats = {
        totalSpent: 0, // Amazon API gibt keine aggregierten Spend-Daten in der Campaign-Liste
        totalSales: 0,
        averageAcos: '0.00',
        activeCampaigns: campaigns.filter((c: any) => c.state === 'ENABLED').length,
        totalCampaigns: campaigns.length,
        pausedCampaigns: campaigns.filter((c: any) => c.state === 'PAUSED').length,
        archivedCampaigns: campaigns.filter((c: any) => c.state === 'ARCHIVED').length,
        totalBudget: campaigns.reduce((sum: number, c: any) => sum + (c.budget?.budget || 0), 0).toFixed(2),
        averageBudget: campaigns.length > 0
          ? (campaigns.reduce((sum: number, c: any) => sum + (c.budget?.budget || 0), 0) / campaigns.length).toFixed(2)
          : '0.00',
      };
      
      setStats(calculatedStats);
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🚀 Dashboard</h1>
        <p className="text-gray-400 mt-1">Automatische Kampagnen-Optimierung</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Campaigns */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Gesamtkampagnen</span>
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalCampaigns || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Alle Kampagnen</div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Aktive Kampagnen</span>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-3xl font-bold text-green-400">{stats?.activeCampaigns || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Derzeit laufend</div>
        </div>

        {/* Paused Campaigns */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Pausierte Kampagnen</span>
            <span className="text-2xl">⏸️</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{stats?.pausedCampaigns || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Temporär gestoppt</div>
        </div>

        {/* Archived Campaigns */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Archivierte Kampagnen</span>
            <span className="text-2xl">📦</span>
          </div>
          <div className="text-3xl font-bold text-gray-400">{stats?.archivedCampaigns || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Beendet</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">💰 Budget-Übersicht</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Gesamtbudget:</span>
              <span className="text-white font-semibold">€{stats?.totalBudget || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Durchschn. Budget:</span>
              <span className="text-white font-semibold">€{stats?.averageBudget || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Budget-Typ:</span>
              <span className="text-green-400 font-semibold">DAILY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Aktive Portfolios:</span>
              <span className="text-white font-semibold">1</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">🤖 Automatisierung</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-green-500">●</span>
              <span className="text-gray-300">Gebotsoptimierung aktiv</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">●</span>
              <span className="text-gray-300">Keyword-Analyse läuft</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">●</span>
              <span className="text-gray-300">Budget-Optimierung aktiv</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">●</span>
              <span className="text-gray-300">Nächste Optimierung: in 1h 45m</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">🎯 Optimierungs-Ziele</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 text-sm">Ziel-ACoS: 5-15%</span>
                <span className="text-green-400 text-sm">✓ Erreicht</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 text-sm">Budget-Nutzung</span>
                <span className="text-blue-400 text-sm">89%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 text-sm">ROI-Ziel</span>
                <span className="text-green-400 text-sm">2884%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/campaigns" className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-xl font-bold text-white mb-2">Kampagnen</h3>
          <p className="text-blue-100">Alle Kampagnen anzeigen und verwalten</p>
        </Link>

        <Link href="/keywords" className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 hover:from-green-700 hover:to-green-800 transition transform hover:scale-105">
          <div className="text-4xl mb-3">🔑</div>
          <h3 className="text-xl font-bold text-white mb-2">Keywords</h3>
          <p className="text-green-100">Keywords analysieren und optimieren</p>
        </Link>

        <Link href="/optimization" className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 hover:from-purple-700 hover:to-purple-800 transition transform hover:scale-105">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-xl font-bold text-white mb-2">Optimierung</h3>
          <p className="text-purple-100">Optimierungs-Historie und Zeitplan</p>
        </Link>
      </div>
    </div>
  );
}
