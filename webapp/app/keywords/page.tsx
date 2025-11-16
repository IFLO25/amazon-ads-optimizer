'use client';

import { useEffect, useState } from 'react';
import { keywordsApi } from '@/lib/api';
import { TrendingUp, Search } from 'lucide-react';

interface Keyword {
  keywordId: string;
  keywordText: string;
  matchType: string;
  state: string;
  bid: number;
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    try {
      const response = await keywordsApi.getAll();
      const data = response.data.keywords || response.data || [];
      setKeywords(data);
    } catch (error) {
      console.error('Fehler beim Laden der Keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const optimizeKeywords = async () => {
    setOptimizing(true);
    try {
      await keywordsApi.optimize();
      await loadKeywords();
    } catch (error) {
      console.error('Fehler bei der Optimierung:', error);
    } finally {
      setOptimizing(false);
    }
  };

  const filteredKeywords = keywords.filter(kw =>
    kw.keywordText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xl text-gray-300">Lade Keywords...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <span>🔑</span>
            Keywords
          </h1>
          <p className="mt-2 text-gray-400 text-lg">
            {keywords.length} Keywords verwaltet
          </p>
        </div>
        <button
          onClick={optimizeKeywords}
          disabled={optimizing}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 shadow-lg"
        >
          <TrendingUp className={`h-5 w-5 ${optimizing ? 'animate-spin' : ''}`} />
          {optimizing ? 'Optimiere...' : 'Jetzt optimieren'}
        </button>
      </div>

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border border-blue-700 shadow-xl">
          <div className="text-3xl mb-2">🔑</div>
          <div className="text-3xl font-bold text-white">{keywords.length}</div>
          <div className="text-sm text-blue-300 mt-1">Gesamt</div>
        </div>
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border border-green-700 shadow-xl">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-bold text-white">
            {keywords.filter(k => k.state === 'ENABLED').length}
          </div>
          <div className="text-sm text-green-300 mt-1">Aktiv</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border border-purple-700 shadow-xl">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-3xl font-bold text-white">
            {keywords.filter(k => k.matchType === 'EXACT').length}
          </div>
          <div className="text-sm text-purple-300 mt-1">Exact Match</div>
        </div>
        <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-xl p-6 border border-orange-700 shadow-xl">
          <div className="text-3xl mb-2">🔄</div>
          <div className="text-3xl font-bold text-white">
            {keywords.filter(k => k.matchType === 'BROAD').length}
          </div>
          <div className="text-sm text-orange-300 mt-1">Broad Match</div>
        </div>
      </div>

      {/* Suchleiste */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Keywords durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Tabelle */}
      <div className="rounded-xl bg-gray-800 border border-gray-700 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Keyword
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Match Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Gebot
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-gray-400 text-lg">
                      {searchTerm ? 'Keine Keywords gefunden' : 'Keine Keywords vorhanden'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((keyword, index) => (
                  <tr 
                    key={keyword.keywordId} 
                    className="hover:bg-gray-700 transition group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">#{index + 1}</span>
                        <div className="font-semibold text-white group-hover:text-blue-400 transition">
                          {keyword.keywordText}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        keyword.matchType === 'EXACT'
                          ? 'bg-purple-900 text-purple-300 border border-purple-700'
                          : keyword.matchType === 'PHRASE'
                          ? 'bg-blue-900 text-blue-300 border border-blue-700'
                          : 'bg-orange-900 text-orange-300 border border-orange-700'
                      }`}>
                        {keyword.matchType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        keyword.state === 'ENABLED' 
                          ? 'bg-green-900 text-green-300 border border-green-700' 
                          : 'bg-gray-700 text-gray-400 border border-gray-600'
                      }`}>
                        {keyword.state === 'ENABLED' && '✓'}
                        {keyword.state}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-white font-semibold">
                        €{keyword.bid?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <code className="text-xs bg-gray-900 px-2 py-1 rounded text-gray-400 font-mono">
                        {keyword.keywordId}
                      </code>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner */}
      {keywords.length > 0 && (
        <div className="mt-8 bg-green-900/30 rounded-xl p-6 border border-green-700">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="text-lg font-bold text-green-300 mb-2">Keyword-Optimierung</h3>
              <p className="text-green-200">
                Das System analysiert kontinuierlich die Performance aller Keywords und passt 
                Gebote automatisch an, um die besten Ergebnisse zu erzielen.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
