
import React, { useMemo } from 'react';
import { Product } from '../types';

interface ReportsProps {
  products: Product[];
}

interface SkuSummary {
  sku: string;
  name: string;
  totalQuantity: number;
  lots: {
    lotNumber: string;
    quantity: number;
    positions: string[];
  }[];
}

const Reports: React.FC<ReportsProps> = ({ products }) => {
  const summary = useMemo(() => {
    const map = new Map<string, SkuSummary>();

    products.forEach(p => {
      if (!map.has(p.sku)) {
        map.set(p.sku, {
          sku: p.sku,
          name: p.name,
          totalQuantity: 0,
          lots: []
        });
      }

      const item = map.get(p.sku)!;
      item.totalQuantity += p.quantity;

      const lotIndex = item.lots.findIndex(l => l.lotNumber === p.lotNumber);
      if (lotIndex > -1) {
        item.lots[lotIndex].quantity += p.quantity;
        item.lots[lotIndex].positions.push(p.positionId);
      } else {
        item.lots.push({
          lotNumber: p.lotNumber,
          quantity: p.quantity,
          positions: [p.positionId]
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.sku.localeCompare(b.sku));
  }, [products]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Relatórios de Inventário</h3>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">Consolidação de saldo por SKU e Lote</p>
        </div>
        <button 
          onClick={handlePrint}
          className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all flex items-center shadow-xl"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Imprimir Relatório
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden print:shadow-none print:border-none">
        <div className="hidden print:block p-8 border-b-4 border-slate-900 mb-8">
           <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-slate-900">NexusWMS</h1>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Relatório de Posição de Estoque</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Data de Emissão</p>
                <p className="text-sm font-black text-slate-800">{new Date().toLocaleString('pt-BR')}</p>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] print:bg-slate-100 print:text-slate-900">
                <th className="px-8 py-5">Código SKU</th>
                <th className="px-8 py-5">Descrição do Produto</th>
                <th className="px-8 py-5">Detalhamento por Lote</th>
                <th className="px-8 py-5 text-right">Saldo Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">Nenhum dado para exibir no momento.</td>
                </tr>
              ) : (
                summary.map(item => (
                  <tr key={item.sku} className="hover:bg-slate-50/50 transition-colors align-top">
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-lg border border-blue-100 uppercase print:bg-white print:border-slate-300">
                        {item.sku}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-800 leading-tight">{item.name}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-3">
                        {item.lots.map(lot => (
                          <div key={lot.lotNumber} className="flex flex-col space-y-1">
                            <div className="flex justify-between items-center bg-slate-50/80 p-3 rounded-xl border border-slate-100 print:bg-white print:p-1 print:border-0 print:border-b">
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase block tracking-tighter">Lote</span>
                                <span className="text-xs font-bold text-slate-700">{lot.lotNumber}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] font-black text-slate-400 uppercase block tracking-tighter">Quantidade</span>
                                <span className="text-sm font-black text-slate-900">{lot.quantity} UN</span>
                              </div>
                            </div>
                            <div className="px-2">
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Localizações: {lot.positions.join(', ')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="inline-block px-4 py-2 bg-slate-900 text-white rounded-2xl print:bg-white print:text-black print:p-0">
                         <p className="text-[10px] font-black uppercase opacity-60 tracking-widest text-center">Total</p>
                         <p className="text-lg font-black text-center">{item.totalQuantity}</p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="hidden print:block p-8 border-t border-slate-100 mt-8">
           <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>NexusWMS - Sistema de Gestão</span>
              <span>Página 1 de 1</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
