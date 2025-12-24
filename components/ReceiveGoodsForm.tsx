
import React, { useState, useRef, useEffect } from 'react';
import { Product, PalletPosition, CatalogItem } from '../types';
import { getStorageSuggestion } from '../services/geminiService';

interface ReceiveGoodsFormProps {
  catalog: CatalogItem[];
  availablePositions: PalletPosition[];
  onSubmit: (product: Product) => void;
}

const ReceiveGoodsForm: React.FC<ReceiveGoodsFormProps> = ({ catalog, availablePositions, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 1,
    lotNumber: '',
    positionId: '',
    imageUrl: ''
  });
  
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCatalog, setFilteredCatalog] = useState<CatalogItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (val: string) => {
    setFormData(prev => ({ ...prev, sku: val, name: '' }));
    if (val.length > 0) {
      const filtered = catalog.filter(item => 
        item.sku.toLowerCase().includes(val.toLowerCase()) || 
        item.name.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredCatalog(filtered);
      setShowDropdown(true);
    } else setShowDropdown(false);
  };

  const selectItem = (item: CatalogItem) => {
    setFormData(prev => ({ ...prev, sku: item.sku, name: item.name, category: item.category, imageUrl: item.imageUrl || '' }));
    setShowDropdown(false);
  };

  const handleSuggest = async () => {
    if (!formData.sku) return alert('Informe o código do produto primeiro.');
    setIsSuggesting(true);
    const trulyEmpty = availablePositions.filter(p => !p.isOccupied).map(p => p.id);
    if (trulyEmpty.length === 0) {
      alert("Nenhuma posição totalmente livre para sugestão otimizada.");
      setIsSuggesting(false);
      return;
    }
    const result = await getStorageSuggestion(formData.name || formData.sku, formData.category, trulyEmpty);
    if (result) {
      setFormData(prev => ({ ...prev, positionId: result.suggestedPosition }));
    }
    setIsSuggesting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.positionId) return alert('Selecione uma posição.');
    
    // Validar novamente se a posição está ocupada (proteção extra)
    const targetPos = availablePositions.find(p => p.id === formData.positionId);
    if (targetPos?.isOccupied) {
      return alert('ERRO: Este endereço já possui um saldo e está bloqueado para novas entradas até que seja zerado.');
    }

    if (!formData.lotNumber) return alert('Informe o número do lote.');
    
    onSubmit({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      entryDate: new Date().toISOString().split('T')[0]
    });
    // Limpa para a próxima entrada
    setFormData(prev => ({ ...prev, lotNumber: '', quantity: 1, positionId: '' }));
    alert('Entrada processada com sucesso!');
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Entrada de Mercadoria</h3>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter mt-1">O endereço ficará indisponível até o saldo zerar</p>
          </div>
          {formData.imageUrl && <img src={formData.imageUrl} className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg" alt="Prod" />}
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Produto (Catálogo)</label>
              <div className="relative">
                <input
                  required
                  autoComplete="off"
                  type="text"
                  placeholder="Busque por SKU ou Nome..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all font-bold text-slate-800"
                  value={formData.sku}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => formData.sku && setShowDropdown(true)}
                />
              </div>
              {showDropdown && filteredCatalog.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {filteredCatalog.map((item) => (
                    <button key={item.id} type="button" onClick={() => selectItem(item)} className="w-full text-left px-5 py-4 hover:bg-slate-50 flex items-center space-x-4 border-b border-slate-50 last:border-0 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">?</div>}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 leading-tight">{item.name}</p>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">{item.sku}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Número do Lote</label>
              <input
                required
                type="text"
                placeholder="Ex: LOTE-2024-001"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all font-bold text-slate-800 uppercase"
                value={formData.lotNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, lotNumber: e.target.value.toUpperCase() }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantidade un.</label>
              <input required min="1" type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all font-bold" value={formData.quantity} onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))} />
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Endereço de Destino (Somente Disponíveis)</label>
                <p className="text-[11px] text-slate-400 font-bold mt-1">Clique em uma posição livre para selecionar.</p>
              </div>
              <button type="button" onClick={handleSuggest} disabled={isSuggesting} className={`flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-sm transition-all ${isSuggesting ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'}`}>
                <svg className={`w-4 h-4 mr-2 ${isSuggesting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {isSuggesting ? 'Otimizando...' : 'Sugestão Inteligente'}
              </button>
            </div>

            {availablePositions.length === 0 ? (
              <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum endereço cadastrado. Vá em "Config. Endereços" primeiro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {availablePositions.map((pos) => {
                  const isSelected = formData.positionId === pos.id;
                  const isBlocked = pos.isOccupied;

                  return (
                    <button 
                      key={pos.id} 
                      type="button" 
                      disabled={isBlocked}
                      onClick={() => setFormData(prev => ({ ...prev, positionId: pos.id }))} 
                      className={`p-4 rounded-2xl border-2 text-center transition-all group relative ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-110 z-10' 
                          : isBlocked 
                            ? 'bg-red-50 border-red-100 text-red-200 cursor-not-allowed grayscale' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      <span className="text-[9px] block opacity-40 font-black uppercase mb-1">{isBlocked ? 'OCUP' : 'P'}</span>
                      <span className="text-xs font-black tracking-tighter">{pos.id}</span>
                      {isBlocked && (
                        <div className="absolute top-1 right-1">
                          <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-8">
            <button type="submit" className="px-16 py-5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-500/30 active:scale-95 transition-all">
              Confirmar Recebimento WMS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiveGoodsForm;
