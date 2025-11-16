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
      setError(null);
      const response = await campaignsApi.getAll();
      const campaigns = response.data.campaigns || response.data || [];
      
      // Berechne Statistiken aus echten Amazon-Kampagnen
      const enabledCampaigns = campaigns.filter((c: any) => c.state === 'ENABLED');
      const pausedCampaigns = campaigns.filter((c: any) => c.state === 'PAUSED');
      const archivedCampaigns = campaigns.filter((c: any) => c.state === 'ARCHIVED');
      
      const totalBudget = campaigns.reduce((sum: number, c: any) => {
        const budget = c.budget?.budget || 0;
        return sum + budget;
      }, 0);
      
      const averageBudget = campaigns.length > 0 ? totalBudget / campaigns.length : 0;
      
      const calculatedStats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: enabledCampaigns.length,
        pausedCampaigns: pausedCampaigns.length,
        archivedCampaigns: archivedCampaigns.length,
        totalBudget: totalBudget.toFixed(2),
        averageBudget: averageBudget.toFixed(2),
        budgetType: campaigns[0]?.budget?.budgetType || 'DAILY',
      };
      
      setStats(calculatedStats);
      setLoading(false);
    } catch (error: any) {
      console.error('Fehler beim Laden der Stats:', error);
      setError(error.message || 'Fehler beim Laden der Daten');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xl text-gray-300">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Verbindungsfehler</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={fetchStats}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <span>🚀</span>
          Dashboard
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Amazon Ads Optimizer - Echtzeit-Übersicht</p>
      </div>

      {/* Hauptstatistiken */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Gesamtkampagnen */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border border-blue-700 shadow-xl hover:shadow-2xl transition transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-300 text-sm font-medium uppercase">Gesamtkampagnen</span>
            <span className="text-4xl">📊</span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">{stats?.totalCampaigns || 0}</div>
          <div className="text-sm text-blue-300">Alle Kampagnen</div>
        </div>

        {/* Aktive Kampagnen */}
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border border-green-700 shadow-xl hover:shadow-2xl transition transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <span className="text-green-300 text-sm font-medium uppercase">Aktiv</span>
            <span className="text-4xl">✅</span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">{stats?.activeCampaigns || 0}</div>
          <div className="text-sm text-green-300">Derzeit laufend</div>
        </div>

        {/* Pausierte Kampagnen */}
        <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-xl p-6 border border-yellow-700 shadow-xl hover:shadow-2xl transition transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <span className="text-yellow-300 text-sm font-medium uppercase">Pausiert</span>
            <span className="text-4xl">⏸️</span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">{stats?.pausedCampaigns || 0}</div>
          <div className="text-sm text-yellow-300">Temporär gestoppt</div>
        </div>

        {/* Archivierte Kampagnen */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 border border-gray-600 shadow-xl hover:shadow-2xl transition transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm font-medium uppercase">Archiviert</span>
            <span className="text-4xl">📦</span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">{stats?.archivedCampaigns || 0}</div>
          <div className="text-sm text-gray-400">Beendet</div>
        </div>
      </div>

      {/* Detaillierte Informationen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Budget-Übersicht */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>💰</span>
            Budget-Übersicht
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-400">Gesamtbudget (täglich):</span>
              <span className="text-2xl font-bold text-green-400">€{stats?.totalBudget || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-400">Durchschnittsbudget:</span>
              <span className="text-2xl font-bold text-blue-400">€{stats?.averageBudget || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-400">Budget-Typ:</span>
              <span className="text-lg font-semibold text-purple-400">{stats?.budgetType || 'DAILY'}</span>
            </div>
          </div>
        </div>

        {/* Automatisierung Status */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🤖</span>
            Automatisierung
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
              <span className="text-green-500 text-xl">●</span>
              <span className="text-green-300 font-medium">Gebotsoptimierung aktiv</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
              <span className="text-green-500 text-xl">●</span>
              <span className="text-green-300 font-medium">Keyword-Analyse läuft</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
              <span className="text-green-500 text-xl">●</span>
              <span className="text-green-300 font-medium">Budget-Optimierung aktiv</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
              <span className="text-blue-500 text-xl">⏱</span>
              <span className="text-blue-300 font-medium">Nächste Optimierung: in 1h 45m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">⚡ Schnellzugriff</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/campaigns" className="group bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 shadow-xl hover:shadow-2xl">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-2">Kampagnen</h3>
            <p className="text-blue-100">Verwalte deine {stats?.totalCampaigns || 0} Kampagnen</p>
            <div className="mt-4 text-blue-200 text-sm font-medium group-hover:text-white transition">
              Jetzt ansehen →
            </div>
          </Link>

          <Link href="/keywords" className="group bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-8 hover:from-green-700 hover:to-green-800 transition transform hover:scale-105 shadow-xl hover:shadow-2xl">
            <div className="text-5xl mb-4">🔑</div>
            <h3 className="text-2xl font-bold text-white mb-2">Keywords</h3>
            <p className="text-green-100">Optimiere deine Keywords</p>
            <div className="mt-4 text-green-200 text-sm font-medium group-hover:text-white transition">
              Jetzt ansehen →
            </div>
          </Link>

          <Link href="/optimization" className="group bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-8 hover:from-purple-700 hover:to-purple-800 transition transform hover:scale-105 shadow-xl hover:shadow-2xl">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-2">Optimierung</h3>
            <p className="text-purple-100">Starte manuelle Optimierung</p>
            <div className="mt-4 text-purple-200 text-sm font-medium group-hover:text-white transition">
              Jetzt starten →
            </div>
          </Link>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-xl p-6 border border-blue-700/50">
        <div className="flex items-start gap-4">
          <span className="text-4xl">💡</span>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Vollautomatisches System</h3>
            <p className="text-gray-300">
              Dein Amazon Ads Optimizer läuft vollautomatisch im Hintergrund und optimiert alle 2 Stunden 
              deine Kampagnen, Keywords und Budgets für maximale Performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
