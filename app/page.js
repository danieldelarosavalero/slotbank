import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const { data: carteras, error: errorCartera } = await supabase
    .from('carteras')
    .select('*')
    .limit(1)

  const cartera = carteras?.[0]

  const { data: activos, error: errorActivos } = await supabase
    .from('activos')
    .select('*')

  const { data: movimientos, error: errorMovimientos } = await supabase
    .from('movimientos')
    .select('*')
    .order('fecha', { ascending: false })

  const { data: simulaciones } = await supabase
    .from('simulaciones')
    .select('*')
    .order('fecha', { ascending: false })  

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-emerald-400">SlotBank</h1>
        <p className="text-gray-400 mt-1">Panel de inversión inteligente</p>
      </div>

      {/* Botón simulador */}
      <div className="mb-8">
        <Link href="/simulador" className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-xl transition-colors">
          Abrir simulador de ahorro →
        </Link>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-emerald-900">
        <p className="text-gray-400 text-sm mb-1">Patrimonio total</p>
        <h2 className="text-5xl font-bold text-emerald-400">
          {cartera?.valor_total?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </h2>
        <p className="text-emerald-500 mt-2 text-lg">
          +{cartera?.rentabilidad_total}% rentabilidad total
        </p>
        <p className="text-gray-500 text-sm mt-1">{cartera?.nombre}</p>
      </div>

      {/* Activos */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-white">Composición de la cartera</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activos?.map((activo) => (
            <div key={activo.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-white">{activo.nombre}</p>
                  <p className="text-gray-500 text-sm">{activo.tipo}</p>
                </div>
                <span className="bg-emerald-900 text-emerald-400 text-xs px-2 py-1 rounded-full">
                  {activo.porcentaje}%
                </span>
              </div>
              <p className="text-2xl font-bold text-white mt-3">
                {activo.valor_actual?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-emerald-400 text-sm mt-1">+{activo.rentabilidad}% rentabilidad</p>
            </div>
          ))}
        </div>
      </div>

      {/* Movimientos */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Últimos movimientos</h3>
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          {movimientos?.map((mov, index) => (
            <div key={mov.id} className={`flex justify-between items-center p-4 ${index !== movimientos.length - 1 ? 'border-b border-gray-800' : ''}`}>
              <div>
                <p className="text-white capitalize">{mov.tipo}</p>
                <p className="text-gray-500 text-sm">{mov.descripcion}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-semibold">
                  {mov.cantidad > 0 ? '+' : ''}{mov.cantidad?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(mov.fecha).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
{/* Simulaciones guardadas */}
      {simulaciones && simulaciones.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-white">Simulaciones guardadas</h3>
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="grid grid-cols-4 p-4 border-b border-gray-800 text-gray-500 text-sm">
              <span>Aportación/mes</span>
              <span>Años</span>
              <span>Rentabilidad</span>
              <span>Patrimonio final</span>
            </div>
            {simulaciones.map((sim, index) => (
              <div key={sim.id} className={`grid grid-cols-4 p-4 ${index !== simulaciones.length - 1 ? 'border-b border-gray-800' : ''}`}>
                <span className="text-white">{sim.aportacion_mensual}€/mes</span>
                <span className="text-gray-400">{sim.anos} años</span>
                <span className="text-gray-400">{sim.rentabilidad}%</span>
                <span className="text-emerald-400 font-semibold">
                  {Number(sim.patrimonio_final).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
} 