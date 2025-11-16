'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, DollarSign, Target, Activity } from 'lucide-react';
import { campaignsApi } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await campaignsApi.getAll();
      const campaigns = response.data;

      // Berechne Statistiken
      const total = campaigns.length;
      const active = campaigns.filter((c: any) => c.state === 'ENABLED').length;
      const paused = campaigns.filter((c: any) => c.state === 'PAUSED').length;
      const archived = campaigns.filter((c: any) => c.state === 'ARCHIVED').length;

      // Berechne Gesamtbudget
      const totalBudget = campaigns.reduce((sum: number, c: any) => {
        const budget = c.budget?.budget || 0;
        return sum + budget;
      }, 0);

      // Berechne Durchschnittsbudget
      const avgBudget = total > 0 ? totalBudget / total : 0;

      setStats({
        total,
        active,
        paused,
        archived,
        totalBudget: totalBudget.toFixed(2),
        avgBudget: avgBudget.toFixed(2),
      });
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white flex items-center gap-3 mb-2">
          <span>🎯</span>
          Amazon Ads Dashboard
        </h1>
        <p className="text-gray-400 text-xl">Echtzeit-Übersicht aller Kampagnen und Performance</p>
      </div>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Gesamtkampagnen */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-2xl border border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-white/20 p-3">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <span className="text-blue-200 text-sm font-semibold">GESAMT</span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">{stats?.total || 0}</div>
          <div className="text-blue-200 text-sm">Kampagnen insgesamt</div>
        </div>

        {/* Aktive Kampagnen */}
        <div className="rounded-2xl bg-gradient-to-br from-green-600 to-green-800 p-6 shadow-2xl border border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-white/20 p-3">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <span className="text-green-200 text-sm font-semibold">AKTIV</span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">{stats?.active || 0}</div>
          <div className="text-green-200 text-sm">Laufende Kampagnen</div>
        </div>

        {/* Pausierte Kampagnen */}
        <div className="rounded-2xl bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 shadow-2xl border border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-white/20 p-3">
              <Target className="h-8 w-8 text-white" />
            </div>
            <span className="text-yellow-200 text-sm font-semibold">PAUSIERT</span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">{stats?.paused || 0}</div>
          <div className="text-yellow-200 text-sm">Pausierte Kampagnen</div>
        </div>

        {/* Gesamtbudget */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 shadow-2xl border border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-white/20 p-3">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <span className="text-purple-200 text-sm font-semibold">BUDGET</span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">€{stats?.totalBudget || '0.00'}</div>
          <div className="text-purple-200 text-sm">Tagesbudget gesamt</div>
        </div>
      </div>

      {/* Zusätzliche Info-Karten */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Budget-Übersicht */}
        <div className="rounded-2xl bg-gray-800 border border-gray-700 p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>💰</span>
            Budget-Übersicht
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-300">Gesamtbudget (täglich)</span>
              <span className="text-2xl font-bold text-white">€{stats?.totalBudget}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-300">Durchschnittsbudget</span>
              <span className="text-2xl font-bold text-white">€{stats?.avgBudget}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-300">Budget-Typ</span>
              <span className="text-white font-semibold">DAILY</span>
            </div>
          </div>
        </div>

        {/* Automatisierung */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-700 p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🤖</span>
            Automatisierung
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-indigo-800/30 rounded-lg">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-green-300 font-semibold">Gebotsoptimierung aktiv</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-indigo-800/30 rounded-lg">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-green-300 font-semibold">Keyword-Analyse läuft</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-indigo-800/30 rounded-lg">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-green-300 font-semibold">Budget-Optimierung aktiv</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-indigo-800/30 rounded-lg">
              <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-blue-300 font-semibold">Nächste Optimierung: in 1h 45m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schnellzugriff */}
      <div className="rounded-2xl bg-gray-800 border border-gray-700 p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <span>⚡</span>
          Schnellzugriff
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/campaigns"
            className="group rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 hover:from-blue-700 hover:to-blue-900 transition transform hover:scale-105 shadow-lg"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Kampagnen</h3>
            <p className="text-blue-200 text-sm mb-4">Verwalte deine {stats?.total} Kampagnen</p>
            <div className="text-white font-semibold group-hover:translate-x-2 transition">
              Jetzt ansehen →
            </div>
          </a>

          <a
            href="/keywords"
            className="group rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 hover:from-purple-700 hover:to-purple-900 transition transform hover:scale-105 shadow-lg"
          >
            <div className="text-4xl mb-3">🔑</div>
            <h3 className="text-xl font-bold text-white mb-2">Keywords</h3>
            <p className="text-purple-200 text-sm mb-4">Optimiere deine Keywords</p>
            <div className="text-white font-semibold group-hover:translate-x-2 transition">
              Jetzt ansehen →
            </div>
          </a>

          <a
            href="/optimization"
            className="group rounded-xl bg-gradient-to-br from-green-600 to-green-800 p-6 hover:from-green-700 hover:to-green-900 transition transform hover:scale-105 shadow-lg"
          >
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-xl font-bold text-white mb-2">Optimierung</h3>
            <p className="text-green-200 text-sm mb-4">Starte manuelle Optimierung</p>
            <div className="text-white font-semibold group-hover:translate-x-2 transition">
              Jetzt starten →
            </div>
          </a>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={loadStats}
        className="fixed bottom-8 right-8 rounded-full bg-blue-600 p-4 text-white hover:bg-blue-700 shadow-2xl transition transform hover:scale-110"
        title="Daten aktualisieren"
      >
        <RefreshCw className="h-6 w-6" />
      </button>
    </div>
  );
}
