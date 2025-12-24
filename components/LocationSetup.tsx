
import React, { useState } from 'react';
import { PalletPosition } from '../types';

interface LocationSetupProps {
  positions: PalletPosition[];
  onAddPosition: (pos: PalletPosition) => void;
  onDeletePosition: (id: string) => void;
  onBulkAdd: (prefix: string, aisleNum: string, startSlot: number, endSlot: number, startLevel: number, endLevel: number) => void;
}

const LocationSetup: React.FC<LocationSetupProps> = ({ positions, onAddPosition, onDeletePosition, onBulkAdd }) => {
  // Estado para Cadastro Único
  const [singlePrefix, setSinglePrefix] = useState('R');
  const [singleAisle, setSingleAisle] = useState('1');
  const [singleSlot, setSingleSlot] = useState(1);
  const [singleLevel, setSingleLevel] = useState(1);

  // Estado para Geração em Massa
  const [bulkPrefix, setBulkPrefix] = useState('R');
  const [bulkAisle, setBulkAisle] = useState('1');
  const [startSlot, setStartSlot] = useState(1);
  const [endSlot, setEndSlot] = useState(10);
  const [startLevel, setStartLevel] = useState(1);
  const [endLevel, setEndLevel] = useState(4);

  const formatId = (prefix: string, aisle: string, slot: number, level: number) => {
    const s = slot.toString().padStart(2, '0');
    const l = level.toString().padStart(3, '0');
    return `${prefix}${aisle}.${s}.${l}`;
  };

  const handleSingleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = formatId(singlePrefix.toUpperCase(), singleAisle, singleSlot, singleLevel);
    
    if (positions.find(p => p.id === id)) return alert('Este endereço já existe!');
    
    onAddPosition({
      id,
      aisle: singleAisle,
      level: singleLevel,
      slot: singleSlot,
      isOccupied: false
    });
    alert(`Endereço ${id} cadastrado!`);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkPrefix || !bulkAisle) return alert('Preencha os campos de identificação da Rua/Corredor.');
    
    const count = (endSlot - startSlot + 1) * (endLevel - startLevel + 1);
    if (confirm(`Deseja gerar automaticamente ${count} endereços para a Rua ${bulkPrefix}${bulkAisle}?`)) {
      onBulkAdd(bulkPrefix.toUpperCase(), bulkAisle, startSlot, endSlot, startLevel, endLevel);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painéis de Cadastro */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6">Cadastro Individual</h3>
            <form onSubmit={handleSingleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prefixo</label>
                  <input required placeholder="R" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold uppercase" value={singlePrefix} onChange={e => setSinglePrefix(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nº Rua</label>
                  <input required placeholder="1" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={singleAisle} onChange={e => setSingleAisle(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vão</label>
                  <input required type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={singleSlot} onChange={e => setSingleSlot(parseInt(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível</label>
                  <input required type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={singleLevel} onChange={e => setSingleLevel(parseInt(e.target.value))} />
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-[9px] font-black text-blue-400 uppercase mb-1">Resultado da Etiqueta:</p>
                <p className="text-lg font-black text-blue-700 tracking-tighter">
                  {formatId(singlePrefix.toUpperCase(), singleAisle, singleSlot, singleLevel)}
                </p>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Criar Endereço</button>
            </form>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white">
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Gerador de Rua</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-6">Cadastrar rua inteira em segundos</p>
            <form onSubmit={handleBulkSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prefixo (ex: R)</label>
                  <input required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold uppercase text-white outline-none" value={bulkPrefix} onChange={e => setBulkPrefix(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Número Rua</label>
                  <input required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold text-white outline-none" value={bulkAisle} onChange={e => setBulkAisle(e.target.value)} />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Intervalo de Vãos (Coluna)</p>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="De" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold text-white outline-none" value={startSlot} onChange={e => setStartSlot(parseInt(e.target.value))} />
                  <input type="number" placeholder="Até" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold text-white outline-none" value={endSlot} onChange={e => setEndSlot(parseInt(e.target.value))} />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Intervalo de Níveis (Altura)</p>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="De" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold text-white outline-none" value={startLevel} onChange={e => setStartLevel(parseInt(e.target.value))} />
                  <input type="number" placeholder="Até" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold text-white outline-none" value={endLevel} onChange={e => setEndLevel(parseInt(e.target.value))} />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Gerar Rua Completa</button>
            </form>
          </div>
        </div>

        {/* Listagem de Endereços */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
             <h4 className="text-xl font-black text-slate-800 tracking-tight uppercase">Layout do Armazém ({positions.length} posições)</h4>
          </div>
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="max-h-[700px] overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-4">Endereço (ID)</th>
                    <th className="px-8 py-4">Rua/Corr.</th>
                    <th className="px-8 py-4">Vão</th>
                    <th className="px-8 py-4">Nível</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {positions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic">Nenhum endereço cadastrado. Utilize o gerador ao lado.</td>
                    </tr>
                  ) : (
                    positions.map(pos => (
                      <tr key={pos.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4">
                          <span className="font-black text-slate-900 tracking-tighter">{pos.id}</span>
                        </td>
                        <td className="px-8 py-4 text-sm font-bold text-slate-500">{pos.aisle}</td>
                        <td className="px-8 py-4 text-sm font-bold text-slate-500">{pos.slot.toString().padStart(2, '0')}</td>
                        <td className="px-8 py-4 text-sm font-bold text-slate-500">{pos.level.toString().padStart(3, '0')}</td>
                        <td className="px-8 py-4">
                          {pos.isOccupied ? (
                            <span className="px-2 py-1 bg-red-50 text-red-600 text-[9px] font-black uppercase rounded-md border border-red-100">Ocupado</span>
                          ) : (
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-md border border-emerald-100">Disponível</span>
                          )}
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button 
                            disabled={pos.isOccupied}
                            onClick={() => confirm('Excluir este endereço?') && onDeletePosition(pos.id)}
                            className={`p-2 rounded-lg transition-colors ${pos.isOccupied ? 'text-slate-200 cursor-not-allowed' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSetup;
