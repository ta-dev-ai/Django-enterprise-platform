
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#1e293b', fontSize: '2.5rem', fontWeight: '800' }}>🚴 VELOS PARIS DATA <span style={{color:'#3b82f6'}}>V2</span></h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
          Interface Propulsée par <strong>TAYIER OS ENGINE</strong>
        </p>
      </header>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <h2>État du Système</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
            <strong>📡 TAYIER ENGINE</strong><br/>
            <span style={{ color: 'green' }}>● Connecté (Port 8000)</span>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
             <strong>🚲 Vélos Disponibles</strong><br/>
             <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>14,230</span>
          </div>
        </div>
      </div>

       <div style={{textAlign:'center', marginTop:'3rem', color:'#94a3b8', fontSize:'0.9rem'}}>
          © 2026 Renovate Energy - Tayier Nimait (Brevet INPI)
       </div>
    </div>
  )
}

export default App
