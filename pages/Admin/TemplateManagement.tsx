import React from 'react';
import { INITIAL_TEMPLATES } from '../../data/mockData';
import { Icon } from '../../components/Icon';

interface Props {
  onNavigate: (page: string) => void;
}

const TemplateManagement: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* 顶部导航 */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('admin-certs')}>
            <div className="size-9 bg-primary flex items-center justify-center rounded-xl text-white shadow-lg shadow-red-500/20">
              <Icon name="verified" className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">CertVerify <span className="text-primary text-xs font-bold bg-red-50 px-1.5 py-0.5 rounded ml-1">ADMIN</span></span>
          </div>
          <div className="flex items-center gap-1 h-16">
            <button onClick={() => onNavigate('admin-certs')} className="px-4 h-full border-b-2 border-transparent text-slate-500 hover:text-primary transition-all text-sm font-medium">证书信息管理</button>
            <button className="px-4 h-full border-b-2 border-primary text-primary font-bold text-sm">证书模板库</button>
            <button onClick={() => onNavigate('admin-config')} className="px-4 h-full border-b-2 border-transparent text-slate-500 hover:text-primary transition-all text-sm font-medium">点位配置</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full bg-slate-100 border border-slate-200 p-0.5">
            <img className="w-full h-full rounded-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
        </div>
      </nav>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* 标题栏 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">证书模板库</h1>
            <p className="text-slate-500">统一管理所有颁发模板，支持 A4 横向/纵向底图配置与动态变量映射。</p>
          </div>
          <button className="px-6 h-11 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 active:scale-95 transition-all">
            <Icon name="add_photo_alternate" />
            新建底图模板
          </button>
        </div>

        {/* 筛选栏 */}
        <div className="flex items-center gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-200 w-fit shadow-sm">
          <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-black shadow-md shadow-red-500/10">全部模板</button>
          <button className="px-5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-bold transition-colors">荣誉证书</button>
          <button className="px-5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-bold transition-colors">结业证明</button>
          <button className="px-5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-bold transition-colors">资格认证</button>
        </div>

        {/* 模板网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {INITIAL_TEMPLATES.map(t => (
            <div key={t.id} className="group flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft hover:shadow-lift hover:border-primary/30 transition-all duration-500">
              <div className="relative aspect-[1.414/1] bg-slate-100 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                  style={{backgroundImage: `url('${t.imageUrl}')`}}
                ></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-white/90 text-primary backdrop-blur-md shadow-sm border border-white/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse"></div>
                    {t.type}
                  </span>
                </div>
                {/* 悬浮操作层 */}
                <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-6 text-center">
                  <div className="flex flex-col items-center gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white text-xs font-medium leading-relaxed opacity-90">{t.description}</p>
                    <button 
                      onClick={() => onNavigate('admin-config')}
                      className="bg-white text-primary font-black py-2.5 px-6 rounded-xl shadow-xl hover:bg-red-50 active:scale-95 transition-all text-sm flex items-center gap-2"
                    >
                      <Icon name="tune" className="w-4 h-4" />
                      进入配置点位
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors truncate">{t.name}</h3>
                </div>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">支持格式</span>
                      <span className="text-xs font-mono font-black text-slate-600">{t.format}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="size-9 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-red-50 rounded-xl transition-all">
                      <Icon name="visibility" className="w-5 h-5" />
                    </button>
                    <button className="size-9 flex items-center justify-center text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all">
                      <Icon name="delete" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 新建占位符 */}
          <button className="group flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-red-50/30 transition-all duration-500 h-full min-h-[340px] shadow-sm">
            <div className="size-16 rounded-2xl bg-slate-50 group-hover:bg-white flex items-center justify-center mb-4 transition-all shadow-sm group-hover:shadow-red-500/10 group-hover:-translate-y-1">
              <Icon name="add" className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-slate-900 font-black text-lg mb-1 tracking-tight">上传底图</p>
            <p className="text-slate-400 text-xs">支持 PNG, JPG, PDF</p>
          </button>
        </div>
      </main>
    </div>
  );
};

export default TemplateManagement;