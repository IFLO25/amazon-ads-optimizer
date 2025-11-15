'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface Keyword {
  keywordId: string;
  keywordText: string;
  campaignName: string;
  state: string;
  matchType: string;
  bid: number;
  impressions: number;
  clicks: number;
  spend: number;
  sales: number;
  orders: number;
  acos: number;
  ctr: number;
  conversionRate: number;
  cpc: number;
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('acos');

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const response = await axios.get(`${API_URL}/keywords`);
      setKeywords(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Keywords:', error);
      setLoading(false);
    }
  };

  const filteredKeywords = keywords.filter(keyword => {
    if (filter === 'all') return true;
    if (filter === 'enabled') return keyword.state === 'ENABLED';
    if (filter === 'paused') return keyword.state === 'PAUSED';
    if (filter === 'high-acos') return keyword.acos > 25;
    if (filter === 'low-acos') return keyword.acos <= 15;
    return true;
  });

  const sortedKeywords = [...filteredKeywords].sort((a, b) => {
    if (sortBy === 'acos') return b.acos - a.acos;
    if (sortBy === 'spend') return b.spend - a.spend;
    if (sortBy === 'sales') return b.sales - a.sales;
    if (sortBy === 'clicks') return b.clicks - a.clicks;
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Lade Keywords...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block">
              ← Zurück zum Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">🔑 Keywords-Analyse</h1>
            <p className="text-gray-400 mt-1">{keywords.length} Keywords gefunden</p>
          </div>
          <button 
            onClick={fetchKeywords}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔄 Aktualisieren
          </button>
        </div>
      </header>

      {/* Filters & Sort */}
      <div className="px-8 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {/* Filters */}
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Alle ({keywords.length})
            </button>
            <button
              onClick={() => setFilter('enabled')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'enabled' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Aktiv ({keywords.filter(k => k.state === 'ENABLED').length})
            </button>
            <button
              onClick={() => setFilter('high-acos')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'high-acos' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Hoher ACoS ({keywords.filter(k => k.acos > 25).length})
            </button>
            <button
              onClick={() => setFilter('low-acos')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'low-acos' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Niedriger ACoS ({keywords.filter(k => k.acos <= 15).length})
            </button>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Sortieren:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="acos">ACoS (hoch → niedrig)</option>
              <option value="spend">Ausgaben (hoch → niedrig)</option>
              <option value="sales">Umsatz (hoch → niedrig)</option>
              <option value="clicks">Klicks (hoch → niedrig)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Keywords Table */}
      <main className="px-8 py-6">
        {sortedKeywords.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🔑</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Keine Keywords gefunden
            </h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'Es wurden noch keine Keywords erstellt.' 
                : `Keine Keywords für diesen Filter vorhanden.`}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Keyword
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Kampagne
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Match Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Gebot
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ausgaben
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Umsatz
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      ACoS
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Klicks
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      CTR
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      CPC
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sortedKeywords.map((keyword) => (
                    <tr key={keyword.keywordId} className="hover:bg-gray-750 transition">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{keyword.keywordText}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">{keyword.campaignName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          keyword.matchType === 'EXACT' 
                            ? 'bg-purple-900 text-purple-300' 
                            : keyword.matchType === 'PHRASE'
                            ? 'bg-blue-900 text-blue-300'
                            : 'bg-orange-900 text-orange-300'
                        }`}>
                          {keyword.matchType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          keyword.state === 'ENABLED' 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {keyword.state === 'ENABLED' ? '✓ Aktiv' : '⏸ Pausiert'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-300">
                        €{keyword.bid.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-white font-medium">
                        €{keyword.spend.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-green-400 font-medium">
                        €{keyword.sales.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-semibold ${
                          keyword.acos <= 15 ? 'text-green-400' : 
                          keyword.acos <= 25 ? 'text-yellow-400' : 
                          'text-red-400'
                        }`}>
                          {keyword.acos.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-300">
                        {keyword.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-300">
                        {keyword.ctr.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-300">
                        €{keyword.cpc.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
