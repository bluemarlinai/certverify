
import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_TEMPLATES } from '../../data/mockData';
import { Template } from '../../types';

interface Props {
  onNavigate: (page: string, data?: any) => void;
  templates: Template[]; // 从 App.tsx 接收模板列表
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>; // 从 App.tsx 接收更新模板列表的函数
}

const TemplateManagement: React.FC<Props> = ({ onNavigate, templates, setTemplates }) => {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    description: '',
    type: 'A4 横向',
    format: 'PNG',
    imageUrl: '',
    code: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // --- 新增: 返回顶部按钮相关 ---
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  // --- 新增: 监听主内容区滚动 ---
  useEffect(() => {
    const mainEl = mainContentRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      if (mainEl.scrollTop > 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);

  // --- 新增: 点击返回顶部 ---
  const handleBackToTop = () => {
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleCreateTemplate = () => {
    if (!newTemplate.name) {
      alert('请填写模板名称');
      return;
    }
    if (!newTemplate.code) {
      alert('请填写模板代码');
      return;
    }
    const imageUrlToUse = newTemplate.imageUrl || 'https://images.unsplash.com/photo-1614032120894-080be8095f9c?auto=format&fit=crop&q=80&w=1200';
    
    const createdTemplate: Template = {
      id: 't' + (templates.length + 1),
      name: newTemplate.name!,
      description: newTemplate.description || '暂无描述',
      type: newTemplate.type as any || 'A4 横向',
      format: 'PNG',
      imageUrl: imageUrlToUse,
      code: newTemplate.code.toUpperCase()
    };

    setTemplates([createdTemplate, ...templates]);
    setIsNewModalOpen(false);
    setNewTemplate({ name: '', description: '', type: 'A4 横向', format: 'PNG', imageUrl: '', code: '' });
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;
    if (!editingTemplate.name) {
      alert('请填写模板名称');
      return;
    }
    if (!editingTemplate.code) {
      alert('请填写模板代码');
      return;
    }
    const imageUrlToUse = editingTemplate.imageUrl || 'https://images.unsplash.com/photo-1614032120894-080be8095f9c?auto=format&fit=crop&q=80&w=1200';

    setTemplates(prevTemplates => prevTemplates.map(t => 
      t.id === editingTemplate.id ? { ...editingTemplate, imageUrl: imageUrlToUse, code: editingTemplate.code.toUpperCase() } : t
    ));
    setIsEditModalOpen(false); 
    setEditingTemplate(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<Partial<Template>>> | React.Dispatch<React.SetStateAction<Template | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(prev => prev ? { ...prev, imageUrl: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (setter: React.Dispatch<React.SetStateAction<Partial<Template>>> | React.Dispatch<React.SetStateAction<Template | null>>, fileInputRef: React.RefObject<HTMLInputElement>) => {
    setter(prev => prev ? { ...prev, imageUrl: '' } : null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openEditModal = (template: Template) => {
    setEditingTemplate({ ...template });
    setIsEditModalOpen(true); 
  };

  const openImagePreview = (url: string) => {
    setPreviewImageUrl(url);
    setIsImagePreviewModalOpen(true);
  };

  const closeImagePreview = () => {
    setIsImagePreviewModalOpen(false);
    setPreviewImageUrl('');
  };

  return (
    <div className="h-full flex flex-col bg-background-light">
      {/* 统一 Header */}
      <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-10 py-3 z-50">
        <div className="flex items-center gap-4 text-slate-900" onClick={() => onNavigate('admin-certs')}>
          <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] cursor-pointer font-display">证书系统</h2>
        </div>
        <div className="flex flex-1 justify-end">
          <nav className="flex items-center gap-9">
            <button className="text-slate-600 hover:text-primary text-sm font-medium transition-colors" onClick={() => onNavigate('admin-certs')}>证书信息管理</button>
            <button className="text-primary text-sm font-bold leading-normal relative after:content-[''] after:absolute after:left-0 after:-bottom-5 after:w-full after:h-0.5 after:bg-primary">证书模板管理</button>
          </nav>
        </div>
      </header>

      <main ref={mainContentRef} className="flex-1 overflow-y-auto flex justify-center py-10 px-6 sm:px-10">
        <div className="w-full max-w-[1280px] flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] text-red-950 font-display">证书模板管理</h1>
              <p className="text-slate-500 text-base font-normal max-w-2xl">上传、编辑和管理用于颁发证书的视觉模板。支持 A4 比例背景图导入。</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
              onClick={() => setIsNewModalOpen(true)}
              className="group flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300 cursor-pointer min-h-[320px] p-6 text-center"
            >
              <div className="size-20 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-5 transition-colors duration-300 transform group-hover:scale-110">
                <span className="material-symbols-outlined text-[48px] text-primary transition-transform duration-300 group-hover:rotate-12">add_photo_alternate</span>
              </div>
              <p className="text-primary font-black text-xl mb-1">新建证书模板</p>
              <p className="text-slate-500 text-sm max-w-xs">点击上传背景图，开始创建新模板。</p>
            </div>

            {templates.map(t => (
              <div key={t.id} className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft hover:shadow-lift hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative aspect-[1.414/1] bg-slate-100 overflow-hidden group-hover:brightness-[1.02] transition-all">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: `url('${t.imageUrl}')`}}></div>
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-white/90 text-primary backdrop-blur-md shadow-sm border border-white/20">
                      {t.type}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      className="bg-white text-primary font-bold py-2 px-5 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center gap-2"
                      onClick={() => openImagePreview(t.imageUrl)} // 修改为打开图片预览模态框
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      查看证书模板
                    </button>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors font-display">{t.name}</h3>
                  <p className="text-xs font-mono font-bold text-slate-500 mb-3">{t.code}</p>
                  <p className="text-xs text-slate-500 mb-5 line-clamp-2">{t.description}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">{t.format}</span>
                    <div className="flex items-center gap-1">
                      {/* 新增编辑模板详情按钮 */}
                      <button className="size-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" onClick={(e) => {e.stopPropagation(); openEditModal(t);}} title="编辑模板详情"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      <button className="size-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" onClick={() => onNavigate('admin-config', t.id)} title="配置模板字段"><span className="material-symbols-outlined text-[18px]">settings_suggest</span></button>
                      <button className="size-8 flex items-center justify-center text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="删除模板"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create New Template Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsNewModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-primary px-8 py-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">add_circle</span>
                <h3 className="text-xl font-black tracking-tight">新建证书模板</h3>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="hover:rotate-90 transition-transform p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-8 flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">模板名称</label>
                <input 
                  type="text" 
                  placeholder="例如：2024中国舞蹈大赛荣誉证书"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base outline-none"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">模板代码 (CODE)</label>
                <input 
                  type="text" 
                  placeholder="例如: DANCE_CONTEST (请使用大写英文和下划线)"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base outline-none font-mono uppercase"
                  value={newTemplate.code}
                  onChange={(e) => setNewTemplate({...newTemplate, code: e.target.value.toUpperCase()})} // 自动转换为大写
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest">证书方向</label>
                  <select 
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    value={newTemplate.type}
                    onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value as any})}
                  >
                    <option value="A4 横向">A4 横向 (推荐)</option>
                    <option value="A4 纵向">A4 纵向</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest">默认格式</label>
                  <div className="h-12 flex items-center px-4 bg-slate-100 rounded-xl text-slate-500 font-bold text-sm">PNG / 电子版</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">描述信息</label>
                <textarea 
                  placeholder="简要说明此模板的适用场景..."
                  rows={3}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">背景图片</label>
                <div 
                  onClick={() => newFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-primary/30 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden"
                  style={{ minHeight: newTemplate.imageUrl ? '150px' : 'auto' }} // 如果有图，给个最小高度
                >
                  <input 
                    type="file" 
                    ref={newFileInputRef} 
                    className="hidden" 
                    accept="image/png, image/jpeg" 
                    onChange={(e) => handleImageChange(e, setNewTemplate)} 
                  />
                  {newTemplate.imageUrl ? (
                    <>
                      <img src={newTemplate.imageUrl} alt="Template Preview" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md group-hover:bg-white transition-colors">
                        <span className="material-symbols-outlined text-4xl text-primary">edit_square</span>
                        <p className="text-sm font-bold text-slate-600">点击更换背景图</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleClearImage(setNewTemplate, newFileInputRef); }} 
                          className="mt-2 text-xs text-red-600 hover:underline font-medium"
                        >
                          清除图片
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all">cloud_upload</span>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-600">点击或拖拽上传背景图</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Recommended Size: 3508 x 2480 (300DPI)</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button 
                  onClick={() => setIsNewModalOpen(false)}
                  className="flex-1 h-12 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleCreateTemplate}
                  className="flex-[2] h-12 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  保存模板并开始配置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {isEditModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-primary px-8 py-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">edit</span>
                <h3 className="text-xl font-black tracking-tight">编辑证书模板</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="hover:rotate-90 transition-transform p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-8 flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">模板名称</label>
                <input 
                  type="text" 
                  placeholder="例如：2024中国舞蹈大赛荣誉证书"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base outline-none"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">模板代码 (CODE)</label>
                <input 
                  type="text" 
                  placeholder="例如: DANCE_CONTEST (请使用大写英文和下划线)"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base outline-none font-mono uppercase"
                  value={editingTemplate.code}
                  onChange={(e) => setEditingTemplate({...editingTemplate, code: e.target.value.toUpperCase()})} // 自动转换为大写
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest">证书方向</label>
                  <select 
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    value={editingTemplate.type}
                    onChange={(e) => setEditingTemplate({...editingTemplate, type: e.target.value as any})}
                  >
                    <option value="A4 横向">A4 横向 (推荐)</option>
                    <option value="A4 纵向">A4 纵向</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest">默认格式</label>
                  <div className="h-12 flex items-center px-4 bg-slate-100 rounded-xl text-slate-500 font-bold text-sm">PNG / 电子版</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">描述信息</label>
                <textarea 
                  placeholder="简要说明此模板的适用场景..."
                  rows={3}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({...editingTemplate, description: e.target.value})}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">背景图片</label>
                <div 
                  onClick={() => editFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-primary/30 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden"
                  style={{ minHeight: editingTemplate.imageUrl ? '150px' : 'auto' }}
                >
                  <input 
                    type="file" 
                    ref={editFileInputRef} 
                    className="hidden" 
                    accept="image/png, image/jpeg" 
                    onChange={(e) => handleImageChange(e, setEditingTemplate)} 
                  />
                  {editingTemplate.imageUrl ? (
                    <>
                      <img src={editingTemplate.imageUrl} alt="Template Preview" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md group-hover:bg-white transition-colors">
                        <span className="material-symbols-outlined text-4xl text-primary">edit_square</span>
                        <p className="text-sm font-bold text-slate-600">点击更换背景图</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleClearImage(setEditingTemplate, editFileInputRef); }} 
                          className="mt-2 text-xs text-red-600 hover:underline font-medium"
                        >
                          清除图片
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all">cloud_upload</span>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-600">点击或拖拽上传背景图</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Recommended Size: 3508 x 2480 (300DPI)</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 h-12 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleUpdateTemplate}
                  className="flex-[2] h-12 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  保存更改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {isImagePreviewModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closeImagePreview}></div>
          <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-slate-900 px-8 py-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">image</span>
                <h3 className="text-xl font-black tracking-tight">模板背景图预览</h3>
              </div>
              <button onClick={closeImagePreview} className="hover:rotate-90 transition-transform p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-4 bg-slate-100 flex items-center justify-center">
              <img src={previewImageUrl} alt="Template Preview" className="max-w-full h-auto max-h-[calc(100vh-200px)] object-contain rounded-lg shadow-md" />
            </div>
            <div className="p-4 bg-white border-t border-slate-100 flex justify-end">
              <button 
                onClick={closeImagePreview}
                className="h-10 px-6 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
       <button
        onClick={handleBackToTop}
        className={`fixed bottom-8 right-8 z-50 size-12 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95 ${showBackToTop ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
        aria-label="返回顶部"
        title="返回顶部"
      >
        <span className="material-symbols-outlined">arrow_upward</span>
      </button>
    </div>
  );
};

export default TemplateManagement;
