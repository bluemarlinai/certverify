
import React, { useState } from 'react';
import { ORGANIZATIONS, INITIAL_RECIPIENTS } from '../../data/mockData';

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

const CertificateQuery: React.FC<Props> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [org, setOrg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        onNavigate('public-result', match);
      } else {
        setError('未查询到证书，请核对信息后再试');
      }
    }, 1000);
  };

  return (
    <div className="bg-rose-50 min-h-screen flex flex-col font-display selection:bg-primary selection:text-white">
      <header className="w-full bg-white border-b border-red-100 sticky top-0 z-50">
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

      <main className="flex-grow flex flex-col items-center justify-start pt-8 pb-10 px-4 sm:px-6">
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

      <footer className="w-full py-6 sm:py-8 text-center border-t border-red-100 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">© 2026 证书查询验证系统 版权所有</p>
        </div>
      </footer>
    </div>
  );
};

export default CertificateQuery;
