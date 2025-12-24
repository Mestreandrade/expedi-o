
import React, { useState, useMemo } from 'react';
import { Product } from '../types';

interface DispatchGoodsFormProps {
  products: Product[];
  onDispatch: (sku: string, positionId: string, quantity: number) => void;
}

const DispatchGoodsForm: React.FC<DispatchGoodsFormProps> = ({ products, onDispatch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [targetQuantity, setTargetQuantity] = useState<number | ''>('');
  const [quantitiesByLoc, setQuantitiesByLoc] = useState<Record<string, string>>({});

  // Busca que considera SKU, Nome e NÚMERO DO LOTE
  const uniqueProductsBySkuAndLot = useMemo(() => {
    const map = new Map();
    products.forEach(p => {
      const key = `${p.sku}-${p.lotNumber}`;
      if (!map.has(key)) {
        map.set(key, p);
      }
    });
    return Array.from(map.values());
  }, [products]);

  const filteredItems = uniqueProductsBySkuAndLot.filter(p => 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productLocations = useMemo(() => {
    if (!selectedProduct) return [];
    
    // LOGICA DE PRIORIZAÇÃO:
    // 1. Menor quantidade primeiro (para limpar posições e evitar pallets quebrados)
    // 2. Data de entrada mais antiga (FIFO) como desempate
    return [...products]
      .filter(p => p.sku === selectedProduct.sku && p.lotNumber === selectedProduct.lotNumber)
      .sort((a, b) => {
        if (a.quantity !== b.quantity) {
          return a.quantity - b.quantity; // Menor quantidade primeiro
        }
        return new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime(); // Mais antigo primeiro
      });
  }, [selectedProduct, products]);

  const handleQtyChange = (locId: string, val: string) => {
    setQuantitiesByLoc(prev => ({ ...prev, [locId]: val }));
  };

  const handleApplySuggestion = () => {
    if (typeof targetQuantity !== 'number' || targetQuantity <= 0) {
      return alert('Informe a quantidade total desejada.');
    }

    let remaining = targetQuantity;
    const newQtys: Record<string, string> = {};

    // O array productLocations já está ordenado para priorizar a limpeza de posições
    for (const loc of productLocations) {
      if (remaining <= 0) break;
      const locKey = `${loc.positionId}-${loc.lotNumber}`;
      const take = Math.min(loc.quantity, remaining);
      newQtys[locKey] = take.toString();
      remaining -= take;
    }

    if (remaining > 0) {
      alert(`Atenção: Estoque insuficiente deste lote. Faltam ${remaining} unidades.`);
    }

    setQuantitiesByLoc(newQtys);
  };

  const executeDispatch = (loc: Product) => {
    const locKey = `${loc.positionId}-${loc.lotNumber}`;
    const qty = parseInt(quantitiesByLoc[locKey]) || 0;

    if (qty <= 0) return alert('Informe uma quantidade para este local.');
    if (qty > loc.quantity) return alert('Quantidade maior que o disponível.');
    
    onDispatch(loc.sku, loc.positionId, qty);
    
    setQuantitiesByLoc(prev => {
      const next = { ...prev };
      delete next[locKey];
      return next;
    });
  };

  const executeBulkDispatch = () => {
    const locationsToProcess = productLocations.filter(loc => {
      const key = `${loc.positionId}-${loc.lotNumber}`;
      return parseInt(quantitiesByLoc[key]) > 0;
    });

    if (locationsToProcess.length === 0) return alert('Nenhuma sugestão aplicada.');

    if (confirm(`Confirmar a saída de ${locationsToProcess.length} endereços?`)) {
      locationsToProcess.forEach(loc => executeDispatch(loc));
      setSelectedProduct(null);
      setSearchTerm('');
      setTargetQuantity('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Expedição & Picking</h3>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">Otimização de Espaço: Priorizando Limpeza de Posições</p>
          </div>
          {selectedProduct && (
            <button 
              onClick={() => { setSelectedProduct(null); setTargetQuantity(''); setQuantitiesByLoc({}); }}
              className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors"
            >
              Voltar à busca
            </button>
          )}
        </div>

        <div className="p-8 space-y-8">
          {!selectedProduct ? (
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar por SKU, Nome ou NÚMERO DO LOTE..."
                  className="w-full pl-14 pr-5 py-5 bg-white border-2 border-slate-100 rounded-3xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {searchTerm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95">
                  {filteredItems.map(p => (
                    <button
                      key={`${p.sku}-${p.lotNumber}`}
                      onClick={() => setSelectedProduct(p)}
                      className="flex items-center p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-400 hover:shadow-lg transition-all text-left group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 overflow-hidden mr-4 border border-slate-50">
                        {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300 font-black">?</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest truncate">{p.sku}</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase mt-1">Lote: {p.lotNumber}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Estoque Total</p>
                        <p className="text-base font-black text-slate-900 leading-none">
                          {products.filter(pr => pr.sku === p.sku && pr.lotNumber === p.lotNumber).reduce((acc, curr) => acc + curr.quantity, 0)}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400">UN</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mr-6 border-2 border-slate-700 bg-slate-800">
                    <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black">{selectedProduct.name}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-[10px] font-black px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30 uppercase tracking-widest">{selectedProduct.sku}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30 uppercase tracking-widest">LOTE: {selectedProduct.lotNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto bg-white/5 p-4 rounded-3xl border border-white/10 flex items-center space-x-4">
                  <div className="flex-1 md:w-48">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Quantidade Total Saída</p>
                    <input 
                      type="number"
                      placeholder="Ex: 125"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-white"
                      value={targetQuantity}
                      onChange={(e) => setTargetQuantity(parseInt(e.target.value) || '')}
                    />
                  </div>
                  <button 
                    onClick={handleApplySuggestion}
                    className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                  >
                    Otimizar Picking
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Endereços Ordenados por Menor Saldo</h5>
                  {Object.keys(quantitiesByLoc).length > 0 && (
                    <button 
                      onClick={executeBulkDispatch}
                      className="text-[10px] font-black text-red-600 uppercase flex items-center hover:underline"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Confirmar Saída Otimizada
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {productLocations.map(loc => {
                    const locKey = `${loc.positionId}-${loc.lotNumber}`;
                    const suggestedVal = parseInt(quantitiesByLoc[locKey]) || 0;
                    const isFullClear = suggestedVal === loc.quantity;
                    const isSuggested = suggestedVal > 0;
                    
                    return (
                      <div 
                        key={locKey} 
                        className={`p-6 bg-white border-2 rounded-[2rem] flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all ${
                          isSuggested 
                            ? isFullClear 
                              ? 'border-emerald-500 bg-emerald-50/10 ring-4 ring-emerald-50' 
                              : 'border-blue-500 bg-blue-50/10 ring-4 ring-blue-50'
                            : 'border-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-8">
                          <div className={`px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-tighter ${isSuggested ? isFullClear ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {loc.positionId}
                          </div>
                          <div className="border-l border-slate-100 pl-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo no Endereço</p>
                            <p className="text-lg font-black text-slate-800 leading-tight">{loc.quantity} <span className="text-xs text-slate-400">UN</span></p>
                          </div>
                          {isSuggested && (
                            <div className={`flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isFullClear ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                              {isFullClear ? 'Limpeza de Posição' : 'Sugestão Parcial'}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase text-center tracking-tighter">Qtd a Retirar</p>
                            <input
                              type="number"
                              min="1"
                              max={loc.quantity}
                              placeholder="0"
                              className={`w-24 px-4 py-2 bg-white border rounded-xl focus:ring-2 outline-none font-black text-center text-slate-800 ${isSuggested ? 'border-blue-300 ring-blue-100' : 'border-slate-200'}`}
                              value={quantitiesByLoc[locKey] || ''}
                              onChange={(e) => handleQtyChange(locKey, e.target.value)}
                            />
                          </div>
                          <button
                            onClick={() => executeDispatch(loc)}
                            className="h-12 px-6 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all"
                          >
                            Baixar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchGoodsForm;
