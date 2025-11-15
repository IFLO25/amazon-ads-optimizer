'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface OptimizationLog {
  id: string;
  timestamp: string;
  type: string;
  campaignName: string;
  action: string;
  oldValue: number;
  newValue: number;
  reason: string;
  impact: string;
}

export default function OptimizationPage() {
  const [logs, setLogs] = useState<OptimizationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/optimization/history`);
      setLogs(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Optimierungs-Historie:', error);
      setLoading(false);
    }
  };

  const runOptimization = async () => {
    setOptimizing(true);
    try {
      await axios.post(`${API_URL}/optimization/run`);
      await fetchLogs();
      alert('✅ Optimierung erfolgreich durchgeführt!');
    } catch (error) {
      console.error('Fehler bei der Optimierung:', error);
      alert('❌ Fehler bei der Optimierung!');
    }
    setOptimizing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Lade Optimierungs-Historie...</div>
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
            <h1 className="text-3xl font-bold text-white">⚡ Optimierungs-Center</h1>
            <p className="text-gray-400 mt-1">Automatische Kampagnen-Optimierung</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchLogs}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              🔄 Aktualisieren
            </button>
            <button 
              onClick={runOptimization}
              disabled={optimizing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {optimizing ? '⏳ Optimiere...' : '▶️ Jetzt optimieren'}
            </button>
          </div>
        </div>
      </header>

      {/* Status Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Auto-Optimization Status */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">🤖 Auto-Optimierung</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoOptimize}
                  onChange={(e) => setAutoOptimize(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <p className="text-gray-400 text-sm mb-2">
              Status: <span className={autoOptimize ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                {autoOptimize ? '✓ Aktiv' : '✗ Pausiert'}
              </span>
            </p>
            <p className="text-gray-400 text-sm">
              Nächste Optimierung: <span className="text-blue-400 font-semibold">in 1h 45m</span>
            </p>
          </div>

          {/* Optimizations Today */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Optimierungen heute</span>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-white">{logs.filter(l => {
              const today = new Date().toDateString();
              return new Date(l.timestamp).toDateString() === today;
            }).length}</div>
            <div className="text-sm text-gray-500 mt-1">Durchgeführte Änderungen</div>
          </div>

          {/* Total Impact */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Geschätzte Ersparnis</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-green-400">€124.50</div>
            <div className="text-sm text-gray-500 mt-1">Letzte 7 Tage</div>
          </div>
        </div>

        {/* Optimization Rules */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🎯 Aktive Optimierungs-Regeln</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500">✓</span>
                <span className="text-white font-semibold">Gebot-Anpassung bei hohem ACoS</span>
              </div>
              <p className="text-gray-400 text-sm">Gebote um 15% senken wenn ACoS &gt; 25%</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500">✓</span>
                <span className="text-white font-semibold">Gebot-Erhöhung bei niedrigem ACoS</span>
              </div>
              <p className="text-gray-400 text-sm">Gebote um 10% erhöhen wenn ACoS &lt; 10%</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500">✓</span>
                <span className="text-white font-semibold">Keyword-Pausierung</span>
              </div>
              <p className="text-gray-400 text-sm">Keywords pausieren wenn ACoS &gt; 40% und &gt; 50€ Ausgaben</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500">✓</span>
                <span className="text-white font-semibold">Budget-Umverteilung</span>
              </div>
              <p className="text-gray-400 text-sm">Budget von Low-Performern zu Top-Performern verschieben</p>
            </div>
          </div>
        </div>

        {/* Optimization History */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">📋 Optimierungs-Historie</h3>
          </div>
          
          {logs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Keine Optimierungen durchgeführt
              </h3>
              <p className="text-gray-400 mb-6">
                Starte die erste Optimierung mit dem Button oben rechts.
              </p>
              <button 
                onClick={runOptimization}
                disabled={optimizing}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-600"
              >
                ▶️ Erste Optimierung starten
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Zeitpunkt
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Typ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Kampagne
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Aktion
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Änderung
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Grund
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-750 transition">
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(log.timestamp).toLocaleString('de-DE')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          log.type === 'BID' 
                            ? 'bg-blue-900 text-blue-300' 
                            : log.type === 'BUDGET'
                            ? 'bg-purple-900 text-purple-300'
                            : 'bg-orange-900 text-orange-300'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {log.campaignName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-red-400">€{log.oldValue.toFixed(2)}</span>
                        <span className="text-gray-500 mx-2">→</span>
                        <span className="text-green-400">€{log.newValue.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {log.reason}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          log.impact === 'HIGH' 
                            ? 'bg-green-900 text-green-300' 
                            : log.impact === 'MEDIUM'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {log.impact}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
