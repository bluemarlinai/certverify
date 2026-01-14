
import React, { useState, useEffect } from 'react';
import CertificateInfo from './pages/Admin/CertificateInfo';
import TemplateManagement from './pages/Admin/TemplateManagement';
import TemplateConfig from './pages/Admin/TemplateConfig';
import CertificateQuery from './pages/Public/CertificateQuery';
import CertificateResult from './pages/Public/CertificateResult';
// Add import for Placeholder
import { Recipient, Template, Placeholder } from './types';
import { INITIAL_TEMPLATES, INITIAL_RECIPIENTS } from './data/mockData'; // 导入 mock 模板和学员数据

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('admin-certs');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedRecipientForConfig, setSelectedRecipientForConfig] = useState<Recipient | null>(null); // 新增状态：用于个人证书配置

  // 模拟全局的学员数据状态 (从 CertificateInfo 提升到 App)
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  // 全局的模板数据状态 (从 TemplateManagement 提升到 App)
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);

  // Simple Hash Router Simulation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash.startsWith('query')) {
          setCurrentPage('public-query');
        } else if (hash.startsWith('result')) {
          setCurrentPage('public-result');
        } else if (hash.startsWith('admin-config')) { // 处理 admin-config 页面 (模板配置或个人配置)
          const parts = hash.split('/');
          if (parts.length > 2 && parts[1] === 'recipient') { // admin-config/recipient/{recipientId}
            const recipientId = parts[2];
            const recipient = recipients.find(r => r.id === recipientId);
            if (recipient && recipient.templateCode) {
              const template = templates.find(t => t.code === recipient.templateCode); // Use global templates
              setSelectedRecipientForConfig(recipient);
              setSelectedTemplateId(template?.id || null); // 确保传递模板ID
              setCurrentPage('admin-config');
            } else {
              // 处理找不到学员或模板代码的情况
              setSelectedRecipientForConfig(null);
              setSelectedTemplateId(null);
              setCurrentPage('admin-certs'); // 返回主页或错误页
            }
          } else if (parts.length > 1) { // admin-config/{templateId} (全局模板配置)
            setSelectedTemplateId(parts[1]); // 从 URL 中获取 template ID
            setSelectedRecipientForConfig(null); // 清除个人配置状态
            setCurrentPage('admin-config');
          } else {
            setSelectedTemplateId(null);
            setSelectedRecipientForConfig(null);
            setCurrentPage('admin-certs'); // 默认页
          }
        } 
        else {
          setSelectedTemplateId(null);
          setSelectedRecipientForConfig(null);
          setCurrentPage(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [recipients, templates]); // 依赖 recipients 和 templates，以便在学员数据或模板数据变化时能正确查找

  // 用于 TemplateConfig 保存个人配置时回调更新 App 状态
  const updateRecipientPlaceholderOverrides = (recipientId: string, newOverrides: { [key: string]: Partial<Omit<Placeholder, 'id' | 'key' | 'label'>> }) => {
    setRecipients(prevRecipients => 
      prevRecipients.map(r => 
        r.id === recipientId 
          ? { ...r, placeholderOverrides: newOverrides } 
          : r
      )
    );
  };

  const navigateTo = (page: string, data?: any) => {
    if (page === 'public-result') {
      setSelectedRecipient(data);
      setSelectedTemplateId(null);
      setSelectedRecipientForConfig(null);
      window.location.hash = page;
    } else if (page === 'admin-config') { // 全局模板配置
      setSelectedTemplateId(data); // data 此时是 templateId
      setSelectedRecipientForConfig(null);
      window.location.hash = `${page}/${data}`;
    } else if (page === 'admin-recipient-config') { // 个人证书调整
      const recipient: Recipient = data; // data 此时是 Recipient 对象
      if (recipient && recipient.templateCode) {
        const template = templates.find(t => t.code === recipient.templateCode); // Use global templates
        setSelectedRecipientForConfig(recipient);
        setSelectedTemplateId(template?.id || null); // 确保传递模板ID
        window.location.hash = `admin-config/recipient/${recipient.id}`; // 更新 URL hash
      } else {
        alert('无法进行个人证书调整，缺少模板信息。');
        window.location.hash = 'admin-certs';
      }
    } else {
      setSelectedTemplateId(null); // 清除选中的模板 ID
      setSelectedRecipientForConfig(null); // 清除选中的学员配置
      window.location.hash = page;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'admin-certs':
        return <CertificateInfo onNavigate={navigateTo} recipients={recipients} setRecipients={setRecipients} templates={templates} />;
      case 'admin-templates':
        return <TemplateManagement onNavigate={navigateTo} templates={templates} setTemplates={setTemplates} />;
      case 'admin-config':
        return <TemplateConfig 
                  onNavigate={navigateTo} 
                  selectedTemplateId={selectedTemplateId} 
                  templates={templates} 
                  recipientToConfig={selectedRecipientForConfig}
                  updateRecipientPlaceholderOverrides={updateRecipientPlaceholderOverrides}
                />;
      case 'public-query':
        return <CertificateQuery onNavigate={navigateTo} templates={templates} />;
      case 'public-result':
        // 查找对应的模板以获取背景图等信息
        const resultRecipientTemplate = selectedRecipient?.templateCode 
          ? templates.find(t => t.code === selectedRecipient.templateCode) // Use global templates
          : null;
        return <CertificateResult recipient={selectedRecipient} onNavigate={navigateTo} template={resultRecipientTemplate} />;
      default:
        return <CertificateInfo onNavigate={navigateTo} recipients={recipients} setRecipients={setRecipients} templates={templates} />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background-light">
      {renderPage()}
    </div>
  );
};

export default App;
