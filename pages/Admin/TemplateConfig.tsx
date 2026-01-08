
import React, { useState } from 'react';
import { MOCK_PLACEHOLDERS } from '../../data/mockData';
import { Placeholder } from '../../types';

interface Props {
  onNavigate: (page: string) => void;
}

const TemplateConfig: React.FC<Props> = ({ onNavigate }) => {
  const [placeholders, setPlaceholders] = useState<Placeholder[]>(MOCK_PLACEHOLDERS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_PLACEHOLDERS[0].id);

  const selected = placeholders.find(p => p.id === selectedId) || placeholders[0];

  const updatePlaceholder = (id: string, updates: Partial<Placeholder>) => {
    setPlaceholders(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background-light">
      {/* Header */}
      <header class="flex-none flex items-center justify-between border-b border-rose-100 px-6 py-3 bg-white z-30 shadow-[0_1px_2px_rgba(225,29,72,0.05)]">
        <div class="flex items-center gap-4">
          <div class="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary cursor-pointer" onClick={() => onNavigate('admin-certs')}>
            <span class="material-symbols-outlined">workspace_premium</span>
          </div>
          <div class="flex flex-col">
            <h2 class="text-base font-bold text-slate-800">证书管理后台</h2>
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <span>模板列表</span>
              <span class="material-symbols-outlined text-[10px]">chevron_right</span>
              <span class="font-medium text-primary">年度卓越奖</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-100">
            <button class="px-3 py-1.5 text-xs font-semibold rounded bg-white shadow-sm text-primary">编辑器</button>
            <button class="px-3 py-1.5 text-xs font-medium rounded hover:bg-white/50 text-slate-600">预览</button>
            <button class="px-3 py-1.5 text-xs font-medium rounded hover:bg-white/50 text-slate-600">JSON</button>
          </div>
          <div class="h-6 w-px bg-rose-100"></div>
          <button class="flex items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-sm gap-2 transition-all">
            <span class="material-symbols-outlined text-lg">save</span>
            <span>保存更改</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <nav class="w-64 flex-none bg-white border-r border-rose-100 flex flex-col z-20">
          <div class="p-4 space-y-1">
            <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-slate-900 group" onClick={() => onNavigate('admin-certs')}>
              <span class="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-primary">fact_check</span>
              <span class="text-sm font-medium">证书信息管理</span>
            </button>
            <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-slate-900 group" onClick={() => onNavigate('admin-templates')}>
              <span class="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-primary">grid_view</span>
              <span class="text-sm font-medium">证书模板管理</span>
            </button>
            <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/5 text-primary font-medium border border-primary/10">
              <span class="material-symbols-outlined text-[22px]">tune</span>
              <span class="text-sm">证书模板配置</span>
            </button>
          </div>
        </nav>

        {/* Editor Canvas Area */}
        <section class="flex-1 flex flex-col relative min-w-0 bg-rose-50/30">
          <div class="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-2 py-1.5 bg-white/90 backdrop-blur-sm border border-rose-100 rounded-full shadow-lift">
            <button class="p-2 rounded-full hover:bg-rose-50 text-slate-600"><span class="material-symbols-outlined text-[20px]">arrow_selector_tool</span></button>
            <div class="w-px h-4 bg-rose-100"></div>
            <button class="p-2 rounded-full hover:bg-rose-50 text-slate-600"><span class="material-symbols-outlined text-[20px]">pan_tool</span></button>
            <button class="p-2 rounded-full hover:bg-rose-50 text-slate-600"><span class="material-symbols-outlined text-[20px]">remove</span></button>
            <span class="text-xs font-mono font-medium w-12 text-center text-slate-700">100%</span>
            <button class="p-2 rounded-full hover:bg-rose-50 text-slate-600"><span class="material-symbols-outlined text-[20px]">add</span></button>
          </div>

          <div class="flex-1 overflow-auto p-12 flex items-center justify-center dot-grid">
            <div class="relative bg-white shadow-2xl border border-rose-100" style={{ width: '800px', height: '566px' }}>
              <div class="absolute inset-0 bg-cover bg-center opacity-100" style={{ backgroundImage: `url('https://picsum.photos/seed/editor/800/566')` }}></div>
              
              {placeholders.map(p => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`absolute group border-2 cursor-move flex items-center justify-center transition-all ${selectedId === p.id ? 'border-primary bg-primary/5' : 'border-dashed border-slate-400 hover:border-primary/50 hover:bg-primary/5'}`}
                  style={{ top: `${p.y}px`, left: `${p.x}px`, width: `${p.width}px`, height: `${p.height}px` }}
                >
                  {selectedId === p.id && (
                    <>
                      <div class="absolute -top-1.5 -left-1.5 size-3 bg-white border border-primary rounded-full z-10"></div>
                      <div class="absolute -top-1.5 -right-1.5 size-3 bg-white border border-primary rounded-full z-10"></div>
                      <div class="absolute -bottom-1.5 -left-1.5 size-3 bg-white border border-primary rounded-full z-10"></div>
                      <div class="absolute -bottom-1.5 -right-1.5 size-3 bg-white border border-primary rounded-full z-10"></div>
                      <div class="absolute -top-8 left-0 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-t tracking-wider uppercase">文本域</div>
                    </>
                  )}
                  <span className="pointer-events-none select-none" style={{ fontSize: `${p.fontSize}px`, color: p.color, textAlign: p.align, width: '100%' }}>
                    {`{{ ${p.key} }}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div class="h-8 bg-white border-t border-rose-100 flex items-center justify-between px-4 text-xs text-slate-500">
            <div class="flex items-center gap-4">
              <span>X: {selected.x}px</span>
              <span>Y: {selected.y}px</span>
              <span>选中项：{selected.label}</span>
            </div>
            <div>上次自动保存：1分钟前</div>
          </div>
        </section>

        {/* Properties Sidebar */}
        <aside class="w-80 flex-none bg-white border-l border-rose-100 flex flex-col z-20 shadow-xl">
          <div class="flex border-b border-rose-100">
            <button class="flex-1 py-3 text-sm font-semibold text-primary border-b-2 border-primary bg-primary/5">属性</button>
            <button class="flex-1 py-3 text-sm font-medium text-slate-500">图层</button>
          </div>
          <div class="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-sm font-bold text-slate-900 mb-0.5">{selected.label}</h3>
                <p class="text-xs text-slate-500">文本占位符</p>
              </div>
              <button class="text-slate-400 hover:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">delete</span></button>
            </div>

            <div class="space-y-3">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-400">数据映射</label>
              <div class="space-y-1">
                <label class="text-xs font-medium text-slate-700">变量键</label>
                <div class="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded px-3 py-2">
                  <span class="text-slate-400 font-mono text-sm select-none">{"{{"}</span>
                  <input class="bg-transparent border-none p-0 text-sm font-mono text-slate-800 w-full focus:ring-0" value={selected.key} onChange={(e) => updatePlaceholder(selected.id, { key: e.target.value })} />
                  <span class="text-slate-400 font-mono text-sm select-none">{"}}"}</span>
                </div>
              </div>
            </div>

            <hr class="border-rose-100" />

            <div class="space-y-3">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-400">尺寸 & 位置</label>
              <div class="grid grid-cols-2 gap-3">
                {['x', 'y', 'width', 'height'].map(attr => (
                  <div key={attr}>
                    <label class="text-[10px] font-medium text-slate-500 mb-1 block uppercase">{attr}</label>
                    <div class="relative">
                      <input class="w-full bg-white border border-rose-100 rounded px-2 py-1.5 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none" type="number" value={(selected as any)[attr]} onChange={(e) => updatePlaceholder(selected.id, { [attr]: parseInt(e.target.value) })} />
                      <span class="absolute right-2 top-1.5 text-xs text-slate-400 pointer-events-none">px</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr class="border-rose-100" />

            <div class="space-y-3">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-400">排版</label>
              <div class="space-y-3">
                <div>
                  <label class="text-[10px] font-medium text-slate-500 mb-1 block">字体大小</label>
                  <div class="relative">
                    <input class="w-full bg-white border border-rose-100 rounded px-2 py-1.5 text-sm font-mono focus:border-primary outline-none" type="number" value={selected.fontSize} onChange={(e) => updatePlaceholder(selected.id, { fontSize: parseInt(e.target.value) })} />
                    <span class="absolute right-2 top-1.5 text-xs text-slate-400">px</span>
                  </div>
                </div>
                <div>
                  <label class="text-[10px] font-medium text-slate-500 mb-1 block">对齐</label>
                  <div class="flex bg-rose-50 rounded p-1 border border-rose-100">
                    {['left', 'center', 'right'].map(align => (
                      <button 
                        key={align} 
                        onClick={() => updatePlaceholder(selected.id, { align: align as any })}
                        class={`flex-1 py-1 rounded transition-all flex justify-center ${selected.align === align ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white'}`}
                      >
                        <span class="material-symbols-outlined text-[18px]">{`format_align_${align}`}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 border-t border-rose-100 bg-rose-50">
            <button class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-slate-400 text-slate-600 hover:bg-white hover:border-primary hover:text-primary transition-all text-sm font-semibold">
              <span class="material-symbols-outlined">add_circle</span>
              添加新占位符
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TemplateConfig;
