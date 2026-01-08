
import React, { useState } from 'react';
import { MOCK_PLACEHOLDERS, INITIAL_RECIPIENTS } from '../../data/mockData';
import { Placeholder } from '../../types';

interface Props {
  onNavigate: (page: string) => void;
}

const TemplateConfig: React.FC<Props> = ({ onNavigate }) => {
  const [placeholders, setPlaceholders] = useState<Placeholder[]>(MOCK_PLACEHOLDERS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_PLACEHOLDERS[0].id);
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'json'>('editor');
  
  const selected = placeholders.find(p => p.id === selectedId) || placeholders[0];
  const sampleRecipient = INITIAL_RECIPIENTS[0];

  const updatePlaceholder = (id: string, updates: Partial<Placeholder>) => {
    setPlaceholders(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addNewPlaceholder = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newP: Placeholder = {
      id: newId,
      key: 'new_field',
      label: '新占位符',
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      fontSize: 20,
      color: '#000000',
      align: 'center'
    };
    setPlaceholders([...placeholders, newP]);
    setSelectedId(newId);
  };

  const deletePlaceholder = (id: string) => {
    if (placeholders.length <= 1) return;
    const newList = placeholders.filter(p => p.id !== id);
    setPlaceholders(newList);
    setSelectedId(newList[0].id);
  };

  const handleSave = () => {
    console.log('Saving config:', placeholders);
    alert('模板配置已成功保存！');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background-light selection:bg-primary/10">
      {/* Header */}
      <header className="flex-none flex items-center justify-between border-b border-rose-100 px-6 py-3 bg-white z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-all" onClick={() => onNavigate('admin-templates')}>
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-black text-slate-800 tracking-tight">年度卓越奖 · 模板配置</h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <span>Admin</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary">Visual Editor</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl border border-rose-100">
            <button 
              onClick={() => setViewMode('editor')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'editor' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              编辑器
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'preview' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              预览效果
            </button>
            <button 
              onClick={() => setViewMode('json')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'json' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              JSON 输出
            </button>
          </div>
          <div className="h-6 w-px bg-rose-100 hidden sm:block"></div>
          <button 
            onClick={handleSave}
            className="flex items-center justify-center rounded-xl h-10 px-5 bg-primary hover:bg-primary-dark text-white text-sm font-black shadow-lg shadow-red-500/20 gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">publish</span>
            <span>保存配置</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="w-64 flex-none bg-white border-r border-rose-100 flex flex-col z-20">
          <div className="p-4 space-y-2">
            <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Navigation</p>
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-primary group transition-all" onClick={() => onNavigate('admin-certs')}>
              <span className="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-primary">fact_check</span>
              <span className="text-sm font-bold">证书台账</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-primary group transition-all" onClick={() => onNavigate('admin-templates')}>
              <span className="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-primary">grid_view</span>
              <span className="text-sm font-bold">模板资产库</span>
            </button>
            <div className="h-px bg-rose-50 my-2"></div>
            <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Layers</p>
            <div className="space-y-1 max-h-[40vh] overflow-y-auto no-scrollbar">
              {placeholders.map(p => (
                <button 
                  key={p.id}
                  onClick={() => { setSelectedId(p.id); setViewMode('editor'); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${selectedId === p.id ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">text_fields</span>
                    <span className="truncate w-32 text-left">{p.label}</span>
                  </div>
                  {selectedId === p.id && <span className="material-symbols-outlined text-sm">edit</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto p-4 border-t border-rose-50">
            <button 
              onClick={addNewPlaceholder}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-primary hover:text-primary hover:bg-red-50 transition-all text-xs font-black uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              添加占位符
            </button>
          </div>
        </nav>

        {/* Editor Canvas Area */}
        <section className="flex-1 flex flex-col relative min-w-0 bg-[#fdf2f2]/30">
          {viewMode === 'json' ? (
            <div className="flex-1 overflow-auto p-8 font-mono text-sm bg-slate-900 text-emerald-400 flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                <span className="text-white font-bold tracking-tight">CONFIG_OUTPUT.json</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(placeholders, null, 2))}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors"
                >
                  复制代码
                </button>
              </div>
              <pre className="flex-1 selection:bg-white/20 whitespace-pre-wrap">
                {JSON.stringify(placeholders, null, 2)}
              </pre>
            </div>
          ) : (
            <>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md border border-rose-100 rounded-2xl shadow-lift">
                <button className="p-2 rounded-xl hover:bg-rose-50 text-slate-600"><span className="material-symbols-outlined text-[20px]">near_me</span></button>
                <div className="w-px h-5 bg-rose-100"></div>
                <button className="p-2 rounded-xl hover:bg-rose-50 text-slate-600"><span className="material-symbols-outlined text-[20px]">zoom_out</span></button>
                <span className="text-[10px] font-black w-14 text-center text-slate-500 uppercase tracking-widest">100%</span>
                <button className="p-2 rounded-xl hover:bg-rose-50 text-slate-600"><span className="material-symbols-outlined text-[20px]">zoom_in</span></button>
                <div className="w-px h-5 bg-rose-100"></div>
                <button className="p-2 rounded-xl hover:bg-rose-50 text-slate-600"><span className="material-symbols-outlined text-[20px]">layers</span></button>
              </div>

              <div className="flex-1 overflow-auto p-16 flex items-center justify-center dot-grid relative">
                <div className="relative bg-white shadow-2xl border border-rose-100 transition-all duration-500 transform" style={{ width: '800px', height: '566px' }}>
                  <div className="absolute inset-0 bg-cover bg-center opacity-100" style={{ backgroundImage: `url('https://picsum.photos/seed/editor/800/566')` }}></div>
                  
                  {placeholders.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => { setSelectedId(p.id); setViewMode('editor'); }}
                      className={`absolute group border-2 cursor-move flex items-center justify-center transition-all ${viewMode === 'preview' ? 'border-transparent' : (selectedId === p.id ? 'border-primary bg-primary/5' : 'border-dashed border-slate-400/30 hover:border-primary/50 hover:bg-primary/5')}`}
                      style={{ top: `${p.y}px`, left: `${p.x}px`, width: `${p.width}px`, height: `${p.height}px` }}
                    >
                      {viewMode === 'editor' && selectedId === p.id && (
                        <>
                          <div className="absolute -top-1.5 -left-1.5 size-3 bg-white border-2 border-primary rounded-full z-10"></div>
                          <div className="absolute -top-1.5 -right-1.5 size-3 bg-white border-2 border-primary rounded-full z-10"></div>
                          <div className="absolute -bottom-1.5 -left-1.5 size-3 bg-white border-2 border-primary rounded-full z-10"></div>
                          <div className="absolute -bottom-1.5 -right-1.5 size-3 bg-white border-2 border-primary rounded-full z-10"></div>
                          <div className="absolute -top-7 left-0 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-t tracking-widest uppercase shadow-sm">Field: {p.key}</div>
                        </>
                      )}
                      <span className={`pointer-events-none select-none cert-font whitespace-nowrap overflow-hidden`} style={{ fontSize: `${p.fontSize}px`, color: p.color, textAlign: p.align, width: '100%' }}>
                        {viewMode === 'preview' ? (
                          p.key === 'recipient_name' ? sampleRecipient.name : 
                          p.key === 'award_title' ? sampleRecipient.award : 
                          `[${p.label}]`
                        ) : `{{ ${p.key} }}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-10 bg-white border-t border-rose-100 flex items-center justify-between px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5"><span className="text-primary">X</span> {selected.x}</span>
                  <span className="flex items-center gap-1.5"><span className="text-primary">Y</span> {selected.y}</span>
                  <span className="flex items-center gap-1.5"><span className="text-primary">Selected</span> {selected.label}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span>Auto-saving enabled</span>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Properties Sidebar */}
        <aside className="w-80 flex-none bg-white border-l border-rose-100 flex flex-col z-20 shadow-xl overflow-hidden">
          <div className="flex border-b border-rose-100 bg-slate-50/50">
            <button className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary bg-white">Properties</button>
            <button className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">History</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 no-scrollbar">
            {/* Header Identity */}
            <div className="flex items-start justify-between">
              <div>
                <input 
                  className="text-lg font-black text-slate-900 mb-0.5 bg-transparent border-none p-0 focus:ring-0 w-full" 
                  value={selected.label} 
                  onChange={(e) => updatePlaceholder(selected.id, { label: e.target.value })}
                />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Type: Text Placeholder</p>
              </div>
              <button 
                onClick={() => deletePlaceholder(selected.id)}
                className="size-8 flex items-center justify-center text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>

            {/* Data Mapping */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Mapping</label>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">Variable Key</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-primary transition-all">
                  <span className="text-slate-300 font-mono text-xs select-none">{"{{"}</span>
                  <input 
                    className="bg-transparent border-none p-0 text-xs font-mono font-bold text-slate-800 w-full focus:ring-0" 
                    value={selected.key} 
                    onChange={(e) => updatePlaceholder(selected.id, { key: e.target.value })} 
                  />
                  <span className="text-slate-300 font-mono text-xs select-none">{"}}"}</span>
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed italic">Matched to recipient record property names in database.</p>
              </div>
            </div>

            <hr className="border-rose-50" />

            {/* Geometry */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Geometry</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'x', label: 'X Position' },
                  { key: 'y', label: 'Y Position' },
                  { key: 'width', label: 'Width' },
                  { key: 'height', label: 'Height' }
                ].map(attr => (
                  <div key={attr.key}>
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-tighter">{attr.label}</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                        type="number" 
                        value={(selected as any)[attr.key]} 
                        onChange={(e) => updatePlaceholder(selected.id, { [attr.key]: parseInt(e.target.value) || 0 })} 
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-300 pointer-events-none">PX</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-rose-50" />

            {/* Typography */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Typography</label>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-tighter">Font Size</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="8" 
                      max="120" 
                      className="flex-1 accent-primary h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      value={selected.fontSize} 
                      onChange={(e) => updatePlaceholder(selected.id, { fontSize: parseInt(e.target.value) })} 
                    />
                    <div className="relative w-20">
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-700 focus:border-primary outline-none" 
                        type="number" 
                        value={selected.fontSize} 
                        onChange={(e) => updatePlaceholder(selected.id, { fontSize: parseInt(e.target.value) || 8 })} 
                      />
                      <span className="absolute right-2 top-2 text-[9px] font-bold text-slate-300">PT</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-tighter">Text Color</label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="size-10 rounded-xl border border-slate-200 shadow-inner shrink-0 cursor-pointer overflow-hidden" 
                      style={{ backgroundColor: selected.color }}
                    >
                      <input 
                        type="color" 
                        className="opacity-0 w-full h-full cursor-pointer" 
                        value={selected.color} 
                        onChange={(e) => updatePlaceholder(selected.id, { color: e.target.value })} 
                      />
                    </div>
                    <input 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-700 focus:border-primary outline-none uppercase" 
                      value={selected.color} 
                      onChange={(e) => updatePlaceholder(selected.id, { color: e.target.value })} 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-tighter">Text Alignment</label>
                  <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100">
                    {['left', 'center', 'right'].map(align => (
                      <button 
                        key={align} 
                        onClick={() => updatePlaceholder(selected.id, { align: align as any })}
                        className={`flex-1 py-2 rounded-lg transition-all flex justify-center items-center ${selected.align === align ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{`format_align_${align}`}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50/50 border-t border-rose-50">
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all text-xs font-black shadow-sm group">
              <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">content_copy</span>
              复制图层样式
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TemplateConfig;
