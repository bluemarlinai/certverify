
import React, { useState, useRef } from 'react';
import { INITIAL_RECIPIENTS, ORGANIZATIONS } from '../../data/mockData';
import { Recipient, CertificateStatus } from '../../types';

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

const CertificateInfo: React.FC<Props> = ({ onNavigate }) => {
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importStep, setImportStep] = useState<'upload' | 'validate' | 'success'>('upload');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredRecipients = recipients.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.certNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.award.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
        alert('请上传 Excel (.xlsx, .xls) 或 CSV 文件');
        return;
      }
      setSelectedFile(file);
      setImportStep('validate');
    }
  };

  const confirmImport = () => {
    setImportStep('upload'); // 模拟加载状态
    setTimeout(() => {
      const newRecipients: Recipient[] = [
        {
          id: Math.random().toString(),
          name: '张舞蝶',
          phone: '13988880001',
          award: '少儿现代舞·特等奖',
          date: new Date().toISOString().split('T')[0],
          status: CertificateStatus.PENDING,
          orgId: '1',
          certNumber: 'DANCE-IMP-' + Math.floor(Math.random() * 1000)
        }
      ];
      setRecipients([...newRecipients, ...recipients]);
      setImportStep('success');
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStep('upload');
        setSelectedFile(null);
      }, 1500);
    }, 1200);
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
      {/* 统一 Header */}
      <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4 text-slate-900" onClick={() => onNavigate('admin-certs')}>
          <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] cursor-pointer font-display">证书系统</h2>
        </div>
        <div className="flex flex-1 justify-end">
          <nav className="flex items-center gap-9">
            <button className="text-primary text-sm font-bold leading-normal relative after:content-[''] after:absolute after:left-0 after:-bottom-5 after:w-full after:h-0.5 after:bg-primary">证书信息管理</button>
            <button className="text-slate-600 hover:text-primary text-sm font-medium transition-colors" onClick={() => onNavigate('admin-templates')}>证书模板管理</button>
          </nav>
        </div>
      </header>

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
          
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-red-100 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm transition-all shadow-lg active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
                批量导入 (Excel)
              </button>
              <button 
                onClick={simulateBulkGenerate}
                className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
                一键生成证书
              </button>
            </div>
            
            <div className="relative w-full md:w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="搜索姓名、编号、奖项..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isGenerating && (
          <div className="mb-8 bg-white p-6 rounded-xl border border-primary/20 shadow-lift animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                正在批量生成渲染图片...
              </span>
              <span className="text-sm font-mono font-bold text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-red-50 rounded-full h-3 overflow-hidden">
              <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Recipients</p>
              <p className="text-3xl font-black text-slate-900">{recipients.length}</p>
            </div>
            <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined">group</span></div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Generated</p>
              <p className="text-3xl font-black text-emerald-600">{recipients.filter(r => r.status === CertificateStatus.GENERATED).length}</p>
            </div>
            <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><span className="material-symbols-outlined">task_alt</span></div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Pending</p>
              <p className="text-3xl font-black text-amber-500">{recipients.filter(r => r.status === CertificateStatus.PENDING).length}</p>
            </div>
            <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500"><span className="material-symbols-outlined">hourglass_empty</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400">姓名 (Recipient)</th>
                  <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400">证书编号</th>
                  <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400">奖项内容</th>
                  <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400">颁发日期</th>
                  <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400">当前状态</th>
                  <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRecipients.map(r => (
                  <tr key={r.id} className="group hover:bg-red-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">{r.name}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500 font-mono">{r.certNumber}</td>
                    <td className="py-4 px-6 text-sm text-slate-900 font-medium">{r.award}</td>
                    <td className="py-4 px-6 text-sm text-slate-400">{r.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${r.status === CertificateStatus.GENERATED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        <div className={`size-1.5 rounded-full ${r.status === CertificateStatus.GENERATED ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="size-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" onClick={() => onNavigate('public-result', r)} title="预览证书"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                        <button className="size-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="删除记录"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRecipients.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
               <span className="material-symbols-outlined text-6xl mb-4 opacity-20">search_off</span>
               <p className="font-bold tracking-tight">未找到匹配的证书信息</p>
            </div>
          )}
        </div>
      </div>

      {/* Import Excel Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsImportModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-slate-900 px-8 py-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
                <h3 className="text-xl font-black tracking-tight">批量导入数据</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="hover:rotate-90 transition-transform p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-8">
              {importStep === 'upload' ? (
                <div className="space-y-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-red-50/30 hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                    <div className="size-20 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">cloud_upload</span>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-black text-slate-700">点击上传 Excel 表格</p>
                      <p className="text-xs text-slate-400 mt-2">支持 .xlsx, .xls, .csv 格式文件</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 border border-amber-100">
                    <span className="material-symbols-outlined text-amber-500">info</span>
                    <div className="text-xs text-amber-800 leading-relaxed">
                      <p className="font-bold mb-1">导入说明：</p>
                      <p>请确保表头包含：姓名、手机号、奖项名称、证书编号等关键列。您可以 <a href="#" className="underline font-black">下载模板文件</a> 进行填写。</p>
                    </div>
                  </div>
                </div>
              ) : importStep === 'validate' ? (
                <div className="space-y-6">
                   <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="material-symbols-outlined text-primary text-4xl">description</span>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-black text-slate-800 truncate">{selectedFile?.name}</p>
                        <p className="text-xs text-slate-400">已识别出 42 条待导入数据</p>
                      </div>
                      <button onClick={() => setImportStep('upload')} className="text-xs font-black text-primary hover:underline">更换文件</button>
                   </div>
                   
                   <div className="space-y-3">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">数据校验结果</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                         <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
                            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> 格式校验通过 (42/42)</span>
                         </div>
                         <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
                            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> 必填项检查通过</span>
                         </div>
                      </div>
                   </div>

                   <button 
                    onClick={confirmImport}
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                   >
                     确认导入 42 条记录
                   </button>
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-center gap-4 animate-scale-in">
                   <div className="size-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                      <span className="material-symbols-outlined text-6xl">done_all</span>
                   </div>
                   <h4 className="text-2xl font-black text-slate-900">导入成功</h4>
                   <p className="text-slate-500">数据已成功同步至管理后台，正在关闭...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateInfo;
