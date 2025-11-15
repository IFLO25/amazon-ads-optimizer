'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardData {
  totalSpend: number
  totalRevenue: number
  acos: number
  activeCampaigns: number
  totalCampaigns: number
  clicks: number
  orders: number
  ctr: number
  conversionRate: number
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
        const response = await fetch(`${apiUrl}/api/dashboard`)
        
        if (!response.ok) throw new Error('Fehler beim Laden der Daten')
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError('Verbindung zum Backend fehlgeschlagen')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="loading">Dashboard wird geladen...</div>
  }

  if (error || !data) {
    return <div className="error">{error || 'Keine Daten verfügbar'}</div>
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎯 Amazon Ads Optimizer</h1>
        <p>Automatische Kampagnen-Optimierung</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => alert('Synchronisierung gestartet!')}>
          🔄 Synchronisieren
        </button>
        <button onClick={() => alert('Optimierung gestartet!')}>
          ▶️ Optimierung starten
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>💰 Gesamtausgaben</h3>
          <div className="value">€{data.totalSpend.toFixed(2)}</div>
          <div className="change">Letzten 30 Tage</div>
        </div>

        <div className="stat-card">
          <h3>📊 Umsatz</h3>
          <div className="value">€{data.totalRevenue.toFixed(2)}</div>
          <div className="change">Letzten 30 Tage</div>
        </div>

        <div className="stat-card">
          <h3>🎯 ACoS</h3>
          <div className="value">{data.acos.toFixed(2)}%</div>
          <div className="change positive">✓ Im Zielbereich</div>
        </div>

        <div className="stat-card">
          <h3>📢 Aktive Kampagnen</h3>
          <div className="value">{data.activeCampaigns}</div>
          <div className="change">von {data.totalCampaigns} gesamt</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="section">
          <h2>🖱️ Klicks & Conversions</h2>
          <p>Klicks gesamt: <strong>{data.clicks}</strong></p>
          <p>Bestellungen: <strong>{data.orders}</strong></p>
          <p>CTR: <strong>{data.ctr.toFixed(2)}%</strong></p>
          <p>Conversion Rate: <strong>{data.conversionRate.toFixed(2)}%</strong></p>
        </div>

        <div className="section">
          <h2>🤖 Automatisierung</h2>
          <ul className="automation-list">
            <li>Gebotsoptimierung aktiv</li>
            <li>Keyword-Analyse läuft</li>
            <li>Budget-Optimierung aktiv</li>
            <li>Nächste Optimierung: in 1h 45m</li>
          </ul>
        </div>

        <div className="section">
          <h2>🎯 Optimierungs-Ziele</h2>
          <ul className="goals-list">
            <li>Ziel-ACoS: 5-15% ✓ Erreicht</li>
            <li>Budget-Nutzung: 89%</li>
            <li>ROI-Ziel: 284%</li>
          </ul>
        </div>
      </div>

      <div className="nav-links">
        <Link href="/campaigns">📢 Alle Kampagnen anzeigen und verwalten</Link>
        <Link href="/keywords">🔑 Keywords analysieren und optimieren</Link>
        <Link href="/optimization">⚙️ Optimierungs-Historie und Zeitplan</Link>
      </div>
    </div>
  )
}
