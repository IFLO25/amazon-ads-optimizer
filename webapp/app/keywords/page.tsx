'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Search, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { keywordsApi } from '@/lib/api';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    try {
      setLoading(true);
      const response = await keywordsApi.getAll();
      setKeywords(response.data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Keywords:', error);
      setKeywords([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredKeywords = keywords.filter((keyword) =>
    keyword.keywordText?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStateColor = (state: string) => {
    switch (state) {
      case 'ENABLED':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'PAUSED':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'ARCHIVED':
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'EXACT':
        return 'bg-purple-500/20 text-purple-400 border-purple-500';
      case 'PHRASE':
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'BROAD':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const stats = {
    total: keywords.length,
    enabled: keywords.filter(k => k.state === 'ENABLED').length,
    paused: keywords.filter(k => k.state === 'PAUSED').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Lade Keywords...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white flex items-center gap-3 mb-2">
          <span>🔑</span>
          Keywords
        </h1>
        <p className="text-gray-400 text-xl">Verwalte und optimiere deine Kampagnen-Keywords</p>
      </div>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-xl border border-blue-500">
          <div className="text-blue-200 text-sm font-semibold mb-2">GESAMT</div>
          <div className="text-4xl font-bold text-white">{stats.total}</div>
          <div className="text-blue-200 text-sm mt-2">Keywords insgesamt</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-600 to-green-800 p-6 shadow-xl border border-green-500">
          <div className="text-green-200 text-sm font-semibold mb-2">AKTIV</div>
          <div className="text-4xl font-bold text-white">{stats.enabled}</div>
          <div className="text-green-200 text-sm mt-2">Laufende Keywords</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 shadow-xl border border-yellow-500">
          <div className="text-yellow-200 text-sm font-semibold mb-2">PAUSIERT</div>
          <div className="text-4xl font-bold text-white">{stats.paused}</div>
          <div className="text-yellow-200 text-sm mt-2">Pausierte Keywords</div>
        </div>
      </div>

      {/* Suche & Refresh */}
      <div className="rounded-xl bg-gray-800 border border-gray-700 p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Suchfeld */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Keyword suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadKeywords}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold"
          >
            <RefreshCw className="h-5 w-5" />
            Aktualisieren
          </button>
        </div>
      </div>

      {/* Keywords-Tabelle */}
      <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Keyword
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Match-Typ
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Gebot
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Kampagne
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-lg">
                      {searchTerm 
                        ? 'Keine Keywords gefunden' 
                        : 'Keine Keywords vorhanden'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((keyword, index) => (
                  <tr
                    key={keyword.keywordId || index}
                    className="hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="text-white font-semibold">
                        {keyword.keywordText || 'N/A'}
                      </div>
                      <div className="text-gray-400 text-sm">
                        ID: {keyword.keywordId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStateColor(
                          keyword.state
                        )}`}
                      >
                        {keyword.state || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getMatchTypeColor(
                          keyword.matchType
                        )}`}
                      >
                        {keyword.matchType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-semibold">
                        €{keyword.bid?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">
                        {keyword.campaignId || 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ergebnisse Anzeige */}
      {filteredKeywords.length > 0 && (
        <div className="mt-6 text-center text-gray-400">
          {filteredKeywords.length} von {keywords.length} Keywords angezeigt
        </div>
      )}

      {/* Info-Box */}
      <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700 p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-bold text-lg mb-2">💡 Keyword-Optimierung</h3>
            <p className="text-gray-300 leading-relaxed">
              Die automatische Keyword-Analyse läuft kontinuierlich im Hintergrund. 
              Schlecht performende Keywords werden automatisch pausiert und 
              vielversprechende Keywords erhalten höhere Gebote für bessere Platzierungen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
