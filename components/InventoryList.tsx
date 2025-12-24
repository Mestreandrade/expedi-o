
import React, { useState } from 'react';
import { Product } from '../types';

interface InventoryListProps {
  products: Product[];
  onRemove: (productId: string, positionId: string) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ products, onRemove }) => {
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.positionId.toLowerCase().includes(search.toLowerCase()) ||
    p.lotNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Pesquisar estoque por SKU, Lote ou Posição..."
            className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-8 py-5">Visual</th>
                <th className="px-8 py-5">SKU / Lote</th>
                <th className="px-8 py-5">Produto</th>
                <th className="px-8 py-5">Localização</th>
                <th className="px-8 py-5 text-right">Qtd.</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
                        {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-200">?</div>}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-xs font-black text-blue-600 tracking-wider font-mono uppercase">{prod.sku}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">LT: {prod.lotNumber}</p>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-sm font-bold text-slate-800 leading-tight">{prod.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5 tracking-tighter">{prod.category}</p>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-100 uppercase tracking-tighter">
                        Pos: {prod.positionId}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm font-black text-slate-900 text-right">{prod.quantity} <span className="text-[10px] text-slate-400">UN</span></td>
                    <td className="px-8 py-4 text-right">
                      <button onClick={() => confirm('Confirmar saída total deste lote na posição?') && onRemove(prod.id, prod.positionId)} className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhum resultado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
