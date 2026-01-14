
import React, { useState, useRef, useEffect } from 'react';
import { ORGANIZATIONS, INITIAL_RECIPIENTS } from '../../data/mockData';
import { Template } from '../../types'; // Import Template type

interface Props {
  onNavigate: (page: string, data?: any) => void;
  templates: Template[]; // 从 App.tsx 接收模板列表
}

const CertificateQuery: React.FC<Props> = ({ onNavigate, templates }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [org, setOrg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSearch = () => {
    if (!name || !phone || !org) {
      setError('请填写完整查询信息');
      return;
    }
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const match = INITIAL_RECIPIENTS.find(r => 
        r.name === name && 
        r.phone === phone && 
        r.orgId === org
      );

      setLoading(false);
      if (match) {
        if (match.isEnabled) {
          onNavigate('public-result', match);
        } else {
          setError('此证书已暂停使用，请联系管理员'); // NEW: Specific error for disabled certificates
        }
      } else {
        setError('未查询到证书，请核对信息后再试');
      }
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-rose-50 font-display selection:bg-primary selection:text-white">
      <header className="flex-none w-full bg-white border-b border-red-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 truncate">CertVerify</h1>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => onNavigate('admin-certs')}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors rounded-lg hover:bg-red-50"
            >
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
              <span className="hidden sm:inline">管理后台</span>
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors rounded-lg hover:bg-red-50">
              <span className="material-symbols-outlined text-[20px]">help</span>
              <span className="hidden sm:inline">帮助中心</span>
            </button>
          </div>
        </div>
      </header>

      <main ref={mainContentRef} className="flex-1 overflow-y-auto flex flex-col items-center justify-start pt-8 pb-10 px-4 sm:px-6">
        <div className="w-full max-w-lg flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-2">证书查询</h2>
            <p className="text-slate-500 text-base sm:text-lg">请输入相关信息查询并下载您的电子证书</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-red-100 p-5 sm:p-8">
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">person</span>学生姓名
                </label>
                <input 
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base appearance-none hover:border-red-200" 
                  placeholder="请输入学生全名" 
                  type="text" 
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">phone_iphone</span>家长电话
                </label>
                <input 
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base appearance-none hover:border-red-200" 
                  placeholder="请输入预留手机号" 
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(''); }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">school</span>所属机构
                </label>
                <select 
                  className="w-full h-12 pl-4 pr-10 appearance-none rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base hover:border-red-200"
                  value={org}
                  onChange={(e) => { setOrg(e.target.value); setError(''); }}
                >
                  <option value="">请选择机构</option>
                  {ORGANIZATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>

              {error && <p className="text-primary text-sm font-medium text-center">{error}</p>}

              <button 
                className={`mt-2 sm:mt-4 w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                type="button"
                disabled={loading}
                onClick={handleSearch}
              >
                <span className="material-symbols-outlined">{loading ? 'sync' : 'search'}</span>
                {loading ? '查询中...' : '立即查询'}
              </button>
            </form>
            <div className="mt-5 sm:mt-6 flex items-start sm:items-center justify-center gap-2 text-xs text-slate-400 px-2 text-center">
              <span className="material-symbols-outlined text-sm shrink-0 mt-0.5 sm:mt-0">lock</span>
              <span className="leading-tight">您的信息仅用于证书验证，我们严格保护隐私安全</span>
            </div>
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

export default CertificateQuery;
