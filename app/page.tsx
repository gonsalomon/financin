'use client';
import { useState, useEffect } from 'react';

const DENOMINACIONES = [20000, 10000, 2000, 1000, 500, 200, 100, 50, 20, 10];

export default function FinancinApp() {
  const [conteo, setConteo] = useState<{ [key: number]: number }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('financin_conteo');
      if (saved) return JSON.parse(saved);
    }
    return DENOMINACIONES.reduce((acc, curr) => ({ ...acc, [curr]: 0 }), {});
  });

  // Sync to localStorage whenever conteo changes
  useEffect(() => {
    localStorage.setItem('financin_conteo', JSON.stringify(conteo));
  }, [conteo]);

  const actualizarCantidad = (valor: number, delta: number) => {
    setConteo(prev => ({
      ...prev,
      [valor]: Math.max(0, prev[valor] + delta)
    }));
  };

  const totalGeneral = Object.entries(conteo).reduce(
    (acc, [valor, cantidad]) => acc + Number(valor) * cantidad, 0
  );

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen bg-slate-50">
      <h1 className="text-3xl font-black mb-8 text-blue-600">financin</h1>
      
      <div className="bg-slate-900 p-8 rounded-[2.5rem] mb-10 text-center text-white shadow-xl">
        <p className="text-[10px] opacity-50 uppercase font-black mb-2">Efectivo Total</p>
        <div className="text-5xl font-mono">${totalGeneral.toLocaleString('es-AR')}</div>
      </div>

      <div className="grid gap-4">
        {DENOMINACIONES.map((valor) => (
          <div key={valor} className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-2xl font-black text-slate-700">${valor.toLocaleString()}</span>
            <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl">
              <button 
                onClick={() => actualizarCantidad(valor, -1)}
                className="w-10 h-10 bg-white rounded-xl shadow-sm text-xl"
              >-</button>
              <span className="w-6 text-center font-bold "><p className='text-black'>{conteo[valor]}</p></span>
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