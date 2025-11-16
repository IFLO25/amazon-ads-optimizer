'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Target, Zap, DollarSign, Activity, Clock } from 'lucide-react';
import { dashboardApi, campaignsApi } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    pausedCampaigns: 0,
    totalBudget: 0,
    totalSpend: 0,
    totalImpressions: 0,
    totalClicks: 0,
    avgCtr: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await campaignsApi.getAll();
      const campaigns = Array.isArray(response.data) ? response.data : [];
      
      const activeCampaigns = campaigns.filter((c: any) => c.state === 'ENABLED' || c.state === 'enabled');
      const pausedCampaigns = campaigns.filter((c: any) => c.state === 'PAUSED' || c.state === 'paused');
      
      const totalBudget = campaigns.reduce((sum: number, c: any) => {
        const budget = parseFloat(c.budget?.budget || c.dailyBudget || 0);
        return sum + (isNaN(budget) ? 0 : budget);
      }, 0);

      setStats({
        totalCampaigns: campaigns.length,
        activeCampaigns: activeCampaigns.length,
        pausedCampaigns: pausedCampaigns.length,
        totalBudget: totalBudget,
        totalSpend: 0,
        totalImpressions: 0,
        totalClicks: 0,
        avgCtr: 0,
      });
    } catch (err: any) {
      console.error('Fehler beim Laden der Dashboard-Daten:', err);
      setError(err.response?.data?.message || 'Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white flex items-center gap-3 mb-2">
          <span>📊</span>
          Amazon Ads Dashboard
        </h1>
        <p className="text-gray-400 text-xl">Echtzeit-Übersicht aller Kampagnen und Performance</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-700 rounded-xl p-4">
          <p className="text-red-400">⚠️ {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-blue-900/50 to-blue-700/50 border border-blue-600 p-6 shadow-xl hover:shadow-2xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-blue-500 p-3">
              <Target className="h-6 w-6 text-white" />
            </div>
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-blue-300 text-sm font-medium mb-1">GESAMT</h3>
          <p className="text-4xl font-bold text-white mb-1">{stats.totalCampaigns}</p>
          <p className="text-blue-200 text-sm">Kampagnen insgesamt</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-900/50 to-green-700/50 border border-green-600 p-6 shadow-xl hover:shadow-2xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-green-500 p-3">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <Activity className="h-5 w-5 text-green-400" />
          </div>
          <h3 className="text-green-300 text-sm font-medium mb-1">AKTIV</h3>
          <p className="text-4xl font-bold text-white mb-1">{stats.activeCampaigns}</p>
          <p className="text-green-200 text-sm">Laufende Kampagnen</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-orange-900/50 to-orange-700/50 border border-orange-600 p-6 shadow-xl hover:shadow-2xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-orange-500 p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-orange-300 text-sm font-medium mb-1">PAUSIERT</h3>
          <p className="text-4xl font-bold text-white mb-1">{stats.pausedCampaigns}</p>
          <p className="text-orange-200 text-sm">Pausierte Kampagnen</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-purple-900/50 to-purple-700/50 border border-purple-600 p-6 shadow-xl hover:shadow-2xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-purple-500 p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-purple-300 text-sm font-medium mb-1">BUDGET</h3>
          <p className="text-4xl font-bold text-white mb-1">€{stats.totalBudget.toFixed(2)}</p>
          <p className="text-purple-200 text-sm">Tagesbudget gesamt</p>
        </div>
      </div>

      <div className="rounded-xl bg-gray-800 border border-gray-700 p-8 shadow-2xl mb-8">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🤖</span>
          Automatisierung
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-green-300">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-lg">Gebotsoptimierung aktiv</span>
          </div>
          <div className="flex items-center gap-3 text-green-300">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-lg">Keyword-Analyse läuft</span>
          </div>
          <div className="flex items-center gap-3 text-green-300">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-lg">Budget-Optimierung aktiv</span>
          </div>
          <div className="flex items-center gap-3 text-blue-300">
            <Clock className="h-5 w-5" />
            <span className="text-lg">Nächste Optimierung: in 1h 45m</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gray-800 border border-gray-700 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <span>⚡</span>
          Schnellzugriff
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/campaigns" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl p-6 text-white transition transform hover:scale-105 shadow-xl">
            <Target className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Kampagnen</h3>
            <p className="text-blue-100">Verwalte deine Kampagnen</p>
          </Link>
          
          <Link href="/keywords" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl p-6 text-white transition transform hover:scale-105 shadow-xl">
            <Zap className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Keywords</h3>
            <p className="text-green-100">Optimiere deine Keywords</p>
          </Link>
          
          <Link href="/optimization" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl p-6 text-white transition transform hover:scale-105 shadow-xl">
            <Activity className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Optimierung</h3>
            <p className="text-purple-100">Starte Optimierung</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
