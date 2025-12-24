
import React from 'react';
import { Stats, Product } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardProps {
  stats: Stats;
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, products }) => {
  const occupancyData = [
    { name: 'Ocupado', value: stats.occupiedPositions },
    { name: 'Livre', value: stats.totalPositions - stats.occupiedPositions },
  ];

  const categoryData = products.reduce((acc: any[], prod) => {
    const existing = acc.find(item => item.name === prod.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: prod.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#2563eb', '#e2e8f0'];
  const CAT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Posições Totais', value: stats.totalPositions, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'blue' },
          { label: 'Ocupação Atual', value: `${stats.totalPositions > 0 ? Math.round((stats.occupiedPositions / stats.totalPositions) * 100) : 0}%`, icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'green' },
          { label: 'Pallets Ativos', value: stats.occupiedPositions, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'indigo' },
          { label: 'Total Unidades', value: stats.totalProducts, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'amber' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 mr-4`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Taxa de Ocupação</h3>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
               <span className="text-3xl font-bold text-slate-800">{stats.totalPositions > 0 ? Math.round((stats.occupiedPositions / stats.totalPositions) * 100) : 0}%</span>
               <span className="text-xs text-slate-500 uppercase font-semibold">Ocupado</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Categorias por Lote</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CAT_COLORS[index % CAT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Entradas Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-8 py-4">Produto</th>
                <th className="px-8 py-4">Lote</th>
                <th className="px-8 py-4">Posição</th>
                <th className="px-8 py-4">Data</th>
                <th className="px-8 py-4 text-right">Qtd.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentEntries.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <p className="text-sm font-medium text-slate-900">{prod.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{prod.sku}</p>
                  </td>
                  <td className="px-8 py-4 text-xs text-slate-600 font-black uppercase tracking-widest">{prod.lotNumber}</td>
                  <td className="px-8 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                      {prod.positionId}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-500">{prod.entryDate}</td>
                  <td className="px-8 py-4 text-sm font-semibold text-slate-900 text-right">{prod.quantity}</td>
                </tr>
              ))}
              {stats.recentEntries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-500 italic">Aguardando primeiros lançamentos...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
