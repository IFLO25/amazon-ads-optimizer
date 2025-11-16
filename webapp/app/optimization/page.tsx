'use client';

import { useState } from 'react';
import { Play, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { optimizationApi } from '@/lib/api';

export default function OptimizationPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runOptimization = async () => {
    setRunning(true);
    setResults(null);
    
    try {
      const response = await optimizationApi.runAll();
      setResults(response.data);
    } catch (error: any) {
      console.error('Fehler bei der Optimierung:', error);
      setResults({ 
        error: error.message || 'Optimierung fehlgeschlagen',
        success: false 
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <span>⚡</span>
          Optimierung
        </h1>
        <p className="mt-2 text-gray-400 text-lg">
          Manuelle Optimierung aller Kampagnen und Keywords
        </p>
      </div>

      {/* Hauptbereich */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Optimierungs-Card */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-gray-800 border border-gray-700 p-8 shadow-2xl">
            <div className="text-center">
              {!running && !results && (
                <>
                  <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-6 shadow-lg">
                    <Play className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">Optimierung starten</h2>
                  <p className="text-gray-400 text-lg mb-8">
                    Startet eine vollständige Optimierung aller Kampagnen, Keywords, Gebote und Budgets basierend auf der aktuellen Performance.
                  </p>
                  <button
                    onClick={runOptimization}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-4 text-white hover:from-blue-700 hover:to-blue-800 text-lg font-bold transition transform hover:scale-105 shadow-xl"
                  >
                    🚀 Optimierung starten
                  </button>
                </>
              )}

              {running && (
                <>
                  <div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
                  <h2 className="text-3xl font-bold text-white mb-3">Optimierung läuft...</h2>
                  <p className="text-gray-400 text-lg">
                    Das System analysiert alle Kampagnen und Keywords. Dies kann einige Minuten dauern.
                  </p>
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center justify-center gap-3 text-blue-400">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span>Analysiere Performance-Daten...</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-blue-400">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <span>Berechne optimale Gebote...</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-blue-400">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <span>Aktualisiere Keywords...</span>
                    </div>
                  </div>
                </>
              )}

              {!running && results && !results.error &&
