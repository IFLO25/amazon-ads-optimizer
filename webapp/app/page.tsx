'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';

interface Stats {
  totalCampaigns: number;
  activeCampaigns: number;
  pausedCampaigns: number;
  totalBudget: number;
  totalSpent: number;
  totalKeywords: number;
  activeKeywords: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    pausedCampaigns: 0,
    totalBudget: 0,
    totalSpent: 0,
    totalKeywords: 0,
    activeKeywords: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      // Fetch campaign stats
      const campaignsRes = await fetch(`${apiUrl}/api/campaigns/stats`);
      const campaignsData = await campaignsRes.json();
      
      // Fetch keyword stats
      const keywordsRes = await fetch(`${apiUrl}/api/keywords/stats`);
      const keywordsData = await keywordsRes.json();

      setStats({
        totalCampaigns: campaignsData.total || 0,
        activeCampaigns: campaignsData.active || 0,
        pausedCampaigns: campaignsData.paused || 0,
        totalBudget: campaignsData.totalBudget || 0,
        totalSpent: campaignsData.totalSpent || 0,
        totalKeywords: keywordsData.total || 0,
        activeKeywords: keywordsData.active || 0,
      });
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🎯 Amazon Ads Dashboard
            </h1>
            <p className="text-gray-400">
              Echtzeit-Übersicht aller Kampagnen und Performance
            </p>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Lade Statistiken...</p>
            </div>
          ) : (
            <>
              {/* Campaign Stats */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">📊 Kampagnen</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Kampagnen insgesamt"
                    value={stats.totalCampaigns}
                    icon="📈"
                    color="blue"
                  />
                  <StatCard
                    title="Laufende Kampagnen"
                    value={stats.activeCampaigns}
                    icon="✅"
                    color="green"
                  />
                  <StatCard
                    title="Pausiert"
                    value={stats.pausedCampaigns}
                    icon="⏸️"
                    color="yellow"
                  />
                  <StatCard
                    title="Budget gesamt"
                    value={`${stats.totalBudget.toFixed(2)}€`}
                    icon="💰"
                    color="purple"
                  />
                </div>
              </div>

              {/* Budget Stats */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">💵 Budget & Ausgaben</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard
                    title="Ausgaben gesamt"
                    value={`${stats.totalSpent.toFixed(2)}€`}
                    icon="💸"
                    color="red"
                  />
                  <StatCard
                    title="Budget übrig"
                    value={`${(stats.totalBudget - stats.totalSpent).toFixed(2)}€`}
                    icon="🏦"
                    color="green"
                  />
                  <StatCard
                    title="Budget-Auslastung"
                    value={`${stats.totalBudget > 0 ? ((stats.totalSpent / stats.totalBudget) * 100).toFixed(1) : 0}%`}
                    icon="📊"
                    color="blue"
                  />
                </div>
              </div>

              {/* Keyword Stats */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">🔑 Keywords</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatCard
                    title="Keywords gesamt"
                    value={stats.totalKeywords}
                    icon="🔤"
                    color="indigo"
                  />
                  <StatCard
                    title="Aktive Keywords"
                    value={stats.activeKeywords}
                    icon="✨"
                    color="green"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">⚡ Schnellaktionen</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={fetchStats}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    🔄 Aktualisieren
                  </button>
                  <a
                    href="/campaigns"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                  >
                    📋 Kampagnen anzeigen
                  </a>
                  <a
                    href="/optimization"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                  >
                    🚀 Jetzt optimieren
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
