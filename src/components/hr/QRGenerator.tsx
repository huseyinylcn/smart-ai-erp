import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Info, QrCode, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QRGeneratorProps {
  companyId: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ companyId }) => {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState<'ENTRY' | 'EXIT'>('ENTRY');

  const qrData = JSON.stringify({
    type: activeType,
    companyId: companyId,
    timestamp: new Date().toISOString()
  });

  const qrColor = activeType === 'ENTRY' ? '#064E3B' : '#7F1D1D';
  const qrLabel = activeType === 'ENTRY' ? 'GİRİŞ QR KODU' : 'ÇIXIŞ QR KODU';

  const downloadQR = () => {
    const svg = document.getElementById('attendance-qr');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 100;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        ctx.fillStyle = qrColor;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(qrLabel, canvas.width / 2, canvas.height - 40);
        ctx.font = '14px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText(`Company: ${companyId}`, canvas.width / 2, canvas.height - 15);
        
        const link = document.createElement('a');
        link.download = `QR_${activeType}_${companyId}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 rounded-2xl ${activeType === 'ENTRY' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} transition-colors`}>
           <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-[18px] font-black text-slate-800 uppercase italic">QR Generator</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Attendance System</p>
        </div>
      </div>

      <div className="flex p-1 bg-slate-50 rounded-2xl mb-8">
        <button 
          onClick={() => setActiveType('ENTRY')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase italic transition-all ${activeType === 'ENTRY' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Giriş QR
        </button>
        <button 
          onClick={() => setActiveType('EXIT')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase italic transition-all ${activeType === 'EXIT' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Çıxış QR
        </button>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 mb-8 overflow-hidden">
        <QRCodeSVG 
          id="attendance-qr"
          value={qrData}
          size={240}
          level="H"
          fgColor={qrColor}
          includeMargin={true}
        />
        <p className={`mt-6 text-[12px] font-black uppercase italic tracking-widest ${activeType === 'ENTRY' ? 'text-emerald-700' : 'text-rose-700'}`}>
          {qrLabel}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={downloadQR}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200"
        >
          <Download className="w-4 h-4" />
          Yadda Saxla (PNG)
        </button>

        <button 
          onClick={() => navigate('/hr/attendance-portal')}
          className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200"
        >
          <Smartphone className="w-4 h-4" />
          Bu cihazda davamiyyəti qeydə al
        </button>
        
        <div className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50">
           <Info className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
           <p className="text-[10px] font-medium text-indigo-700 leading-relaxed italic">
             Bu QR kodu çap edib giriş/çıxış nöqtələrində yerləşdirin. İşçilər mobil cihazla bu kodu oxudaraq davamiyyəti qeyd edəcəklər.
           </p>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
