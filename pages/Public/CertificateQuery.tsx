import React, { useState } from 'react';
import { ORGANIZATIONS, INITIAL_RECIPIENTS } from '../../data/mockData';
import { Icon } from '../../components/Icon';

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
    <div className="bg-rose-50 min-h-screen flex flex-col selection:bg-primary selection:text-white">
      {/* 返回管理端悬浮按钮 - 仅用于演示/开发环境 */}
      <button 
        onClick={() => onNavigate('admin-certs')}
        className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold text-sm hover:scale-105 active:scale-95 transition-all group"
      >
        <Icon name="admin_panel_settings" className="w-5 h-5 text-gold group-hover:rotate-12 transition-transform" />
        返回管理端
      </button>

      <header className="w-full bg-white border-b border-red-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              <Icon name="verified" className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">CertVerify</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary transition-all rounded-xl hover:bg-red-50">
            <Icon name="help" className="w-5 h-5" />
            <span className="hidden sm:inline">帮助</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start pt-12 pb-10 px-4 sm:px-6">
        <div className="w-full max-w-lg flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3">电子证书查询</h2>
            <p className="text-slate-500 text-base sm:text-lg">请输入颁发时预留的信息进行验证下载</p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-soft border border-red-100 p-6 sm:p-10 relative overflow-hidden">
            {/* 装饰图标 */}
            <div className="absolute -top-6 -right-6 text-primary/5">
              <Icon name="verified" className="w-32 h-32" />
            </div>

            <form className="flex flex-col gap-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Icon name="person" className="text-primary w-4 h-4" />获奖学生姓名
                </label>
                <input 
                  className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-base font-medium" 
                  placeholder="请输入真实姓名" 
                  type="text" 
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Icon name="phone_iphone" className="text-primary w-4 h-4" />预留家长手机
                </label>
                <input 
                  className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-base font-medium" 
                  placeholder="请输入11位手机号" 
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(''); }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Icon name="school" className="text-primary w-4 h-4" />所属培训机构
                </label>
                <div className="relative">
                  <select 
                    className="w-full h-14 pl-5 pr-12 appearance-none rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-base"
                    value={org}
                    onChange={(e) => { setOrg(e.target.value); setError(''); }}
                  >
                    <option value="">点击选择机构</option>
                    {ORGANIZATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Icon name="expand_more" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-primary text-xs font-bold py-3 px-4 rounded-xl flex items-center gap-2 animate-shake">
                  <Icon name="error" className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button 
                className={`mt-4 w-full h-14 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-xl shadow-red-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg ${loading ? 'opacity-70 cursor-wait' : ''}`}
                type="button"
                disabled={loading}
                onClick={handleSearch}
              >
                {loading ? (
                  <Icon name="sync" className="animate-spin" />
                ) : (
                  <Icon name="search" />
                )}
                {loading ? '正在检索数据库...' : '立即查询证书'}
              </button>
            </form>
          </div>
          
          <div className="flex flex-col items-center gap-4 mt-4">
             <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
               <Icon name="verified_user" className="w-4 h-4 text-emerald-500" />
               官方认证查询系统 · 数据已进行分级加密
             </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 text-center mt-auto">
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">© 2026 CertVerify System · Academic Integrity First</p>
      </footer>
    </div>
  );
};

export default CertificateQuery;