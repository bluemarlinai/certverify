
import React, { useEffect, useRef } from 'react';
import { Recipient } from '../../types';

interface Props {
  recipient: Recipient | null;
  onNavigate: (page: string) => void;
}

const CertificateResult: React.FC<Props> = ({ recipient, onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateDownload = () => {
    if (!recipient || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (A4 ratio at 150 DPI roughly 1240x874)
    canvas.width = 1240;
    canvas.height = 874;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#d32f2f';
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.strokeStyle = '#ffb300';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Text Rendering
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d32f2f';
    ctx.font = 'bold 80px "Noto Serif SC", serif';
    ctx.fillText('荣誉证书', canvas.width / 2, 200);

    ctx.fillStyle = '#64748b';
    ctx.font = '24px "Manrope", sans-serif';
    ctx.fillText('CERTIFICATE OF HONOR', canvas.width / 2, 240);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 48px "Noto Serif SC", serif';
    ctx.fillText(recipient.name, 200, 400);
    
    ctx.font = '32px "Noto Serif SC", serif';
    ctx.fillText(' 先生/女士：', 200 + ctx.measureText(recipient.name).width, 400);

    ctx.fillStyle = '#475569';
    ctx.font = '30px "Noto Serif SC", serif';
    const content = `在2024年度“卓越创新奖”评选活动中表现优异，荣获 ${recipient.award}，特发此证，以资鼓励。`;
    
    // Simple line wrapping
    const words = content.split('');
    let line = '';
    let y = 480;
    for(let n = 0; n < words.length; n++) {
      let testLine = line + words[n];
      let metrics = ctx.measureText(testLine);
      if (metrics.width > 840 && n > 0) {
        ctx.fillText(line, 200, y);
        line = words[n];
        y += 50;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 200, y);

    // Footer
    ctx.textAlign = 'right';
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 36px "Noto Serif SC", serif';
    ctx.fillText('CertVerify 组委会', canvas.width - 200, 700);
    ctx.font = '24px "Noto Serif SC", serif';
    ctx.fillText(recipient.date, canvas.width - 200, 750);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px "JetBrains Mono", monospace';
    ctx.fillText(`ID: ${recipient.certNumber}`, 200, 750);

    // Random filename generation
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const fileName = `CERT_${randomString}.png`;

    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!recipient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-rose-50">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">error</span>
        <p className="text-slate-500 mb-6">未找到相关证书记录</p>
        <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold" onClick={() => onNavigate('public-query')}>返回查询</button>
      </div>
    );
  }

  return (
    <div className="bg-rose-50 min-h-screen flex flex-col font-display selection:bg-primary selection:text-white">
      <canvas ref={canvasRef} className="hidden" />
      <header className="w-full bg-primary shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-center relative">
          <button 
            onClick={() => onNavigate('public-query')}
            className="absolute left-4 text-white/80 hover:text-white flex items-center gap-1"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
            <h1 className="text-lg font-bold tracking-wide">CertVerify 证书下载</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start py-6 px-4 sm:px-6 w-full">
        <div className="w-full max-w-lg md:max-w-2xl flex flex-col gap-6 items-center justify-center animate-fade-in">
          <div className="text-center space-y-1 mb-2">
            <div className="inline-flex items-center justify-center p-2 bg-emerald-100 text-emerald-600 rounded-full mb-2">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">查询成功！</h2>
            <p className="text-slate-500 text-sm">恭喜 {recipient.name}，您可以长按图片保存或直接下载</p>
          </div>

          <div className="w-full bg-white rounded-2xl shadow-soft border border-red-100 overflow-hidden flex flex-col">
            <div className="relative bg-slate-50 w-full flex items-center justify-center p-3 sm:p-6 border-b border-dashed border-red-200">
              <div className="relative w-full shadow-lg rounded-sm overflow-hidden bg-white aspect-[1.414/1] border-[6px] sm:border-[10px] border-double border-primary">
                <div className="absolute inset-0 flex flex-col p-4 sm:p-10 items-center text-center justify-between bg-white dot-grid">
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-gold"></div>
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-gold"></div>
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-gold"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-gold"></div>
                  
                  <div className="w-full flex flex-col items-center z-10">
                    <div className="cert-font text-primary font-black text-2xl sm:text-4xl tracking-widest mb-1">荣誉证书</div>
                    <div className="text-[8px] sm:text-[12px] text-primary/60 uppercase tracking-[0.3em] font-bold">Certificate of Honor</div>
                  </div>

                  <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 sm:gap-6 z-10 max-w-lg">
                    <div className="cert-font text-slate-800 text-lg sm:text-2xl w-full text-left">
                      <span className="font-bold text-2xl sm:text-4xl text-black border-b-2 border-slate-200 pb-1 px-2">{recipient.name}</span> 先生/女士：
                    </div>
                    <div className="cert-font text-slate-600 text-sm sm:text-lg text-justify leading-relaxed indent-10">
                      在2024年度“卓越创新奖”评选活动中表现优异，荣获 <span className="text-primary font-bold">{recipient.award}</span>，特发此证，以资鼓励。
                    </div>
                  </div>

                  <div className="w-full flex justify-between items-end z-10 px-2 sm:px-6 pb-2">
                    <div className="flex flex-col items-start">
                      <div className="size-12 sm:size-20 bg-slate-900 flex items-center justify-center text-white p-1 rounded">
                         <span className="material-symbols-outlined text-4xl sm:text-6xl">qr_code_2</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-2">NO: {recipient.certNumber}</span>
                    </div>
                    <div className="flex flex-col items-center relative">
                      <div className="absolute -top-8 -left-10 sm:-top-12 sm:-left-16 h-20 w-20 sm:h-32 sm:w-32 rounded-full border-4 border-red-600/40 text-red-600/40 flex items-center justify-center opacity-80 rotate-[-15deg]">
                        <div className="border-2 border-dashed border-red-600/40 rounded-full h-[90%] w-[90%] flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl sm:text-6xl">verified</span>
                        </div>
                      </div>
                      <div className="cert-font font-bold text-sm sm:text-xl text-slate-800 relative z-10">CertVerify 组委会</div>
                      <div className="cert-font text-[10px] sm:text-sm text-slate-500 mt-1 relative z-10">{recipient.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white flex flex-col items-center gap-4">
              <button 
                onClick={generateDownload}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-xl shadow-red-500/30 transition-all active:scale-95 group"
              >
                <span className="material-symbols-outlined group-hover:bounce">download</span>
                下载保存到相册
              </button>
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">print</span>打印
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>分享
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg text-xs font-medium">
            <span className="material-symbols-outlined text-[16px]">info</span>
            提示：如无法下载，请长按证书图片并选择“保存图片”
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center border-t border-red-50 bg-white/50 mt-auto">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">© 2024 CertVerify Security Infrastructure</p>
      </footer>
    </div>
  );
};

export default CertificateResult;
