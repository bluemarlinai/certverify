
import React, { useState, useEffect } from 'react';
import CertificateInfo from './pages/Admin/CertificateInfo';
import TemplateManagement from './pages/Admin/TemplateManagement';
import TemplateConfig from './pages/Admin/TemplateConfig';
import CertificateQuery from './pages/Public/CertificateQuery';
import CertificateResult from './pages/Public/CertificateResult';
import { Recipient } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('admin-certs');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);

  // Simple Hash Router Simulation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash.startsWith('query')) {
          setCurrentPage('public-query');
        } else if (hash.startsWith('result')) {
          setCurrentPage('public-result');
        } else {
          setCurrentPage(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string, data?: any) => {
    if (page === 'public-result') {
      setSelectedRecipient(data);
    }
    window.location.hash = page;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'admin-certs':
        return <CertificateInfo onNavigate={navigateTo} />;
      case 'admin-templates':
        return <TemplateManagement onNavigate={navigateTo} />;
      case 'admin-config':
        return <TemplateConfig onNavigate={navigateTo} />;
      case 'public-query':
        return <CertificateQuery onNavigate={navigateTo} />;
      case 'public-result':
        return <CertificateResult recipient={selectedRecipient} onNavigate={navigateTo} />;
      default:
        return <CertificateInfo onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
};

export default App;
