
import React from 'react';
import { INITIAL_TEMPLATES } from '../../data/mockData';

interface Props {
  onNavigate: (page: string) => void;
}

const TemplateManagement: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-10 py-3 sticky top-0 z-50">
        <div class="flex items-center gap-4 text-slate-900" onClick={() => onNavigate('admin-certs')}>
          <div class="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg cursor-pointer">
            <span class="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <h2 class="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] cursor-pointer">证书系统</h2>
        </div>
        <div class="flex flex-1 justify-end gap-8">
          <nav class="hidden md:flex items-center gap-9">
            <button class="text-slate-600 hover:text-primary text-sm font-medium transition-colors" onClick={() => onNavigate('admin-certs')}>证书信息管理</button>
            <button class="text-primary text-sm font-bold leading-normal relative after:content-[''] after:absolute after:left-0 after:-bottom-5 after:w-full after:h-0.5 after:bg-primary">证书模板管理</button>
            <button class="text-slate-600 hover:text-primary text-sm font-medium transition-colors" onClick={() => onNavigate('admin-config')}>证书模板配置</button>
          </nav>
          <div class="flex items-center gap-3">
            <button class="size-9 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-600 transition-colors"><span class="material-symbols-outlined text-[20px]">notifications</span></button>
            <div class="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-slate-200" style={{backgroundImage: `url('https://picsum.photos/seed/user/36/36')`}}></div>
          </div>
        </div>
      </header>

      <main class="flex-1 flex justify-center py-10 px-6 sm:px-10">
        <div class="w-full max-w-[1280px] flex flex-col gap-8">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div class="flex flex-col gap-2">
              <h1 class="text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] text-red-950">证书模板管理</h1>
              <p class="text-slate-500 text-base font-normal max-w-2xl">上传、编辑和管理用于颁发证书的视觉模板。支持 .PDF 和 .AI 格式导入。</p>
            </div>
            <button class="group flex items-center justify-center gap-2 rounded-xl h-11 px-6 bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95">
              <span class="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-300">add</span>
              <span class="truncate">上传新模板</span>
            </button>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-1">
            <div class="flex items-center gap-2 p-1 bg-white rounded-lg border border-slate-200 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <button class="px-4 py-2 rounded-md bg-red-100 text-primary text-sm font-bold shadow-sm whitespace-nowrap">全部</button>
              <button class="px-4 py-2 rounded-md text-slate-500 hover:bg-red-50 hover:text-primary text-sm font-medium transition-colors whitespace-nowrap">荣誉证书</button>
              <button class="px-4 py-2 rounded-md text-slate-500 hover:bg-red-50 hover:text-primary text-sm font-medium transition-colors whitespace-nowrap">结业证明</button>
              <button class="px-4 py-2 rounded-md text-slate-500 hover:bg-red-50 hover:text-primary text-sm font-medium transition-colors whitespace-nowrap">资格认证</button>
            </div>
            <div class="relative w-full sm:w-64 group/search">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span class="material-symbols-outlined text-slate-400 group-focus-within/search:text-primary transition-colors text-[20px]">search</span></div>
              <input class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm" placeholder="搜索模板名称..." type="text"/>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {INITIAL_TEMPLATES.map(t => (
              <div key={t.id} class="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft hover:shadow-lift hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                <div class="relative aspect-[1.414/1] bg-slate-100 overflow-hidden group-hover:brightness-[1.02] transition-all">
                  <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: `url('${t.imageUrl}')`}}></div>
                  <div class="absolute top-3 left-3">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-white/90 text-primary backdrop-blur-md shadow-sm border border-white/20">
                      <span class="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse"></span>
                      {t.type}
                    </span>
                  </div>
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button class="bg-white text-primary font-bold py-2 px-5 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center gap-2">
                      <span class="material-symbols-outlined text-[18px]">visibility</span>
                      预览
                    </button>
                  </div>
                </div>
                <div class="p-5 flex flex-col flex-1">
                  <h3 class="font-bold text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">{t.name}</h3>
                  <p class="text-xs text-slate-500 mb-5 line-clamp-2">{t.description}</p>
                  <div class="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                    <span class="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">{t.format}</span>
                    <div class="flex items-center gap-1">
                      <button class="size-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" onClick={() => onNavigate('admin-config')}><span class="material-symbols-outlined text-[18px]">edit</span></button>
                      <button class="size-8 flex items-center justify-center text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"><span class="material-symbols-outlined text-[18px]">delete</span></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button class="group flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-all duration-300 h-full min-h-[320px]">
              <div class="size-16 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center mb-4 transition-colors shadow-sm"><span class="material-symbols-outlined text-[32px] text-slate-400 group-hover:text-primary">add_photo_alternate</span></div>
              <p class="text-slate-900 font-bold text-lg mb-1">新建模板</p>
              <p class="text-slate-500 text-sm">点击上传或创建新设计</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplateManagement;
