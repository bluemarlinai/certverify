
import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_RECIPIENTS, ORGANIZATIONS, INITIAL_TEMPLATES } from '../../data/mockData';
import { Recipient, CertificateStatus, Template } from '../../types';

interface Props {
  onNavigate: (page: string, data?: any) => void;
  recipients: Recipient[];
  setRecipients: React.Dispatch<React.SetStateAction<Recipient[]>>;
  templates: Template[]; // 从 App.tsx 接收模板列表
}

// 定义校验错误的类型
interface ValidationError {
  row: number | 'header'; // 行号，'header'表示表头错误
  column?: string; // 列名（可选）
  message: string; // 错误信息
}

const CertificateInfo: React.FC<Props> = ({ onNavigate, recipients, setRecipients, templates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | CertificateStatus.GENERATED | CertificateStatus.PENDING>('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const [importStep, setImportStep] = useState<'upload' | 'processing' | 'validation-summary' | 'importing' | 'success' | 'failure'>('upload'); // 细化导入步骤
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<Set<string>>(new Set()); 

  // --- 新增: 返回顶部按钮相关 ---
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  // 新增状态：用于存储校验结果
  const [validationResults, setValidationResults] = useState<{
    total: number;
    valid: number;
    invalid: number;
    errors: ValidationError[];
    validRecipients: Recipient[];
  } | null>(null);

  // --- 分页相关状态 ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // 默认每页显示50条

  // --- 新增: 监听主内容区滚动 ---
  useEffect(() => {
    const mainEl = mainContentRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      // 当滚动超过200px时显示按钮
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


  const getTemplateName = (templateCode?: string) => {
    if (!templateCode) return '未指定模板';
    const template = templates.find(t => t.code === templateCode); // Use global templates
    return template ? template.name : '未知模板';
  };

  // 手机号脱敏函数
  const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length !== 11) {
      return phone;
    }
    return `${phone.substring(0, 3)}****${phone.substring(7)}`;
  };

  const filteredRecipients = recipients.filter(r => {
    const matchesSearchTerm = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.certNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.awardTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.awardRank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.templateCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTemplateName(r.templateCode).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      r.status === filterStatus;

    return matchesSearchTerm && matchesStatus;
  });

  // 计算总页数
  const totalPages = Math.ceil(filteredRecipients.length / itemsPerPage);

  // Get data for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredRecipients.slice(indexOfFirstItem, indexOfLastItem);

  // When filter results change, clear selected state and reset page number
  useEffect(() => {
    setSelectedRecipientIds(new Set<string>());
    setCurrentPage(1); // Reset to the first page when search or filter changes
  }, [searchTerm, filterStatus]);

  // 页码切换函数
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    handleBackToTop(); // 切换页面时也返回顶部
  };

  // 文件选择处理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
        alert('请上传 Excel (.xlsx, .xls) 或 CSV 文件');
        return;
      }
      setSelectedFile(file);
      setImportStep('processing'); // 文件选中后，进入处理中状态
    }
  };

  // 模拟后端校验逻辑
  const simulateValidation = async (file: File) => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // 随机生成校验结果，用于演示不同场景
    const scenario = Math.floor(Math.random() * 4); // 0: 全部有效, 1: 部分无效, 2: 文件解析失败, 3: 导入时发生错误

    let mockValidationResults: typeof validationResults = null;
    const mockValidRecipients: Recipient[] = [];
    const mockErrors: ValidationError[] = [];
    const totalRecords = 42; // 假设文件中有42条记录

    if (scenario === 0) { // 全部有效
      for (let i = 0; i < totalRecords; i++) {
        mockValidRecipients.push({
          id: Math.random().toString(),
          name: `有效学员${i + 1}`,
          phone: `1390000${i.toString().padStart(4, '0')}`, // Fix: Use .toString().padStart()
          awardTitle: '优秀证书',
          awardRank: '一等奖',
          date: new Date().toISOString().split('T')[0],
          status: CertificateStatus.PENDING,
          orgId: '1',
          certNumber: 'VALID-IMP-' + Math.floor(Math.random() * 10000),
          templateCode: 'HONOR_CERT_BLUE_FRAME',
          isEnabled: true,
        });
      }
      mockValidationResults = { total: totalRecords, valid: totalRecords, invalid: 0, errors: [], validRecipients: mockValidRecipients };
    } else if (scenario === 1) { // 部分无效
      mockErrors.push(
        { row: 5, column: 'TEMPLATE_CODE', message: "模板代码 'NON_EXISTENT_TPL' 不存在。" },
        { row: 8, column: 'AWARD_TITLE', message: "姓名 '张三丰' 的奖项名称内容过长 (最大50字符)。" },
        { row: 12, column: 'PHONE', message: "手机号 '12345' 格式不正确。" },
        { row: 15, column: 'NAME', message: "姓名为空。" },
        { row: 20, message: "该行数据不完整。" }
      );
      const invalidCount = mockErrors.length;
      const validCount = totalRecords - invalidCount;
      for (let i = 0; i < validCount; i++) {
        mockValidRecipients.push({
          id: Math.random().toString(),
          name: `有效学员${i + 1}`,
          phone: `1391111${i.toString().padStart(4, '0')}`, // Fix: Use .toString().padStart()
          awardTitle: '良好证书',
          awardRank: '二等奖',
          date: new Date().toISOString().split('T')[0],
          status: CertificateStatus.PENDING,
          orgId: '1',
          certNumber: 'PARTIAL-IMP-' + Math.floor(Math.random() * 10000),
          templateCode: 'HONOR_CERT_BLUE_FRAME',
          isEnabled: true,
        });
      }
      mockValidationResults = { total: totalRecords, valid: validCount, invalid: invalidCount, errors: mockErrors, validRecipients: mockValidRecipients };
    } else { // 文件解析失败 或 导入时发生错误 (这里统一模拟为校验失败，导入时发生错误将在下一个步骤模拟)
      mockErrors.push(
        { row: 'header', message: "文件头不匹配，请检查 Excel 模板。" },
        { row: 0, message: "文件内容为空或无法解析。" }
      );
      mockValidationResults = { total: 0, valid: 0, invalid: totalRecords, errors: mockErrors, validRecipients: [] };
    }

    setValidationResults(mockValidationResults);
    setImportStep('validation-summary');
  };

  // 当 selectedFile 改变且处于 processing 状态时，触发模拟校验
  useEffect(() => {
    if (selectedFile && importStep === 'processing') {
      simulateValidation(selectedFile);
    }
  }, [selectedFile, importStep]); // eslint-disable-line react-hooks/exhaustive-deps


  // 确认导入有效记录 (原 confirmImport)
  const handleConfirmValidImport = async () => {
    if (!validationResults || validationResults.valid === 0) return;

    setImportStep('importing'); // 进入导入中状态
    await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟导入延迟

    const importSuccess = Math.random() > 0.2; // 80% 几率成功，20% 几率失败

    if (importSuccess) {
      setRecipients(prevRecipients => [...validationResults.validRecipients, ...prevRecipients]);
      setImportStep('success');
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStep('upload'); // 重置状态
        setSelectedFile(null);
        setValidationResults(null);
      }, 1500);
    } else {
      // 模拟导入失败的情况
      setValidationResults(prev => ({
        ...(prev || { total: 0, valid: 0, invalid: 0, errors: [], validRecipients: [] }), // 确保非空
        errors: [{ row: 0, message: '数据导入到数据库时发生未知错误，请重试。' }],
      }));
      setImportStep('failure');
    }
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
    // 重置所有导入相关的状态
    setImportStep('upload');
    setSelectedFile(null);
    setValidationResults(null);
  };

  const simulateBulkGenerate = () => {
    setIsGenerating(true);
    setProgress(0);

    const recipientsToGenerate = selectedRecipientIds.size > 0 
      ? recipients.filter(r => selectedRecipientIds.has(r.id)) // 生成所有被选中的证书 (包括跨页)
      : filteredRecipients; // 否则生成所有筛选出的

    if (recipientsToGenerate.length === 0) {
      alert('没有证书可供生成。');
      setIsGenerating(false);
      return;
    }

    const totalSteps = recipientsToGenerate.length;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setProgress(Math.min(Math.round((currentStep / totalSteps) * 100), 100));

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setRecipients(prevRecipients => 
          prevRecipients.map(r => 
            recipientsToGenerate.some(toGen => toGen.id === r.id) 
              ? { ...r, status: CertificateStatus.GENERATED } 
              : r
          )
        );
        setSelectedRecipientIds(new Set<string>());
        setTimeout(() => setIsGenerating(false), 500);
      }
    }, 150);
  };

  // “全选”复选框只作用于当前页可见的条目
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedIds = new Set(selectedRecipientIds);
    if (e.target.checked) {
      currentItems.forEach(r => newSelectedIds.add(r.id));
    } else {
      currentItems.forEach(r => newSelectedIds.delete(r.id));
    }
    setSelectedRecipientIds(newSelectedIds);
  };

  // 选中单个证书
  const handleSelectOne = (id: string, isChecked: boolean) => {
    setSelectedRecipientIds(prev => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  // 切换证书的启用状态
  const handleToggleEnabled = (id: string) => {
    setRecipients(prevRecipients => 
      prevRecipients.map(r => 
        r.id === id 
          ? { ...r, isEnabled: !r.isEnabled } 
          : r
      )
    );
  };

  // 批量启用/停用证书
  const handleBulkAction = (enable: boolean) => {
    if (selectedRecipientIds.size === 0) return;

    setRecipients(prevRecipients =>
      prevRecipients.map(r =>
        selectedRecipientIds.has(r.id)
          ? { ...r, isEnabled: enable }
          : r
      )
    );
    alert(`已批量${enable ? '启用' : '停用'} ${selectedRecipientIds.size} 条证书。`);
    setSelectedRecipientIds(new Set<string>()); // 清除选中状态
  };

  // 判断当前页是否全选
  const isAllCurrentPageSelected = currentItems.length > 0 && currentItems.every(r => selectedRecipientIds.has(r.id));
  // 判断是否有任何证书被选中（跨页）
  const isAnySelected = selectedRecipientIds.size > 0;
  // 判断是否有筛选后的证书可以生成
  const canGenerate = filteredRecipients.length > 0;

  return (
    <div className="h-full flex flex-col bg-background-light">
      {/* 统一 Header, 增加了统计数据 */}
      <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-10 py-3 z-50">
        <div className="flex items-center gap-4 text-slate-900" onClick={() => onNavigate('admin-certs')}>
          <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] cursor-pointer font-display">证书系统</h2>
        </div>
        <div className="flex flex-1 justify-end items-center gap-6">
          {/* Compact Stats Display */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span>总计学员:</span>
              <span className="font-bold text-base text-slate-800">{recipients.length}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <span className="material-symbols-outlined text-sm">task_alt</span>
              <span>已生成:</span>
              <span className="font-bold text-base">{recipients.filter(r => r.status === CertificateStatus.GENERATED).length}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500">
              <span className="material-symbols-outlined text-sm">hourglass_empty</span>
              <span>待处理:</span>
              <span className="font-bold text-base">{recipients.filter(r => r.status === CertificateStatus.PENDING).length}</span>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden lg:block"></div>
          <nav className="flex items-center gap-9">
            <button className="text-primary text-sm font-bold leading-normal relative after:content-[''] after:absolute after:left-0 after:-bottom-5 after:w-full after:h-0.5 after:bg-primary">证书信息管理</button>
            <button className="text-slate-600 hover:text-primary text-sm font-medium transition-colors" onClick={() => onNavigate('admin-templates')}>证书模板管理</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main ref={mainContentRef} className="flex-1 overflow-y-auto">
        <div className="w-full max-w-[1280px] mx-auto py-10 px-6 sm:px-10 flex flex-col gap-8"> 
          {/* Page Title Block */}
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

          {isGenerating && (
            <div className="bg-white p-6 rounded-xl border border-primary/20 shadow-lift animate-pulse">
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

          {/* New Top Control Row: Search & Filters */}
          <div className="flex items-center gap-4 flex-wrap"> 
            <div className="relative w-80 shrink-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="搜索姓名、编号、奖项、模板代码或名称..."
                className="w-full h-10 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                  aria-label="清空搜索"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => setFilterStatus('all')}
                className={`h-8 px-4 text-xs font-bold rounded-lg transition-all flex items-center justify-center ${filterStatus === 'all' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                全部
              </button>
              <button
                onClick={() => setFilterStatus(CertificateStatus.GENERATED)}
                className={`h-8 px-4 text-xs font-bold rounded-lg transition-all flex items-center justify-center ${filterStatus === CertificateStatus.GENERATED ? 'bg-emerald-600 text-white' : 'text-emerald-600 hover:bg-emerald-50'}`}
              >
                已生成
              </button>
              <button
                onClick={() => setFilterStatus(CertificateStatus.PENDING)}
                className={`h-8 px-4 text-xs font-bold rounded-lg transition-all flex items-center justify-center ${filterStatus === CertificateStatus.PENDING ? 'bg-amber-500 text-white' : 'text-amber-500 hover:bg-amber-50'}`}
              >
                待处理
              </button>
            </div>
          </div>

          {/* New Bottom Control Row: Actions & Pagination */}
          <div className="flex items-center gap-4 flex-wrap">
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
              批量导入 (Excel)
            </button>
            <button 
              onClick={simulateBulkGenerate}
              disabled={!canGenerate || isGenerating}
              className={`flex items-center justify-center gap-2 h-10 px-5 rounded-xl text-white font-bold text-sm transition-all active:scale-95 ${canGenerate ? 'bg-primary hover:bg-primary-dark' : 'bg-slate-300 cursor-not-allowed'}`}
            >
              <span className="material-symbols-outlined text-[20px]">{isGenerating ? 'sync' : 'auto_fix_high'}</span>
              {isGenerating ? `生成中 (${progress}%)` : (isAnySelected ? `生成选中证书 (${selectedRecipientIds.size})` : `一键生成全部证书 (${filteredRecipients.length})`)}
            </button>
            <button
              onClick={() => handleBulkAction(true)} // true for enable
              disabled={selectedRecipientIds.size === 0}
              className={`flex items-center justify-center gap-2 h-10 px-5 rounded-xl text-white font-bold text-sm transition-all active:scale-95 ${selectedRecipientIds.size > 0 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-300 cursor-not-allowed'}`}
            >
              <span className="material-symbols-outlined text-[20px]">toggle_on</span>
              批量启用 ({selectedRecipientIds.size})
            </button>
            <button
              onClick={() => handleBulkAction(false)} // false for disable
              disabled={selectedRecipientIds.size === 0}
              className={`flex items-center justify-center gap-2 h-10 px-5 rounded-xl text-white font-bold text-sm transition-all active:scale-95 ${selectedRecipientIds.size > 0 ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-300 cursor-not-allowed'}`}
            >
              <span className="material-symbols-outlined text-[20px]">toggle_off</span>
              批量停用 ({selectedRecipientIds.size})
            </button>

            {/* Pagination Controls (Top) - now on the bottom row, pushed to right */}
            <div className="flex items-center gap-4 ml-auto">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600"
              >
                上一页
              </button>
              <span className="text-sm font-bold text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600"
              >
                下一页
              </button>
              {/* Items per page select */}
              <select 
                value={itemsPerPage} 
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="ml-4 h-10 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value={10}>10 条/页</option>
                <option value={20}>20 条/页</option>
                <option value={50}>50 条/页</option>
                <option value={100}>100 条/页</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-red-100 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="py-3 px-6"> {/* Checkbox Header */}
                      <input 
                        type="checkbox" 
                        className="rounded text-primary focus:ring-primary/50 border-slate-300" 
                        onChange={handleSelectAll} 
                        checked={isAllCurrentPageSelected} 
                        disabled={currentItems.length === 0}
                      />
                    </th>
                    <th className="py-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">序号</th> {/* Serial Number Header */}
                    <th className="py-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">姓名 (Recipient)</th>
                    <th className="py-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">证书编号</th>
                    <th className="py-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">证书模板</th>
                    <th className="py-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">奖项名称</th>
                    <th className="py-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">获奖名次</th>
                    <th className="py-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">颁发日期</th>
                    <th className="py-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">证书状态</th>
                    <th className="py-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">启用状态</th>
                    <th className="py-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentItems.map((r, index) => (
                    <tr 
                      key={r.id} 
                      className={`group hover:bg-red-50/30 transition-colors cursor-pointer ${selectedRecipientIds.has(r.id) ? 'bg-red-50/50' : ''}`}
                      onClick={() => handleSelectOne(r.id, !selectedRecipientIds.has(r.id))}
                    >
                      <td className="py-3 px-6"> {/* Checkbox Cell */}
                        <input 
                          type="checkbox" 
                          className="rounded text-primary focus:ring-primary/50 border-slate-300" 
                          checked={selectedRecipientIds.has(r.id)} 
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectOne(r.id, e.target.checked);
                          }}
                        />
                      </td>
                      <td className="py-3 px-3 text-sm text-slate-500 font-mono">{ (currentPage - 1) * itemsPerPage + index + 1 }</td> {/* Serial Number Cell */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{r.name}</span>
                          <span className="text-xs text-slate-500 mt-0.5">{maskPhoneNumber(r.phone)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate-500 font-mono">{r.certNumber}</td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-mono text-slate-500">{r.templateCode || 'N/A'}</span>
                          <span className="text-sm text-slate-700 font-medium">{getTemplateName(r.templateCode)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate-900 font-medium">{r.awardTitle}</td>
                      <td className="py-3 px-3 text-sm text-primary font-black">{r.awardRank}</td>
                      <td className="py-3 px-3 text-sm text-slate-400">{r.date}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${r.status === CertificateStatus.GENERATED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          <div className={`size-1.5 rounded-full ${r.status === CertificateStatus.GENERATED ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleEnabled(r.id); }}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors ${r.isEnabled ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'}`}
                          title={r.isEnabled ? '点击停用' : '点击启用'}
                        >
                          <span className="material-symbols-outlined text-[14px]">{r.isEnabled ? 'toggle_on' : 'toggle_off'}</span>
                          {r.isEnabled ? '启用' : '停用'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button className="size-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" onClick={() => onNavigate('public-result', r)} title="预览证书"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                          <button className="size-8 flex items-center justify-center text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all" onClick={() => onNavigate('admin-recipient-config', r)} title="调整证书布局"><span className="material-symbols-outlined text-[18px]">tune</span></button>
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

          {/* Pagination Controls (Bottom) - kept for redundancy/mobile */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600"
            >
              上一页
            </button>
            <span className="text-sm font-bold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600"
            >
              下一页
            </button>
          </div>
        </div>
      </main>

      {/* Import Excel Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseImportModal}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-slate-900 px-8 py-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
                <h3 className="text-xl font-black tracking-tight">批量导入数据</h3>
              </div>
              <button onClick={handleCloseImportModal} className="hover:rotate-90 transition-transform p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-8">
              {/* Step 1: Upload File */}
              {importStep === 'upload' && (
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
                      <p>请确保表头包含：姓名、手机号、奖项名称、<span className="font-black text-amber-900">模板代码 (TEMPLATE_CODE)</span> 等关键列。您可以 <a href="#" className="underline font-black" onClick={(e) => e.preventDefault()}>下载模板文件</a> 进行填写。</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Processing */}
              {importStep === 'processing' && (
                <div className="py-10 flex flex-col items-center justify-center text-center gap-4 animate-scale-in">
                  <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 animate-spin">
                    <span className="material-symbols-outlined text-6xl">sync</span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">正在处理文件...</h4>
                  <p className="text-slate-500">正在校验数据，请稍候。</p>
                </div>
              )}

              {/* Step 3: Validation Summary */}
              {importStep === 'validation-summary' && validationResults && (
                <div className="space-y-6">
                   <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="material-symbols-outlined text-primary text-4xl">description</span>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-black text-slate-800 truncate">{selectedFile?.name}</p>
                        <p className="text-xs text-slate-400">
                          已识别出 <span className="font-bold text-slate-700">{validationResults.total}</span> 条记录。
                        </p>
                      </div>
                      <button onClick={() => setImportStep('upload')} className="text-xs font-black text-primary hover:underline">重新上传</button>
                   </div>
                   
                   <div className="space-y-3">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">数据校验结果</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-bold border border-emerald-100">
                          <span className="block text-xl font-black">{validationResults.valid}</span>
                          <span className="block">有效记录</span>
                        </div>
                        {validationResults.invalid > 0 && (
                          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-bold border border-red-100">
                            <span className="block text-xl font-black">{validationResults.invalid}</span>
                            <span className="block">无效记录</span>
                          </div>
                        )}
                      </div>

                      {validationResults.errors.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar border p-3 rounded-xl border-red-100 bg-red-50">
                            <p className="text-xs font-black text-red-700 uppercase tracking-wide mb-2">详细错误</p>
                            {validationResults.errors.map((err, index) => (
                                <div key={index} className="flex items-start gap-2 text-red-800 rounded-lg text-xs">
                                    <span className="material-symbols-outlined text-sm text-red-500 mt-0.5 shrink-0">error</span>
                                    <span>
                                        {err.row !== 0 && err.row !== 'header' && `行 ${err.row}: `}
                                        {err.column && `字段 '${err.column}': `}
                                        {err.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                      )}
                   </div>

                   <div className="flex items-center gap-4">
                      <button 
                        onClick={handleCloseImportModal}
                        className="flex-1 h-12 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        取消
                      </button>
                      <button 
                        onClick={handleConfirmValidImport}
                        disabled={validationResults.valid === 0}
                        className={`flex-[2] h-12 rounded-xl font-bold text-white shadow-lg shadow-red-500/20 active:scale-95 transition-all ${validationResults.valid > 0 ? 'bg-primary hover:bg-primary-dark' : 'bg-slate-300 cursor-not-allowed'}`}
                      >
                        确认导入 {validationResults.valid} 条有效记录
                      </button>
                   </div>
                </div>
              )}

              {/* Step 4: Importing */}
              {importStep === 'importing' && (
                <div className="py-10 flex flex-col items-center justify-center text-center gap-4 animate-scale-in">
                  <div className="size-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2 animate-pulse">
                    <span className="material-symbols-outlined text-6xl">data_object</span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">正在导入数据...</h4>
                  <p className="text-slate-500">请勿关闭窗口，导入完成后将自动关闭。</p>
                </div>
              )}

              {/* Step 5: Success */}
              {importStep === 'success' && (
                <div className="py-10 flex flex-col items-center justify-center text-center gap-4 animate-scale-in">
                   <div className="size-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                      <span className="material-symbols-outlined text-6xl">done_all</span>
                   </div>
                   <h4 className="text-2xl font-black text-slate-900">导入成功</h4>
                   <p className="text-slate-500">数据已成功同步至管理后台，正在关闭...</p>
                </div>
              )}

              {/* Step 6: Failure */}
              {importStep === 'failure' && validationResults && (
                <div className="py-10 flex flex-col items-center justify-center text-center gap-4 animate-scale-in">
                   <div className="size-24 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                      <span className="material-symbols-outlined text-6xl">error</span>
                   </div>
                   <h4 className="text-2xl font-black text-slate-900">导入失败</h4>
                   <p className="text-slate-500 mb-4">数据导入过程中发生错误，请检查以下详情或重试。</p>
                   {validationResults.errors.length > 0 && (
                     <div className="space-y-2 max-h-32 overflow-y-auto pr-2 no-scrollbar border p-3 rounded-xl border-red-100 bg-red-50 w-full text-left">
                         {validationResults.errors.map((err, index) => (
                             <div key={index} className="flex items-start gap-2 text-red-800 rounded-lg text-xs">
                                 <span className="material-symbols-outlined text-sm text-red-500 mt-0.5 shrink-0">error</span>
                                 <span>
                                     {err.row !== 0 && err.row !== 'header' && `行 ${err.row}: `}
                                     {err.column && `字段 '${err.column}': `}
                                     {err.message}
                                 </span>
                             </div>
                         ))}
                     </div>
                   )}
                   <div className="flex items-center gap-4 mt-6 w-full">
                      <button 
                        onClick={() => setImportStep('upload')}
                        className="flex-1 h-12 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        重新上传
                      </button>
                      <button 
                        onClick={handleCloseImportModal}
                        className="flex-1 h-12 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                      >
                        关闭
                      </button>
                   </div>
                </div>
              )}
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

export default CertificateInfo;