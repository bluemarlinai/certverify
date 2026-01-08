
import React, { useState } from 'react';
import { INITIAL_RECIPIENTS, ORGANIZATIONS } from '../../data/mockData';
import { Recipient, CertificateStatus } from '../../types';

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
    r.certNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.award.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const simulateImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      const newRecipients: Recipient[] = [
        {
          id: Math.random().toString(),
          name: '新导入用户' + Math.floor(Math.random() * 100),
          phone: '13912345678',
          award: '导入测试奖项',
          date: '2024-01-01',
          status: CertificateStatus.PENDING,
          orgId: '1',
          certNumber: 'CERT-NEW-' + Math.floor(Math.random() * 1000)
        }
      ];
      setRecipients([...newRecipients, ...recipients]);
      setIsImporting(false);
    }, 1500);
  };

  const simulateBulkGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRecipients(recipients.map(r => ({ ...r, status: CertificateStatus.GENERATED })));
          setTimeout(() => setIsGenerating(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-surface-light/95 backdrop-blur-md border-b border-red-100 shadow-sm shadow-red-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('admin-certs')}>
                <div className="bg-primary/10 p-1.5 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-primary group-hover:text-white text-2xl">verified</span>
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">证书系统</span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                <button className="px-4 py-2 rounded-lg bg-primary text-white shadow-lg shadow-red-500/20 font-bold text-sm" onClick={() => onNavigate('admin-certs')}>证书信息管理</button>
                <button className="px-4 py-2 rounded-lg text-slate-600 font-medium text-sm hover:bg-red-50 hover:text-primary transition-all" onClick={() => onNavigate('admin-templates')}>证书模板管理</button>
                <button className="px-4 py-2 rounded-lg text-slate-600 font-medium text-sm hover:bg-red-50 hover:text-primary transition-all" onClick={() => onNavigate('admin-config')}>证书模板配置</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="size-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">help</span></button>
              <div className="w-px h-5 bg-red-100 mx-1"></div>
              <button className="size-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">settings</span></button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-xl hidden md:flex border border-primary/10">
                <span className="material-symbols-outlined text-primary text-4xl">verified</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">证书信息管理</h1>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed max-w-3xl md:ml-1">
              管理获奖人员信息，支持Excel批量导入、数据编辑及证书生成预览。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={simulateImport}
              disabled={isImporting}
              className={`flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-red-200 bg-white text-slate-700 font-bold text-base hover:border-primary hover:text-primary transition-all shadow-sm ${isImporting ? 'opacity-50 cursor-wait' : ''}`}
            >
              <span className="material-symbols-outlined text-[22px]">{isImporting ? 'sync' : 'upload_file'}</span>
              {isImporting ? '导入中...' : '批量导入 (Excel)'}
            </button>
            <button 
              onClick={simulateBulkGenerate}
              className="flex items-center justify-center gap-2 h-12 px-8 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-base transition-all shadow-lg shadow-red-500/30 transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[22px]">auto_fix_high</span>
              批量生成证书
            </button>
          </div>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="mb-8 bg-white p-6 rounded-xl border border-primary/20 shadow-lift">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                正在批量生成图片...
              </span>
              <span className="text-sm font-mono font-bold text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-red-50 rounded-full h-3 overflow-hidden">
              <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">Randomizing Filenames and Applying Templates...</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-red-100 shadow-soft flex items-center justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-2 -mt-2"></div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">总证书数量</p>
              <p className="text-3xl font-bold text-primary">{recipients.length}</p>
            </div>
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">analytics</span></div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-red-100 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">已生成图片</p>
              <p className="text-3xl font-bold text-emerald-600">{recipients.filter(r => r.status === CertificateStatus.GENERATED).length}</p>
            </div>
            <div className="size-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><span className="material-symbols-outlined">image_search</span></div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-red-100 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">待生成</p>
              <p className="text-3xl font-bold text-amber-500">{recipients.filter(r => r.status === CertificateStatus.PENDING).length}</p>
            </div>
            <div className="size-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500"><span className="material-symbols-outlined">pending_actions</span></div>
          </div>
        </div>

        {/* Filters and Table (Remaining logic same as before but refined) */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-xl border border-red-100 shadow-soft flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" 
                placeholder="搜索姓名、证书编号或奖项名称..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select className="form-select block w-40 pl-3 pr-10 py-2.5 text-sm border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-slate-600">
                <option>所有状态</option>
                <option>已生成</option>
                <option>待处理</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>筛选
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-red-100 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-red-50/50 border-b border-red-100">
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 w-12">
                      <input className="rounded border-gray-300 text-primary focus:ring-primary bg-white" type="checkbox"/>
                    </th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">姓名</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">证书编号</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">奖项名称</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">状态</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-50/60">
                  {filteredRecipients.map(r => (
                    <tr key={r.id} className="group hover:bg-red-50/30 transition-colors">
                      <td className="py-4 px-6"><input className="rounded border-gray-300 text-primary focus:ring-primary bg-white" type="checkbox"/></td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ring-1 ${r.status === CertificateStatus.GENERATED ? 'bg-red-100 text-red-600 ring-red-200' : 'bg-orange-100 text-orange-600 ring-orange-200'}`}>
                            {r.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-900">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 font-mono">{r.certNumber}</td>
                      <td className="py-4 px-6 text-sm text-slate-900">{r.award}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${r.status === CertificateStatus.GENERATED ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                          <span className={`size-1.5 rounded-full ${r.status === CertificateStatus.GENERATED ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-slate-500 hover:text-primary hover:bg-red-50 rounded-md transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                          <button 
                            className={`p-1.5 rounded-md transition-colors ${r.status === CertificateStatus.GENERATED ? 'text-primary hover:text-primary-dark hover:bg-red-50' : 'text-slate-300 cursor-not-allowed'}`} 
                            disabled={r.status !== CertificateStatus.GENERATED}
                            onClick={() => onNavigate('public-result', r)}
                            title="Preview and Download"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white px-6 py-4 border-t border-red-100 flex items-center justify-between">
              <span className="text-sm text-slate-500">共 {filteredRecipients.length} 条记录</span>
              <div className="flex items-center gap-2">
                 <button className="size-8 flex items-center justify-center rounded border border-slate-200 text-slate-400"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                 <button className="size-8 flex items-center justify-center rounded bg-primary text-white text-xs font-bold">1</button>
                 <button className="size-8 flex items-center justify-center rounded border border-slate-200 text-slate-400"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => onNavigate('public-query')}
          className="bg-white border-2 border-primary text-primary px-6 py-3 rounded-full font-bold shadow-lift hover:scale-105 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">rocket_launch</span>
          预览查询端
        </button>
      </div>
    </div>
  );
};

export default CertificateInfo;
