
import React, { useEffect, useRef, useState } from 'react';
import { Recipient, Template, Placeholder } from '../../types';
import { MOCK_PLACEHOLDERS, ORGANIZATIONS } from '../../data/mockData';

interface Props {
  recipient: Recipient | null;
  onNavigate: (page: string) => void;
  template: Template | null; // 新增：接收关联的模板信息
}

const CertificateResult: React.FC<Props> = ({ recipient, onNavigate, template }) => {
  const certificateWrapperRef = useRef<HTMLDivElement>(null);
  const certificateContentRef = useRef<HTMLDivElement>(null);

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
  
  // Effect to scale certificate to fit its container
  useEffect(() => {
    const wrapper = certificateWrapperRef.current;
    const content = certificateContentRef.current;
    if (!wrapper || !content) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const scale = entry.contentRect.width / 800; // Design base width is 800px
        content.style.transform = `scale(${scale})`;
      }
    });
    
    resizeObserver.observe(wrapper);
    
    return () => resizeObserver.disconnect();
  }, []);


  useEffect(() => {
    if (!recipient) {
      onNavigate('public-query');
    }
    // Scroll main content to top on mount, not window
    mainContentRef.current?.scrollTo(0, 0);
  }, [recipient, onNavigate]);

  // Download functionality (using a library like html2canvas would be needed for a real implementation)
  const handleDownload = () => {
    alert('下载功能正在开发中！');
    // A real implementation would likely use a library like html2canvas or dom-to-image
    // to capture the `certificateContentRef` element.
  };

  if (!recipient || !template) {
    // This will be briefly visible while App.tsx state updates after navigation
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <p className="text-slate-500">正在加载证书信息...</p>
      </div>
    );
  }

  // Combine base placeholders with recipient-specific overrides
  const finalPlaceholders = MOCK_PLACEHOLDERS.map(p => {
    const override = recipient.placeholderOverrides?.[p.key];
    return override ? { ...p, ...override } : p;
  });
  
  const getOrgName = (orgId: string) => {
    const org = ORGANIZATIONS.find(o => o.id === orgId);
    return org ? org.name : '发证机构';
  };

  const getPlaceholderText = (key: string) => {
    switch (key) {
      case 'recipient_name':
        return recipient.name;
      case 'award_subject':
        return recipient.awardTitle;
      case 'award_rank':
        return recipient.awardRank;
      case 'cert_date':
        return recipient.date;
      case 'cert_number':
        return recipient.certNumber;
      case 'organization_name':
        return getOrgName(recipient.orgId);
      default:
        return `{{${key}}}`;
    }
  };

  return (
    <div className="h-full flex flex-col bg-rose-50 font-display selection:bg-primary selection:text-white">
      <header className="flex-none w-full bg-white border-b border-red-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
               <span className="material-symbols-outlined">verified</span>
             </div>
             <h1 className="text-lg font-bold tracking-tight text-slate-900 truncate">证书查询结果</h1>
           </div>
          <button
            onClick={() => onNavigate('public-query')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors rounded-lg hover:bg-red-50"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="hidden sm:inline">返回查询</span>
          </button>
        </div>
      </header>

      <main ref={mainContentRef} className="flex-1 overflow-y-auto flex flex-col items-center justify-start py-8 sm:py-12 px-4 sm:px-6">
        <div className="w-full max-w-4xl flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-2">祝贺您，{recipient.name}！</h2>
            <p className="text-slate-500 text-base sm:text-lg">您的电子证书已生成，请确认信息并下载。</p>
          </div>

          {/* Certificate Display Area */}
          <div ref={certificateWrapperRef} className="w-full" style={{ aspectRatio: '800 / 566' }}>
            <div 
              ref={certificateContentRef} 
              className="origin-top-left"
              style={{
                width: 800,
                height: 566,
              }}
            >
              <div className="relative w-full h-full">
                <img src={template.imageUrl} alt={template.name} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                
                {/* Render placeholders */}
                {finalPlaceholders.map(p => (
                  <div
                    key={p.id}
                    className={`absolute flex items-center`}
                    style={{
                      top: p.y,
                      left: p.x,
                      width: p.width,
                      height: p.height,
                      justifyContent: p.align,
                    }}
                  >
                    <span
                      className="whitespace-nowrap overflow-hidden w-full"
                      style={{
                        fontSize: p.fontSize,
                        color: p.color,
                        textAlign: p.align,
                      }}
                    >
                      {getPlaceholderText(p.key)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-lg flex flex-col sm:flex-row items-center gap-4 mt-2">
            <button
              onClick={() => onNavigate('public-query')}
              className="w-full sm:w-auto flex-1 h-12 rounded-xl font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              返回重新查询
            </button>
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex-[2] h-12 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">download</span>
              下载证书 (PNG)
            </button>
          </div>
        </div>
      </main>

       <footer className="flex-none w-full py-6 sm:py-8 text-center border-t border-red-100 bg-white">
         <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-sm text-slate-500">© 2026 证书查询验证系统 版权所有</p>
         </div>
       </footer>
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

export default CertificateResult;
