'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

interface Keyword {
  keywordId: string;
  keywordText: string;
  campaignName: string;
  status: string;
  bid: number;
  impressions: number;
  clicks: number;
  matchType: string;
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/keywords`);
      const data = await res.json();
      setKeywords(data);
    } catch (error) {
      console.error('Fehler beim Laden der Keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncKeywords = async () => {
    try {
      setSyncing(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/keywords/sync`, {
        method: 'POST',
      });
      const data = await res.json();
      alert(`✅ ${data.count} Keywords synchronisiert!`);
      await fetchKeywords();
    } catch (error) {
      console.error('Fehler beim Synchronisieren:', error);
      alert('❌ Fehler beim Synchronisieren!');
    } finally {
      setSyncing(false);
    }
  };

  const filteredKeywords = keywords.filter(keyword =>
    keyword.keywordText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    keyword.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'enabled':
        return 'text-green-400';
      case 'paused':
        return 'text-yellow-400';
      case 'archived':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType.toLowerCase()) {
      case 'exact':
        return 'bg-purple-900 text-purple-300';
      case 'phrase':
        return 'bg-blue-900 text-blue-300';
      case 'broad':
        return 'bg-green-900 text-green-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🔑 Keywords
              </h1>
              <p className="text-gray-400">
                Alle Keywords Ihrer Amazon Kampagnen
              </p>
            </div>
            <button
              onClick={syncKeywords}
              disabled={syncing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {syncing ? '🔄 Synchronisiere...' : '🔄 Synchronisieren'}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Keywords oder Kampagnen durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white px-6 py-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Gesamt</div>
              <div className="text-3xl font-bold text-white">{keywords.length}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Aktiv</div>
              <div className="text-3xl font-bold text-green-400">
                {keywords.filter(k => k.status === 'enabled').length}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Gefunden</div>
              <div className="text-3xl font-bold text-blue-400">
                {filteredKeywords.length}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Ø Gebot</div>
              <div className="text-3xl font-bold text-purple-400">
                {keywords.length > 0
                  ? (keywords.reduce((sum, k) => sum + (k.bid || 0), 0) / keywords.length).toFixed(2)
                  : '0.00'}€
              </div>
            </div>
          </div>

          {/* Keywords Table */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Lade Keywords...</p>
            </div>
          ) : filteredKeywords.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">Keine Keywords gefunden</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? 'Passen Sie Ihre Suche an' : 'Synchronisieren Sie Ihre Keywords von Amazon'}
              </p>
              {!searchTerm && (
                <button
                  onClick={syncKeywords}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  🔄 Jetzt synchronisieren
                </button>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="text-left p-4 text-gray-400 font-semibold">Keyword</th>
                      <th className="text-left p-4 text-gray-400 font-semibold">Kampagne</th>
                      <th className="text-left p-4 text-gray-400 font-semibold">Match Type</th>
                      <th className="text-left p-4 text-gray-400 font-semibold">Status</th>
                      <th className="text-right p-4 text-gray-400 font-semibold">Gebot</th>
                      <th className="text-right p-4 text-gray-400 font-semibold">Impressionen</th>
                      <th className="text-right p-4 text-gray-400 font-semibold">Klicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeywords.map((keyword) => (
                      <tr key={keyword.keywordId} className="border-t border-gray-700 hover:bg-gray-750">
                        <td className="p-4 text-white font-medium">{keyword.keywordText}</td>
                        <td className="p-4 text-gray-300">{keyword.campaignName}</td>
                        <td className="p-4">
                          <span className={`${getMatchTypeColor(keyword.matchType)} px-3 py-1 rounded-full text-xs font-semibold`}>
                            {keyword.matchType}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`${getStatusColor(keyword.status)} font-semibold`}>
                            {keyword.status}
                          </span>
                        </td>
                        <td className="p-4 text-right text-white">{keyword.bid?.toFixed(2) || '0.00'}€</td>
                        <td className="p-4 text-right text-gray-300">{keyword.impressions?.toLocaleString() || 0}</td>
                        <td className="p-4 text-right text-gray-300">{keyword.clicks?.toLocaleString() || 0}</td>
                      </tr>
                    ))}
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
