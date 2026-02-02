'use client';
import { useState, useEffect } from 'react';

const DENOMINACIONES = [20000, 10000, 2000, 1000, 500, 200, 100, 50, 20, 10];

interface CashSource {
  id: string;
  name: string;
  conteo: { [key: number]: number };
}

export default function FinancinApp() {
  const [sources, setSources] = useState<CashSource[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('financin_sources');
      if (saved) return JSON.parse(saved);
    }
    return [{
      id: '1',
      name: 'Billetera',
      conteo: DENOMINACIONES.reduce((acc, curr) => ({ ...acc, [curr]: 0 }), {})
    }];
  });

  const [activeSourceId, setActiveSourceId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('financin_active_source');
      if (saved) return saved;
    }
    return '1';
  });

  const [showNewSourceInput, setShowNewSourceInput] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');

  useEffect(() => {
    localStorage.setItem('financin_sources', JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    localStorage.setItem('financin_active_source', activeSourceId);
  }, [activeSourceId]);

  const activeSource = sources.find(s => s.id === activeSourceId) || sources[0];

  const actualizarCantidad = (valor: number, delta: number) => {
    setSources(prev => prev.map(source => 
      source.id === activeSourceId
        ? {
            ...source,
            conteo: {
              ...source.conteo,
              [valor]: Math.max(0, source.conteo[valor] + delta)
            }
          }
        : source
    ));
  };

  const setCantidadDirecta = (valor: number, nuevaCantidad: string) => {
    const cantidad = parseInt(nuevaCantidad) || 0;
    setSources(prev => prev.map(source => 
      source.id === activeSourceId
        ? {
            ...source,
            conteo: {
              ...source.conteo,
              [valor]: Math.max(0, cantidad)
            }
          }
        : source
    ));
  };

  const addNewSource = () => {
    if (!newSourceName.trim()) return;
    
    const newSource: CashSource = {
      id: Date.now().toString(),
      name: newSourceName.trim(),
      conteo: DENOMINACIONES.reduce((acc, curr) => ({ ...acc, [curr]: 0 }), {})
    };
    
    setSources(prev => [...prev, newSource]);
    setActiveSourceId(newSource.id);
    setNewSourceName('');
    setShowNewSourceInput(false);
  };

  const deleteSource = (id: string) => {
    if (sources.length === 1) {
      alert('No puedes eliminar la última fuente');
      return;
    }
    
    setSources(prev => prev.filter(s => s.id !== id));
    if (activeSourceId === id) {
      setActiveSourceId(sources[0].id);
    }
  };

  const totalGeneral = Object.entries(activeSource.conteo).reduce(
    (acc, [valor, cantidad]) => acc + Number(valor) * cantidad, 0
  );

  const totalTodoElEfectivo = sources.reduce((total, source) => {
    return total + Object.entries(source.conteo).reduce(
      (acc, [valor, cantidad]) => acc + Number(valor) * cantidad, 0
    );
  }, 0);

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen bg-slate-50">
      <h1 className="text-3xl font-black mb-8 text-blue-600">financin</h1>
      <label className="block mb-6 text-slate-700"><i>A KISS tracker of your cash count, with LocalStorage (only local data is managed). Values for each bill are hard-coded; use your own.</i></label>
      
      {/* Total Global de TODO */}
      <div className="bg-blue-600 p-4 rounded-2xl mb-4 text-center text-white shadow-lg">
        <p className="text-[8px] opacity-70 uppercase font-black mb-1">Total Global|Global Total</p>
        <div className="text-2xl font-mono">${totalTodoElEfectivo.toLocaleString('es-AR')}</div>
      </div>

      {/* Selector de Fuentes */}
      <div className="mb-6">
        <div className="flex gap-2 flex-wrap mb-2">
          {sources.map(source => (
            <div key={source.id} className="relative">
              <button
                onClick={() => setActiveSourceId(source.id)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  activeSourceId === source.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-100 shadow-sm'
                }`}
              >
                {source.name}
              </button>
              {sources.length > 1 && activeSourceId === source.id && (
                <button
                  onClick={() => deleteSource(source.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-slate-900 text-white rounded-full text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          {!showNewSourceInput && (
            <button
              onClick={() => setShowNewSourceInput(true)}
              className="px-4 py-2 rounded-xl font-bold text-sm bg-slate-700 text-white shadow-sm"
            >
              + Nueva
            </button>
          )}
        </div>

        {showNewSourceInput && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNewSource()}
              placeholder="Nombre (ej: Ahorros)"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-100 shadow-sm text-black"
              autoFocus
            />
            <button
              onClick={addNewSource}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-md"
            >
              ✓
            </button>
            <button
              onClick={() => {
                setShowNewSourceInput(false);
                setNewSourceName('');
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold shadow-sm"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      
      {/* Total de la Fuente Activa */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] mb-10 text-center text-white shadow-xl">
        <p className="text-[10px] opacity-50 uppercase font-black mb-2">{activeSource.name} | Efectivo Total|Total Cash</p>
        <div className="text-5xl font-mono">${totalGeneral.toLocaleString('es-AR')}</div>
      </div>

      {/* Contador de Denominaciones */}
      <div className="grid gap-4">
        {DENOMINACIONES.map((valor) => (
          <div key={valor} className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-2xl font-black text-slate-700">${valor.toLocaleString()}</span>
            <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl">
              <button 
                onClick={() => actualizarCantidad(valor, -1)}
                className="w-10 h-10 bg-white rounded-xl shadow-sm text-xl"
              >-</button>
              <input
                type="number"
                value={activeSource.conteo[valor]}
                onChange={(e) => setCantidadDirecta(valor, e.target.value)}
                className="w-12 text-center font-bold bg-transparent text-black border-none outline-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button 
                onClick={() => actualizarCantidad(valor, 1)}
                className="w-10 h-10 bg-blue-600 text-white rounded-xl shadow-md text-xl"
              >+</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}