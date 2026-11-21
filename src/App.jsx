import { useState } from 'react'
import Bestiary from './components/Bestiary.jsx'
import LootGenerator from './components/LootGenerator.jsx'
import DiceTray from './components/DiceTray.jsx'

const TABS = [
  { id: 'bestiary', label: 'Bestiario' },
  { id: 'loot', label: 'Botin' },
  { id: 'dice', label: 'Dados' }
]

export default function App() {
  const [tab, setTab] = useState('bestiary')

  return (
    <div className="app">
      <header className="header">
        <h1>Asistente del Dungeon Master</h1>
        <p>Dungeons and Dragons 5e</p>
      </header>
      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={'tab' + (tab === t.id ? ' active' : '')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <main className="main">
        {tab === 'bestiary' && <Bestiary />}
        {tab === 'loot' && <LootGenerator />}
        {tab === 'dice' && <DiceTray />}
      </main>
    </div>
  )
}
