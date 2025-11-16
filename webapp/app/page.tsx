
'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      // Fetch campaigns
      const campaignsResponse = await fetch(`${apiUrl}/api/campaigns`);
      const campaigns = await campaignsResponse.json();

      // Calculate stats
      const totalCampaigns = campaigns.length;
      const activeCampaigns = campaigns.filter((c: any) => c.state === 'ENABLED').length;
      const pausedCampaigns = campaigns.filter((c: any) => c.state === 'PAUSED').length;
      const totalBudget = campaigns.reduce((sum: number, c: any) => sum + (parseFloat(c.budget) || 0), 0);

      setStats({
        totalCampaigns,
        activeCampaigns,
        pausedCampaigns,
        totalBudget,
        totalSpend: 0,
        totalImpressions: 0,
        totalClicks: 0,
        avgCtr: 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-gray-400">Monitor your Amazon advertising performance</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white text-xl">Loading dashboard data...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Campaigns"
                value={stats.totalCampaigns.toString()}
                icon="📊"
                trend="+12%"
              />
              <StatCard
                title="Active Campaigns"
                value={stats.activeCampaigns.toString()}
                icon="✅"
                trend="+8%"
              />
              <StatCard
                title="Total Budget"
                value={`$${stats.totalBudget.toFixed(2)}`}
                icon="💰"
                trend="+15%"
              />
              <StatCard
                title="Paused Campaigns"
                value={stats.pausedCampaigns.toString()}
                icon="⏸️"
                trend="-5%"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/campaigns'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors text-left"
                >
                  📢 View All Campaigns
                </button>
                <button
                  onClick={() => window.location.href = '/keywords'}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors text-left"
                >
                  🔑 Manage Keywords
                </button>
                <button
                  onClick={() => window.location.href = '/optimization'}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors text-left"
                >
                  ⚡ Run Optimization
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔄</span>
                  <span>System running 24/7 on Railway</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📊</span>
                  <span>Monitoring {stats.totalCampaigns} campaigns</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✅</span>
                  <span>Connected to Amazon Ads API</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: string; trend: string }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className={`text-sm ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}


