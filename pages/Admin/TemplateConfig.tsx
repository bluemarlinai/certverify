
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_PLACEHOLDERS, INITIAL_RECIPIENTS } from '../../data/mockData';
import { Placeholder, Template, Recipient } from '../../types';

interface Props {
  onNavigate: (page: string, data?: any) => void;
  selectedTemplateId: string | null;
  templates: Template[];
  recipientToConfig?: Recipient | null; // 新增 prop：当前正在配置的学员证书
  updateRecipientPlaceholderOverrides: (recipientId: string, newOverrides: { [key: string]: Partial<Omit<Placeholder, 'id' | 'key' | 'label'>> }) => void; // 新增 prop：更新学员覆盖配置的回调
}

const TemplateConfig: React.FC<Props> = ({ onNavigate, selectedTemplateId, templates, recipientToConfig, updateRecipientPlaceholderOverrides }) => {
  const [placeholders, setPlaceholders] = useState<Placeholder[]>(MOCK_PLACEHOLDERS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_PLACEHOLDERS[0]?.id || '');
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'json'>('editor');
  
  // 根据 selectedTemplateId 或 recipientToConfig 查找当前模板
  const currentTemplate = selectedTemplateId 
    ? templates.find(t => t.id === selectedTemplateId) 
    : (templates.length > 0 ? templates[0] : null);

  const templateBackgroundUrl = currentTemplate?.imageUrl || 'https://images.unsplash.com/photo-1614032120894-080be8095f9c?auto=format&fit=crop&q=80&w=1200';

  // 拖动相关的状态
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const selected = placeholders.find(p => p.id === selectedId) || (placeholders.length > 0 ? placeholders[0] : null);
  const sampleRecipient = recipientToConfig || INITIAL_RECIPIENTS[0]; // 预览时优先使用真实学员数据

  // 根据当前模式和选择的模板/学员，初始化占位符
  useEffect(() => {
    let initialPlaceholders = JSON.parse(JSON.stringify(MOCK_PLACEHOLDERS)); // 深度复制基础占位符

    if (recipientToConfig && recipientToConfig.placeholderOverrides) {
        // 如果是个人证书调整模式，应用学员的个性化覆盖
        initialPlaceholders = initialPlaceholders.map((p: Placeholder) => {
            const override = recipientToConfig.placeholderOverrides?.[p.key];
            return override ? { ...p, ...override } : p;
        });
    } else {
        // TODO: 如果模板有自己的placeholder配置，这里应该加载selectedTemplateId对应的模板配置
        // 目前，如果不是个人调整模式，就使用MOCK_PLACEHOLDERS作为全局模板的默认配置
    }
    setPlaceholders(initialPlaceholders);
    // 重置 selectedId，确保在切换模板/学员时选中第一个
    setSelectedId(initialPlaceholders[0]?.id || '');
  }, [selectedTemplateId, recipientToConfig]); // 依赖项，确保在切换模板ID或学员配置时重新初始化


  const updatePlaceholder = (id: string, updates: Partial<Placeholder>) => {
    setPlaceholders(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addNewPlaceholder = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newP: Placeholder = {
      id: newId,
      key: 'new_field',
      label: '新文本层',
      x: 150,
      y: 150,
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
    setSelectedId(newList[0]?.id || '');
  };

  // 拖动处理函数
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (viewMode !== 'editor') return;
    setSelectedId(id);
    setIsDragging(true);
    const target = placeholders.find(p => p.id === id);
    if (target) {
      setDragOffset({
        x: e.clientX - target.x,
        y: e.clientY - target.y
      });
    }
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !selectedId) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // 限制在画布内（可选，这里先实现自由拖动）
      updatePlaceholder(selectedId, { x: Math.round(newX), y: Math.round(newY) });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, selectedId, updatePlaceholder]); // 依赖中添加 updatePlaceholder

  const handleSave = () => {
    if (recipientToConfig) {
        // 个人证书调整模式：保存到学员的 placeholderOverrides
        const newOverrides: { [key: string]: Partial<Omit<Placeholder, 'id' | 'key' | 'label'>> } = {};
        // 遍历当前placeholders，与MOCK_PLACEHOLDERS对比，只保存有差异的属性作为override
        placeholders.forEach(currentP => {
            const baseP = MOCK_PLACEHOLDERS.find(mp => mp.key === currentP.key);
            if (baseP) {
                const override: Partial<Omit<Placeholder, 'id' | 'key' | 'label'>> = {};
                (Object.keys(currentP) as Array<keyof Placeholder>).forEach(key => {
                    if (key !== 'id' && key !== 'key' && key !== 'label' && (currentP as any)[key] !== (baseP as any)[key]) {
                        (override as any)[key] = (currentP as any)[key];
                    }
                });
                if (Object.keys(override).length > 0) {
                    newOverrides[currentP.key] = override;
                }
            }
        });
        
        updateRecipientPlaceholderOverrides(recipientToConfig.id, newOverrides); // 回调 App.tsx 更新学员状态
        alert(`已保存 ${recipientToConfig.name} 的证书调整！`);
        onNavigate('admin-certs'); // 返回学员列表
    } else {
        // 全局模板配置模式：模拟保存模板配置
        alert(`${currentTemplate?.name || '模板'}配置已成功保存！`);
    }
  };
  
  // 渲染时使用的标题
  const pageTitle = recipientToConfig 
    ? `调整 ${recipientToConfig.name} 的证书布局` 
    : `${currentTemplate?.name || '未选择模板'} · 可视化配置`;

  // 渲染时使用的副标题
  const subTitle = recipientToConfig 
    ? <span className="text-primary font-black">Recipient Adjust</span>
    : <span className="text-primary font-black">Visual Editor</span>;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background-light selection:bg-primary/10 font-display">
      <header className="flex-none flex items-center justify-between border-b border-rose-100 px-6 py-3 bg-white z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-all" onClick={() => onNavigate('admin-templates')}>
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-black text-slate-800 tracking-tight">{pageTitle}</h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <span>ADMIN</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              {subTitle}
              {currentTemplate?.code && (
                <>
                  <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                  <span className="font-mono text-slate-500">{currentTemplate.code}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl border border-rose-100">
            {['editor', 'preview', 'json'].map((mode) => (
              <button 
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === mode ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {mode === 'editor' ? '编辑器' : mode === 'preview' ? '预览效果' : 'JSON 源码'}
              </button>
            ))}
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
        <nav className="w-64 flex-none bg-white border-r border-rose-100 flex flex-col z-20">
          <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
            <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">证书图层列表</p>
            <div className="space-y-1">
              {placeholders.map(p => (
                <button 
                  key={p.id}
                  onClick={() => { setSelectedId(p.id); setViewMode('editor'); }}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition-all ${selectedId === p.id ? 'bg-primary text-white shadow-lg shadow-red-500/20' : 'text-slate-600 hover:bg-rose-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg opacity-70">
                      {p.key.includes('name') ? 'person' : (p.key.includes('award') ? 'workspace_premium' : 'text_fields')}
                    </span>
                    <span className="truncate w-32 text-left">{p.label}</span>
                  </div>
                  {selectedId === p.id && <span className="material-symbols-outlined text-sm">edit</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-rose-50 bg-rose-50/30">
            <button 
              onClick={addNewPlaceholder}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-primary hover:text-primary hover:bg-white transition-all text-xs font-black uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              添加文本内容
            </button>
          </div>
        </nav>

        <section className="flex-1 flex flex-col relative min-w-0 bg-[#fef2f2]/20 overflow-hidden">
          {viewMode === 'json' ? (
            <div className="flex-1 overflow-auto p-8 font-mono text-sm bg-slate-900 text-emerald-400 flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                <span className="text-white font-bold tracking-tight">DANCE_CERT_SCHEMA.json</span>
                <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(placeholders, null, 2)); alert('配置已复制'); }} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs">复制代码</button>
              </div>
              <pre className="flex-1 selection:bg-white/20 whitespace-pre-wrap leading-relaxed">{JSON.stringify(placeholders, null, 2)}</pre>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto p-16 flex items-center justify-center dot-grid relative" ref={canvasRef}>
                <div className="relative bg-white shadow-2xl border-8 border-gold/30 rounded-sm overflow-hidden flex-none" style={{ width: '800px', height: '566px' }}>
                  <div className="absolute inset-0 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url('${templateBackgroundUrl}')` }}>
                    <div className="absolute inset-0 bg-white/10"></div>
                  </div>
                  
                  <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-gold/40 pointer-events-none"></div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 text-primary font-serif font-black text-4xl tracking-[1em] whitespace-nowrap opacity-90 drop-shadow-sm pointer-events-none">荣誉证书</div>

                  {placeholders.map(p => (
                    <div 
                      key={p.id}
                      onMouseDown={(e) => handleMouseDown(e, p.id)}
                      className={`absolute group border-2 flex items-center justify-center transition-shadow select-none ${viewMode === 'preview' ? 'border-transparent pointer-events-none' : (selected?.id === p.id ? 'border-primary bg-primary/5 cursor-move z-10' : 'border-dashed border-slate-400/30 hover:border-primary/50 hover:bg-primary/5 cursor-pointer')}`}
                      style={{ top: `${p.y}px`, left: `${p.x}px`, width: `${p.width}px`, height: `${p.height}px` }}
                    >
                      {viewMode === 'editor' && selected?.id === p.id && (
                        <div className="absolute -top-7 left-0 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-t tracking-widest uppercase shadow-sm">ID: {p.key}</div>
                      )}
                      <span className="pointer-events-none cert-font whitespace-nowrap overflow-hidden" style={{ fontSize: `${p.fontSize}px`, color: p.color, textAlign: p.align, width: '100%' }}>
                        {viewMode === 'preview' && sampleRecipient ? (
                          p.key === 'recipient_name' ? sampleRecipient.name : 
                          p.key === 'award_subject' ? sampleRecipient.awardTitle : // 更新显示逻辑
                          p.key === 'award_rank' ? sampleRecipient.awardRank :     // 更新显示逻辑
                          (p.key === 'cert_date' ? sampleRecipient.date : `[${p.label}]`)
                        ) : `{{ ${p.key} }}`}
                      </span>
                    </div>
                  ))}
                  
                  <div className="absolute bottom-10 right-20 size-24 rounded-full border-4 border-primary/40 flex items-center justify-center opacity-30 rotate-[-15deg] pointer-events-none">
                     <span className="material-symbols-outlined text-4xl text-primary">verified_user</span>
                  </div>
                </div>
              </div>

              <div className="h-10 bg-white border-t border-rose-100 flex items-center justify-between px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5"><span className="text-primary">X</span> {selected?.x}</span>
                  <span className="flex items-center gap-1.5"><span className="text-primary">Y</span> {selected?.y}</span>
                  <span className="flex items-center gap-1.5"><span className="text-primary">SELECTED</span> {selected?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span>{isDragging ? '拖拽中...' : '编辑器就绪'}</span>
                </div>
              </div>
            </>
          )}
        </section>

        <aside className="w-80 flex-none bg-white border-l border-rose-100 flex flex-col z-20 shadow-xl overflow-hidden">
          <div className="flex border-b border-rose-100 bg-slate-50/50">
            <div className="flex-1 py-4 text-center text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary bg-white">属性设置 (Properties)</div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 no-scrollbar">
            {selected ? (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <input className="text-lg font-black text-slate-900 mb-0.5 bg-transparent border-none p-0 focus:ring-0 w-full hover:bg-rose-50 rounded px-1 outline-none" value={selected.label} onChange={(e) => updatePlaceholder(selected.id, { label: e.target.value })} />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">LAYER_ID: {selected.id}</p>
                  </div>
                  <button onClick={() => deletePlaceholder(selected.id)} className="size-8 flex items-center justify-center text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl shrink-0 ml-2"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">数据字段关联</label>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">变量标识符 (Key)</label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-primary transition-all">
                      <span className="text-slate-300 font-mono text-xs select-none">{"{{"}</span>
                      <input className="bg-transparent border-none p-0 text-xs font-mono font-bold text-slate-800 w-full focus:ring-0" value={selected.key} onChange={(e) => updatePlaceholder(selected.id, { key: e.target.value })} />
                      <span className="text-slate-300 font-mono text-xs select-none">{"}}"}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-rose-50" />

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">空间布局 (可鼠标拖拽)</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'x', label: 'X 坐标' },
                      { key: 'y', label: 'Y 坐标' },
                      { key: 'width', label: '图层宽度' },
                      { key: 'height', label: '图层高度' }
                    ].map(attr => (
                      <div key={attr.key}>
                        <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-tighter">{attr.label}</label>
                        <div className="relative">
                          <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="number" value={(selected as any)[attr.key]} onChange={(e) => updatePlaceholder(selected.id, { [attr.key]: parseInt(e.target.value) || 0 })} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-rose-50" />

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">文字排版</label>
                  <div className="space-y-5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-tighter">字体大小</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min="8" max="120" className="flex-1 accent-primary h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" value={selected.fontSize} onChange={(e) => updatePlaceholder(selected.id, { fontSize: parseInt(e.target.value) })} />
                        <input className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-mono font-bold text-slate-700 focus:border-primary outline-none" type="number" value={selected.fontSize} onChange={(e) => updatePlaceholder(selected.id, { fontSize: parseInt(e.target.value) || 8 })} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-tighter">文字颜色</label>
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl border border-slate-200 shadow-inner overflow-hidden"><input type="color" className="opacity-0 w-full h-full cursor-pointer" value={selected.color} onChange={(e) => updatePlaceholder(selected.id, { color: e.target.value })} /></div>
                        <input className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-700 focus:border-primary outline-none uppercase" value={selected.color} onChange={(e) => updatePlaceholder(selected.id, { color: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-tighter">文字对齐</label>
                      <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100">
                        {['left', 'center', 'right'].map(align => (
                          <button key={align} onClick={() => updatePlaceholder(selected.id, { align: align as any })} className={`flex-1 py-2 rounded-lg transition-all flex justify-center items-center ${selected.align === align ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}>
                            <span className="material-symbols-outlined text-[20px]">{`format_align_${align}`}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-6xl mb-4 opacity-20">sentiment_dissatisfied</span>
                    <p className="font-bold tracking-tight">未选择图层</p>
                </div>
            )}
          </div>
          <div className="p-6 bg-slate-50/50 border-t border-rose-50 mt-auto">
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all text-xs font-black shadow-sm group">
              <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">style</span>
              复制当前样式
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TemplateConfig;
