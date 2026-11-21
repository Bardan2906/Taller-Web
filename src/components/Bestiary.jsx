import { useEffect, useMemo, useState } from 'react'
import Card from './Card.jsx'
import { getList, getDetail } from '../api.js'

const PAGE_SIZE = 12

function armorValue(ac) {
  if (Array.isArray(ac)) return ac[0] ? ac[0].value : '-'
  return ac ?? '-'
}

function crLabel(cr) {
  if (cr === 0.125) return '1/8'
  if (cr === 0.25) return '1/4'
  if (cr === 0.5) return '1/2'
  return cr ?? '-'
}

export default function Bestiary() {
  const [list, setList] = useState([])
  const [details, setDetails] = useState({})
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getList('monsters')
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => list.filter((m) => m.name.toLowerCase().includes(query.toLowerCase())),
    [list, query]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  useEffect(() => {
    visible.forEach((m) => {
      if (!details[m.index]) {
        getDetail('monsters', m.index)
          .then((d) => setDetails((prev) => ({ ...prev, [m.index]: d })))
          .catch(() => {})
      }
    })
  }, [visible])

  function onSearch(e) {
    setQuery(e.target.value)
    setPage(0)
  }

  return (
    <section>
      <h2 className="section-title">Bestiario</h2>
      <input
        className="input"
        type="search"
        placeholder="Buscar monstruo por nombre"
        value={query}
        onChange={onSearch}
      />
      {loading && <p className="notice">Cargando monstruos...</p>}
      {error && <p className="notice error">{error}</p>}
      {!loading && filtered.length === 0 && <p className="notice">Sin resultados.</p>}
      <div className="grid">
        {visible.map((m) => {
          const d = details[m.index]
          return (
            <Card
              key={m.index}
              title={m.name}
              subtitle={d ? d.type + ' - ' + d.size : 'Cargando datos'}
              stats={[
                { label: 'Armadura', value: d ? armorValue(d.armor_class) : '...' },
                { label: 'Puntos de Golpe', value: d ? d.hit_points : '...' },
                { label: 'Desafio', value: d ? crLabel(d.challenge_rating) : '...' }
              ]}
            />
          )
        })}
      </div>
      <div className="pager">
        <button className="btn" disabled={page === 0} onClick={() => setPage(page - 1)}>
          Anterior
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button
          className="btn"
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </section>
  )
}
