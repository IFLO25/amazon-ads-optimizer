'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

interface Campaign {
  campaignId: string;
  name: string;
  state: string;
  budget: number;
  startDate: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/campaigns`);
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    await loadCampaigns();
    setSyncing(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
    
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
              <p className="text-gray-400">Manage your Amazon advertising campaigns</p>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {syncing ? '🔄 Syncing...' : '🔄 Sync Data'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Total Campaigns</h3>
              <p className="text-white text-2xl font-bold">{campaigns.length}</p>
            </div>
          
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Active</h3>
              <p className="text-white text-2xl font-bold">
                {campaigns.filter(c => c.state === 'ENABLED').length}
              </p>
            </div>
          
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">⏸️</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Paused</h3>
              <p className="text-white text-2xl font-bold">
                {campaigns.filter(c => c.state === 'PAUSED').length}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white text-xl">Loading campaigns...</div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Campaign Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Budget</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Start Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Campaign ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {campaigns.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                          No campaigns found. Sync your data to get started.
                        </td>
                      </tr>
                    ) : (
                      campaigns.map((campaign) => (
                        <tr key={campaign.campaignId} className="hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{campaign.name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              campaign.state === 'ENABLED'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {campaign.state}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">${campaign.budget?.toFixed(2) || '0.00'}</td>
                          <td className="px-6 py-4 text-gray-300">
                            {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{campaign.campaignId}</td>
                        </tr>
                      ))
                    )}
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
