
import React from 'react';
import { ViewMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const navItems = [
    { id: ViewMode.DASHBOARD, label: 'Dashboard', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { id: ViewMode.CATALOG, label: 'Cadastro Prod.', icon: 'M12 4v16m8-8H4' },
    { id: ViewMode.CONFIG_LOCATIONS, label: 'Config. Endereços', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: ViewMode.RECEIVE, label: 'Entrada Carga', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: ViewMode.DISPATCH, label: 'Saída Carga', icon: 'M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: ViewMode.INVENTORY, label: 'Estoque', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: ViewMode.REPORTS, label: 'Relatórios', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: ViewMode.MAP, label: 'Mapa Armazém', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-2xl z-20 print:hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">NexusWMS</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Logística Avançada</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group ${
                activeView === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <svg className={`w-5 h-5 mr-3 transition-colors ${activeView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center p-2 rounded-xl bg-slate-800/50">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-black">W</div>
            <div className="ml-3 overflow-hidden">
              <p className="text-xs font-bold truncate uppercase tracking-tighter">Warehouse Admin</p>
              <p className="text-[10px] text-slate-500 truncate">Sessão Ativa</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 flex-shrink-0 print:hidden">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            {navItems.find(i => i.id === activeView)?.label}
          </h2>
          <div className="flex items-center space-x-6 text-slate-400">
            <div className="flex items-center space-x-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-500">SISTEMA ONLINE</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-[#fdfdfe] print:p-0 print:bg-white">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
