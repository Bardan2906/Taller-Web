import { useState } from 'react'
import Card from './Card.jsx'
import { getList, getDetail } from '../api.js'

const CR_OPTIONS = [0, 0.125, 0.25, 0.5, ...Array.from({ length: 30 }, (_, i) => i + 1)]

const COIN_TABLE = [
  { max: 4, coins: { cp: [30, 300], sp: [0, 100], gp: [0, 50], pp: [0, 0] } },
  { max: 10, coins: { cp: [0, 0], sp: [100, 600], gp: [50, 400], pp: [0, 50] } },
  { max: 16, coins: { cp: [0, 0], sp: [0, 0], gp: [500, 3000], pp: [50, 500] } },
  { max: 99, coins: { cp: [0, 0], sp: [0, 0], gp: [2000, 10000], pp: [500, 3000] } }
]

const COIN_NAMES = { cp: 'Cobre', sp: 'Plata', gp: 'Oro', pp: 'Platino' }

function crLabel(cr) {
  if (cr === 0.125) return '1/8'
  if (cr === 0.25) return '1/4'
  if (cr === 0.5) return '1/2'
  return String(cr)
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(list, count) {
  const copy = [...list]
  const out = []
  while (out.length < count && copy.length > 0) {
    out.push(copy.splice(rand(0, copy.length - 1), 1)[0])
  }
  return out
}

function tierOf(cr) {
  return COIN_TABLE.findIndex((t) => cr <= t.max)
}

export default function LootGenerator() {
  const [cr, setCr] = useState(1)
  const [loot, setLoot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const tier = tierOf(cr)
      const coins = {}
      Object.entries(COIN_TABLE[tier].coins).forEach(([k, [a, b]]) => {
        coins[k] = rand(a, b)
      })

      const mundaneCount = 1 + Math.floor(cr / 6) + rand(0, 1)
      const magicCount = tier === 0 ? (Math.random() < 0.2 ? 1 : 0) : tier + rand(0, 1)

      const [equipment, magic] = await Promise.all([
        getList('equipment'),
        getList('magic-items')
      ])

      const mundane = await Promise.all(
        pick(equipment, mundaneCount).map((i) => getDetail('equipment', i.index))
      )
      const special = await Promise.all(
        pick(magic, magicCount).map((i) => getDetail('magic-items', i.index))
      )

      setLoot({ coins, mundane, special })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2 className="section-title">Generador de Botin</h2>
      <div className="row">
        <label htmlFor="cr">Nivel de desafio</label>
        <select
          id="cr"
          className="input"
          value={cr}
          onChange={(e) => setCr(Number(e.target.value))}
        >
          {CR_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {crLabel(v)}
            </option>
          ))}
        </select>
        <button className="btn primary" onClick={generate} disabled={loading}>
          {loading ? 'Generando...' : 'Generar botin'}
        </button>
      </div>
      {error && <p className="notice error">{error}</p>}
      {loot && (
        <div>
          <h3 className="subtitle">Monedas</h3>
          <div className="coins">
            {Object.entries(loot.coins)
              .filter(([, v]) => v > 0)
              .map(([k, v]) => (
                <div className={'coin coin-' + k} key={k}>
                  <span className="coin-amount">{v}</span>
                  <span className="coin-name">{COIN_NAMES[k]}</span>
                </div>
              ))}
          </div>
          <h3 className="subtitle">Objetos</h3>
          <div className="grid">
            {loot.mundane.map((i) => (
              <Card
                key={i.index + Math.random()}
                title={i.name}
                subtitle={i.equipment_category ? i.equipment_category.name : ''}
                stats={
                  i.cost
                    ? [{ label: 'Valor', value: i.cost.quantity + ' ' + i.cost.unit }]
                    : []
                }
              />
            ))}
            {loot.special.map((i) => (
              <Card
                key={i.index + Math.random()}
                title={i.name}
                subtitle={'Objeto magico - ' + (i.equipment_category ? i.equipment_category.name : '')}
                stats={i.rarity ? [{ label: 'Rareza', value: i.rarity.name }] : []}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
