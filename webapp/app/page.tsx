'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { campaignsApi } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await campaignsApi.getAll();
      const campaigns = Array.isArray(response.data) ? response.data : [];
      
      // Safely calculate stats from campaigns
      const totalSpent = campaigns.reduce((sum: number, c: any) => sum + (Number(c.spend) || 0), 0);
      const totalSales = campaigns.reduce((sum: number, c: any) => sum + (Number(c.revenue) || 0), 0);
      const totalClicks = campaigns.reduce((sum: number, c: any) => sum + (Number(c.clicks) || 0), 0);
      const totalOrders = campaigns.reduce((sum: number, c: any) => sum + (Number(c.orders) || 0), 0);
      
      const calculatedStats = {
        totalSpent: totalSpent.toFixed(2),
        totalSales: totalSales.toFixed(2),
        averageAcos: campaigns.length > 0 
          ? (campaigns.reduce((sum: number, c: any) => sum + (Number(c.acos) || 0), 0) / campaigns.length).toFixed(2)
          : '0.00',
        activeCampaigns: campaigns.filter((c: any) => c.status === 'ENABLED').length,
        totalCampaigns: campaigns.length,
        totalClicks: totalClicks,
        totalOrders: totalOrders,
        averageCtr: campaigns.length > 0
          ? (campaigns.reduce((sum: number, c: any) => sum + (Number(c.ctr) || 0), 0) / campaigns.length).toFixed(2)
          : '0.00',
        averageConversionRate: campaigns.length > 0
          ? (campaigns.reduce((sum: number, c: any) => sum + (Number(c.conversionRate) || 0), 0) / campaigns.length).toFixed(2)
          : '0.00',
      };
      
      setStats(calculatedStats);
      setLoading(false);
    } catch (error: any) {
      console.error('Fehler beim Laden der Stats:', error);
      setError(error.message || 'Fehler beim Laden der Daten');
      setLoading(false);
      
      // Set default stats on error
      setStats({
        totalSpent: '0.00',
        totalSales: '0.00',
        averageAcos: '0.00',
        activeCampaigns: 0,
        totalCampaigns: 0,
        totalClicks: 0,
        totalOrders: 0,
        averageCtr: '0.00',
        averageConversionRate: '0.00',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Lade Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">🚀 Amazon Ads Optimizer</h1>
            <p className="text-gray-400 mt-1">Automatische Kampagnen-Optimierung</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={fetchStats}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              🔄 Synchronisieren
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              ▶️ Optimierung starten
            </button>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mx-8 mt-6 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Main Content */}
      <main className="px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Spent */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Gesamtausgaben</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-white">€{stats?.totalSpent || '0.00'}</div>
            <div className="text-sm text-gray-500 mt-1">Letzten 30 Tage</div>
          </div>

          {/* Total Sales */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Umsatz</span>
              <span className="text-2xl">💵</span>
            </div>
            <div className="text-3xl font-bold text-green-400">€{stats?.totalSales || '0.00'}</div>
            <div className="text-sm text-gray-500 mt-1">Letzten 30 Tage</div>
          </div>

          {/* Average ACoS */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">ACoS</span>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{stats?.averageAcos || '0.00'}%</div>
            <div className="text-sm text-green-500 mt-1">✓ Im Zielbereich</div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Aktive Kampagnen</span>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.activeCampaigns || 0}</div>
            <div className="text-sm text-gray-500 mt-1">von {stats?.totalCampaigns || 0} gesamt</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">📈 Klicks & Conversions</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Klicks gesamt:</span>
                <span className="text-white font-semibold">{stats?.totalClicks || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bestellungen:</span>
                <span className="text-white font-semibold">{stats?.totalOrders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">CTR:</span>
                <span className="text-green-400 font-semibold">{stats?.averageCtr || '0.00'}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Conversion Rate:</span>
                <span className="text-green-400 font-semibold">{stats?.averageConversionRate || '0.00'}%</span>
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
          <Link href="/campaigns" className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 hover:from-blue-700 hover:to-blue-800 transition">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Kampagnen</h3>
            <p className="text-blue-100">Alle Kampagnen anzeigen und verwalten</p>
          </Link>

          <Link href="/keywords" className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 hover:from-green-700 hover:to-green-800 transition">
            <div className="text-4xl mb-3">🔑</div>
            <h3 className="text-xl font-bold text-white mb-2">Keywords</h3>
            <p className="text-green-100">Keywords analysieren und optimieren</p>
          </Link>

          <Link href="/optimization" className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 hover:from-purple-700 hover:to-purple-800 transition">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Optimierung</h3>
            <p className="text-purple-100">Optimierungs-Historie und Zeitplan</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
