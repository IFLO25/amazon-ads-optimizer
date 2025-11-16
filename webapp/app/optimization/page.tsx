'use client';

import { useState } from 'react';
import { Zap, TrendingUp, DollarSign, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { optimizationApi } from '@/lib/api';

export default function OptimizationPage() {
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const runOptimization = async () => {
    try {
      setOptimizing(true);
      setError('');
      setResult(null);
      const response = await optimizationApi.optimize();
      setResult(response.data);
    } catch (err: any) {
      console.error('Fehler bei der Optimierung:', err);
      setError(err.response?.data?.message || 'Fehler bei der Optimierung');
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white flex items-center justify-center gap-4 mb-4">
            <span>⚡</span>
            Kampagnen-Optimierung
          </h1>
          <p className="text-gray-400 text-2xl">
            Automatische Optimierung Ihrer Amazon Ads Kampagnen
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-900/20 border border-red-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <p className="text-red-400 text-lg">⚠️ {error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-xl bg-gradient-to-br from-blue-900/50 to-blue-700/50 border border-blue-600 p-8 text-center">
            <Target className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-blue-300 text-lg font-bold mb-2">Keyword-Optimierung</h3>
            <p className="text-gray-300">Automatische Anpassung von Geboten basierend auf Performance</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-900/50 to-green-700/50 border border-green-600 p-8 text-center">
            <DollarSign className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-green-300 text-lg font-bold mb-2">Budget-Optimierung</h3>
            <p className="text-gray-300">Intelligente Budgetverteilung auf Top-Performer</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-900/50 to-purple-700/50 border border-purple-600 p-8 text-center">
            <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-purple-300 text-lg font-bold mb-2">Performance-Boost</h3>
            <p className="text-gray-300">Pausierung von unterperformenden Keywords</p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-800 border border-gray-700 shadow-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Starten Sie die Optimierung</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Klicken Sie auf den Button, um eine automatische Analyse und Optimierung aller Ihrer Kampagnen durchzuführen. 
            Der Prozess analysiert Performance-Daten und passt Gebote und Budgets entsprechend an.
          </p>
          <button
            onClick={runOptimization}
            disabled={optimizing}
            className={`px-12 py-6 rounded-2xl text-2xl font-bold transition transform hover:scale-105 flex items-center gap-4 mx-auto ${
              optimizing
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white hover:from-green-700 hover:via-blue-700 hover:to-purple-700 shadow-2xl'
            }`}
          >
            <Zap className={`h-8 w-8 ${optimizing ? 'animate-pulse' : ''}`} />
            {optimizing ? 'Optimierung läuft...' : 'Jetzt optimieren'}
          </button>
        </div>

        {optimizing && (
          <div className="mt-12 rounded-xl bg-blue-900/20 border border-blue-700 p-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-blue-400 text-xl font-bold">Optimierung wird durchgeführt...</p>
            </div>
            <p className="text-center text-gray-400">
              Bitte warten Sie, während wir Ihre Kampagnen analysieren und optimieren.
            </p>
          </div>
        )}

        {result && !optimizing && (
          <div className="mt-12 rounded-xl bg-green-900/20 border border-green-700 p-8">
            <div className="flex items-center gap-4 mb-6">
              <CheckCircle className="h-10 w-10 text-green-400" />
              <h3 className="text-3xl font-bold text-green-400">Optimierung erfolgreich!</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Analysierte Kampagnen</p>
                <p className="text-4xl font-bold text-white">{result.campaignsAnalyzed || 0}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Durchgeführte Änderungen</p>
                <p className="text-4xl font-bold text-white">{result.changesApplied || 0}</p>
              </div>
            </div>
            {result.message && (
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-300 text-lg">{result.message}</p>
              </div>
            )}
            {result.details && result.details.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xl font-bold text-white mb-4">Details:</h4>
                <ul className="space-y-2">
                  {result.details.map((detail: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span className="text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">📊 Optimierungs-Metriken</h3>
            <ul className="space-y-3 text-gray-300">
              <li>• Automatische Gebotsanpassung basierend auf ACOS</li>
              <li>• Pausierung von Keywords mit hohen Kosten</li>
              <li>• Budget-Reallokation zu Top-Performern</li>
              <li>• Performance-Trend-Analyse</li>
            </ul>
          </div>
          <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">⚙️ Optimierungs-Regeln</h3>
            <ul className="space-y-3 text-gray-300">
              <li>• ACOS {'>'} 50%: Gebot um 20% senken</li>
              <li>• ACOS {'<'} 20%: Gebot um 15% erhöhen</li>
              <li>• Keine Conversions: Keyword pausieren</li>
              <li>• Budget-Auslastung {'>'} 90%: Budget erhöhen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
