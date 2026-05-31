import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import Badge from '@/components/Badge'
import type { VehicleStatus } from '@/types'
import { vehicleStatusBadge, vehicleStatusLabel, formatKm } from '@/utils/formatters'

type FilterStatus = 'todos' | VehicleStatus

export default function VeiculosPage() {
  const { vehicles } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('todos')

  const counts = useMemo(() => ({
    todos:      vehicles.length,
    disponivel: vehicles.filter(v => v.status === 'disponivel').length,
    'em-uso':   vehicles.filter(v => v.status === 'em-uso').length,
    manutencao: vehicles.filter(v => v.status === 'manutencao').length,
  }), [vehicles])

  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      const matchStatus = filter === 'todos' || v.status === filter
      const q = search.toLowerCase()
      const matchSearch = !q || v.plate.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [vehicles, filter, search])

  const filterOptions: { key: FilterStatus; label: string }[] = [
    { key: 'todos',      label: `Todos (${counts.todos})` },
    { key: 'disponivel', label: `Disponíveis (${counts.disponivel})` },
    { key: 'em-uso',     label: `Em uso (${counts['em-uso']})` },
  ]
  if (counts.manutencao > 0)
    filterOptions.push({ key: 'manutencao', label: `Manutenção (${counts.manutencao})` })

  return (
    <>
      <div className="filter-row">
        <div className="search-bar">
          <i className="ti ti-search" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar por placa ou modelo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {filterOptions.map(opt => (
          <div
            key={opt.key}
            className={`filter-chip${filter === opt.key ? ' active' : ''}`}
            onClick={() => setFilter(opt.key)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setFilter(opt.key)}
          >
            {opt.label}
          </div>
        ))}
      </div>

      <div className="table-card">
        <table className="dc-table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Placa</th>
              <th>Modelo</th>
              <th style={{ width: 90 }}>Marca</th>
              <th style={{ width: 55 }}>Ano</th>
              <th style={{ width: 100 }}>KM atual</th>
              <th style={{ width: 100 }}>Status</th>
              <th>Usuário atual</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <i className="ti ti-car-off" />
                    Nenhum veículo encontrado.
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(v => (
                <tr key={v.id}>
                  <td><strong className="mono">{v.plate}</strong></td>
                  <td>{v.model}</td>
                  <td>{v.brand}</td>
                  <td>{v.year}</td>
                  <td>{formatKm(v.km)}</td>
                  <td>
                    <Badge variant={vehicleStatusBadge(v.status)}>
                      {vehicleStatusLabel(v.status)}
                    </Badge>
                  </td>
                  <td>
                    {v.currentDriver ? (
                      <div className="driver-row">
                        <div className="mini-avatar">{v.currentDriverInitials}</div>
                        {v.currentDriver}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
