
import React, { useState } from 'react';
import { PalletPosition, Product } from '../types';

interface WarehouseMapProps {
  positions: PalletPosition[];
  products: Product[];
}

const WarehouseMap: React.FC<WarehouseMapProps> = ({ positions, products }) => {
  const [selectedPos, setSelectedPos] = useState<string | null>(null);

  const aisles = Array.from(new Set(positions.map(p => p.aisle))).sort();
  const levels = Array.from(new Set(positions.map(p => p.level))).sort((a, b) => b - a); // Nível 5 no topo

  const getPosition = (aisle: string, level: number, slot: number) => {
    return positions.find(p => p.aisle === aisle && p.level === level && p.slot === slot);
  };

  const getProductAt = (positionId: string) => {
    return products.find(p => p.positionId === positionId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
           <h3 className="text-lg font-bold text-slate-800">Mapa Visual do Armazém</h3>
           <p className="text-sm text-slate-500">Clique em uma posição para ver detalhes do pallet.</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-sm">
             <div className="w-3 h-3 rounded-full bg-slate-200 mr-2"></div>
             <span className="text-slate-600">Disponível</span>
          </div>
          <div className="flex items-center text-sm">
             <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
             <span className="text-slate-600">Ocupado</span>
          </div>
          <div className="flex items-center text-sm">
             <div className="w-3 h-3 rounded-full bg-indigo-400 mr-2 ring-2 ring-indigo-200"></div>
             <span className="text-slate-600">Selecionado</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-x-auto pb-8">
        {aisles.map(aisle => (
          <div key={aisle} className="min-w-[400px]">
            <h4 className="text-center font-bold text-slate-400 mb-6 uppercase tracking-[0.2em] border-b pb-2">Corredor {aisle}</h4>
            <div className="bg-slate-100 p-8 rounded-3xl border-4 border-slate-200">
              {levels.map(level => (
                <div key={level} className="flex justify-center space-x-4 mb-4 last:mb-0">
                  <div className="w-8 flex items-center justify-center text-slate-400 font-bold text-xs">{level}º</div>
                  {[1, 2].map(slot => {
                    const pos = getPosition(aisle, level, slot);
                    if (!pos) return null;
                    const product = getProductAt(pos.id);
                    const isSelected = selectedPos === pos.id;

                    return (
                      <button
                        key={pos.id}
                        onClick={() => setSelectedPos(isSelected ? null : pos.id)}
                        className={`w-32 h-20 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                          isSelected 
                            ? 'bg-indigo-500 border-indigo-600 text-white ring-4 ring-indigo-100 transform scale-105 z-10 shadow-xl' 
                            : pos.isOccupied
                              ? 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700'
                              : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-[10px] font-semibold opacity-60">{pos.id}</span>
                        {pos.isOccupied && !isSelected && (
                           <svg className="w-6 h-6 mt-1 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                           </svg>
                        )}
                        {isSelected && (
                           <span className="text-[9px] font-bold mt-1 text-indigo-100 uppercase">{product?.category || 'Vazio'}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
              <div className="mt-8 pt-4 border-t-2 border-slate-200 flex justify-center space-x-12">
                 <div className="text-[10px] font-bold text-slate-400 uppercase">Posição 1</div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase">Posição 2</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPos && (
        <div className="fixed bottom-10 right-10 w-80 bg-white rounded-2xl shadow-2xl border border-indigo-100 p-6 animate-in slide-in-from-right duration-300 ring-4 ring-indigo-50">
          <div className="flex justify-between items-start mb-4">
             <div>
               <h5 className="text-xs font-bold text-indigo-600 uppercase mb-1">Detalhes da Posição</h5>
               <p className="text-xl font-bold text-slate-800">{selectedPos}</p>
             </div>
             <button onClick={() => setSelectedPos(null)} className="text-slate-400 hover:text-slate-600">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>
          
          {getProductAt(selectedPos) ? (
            <div className="space-y-4">
               <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium mb-1">Produto</p>
                  <p className="text-sm font-bold text-slate-900">{getProductAt(selectedPos)?.name}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{getProductAt(selectedPos)?.sku}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Quantidade</p>
                    <p className="text-lg font-bold text-slate-900">{getProductAt(selectedPos)?.quantity} un.</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Entrada</p>
                    <p className="text-sm font-bold text-slate-900">{getProductAt(selectedPos)?.entryDate}</p>
                  </div>
               </div>
               <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                  Gerar Etiqueta
               </button>
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                 <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                 </svg>
              </div>
              <p className="text-sm text-slate-400">Posição vazia e pronta para armazenagem.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WarehouseMap;
