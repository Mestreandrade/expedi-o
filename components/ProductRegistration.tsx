
import React, { useState, useRef } from 'react';
import { CatalogItem } from '../types';

interface ProductRegistrationProps {
  catalog: CatalogItem[];
  onRegister: (item: CatalogItem) => void;
}

const CATEGORIES = ['Sacaria', 'Óleo', 'Leite'];

const ProductRegistration: React.FC<ProductRegistrationProps> = ({ catalog, onRegister }) => {
  const [formData, setFormData] = useState({ name: '', sku: '', category: CATEGORIES[0], imageUrl: '' });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setFormData(prev => ({ ...prev, imageUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (catalog.some(i => i.sku === formData.sku)) return alert('Código SKU já cadastrado.');
    onRegister({ id: Date.now().toString(), ...formData });
    setFormData({ name: '', sku: '', category: CATEGORIES[0], imageUrl: '' });
    setPreview(null);
    alert('Produto cadastrado com sucesso!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 sticky top-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Novo Registro</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Descritivo</label>
                <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50/50 outline-none font-bold" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código SKU Único</label>
                <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50/50 outline-none font-bold font-mono" value={formData.sku} onChange={e => setFormData(p => ({ ...p, sku: e.target.value.toUpperCase() }))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria Logística</label>
                <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50/50 outline-none font-bold" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Foto do Produto</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative h-48 w-full border-4 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-200 transition-all overflow-hidden"
                >
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Capturar ou Subir Foto</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Salvar Catálogo</button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
             <h4 className="text-lg font-bold text-slate-800 uppercase tracking-tighter">Catálogo de Itens Cadastrados ({catalog.length})</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {catalog.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow group">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-50 group-hover:border-blue-100 transition-colors">
                  {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest truncate">{item.sku}</p>
                  <p className="text-sm font-bold text-slate-800 truncate leading-tight mt-1">{item.name}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full uppercase tracking-tighter">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRegistration;
