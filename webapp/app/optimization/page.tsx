'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

interface Recommendation {
  type: string;
  campaignId?: string;
  campaignName?: string;
  keywordId?: string;
  keywordText?: string;
  message: string;
  suggestion: string;
  priority: string;
}

interface OptimizationResult {
  success: boolean;
  totalRecommendations: number;
  recommendations: Recommendation[];
  analyzedCampaigns: number;
  analyzedKeywords: number;
}

export default function OptimizationPage() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const startOptimization = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/optimization/optimize`, {
        method: 'POST',
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Fehler bei der Optimierung:', error);
      alert('❌ Fehler bei der Optimierung!');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-900 text-red-300 border-red-700';
      case 'medium':
        return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      case 'low':
        return 'bg-blue-900 text-blue-300 border-blue-700';
      default:
        return 'bg-gray-900 text-gray-300 border-gray-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
      default:
        return '⚪';
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
              🚀 Kampagnen-Optimierung
            </h1>
            <p className="text-gray-400">
              Automatische Analyse und Empfehlungen für Ihre Kampagnen
            </p>
          </div>

          {/* Start Optimization */}
          <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">⚡ Optimierung starten</h2>
            <p className="text-gray-400 mb-6">
              Analysieren Sie Ihre Kampagnen und Keywords, um Verbesserungspotenziale zu identifizieren.
            </p>
            <button
              onClick={startOptimization}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              {loading ? '⏳ Analysiere...' : '🚀 Jetzt optimieren'}
            </button>
          </div>

          {/* Results */}
          {result && (
            <>
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="text-gray-400 text-sm mb-2">Empfehlungen</div>
                  <div className="text-3xl font-bold text-white">{result.totalRecommendations}</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="text-gray-400 text-sm mb-2">Analysierte Kampagnen</div>
                  <div className="text-3xl font-bold text-blue-400">{result.analyzedCampaigns}</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="text-gray-400 text-sm mb-2">Analysierte Keywords</div>
                  <div className="text-3xl font-bold text-purple-400">{result.analyzedKeywords}</div>
                </div>
              </div>

              {/* Recommendations */}
              {result.recommendations.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Alles optimal!</h3>
                  <p className="text-gray-400">Keine Optimierungsmöglichkeiten gefunden.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4">💡 Empfehlungen</h2>
                  {result.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`rounded-xl p-6 border-2 ${getPriorityColor(rec.priority)}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getPriorityIcon(rec.priority)}</span>
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                              {rec.type}
                            </span>
                            {rec.campaignName && (
                              <h3 className="text-xl font-bold mt-1">{rec.campaignName}</h3>
                            )}
                            {rec.keywordText && (
                              <h3 className="text-xl font-bold mt-1">{rec.keywordText}</h3>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-black bg-opacity-30">
                          {rec.priority} Priority
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          ⚠️ {rec.message}
                        </p>
                        <p className="text-sm opacity-90">
                          💡 {rec.suggestion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Info Box */}
          {!result && !loading && (
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">ℹ️ Was wird optimiert?</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span><strong>Budget-Auslastung:</strong> Kampagnen mit hoher Budget-Ausschöpfung</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span><strong>CTR-Analyse:</strong> Kampagnen und Keywords mit niedriger Click-Through-Rate</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span><strong>Gebot-Optimierung:</strong> Keywords mit zu hohen Geboten</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span><strong>Performance:</strong> Identifikation von unterperformenden Elementen</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
