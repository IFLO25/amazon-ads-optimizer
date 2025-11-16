'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

interface Keyword {
  keywordId: string;
  keywordText: string;
  state: string;
  bid: number;
  campaignId: string;
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/keywords`);
      const data = await response.json();
      setKeywords(data);
    } catch (error) {
      console.error('Failed to load keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredKeywords = keywords.filter(keyword =>
    keyword.keywordText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
    
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Keywords</h1>
            <p className="text-gray-400">Manage your campaign keywords</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🔑</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Total Keywords</h3>
              <p className="text-white text-2xl font-bold">{keywords.length}</p>
            </div>
          
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Active</h3>
              <p className="text-white text-2xl font-bold">
                {keywords.filter(k => k.state === 'ENABLED').length}
              </p>
            </div>
          
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Avg Bid</h3>
              <p className="text-white text-2xl font-bold">
                ${keywords.length > 0 
                  ? (keywords.reduce((sum, k) => sum + (k.bid || 0), 0) / keywords.length).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 text-white px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white text-xl">Loading keywords...</div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Keyword</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Bid</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Campaign ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredKeywords.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                          {searchTerm ? 'No keywords match your search.' : 'No keywords found.'}
                        </td>
                      </tr>
                    ) : (
                      filteredKeywords.map((keyword) => (
                        <tr key={keyword.keywordId} className="hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{keyword.keywordText}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              keyword.state === 'ENABLED'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {keyword.state}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">${keyword.bid?.toFixed(2) || '0.00'}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{keyword.campaignId}</td>
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
