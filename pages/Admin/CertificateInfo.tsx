import React, { useState } from 'react';
import { INITIAL_RECIPIENTS, ORGANIZATIONS } from '../../data/mockData';
import { Recipient, CertificateStatus } from '../../types';
import { Icon } from '../../components/Icon';

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

const CertificateInfo: React.FC<Props> = ({ onNavigate }) => {
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const filteredRecipients = recipients.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.certNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      const newOne: Recipient = {
        id: Math.random().toString(36).substr(2, 9),
        name: '王小华',
        phone: '13566778899',
        award: '全国青少年编程大赛一等奖',
        date: '2024-05-20',
        status: CertificateStatus.PENDING,
        orgId: '1',
        certNumber: 'CN-' + Math.floor(100000 + Math.random() * 900000)
      };
      setRecipients([newOne, ...recipients]);
      setIsImporting(false);
    }, 1200);
  };

  const handleBulkGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setRecipients(prev => prev.map(r => ({ ...r, status: CertificateStatus.GENERATED })));
          setTimeout(() => setIsGenerating(false), 500);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
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
            <button className="px-4 h-full border-b-2 border-primary text-primary font-bold text-sm">证书信息管理</button>
            <button onClick={() => onNavigate('admin-templates')} className="px-4 h-full border-b-2 border-transparent text-slate-500 hover:text-primary transition-all text-sm font-medium">证书模板管理</button>
            <button onClick={() => onNavigate('admin-config')} className="px-4 h-full border-b-2 border-transparent text-slate-500 hover:text-primary transition-all text-sm font-medium">点位配置</button>
            <button onClick={() => onNavigate('public-query')} className="px-4 h-full border-b-2 border-transparent text-slate-500 hover:text-primary transition-all text-sm font-medium flex items-center gap-1">
               <Icon name="open_in_new" className="w-4 h-4" /> 访问查询端
            </button>
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
            <h1 className="text-3xl font-black text-slate-900 mb-2">获奖人员信息</h1>
            <p className="text-slate-500">管理所有获奖人员数据，支持一键批量生成证书图片（加盐加密文件名）。</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleImport}
              disabled={isImporting}
              className="px-5 h-11 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:border-primary hover:text-primary transition-all flex items-center gap-2 shadow-sm"
            >
              <Icon name={isImporting ? "sync" : "upload_file"} className={isImporting ? "animate-spin" : ""} />
              {isImporting ? '导入中...' : 'Excel 导入'}
            </button>
            <button 
              onClick={handleBulkGenerate}
              disabled={isGenerating}
              className="px-6 h-11 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 active:scale-95 transition-all"
            >
              <Icon name="auto_fix_high" />
              批量生成证书
            </button>
          </div>
        </div>

        {/* 统计面板 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: '累计证书', value: recipients.length, icon: 'article', color: 'text-primary', bg: 'bg-red-50' },
            { label: '已渲染图片', value: recipients.filter(r => r.status === CertificateStatus.GENERATED).length, icon: 'photo_library', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: '待处理记录', value: recipients.filter(r => r.status === CertificateStatus.PENDING).length, icon: 'hourglass_empty', color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: '今日生成', value: '12', icon: 'bolt', color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`size-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <Icon name={stat.icon} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 进度显示 */}
        {isGenerating && (
          <div className="mb-8 bg-white p-6 rounded-2xl border border-primary/10 shadow-lift animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 text-primary">
                <Icon name="sync" className="animate-spin w-5 h-5" />
                <span className="font-bold text-sm">正在批量渲染高清证书 ({progress}%)</span>
              </div>
              <span className="text-xs font-mono text-slate-400">随机文件名加固中...</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* 列表区域 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4 bg-slate-50/30">
            <div className="relative flex-1 w-full">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="搜索姓名、证书编号或所获奖项..."
                className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="h-11 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-white hover:border-slate-300 transition-colors bg-white">
                <Icon name="filter_list" className="w-4 h-4" /> 筛选
              </button>
              <button className="h-11 px-4 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-sm">
                导出名单
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">获奖人姓名</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">证书编号</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">所获奖项</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">生成状态</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">管理操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRecipients.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold font-mono">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{r.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{r.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {r.certNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-slate-600 line-clamp-1">{r.award}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        r.status === CertificateStatus.GENERATED 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        <div className={`size-1.5 rounded-full ${
                          r.status === CertificateStatus.GENERATED ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                        }`} />
                        {r.status}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <Icon name="visibility" className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <Icon name="download" className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                          <Icon name="delete" className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium tracking-tight">显示第 1-{filteredRecipients.length} 条数据，共 {filteredRecipients.length} 条</p>
            <div className="flex items-center gap-1">
              <button className="p-2 text-slate-400 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                <Icon name="chevron_left" />
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg bg-white border border-primary text-primary text-xs font-bold">1</button>
              <button className="p-2 text-slate-400 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                <Icon name="chevron_right" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CertificateInfo;