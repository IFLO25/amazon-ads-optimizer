'use client';

import { useState } from 'react';
import { Play, CheckCircle, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { optimizationApi } from '@/lib/api';

export default function OptimizationPage() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startOptimization = async () => {
    try {
      setIsOptimizing(true);
      setResult(null);
      const response = await optimizationApi.optimize();
      setResult(response.data);
    } catch (error) {
      console.error('Fehler bei der Optimierung:', error);
      setResult({
        success: false,
        message: 'Optimierung fehlgeschlagen',
        error: error instanceof Error ? error.message : 'Unbekannter Fehler',
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white flex items-center gap-3 mb-2">
          <span>🚀</span>
          Kampagnen-Optimierung
        </h1>
        <p className="text-gray-400 text-xl">Manuelle Optimierung aller Kampagnen und Keywords</p>
      </div>

      {/* Info-Karten */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Automatische Optimierung */}
        <div className="rounded-xl bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-700 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-green-500 p-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Automatisch</h2>
          </div>
          <div className="space-y-2 text-green-200">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Läuft 24/7 im Hintergrund</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Gebote werden angepasst</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Keywords werden optimiert</span>
            </div>
          </div>
        </div>

        {/* Manuelle Optimierung */}
        <div className="rounded-xl bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-700 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-blue-500 p-3">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Manuell</h2>
          </div>
          <div className="space-y-2 text-blue-200">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
              <span>Auf Knopfdruck starten</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
              <span>Sofortige Ergebnisse</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
              <span>Detaillierte Reports</span>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="rounded-xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-purple-500 p-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Performance</h2>
          </div>
          <div className="space-y-2 text-purple-200">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
              <span>ROI-Steigerung: +284%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
              <span>ACoS-Reduktion: -15%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
              <span>CTR-Verbesserung: +2.27%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Optimierung starten */}
      <div className="rounded-2xl bg-gray-800 border border-gray-700 p-8 shadow-2xl mb-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
              <Play className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Manuelle Optimierung starten</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Klicke auf den Button, um eine sofortige Optimierung aller Kampagnen durchzuführen. 
              Der Prozess analysiert Performance-Daten, passt Gebote an und optimiert Keywords.
            </p>
          </div>

          <button
            onClick={startOptimization}
            disabled={isOptimizing}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition transform ${
              isOptimizing
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-xl'
            }`}
          >
            {isOptimizing ? (
              <span className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Optimierung läuft...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Play className="h-5 w-5" />
                Optimierung jetzt starten
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Ergebnis */}
      {result && (
        <div
          className={`rounded-xl border p-6 shadow-xl ${
            result.success
              ? 'bg-green-900/20 border-green-700'
              : 'bg-red-900/20 border-red-700'
          }`}
        >
          <div className="flex items-start gap-4">
            {result.success ? (
              <CheckCircle className="h-8 w-8 text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3
                className={`text-xl font-bold mb-2 ${
                  result.success ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {result.success ? '✅ Optimierung erfolgreich!' : '❌ Optimierung fehlgeschlagen'}
              </h3>
              <p className="text-white mb-4">{result.message || 'Keine Details verfügbar'}</p>

              {result.details && (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-semibold mb-3">📊 Details:</h4>
                  <div className="space-y-2 text-gray-300">
                    {result.details.campaignsOptimized !== undefined &&
