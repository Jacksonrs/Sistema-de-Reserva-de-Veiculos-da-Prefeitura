import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

export default function RelatoriosPage() {
  const { vehicles, reservations } = useApp()
  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const stats = useMemo(() => {
    const completed = reservations.filter(r => r.status === 'finalizada')
    const totalKm = completed.reduce((s, r) => s + (r.km ?? 0), 0)
    const avgKm = completed.length ? totalKm / completed.length : 0

    // By vehicle
    const byVehicle: Record<string, { label: string; trips: number; km: number }> = {}
    completed.forEach(r => {
      if (!byVehicle[r.vehiclePlate]) {
        byVehicle[r.vehiclePlate] = { label: r.vehicleLabel, trips: 0, km: 0 }
      }
      byVehicle[r.vehiclePlate].trips++
      byVehicle[r.vehiclePlate].km += r.km ?? 0
    })
    const byVehicleArr = Object.entries(byVehicle)
      .map(([plate, v]) => ({ plate, ...v }))
      .sort((a, b) => b.km - a.km)

    // By sector
    const bySector: Record<string, { trips: number; km: number }> = {}
    completed.forEach(r => {
      const sec = r.sector || 'Não informado'
      if (!bySector[sec]) bySector[sec] = { trips: 0, km: 0 }
      bySector[sec].trips++
      bySector[sec].km += r.km ?? 0
    })
    const bySectorArr = Object.entries(bySector)
      .map(([sector, v]) => ({ sector, ...v }))
      .sort((a, b) => b.trips - a.trips)
    const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    const reservasPorMes = MONTHS.map((name, i) => ({
      name,
      total: reservations.filter(r => new Date(r.date).getMonth() === i).length,
    }))

    const kmPorMes = MONTHS.map((name, i) => ({
      name,
      km: Math.round(completed.filter(r => new Date(r.date).getMonth() === i).reduce((s, r) => s + (r.km ?? 0), 0)),
    }))

    return { completed, totalKm, avgKm, byVehicleArr, bySectorArr, reservasPorMes, kmPorMes }
  }, [vehicles, reservations])

  const disponivel = vehicles.filter(v => v.status === 'disponivel').length
  const emUso = vehicles.filter(v => v.status === 'em-uso').length
  const utilizationPct = vehicles.length ? Math.round((emUso / vehicles.length) * 100) : 0

  return (
    <>
      {/* ── Summary cards ─────────────────────────────────────────────── */}
      <div className="cards-grid">
        <div className="stat-card">
          <div className="stat-label">Total de viagens (mês)</div>
          <div className="stat-value">{stats.completed.length}</div>
          <div className="stat-meta">finalizadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">KM total rodados</div>
          <div className="stat-value">
            {stats.totalKm.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="stat-meta">km em {currentMonth}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Média por viagem</div>
          <div className="stat-value">
            {stats.avgKm.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </div>
          <div className="stat-meta">km médios</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Taxa de utilização</div>
          <div className="stat-value" style={{ color: utilizationPct > 50 ? 'var(--color-amber)' : 'var(--color-accent)' }}>
            {utilizationPct}%
          </div>
          <div className="stat-meta">{emUso} em uso · {disponivel} livres</div>
        </div>
      </div>

      {/* ── Fleet utilization bar ──────────────────────────────────────── */}
      <div className="section-header">
        <div className="section-title">Utilização da frota</div>
      </div>
      <div className="form-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '.85rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
              Veículos em uso / total da frota
            </div>
            <div style={{
              height: 10, borderRadius: 100,
              background: 'var(--color-background-tertiary)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${utilizationPct}%`,
                borderRadius: 100,
                background: utilizationPct > 70 ? 'var(--color-amber)' : 'var(--color-accent)',
                transition: 'width .4s ease',
              }} />
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 500, minWidth: 60, textAlign: 'right' }}>
            {utilizationPct}%
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: 13 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-green)', display: 'inline-block' }} />
            Disponíveis: <strong>{disponivel}</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-amber)', display: 'inline-block' }} />
            Em uso: <strong>{emUso}</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-text-tertiary)', display: 'inline-block' }} />
            Total: <strong>{vehicles.length}</strong>
          </span>
        </div>
      </div>

      {/* ── By vehicle ────────────────────────────────────────────────── */}
      <div className="section-header">
        <div className="section-title">Por veículo</div>
      </div>
      <div className="table-card" style={{ marginBottom: '1.25rem' }}>
        <table className="dc-table">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Viagens</th>
              <th>KM total</th>
              <th>KM médio</th>
              <th>Participação</th>
            </tr>
          </thead>
          <tbody>
            {stats.byVehicleArr.length === 0 ? (
              <tr><td colSpan={5}><div className="empty-state"><i className="ti ti-database-off" />Sem dados.</div></td></tr>
            ) : stats.byVehicleArr.map(row => {
              const pct = stats.totalKm ? Math.round((row.km / stats.totalKm) * 100) : 0
              return (
                <tr key={row.plate}>
                  <td><strong className="mono">{row.plate}</strong></td>
                  <td>{row.trips}</td>
                  <td>{row.km.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km</td>
                  <td>{row.trips ? (row.km / row.trips).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '—'} km</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        flex: 1, height: 6, borderRadius: 100,
                        background: 'var(--color-background-tertiary)', overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: 'var(--color-accent)', borderRadius: 100,
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', minWidth: 28 }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── By sector ─────────────────────────────────────────────────── */}
      <div className="section-header">
        <div className="section-title">Por setor</div>
      </div>
      <div className="table-card">
        <table className="dc-table">
          <thead>
            <tr>
              <th>Setor</th>
              <th style={{ width: 80 }}>Viagens</th>
              <th style={{ width: 120 }}>KM total</th>
            </tr>
          </thead>
          <tbody>
            {stats.bySectorArr.length === 0 ? (
              <tr><td colSpan={3}><div className="empty-state"><i className="ti ti-database-off" />Sem dados.</div></td></tr>
            ) : stats.bySectorArr.map(row => (
              <tr key={row.sector}>
                <td>{row.sector}</td>
                <td>{row.trips}</td>
                <td>{row.km.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ── Gráficos ──────────────────────────────────────────────────── */}
      <div className="section-header" style={{ marginTop: '1.25rem' }}>
        <div className="section-title">Reservas por mês</div>
      </div>
      <div className="chart-card">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats.reservasPorMes} barSize={28}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" name="Reservas" fill="#4d8df7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="section-header">
        <div className="section-title">KM rodados por mês</div>
      </div>
      <div className="chart-card">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats.kmPorMes} barSize={28}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => [`${v} km`, 'KM']} />
            <Bar dataKey="km" name="KM" fill="#7bc67e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
