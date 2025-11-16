'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function OptimizationPage() {
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      setResult(null);
    
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/optimization/run`, {
        method: 'POST',
      });
    
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Optimization failed:', error);
      setResult({ error: 'Optimization failed. Please try again.' });
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
    
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Campaign Optimization</h1>
            <p className="text-gray-400">Optimize your campaigns with one click</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">⚡ Quick Optimization</h2>
              <p className="text-gray-400 mb-6">
                Run AI-powered optimization to improve your campaign performance automatically.
              </p>
            
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="text-white font-medium">Bid Optimization</h3>
                    <p className="text-gray-400 text-sm">Adjust keyword bids based on performance</p>
                  </div>
                </div>
              
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="text-white font-medium">Budget Allocation</h3>
                    <p className="text-gray-400 text-sm">Optimize budget distribution across campaigns</p>
                  </div>
                </div>
              
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="text-white font-medium">Keyword Analysis</h3>
                    <p className="text-gray-400 text-sm">Identify underperforming keywords</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleOptimize}
                disabled={optimizing}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {optimizing ? '⚡ Optimizing...' : '⚡ Start Optimization'}
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">📊 Results</h2>
            
              {!result && !optimizing && (
                <div className="text-center py-12 text-gray-400">
                  <span className="text-6xl mb-4 block">📊</span>
                  <p>Click "Start Optimization" to begin</p>
                </div>
              )}

              {optimizing && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 animate-pulse">⚡</div>
                  <p className="text-white text-lg">Analyzing campaigns...</p>
                  <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
                </div>
              )}

              {result && !result.error && (
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Campaigns Analyzed</span>
                      <span className="text-white font-bold">{result.campaignsAnalyzed || 0}</span>
                    </div>
                  </div>
                
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Keywords Optimized</span>
                      <span className="text-white font-bold">{result.keywordsOptimized || 0}</span>
                    </div>
                  </div>
                
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Changes Applied</span>
                      <span className="text-white font-bold">{result.changesApplied || 0}</span>
                    </div>
                  </div>

                  <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mt-6">
                    <p className="text-green-500 font-semibold">✅ Optimization Complete!</p>
                    <p className="text-gray-300 text-sm mt-1">{result.message || 'Your campaigns have been optimized successfully.'}</p>
                  </div>
                </div>
              )}

              {result && result.error && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                  <p className="text-red-500 font-semibold">❌ Optimization Failed</p>
                  <p className="text-gray-300 text-sm mt-1">{result.error}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-blue-500/20 border border-blue-500 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <span className="text-4xl">ℹ️</span>
              <div>
                <h3 className="text-white font-semibold mb-2">System Running 24/7</h3>
                <p className="text-gray-300">
                  Your Amazon Ads Optimizer is running continuously on Railway. The system monitors 
                  your campaigns around the clock and applies optimizations automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
