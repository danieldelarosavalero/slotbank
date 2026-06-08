'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function Simulador() {
  const [aportacion, setAportacion] = useState(200)
  const [anos, setAnos] = useState(10)
  const [rentabilidad, setRentabilidad] = useState(7)
  const [guardado, setGuardado] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const calcular = () => {
    const meses = anos * 12
    const tasaMensual = rentabilidad / 100 / 12
    let total = 0
    for (let i = 0; i < meses; i++) {
      total = (total + aportacion) * (1 + tasaMensual)
    }
    return total
  }

  const totalInvertido = aportacion * anos * 12
  const totalFinal = calcular()
  const ganancias = totalFinal - totalInvertido

  const guardarSimulacion = async () => {
    setGuardando(true)
    const { error } = await supabase
      .from('simulaciones')
      .insert({
        aportacion_mensual: aportacion,
        anos: anos,
        rentabilidad: rentabilidad,
        total_invertido: totalInvertido,
        patrimonio_final: totalFinal
      })

    if (!error) {
      setGuardado(true)
      setTimeout(() => setGuardado(false), 3000)
    }
    setGuardando(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">

      {/* Header */}
      <div className="mb-10">
        <Link href="/" className="text-emerald-400 text-sm mb-4 block hover:underline">
          ← Volver al dashboard
        </Link>
        <h1 className="text-4xl font-bold text-emerald-400">SlotBank</h1>
        <p className="text-gray-400 mt-1">Simulador de ahorro inteligente</p>
      </div>

      {/* Controles */}
      <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-emerald-900">
        <h2 className="text-xl font-semibold mb-6">Configura tu plan de ahorro</h2>

        {/* Aportación mensual */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-400">Aportación mensual</label>
            <span className="text-emerald-400 font-bold">{aportacion}€</span>
          </div>
          <input
            type="range" min="50" max="2000" step="50"
            value={aportacion}
            onChange={(e) => setAportacion(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="flex justify-between text-gray-600 text-xs mt-1">
            <span>50€</span><span>2.000€</span>
          </div>
        </div>

        {/* Años */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-400">Horizonte temporal</label>
            <span className="text-emerald-400 font-bold">{anos} años</span>
          </div>
          <input
            type="range" min="1" max="40" step="1"
            value={anos}
            onChange={(e) => setAnos(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="flex justify-between text-gray-600 text-xs mt-1">
            <span>1 año</span><span>40 años</span>
          </div>
        </div>

        {/* Rentabilidad */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-400">Rentabilidad anual estimada</label>
            <span className="text-emerald-400 font-bold">{rentabilidad}%</span>
          </div>
          <input
            type="range" min="1" max="15" step="0.5"
            value={rentabilidad}
            onChange={(e) => setRentabilidad(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="flex justify-between text-gray-600 text-xs mt-1">
            <span>1% (conservador)</span><span>15% (agresivo)</span>
          </div>
        </div>

        {/* Botón guardar */}
        <button
          onClick={guardarSimulacion}
          disabled={guardando}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 text-black font-semibold py-3 rounded-xl transition-colors"
        >
          {guardando ? 'Guardando...' : guardado ? '✓ Simulación guardada en tu cartera' : 'Guardar simulación en mi cartera'}
        </button>
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Total invertido</p>
          <p className="text-3xl font-bold text-white">
            {totalInvertido.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Ganancias por interés compuesto</p>
          <p className="text-3xl font-bold text-emerald-400">
            +{ganancias.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-emerald-900">
          <p className="text-gray-400 text-sm mb-1">Patrimonio final estimado</p>
          <p className="text-3xl font-bold text-emerald-400">
            {totalFinal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Tabla por hitos */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Evolución por hitos</h3>
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="grid grid-cols-3 p-4 border-b border-gray-800 text-gray-500 text-sm">
            <span>Año</span>
            <span>Total invertido</span>
            <span>Patrimonio estimado</span>
          </div>
          {[1, 2, 3, 5, 10, 15, 20, 30].filter(a => a <= anos).map((hito) => {
            const meses = hito * 12
            const tasaMensual = rentabilidad / 100 / 12
            let total = 0
            for (let i = 0; i < meses; i++) {
              total = (total + aportacion) * (1 + tasaMensual)
            }
            return (
              <div key={hito} className="grid grid-cols-3 p-4 border-b border-gray-800 last:border-0">
                <span className="text-white">Año {hito}</span>
                <span className="text-gray-400">
                  {(aportacion * hito * 12).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                </span>
                <span className="text-emerald-400 font-semibold">
                  {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                </span>
              </div>
            )
          })}
        </div>
      </div>

    </main>
  )
}