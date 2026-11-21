import { useState } from 'react'

const DICE = [4, 6, 8, 10, 12, 20, 100]

export default function DiceTray() {
  const [die, setDie] = useState(20)
  const [result, setResult] = useState(null)
  const [rolls, setRolls] = useState(0)
  const [history, setHistory] = useState([])

  function roll() {
    const value = Math.floor(Math.random() * die) + 1
    setResult({ die, value })
    setRolls(rolls + 1)
    setHistory([{ die, value }, ...history].slice(0, 8))
  }

  const critical = result && result.die === 20 && result.value === 20
  const fail = result && result.die === 20 && result.value === 1

  return (
    <section>
      <h2 className="section-title">Bandeja de dados</h2>
      <div className="dice-select">
        {DICE.map((d) => (
          <button
            key={d}
            className={'die-btn' + (d === die ? ' active' : '')}
            onClick={() => setDie(d)}
          >
            d{d}
          </button>
        ))}
      </div>
      <button className="btn primary big" onClick={roll}>
        Lanzar d{die}
      </button>
      <div className="result-box">
        {result ? (
          <div
            key={rolls}
            className={'result' + (critical ? ' crit' : '') + (fail ? ' fail' : '')}
          >
            <span className="result-die">d{result.die}</span>
            <span className="result-value">{result.value}</span>
            {critical && <span className="result-note">Critico</span>}
            {fail && <span className="result-note">Pifia</span>}
          </div>
        ) : (
          <p className="notice">Elige un dado y lanzalo.</p>
        )}
      </div>
      {history.length > 0 && (
        <div className="history">
          <h3 className="subtitle">Ultimos lanzamientos</h3>
          <ul>
            {history.map((h, i) => (
              <li key={i}>
                d{h.die}: <strong>{h.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
