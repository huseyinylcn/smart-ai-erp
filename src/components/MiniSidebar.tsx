import { ShoppingCart, QrCode, Scan, MessageSquare, LogOut, Settings } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ScannerModal from './ScannerModal';

const MiniSidebar = () => {
  const { activeCompany, companies, setActiveCompany } = useCompany();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState<{ open: boolean, type: 'qr' | 'barcode' }>({ open: false, type: 'qr' });

  return (
    <div className="w-[70px] bg-[#1a1c1e] dark:bg-slate-950 flex flex-col items-center py-6 shrink-0 relative z-[60] shadow-[4px_0_24px_rgba(0,0,0,0.15)] select-none">
      
      {/* SmartAgent Loqo Section */}
      <div className="mb-8">
        <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[14px] flex items-center justify-center text-white font-black text-xs shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
          SA
        </div>
      </div>

      {/* Company Switcher (DreamsPOS style) */}
      <div className="flex flex-col space-y-3 mb-8 w-full items-center">
        {companies.map((company) => (
          <button
            key={company.id}
            onClick={() => setActiveCompany(company)}
            title={company.name}
            className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-[13px] font-black transition-all relative group ${
              activeCompany?.id === company.id 
                ? 'bg-white text-indigo-700 shadow-[0_0_15px_rgba(255,255,255,0.2)] ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#1a1c1e]' 
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
             {company.logo || (company.code?.substring(0, 2) || '??')}
            {/* Tooltip */}
            <span className="absolute left-14 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {company.name}
            </span>
          </button>
        ))}
      </div>

      <div className="w-8 h-[1px] bg-slate-800 mb-6"></div>

      {/* Applications / Tools */}
      <div className="flex flex-col space-y-5 items-center">
        {/* POS */}
        <NavLink
            to="/pos"
            className={({ isActive }) => 
                `w-11 h-11 rounded-[14px] flex items-center justify-center transition-all group ${
                isActive 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-slate-800/30 text-slate-400 hover:bg-indigo-600/20 hover:text-indigo-400'
                }`
            }
            title="Sürətli POS Satış"
            >
            <ShoppingCart className="w-[22px] h-[22px]" />
        </NavLink>

        {/* Barcode */}
        <button 
           onClick={() => setShowScanner({ open: true, type: 'barcode' })}
           className="w-10 h-10 rounded-xl bg-slate-800/30 text-slate-500 hover:bg-indigo-600/20 hover:text-indigo-400 flex items-center justify-center transition-all"
           title="Barcode Skaner"
        >
           <Scan className="w-5 h-5" />
        </button>

        {/* QR Code */}
        <button 
           onClick={() => setShowScanner({ open: true, type: 'qr' })}
           className="w-10 h-10 rounded-xl bg-slate-800/30 text-slate-500 hover:bg-indigo-600/20 hover:text-indigo-400 flex items-center justify-center transition-all"
           title="QR Kod Skaner"
        >
           <QrCode className="w-5 h-5" />
        </button>

        {/* Chat */}
        <button 
           className="w-10 h-10 rounded-xl bg-slate-800/30 text-slate-500 hover:bg-indigo-600/20 hover:text-indigo-400 flex items-center justify-center transition-all"
           title="Müştəri Dəstəyi (Chat)"
        >
           <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      <ScannerModal 
        isOpen={showScanner.open} 
        onClose={() => setShowScanner({ open: false, type: 'qr' })} 
        type={showScanner.type} 
      />
    </div>
  );
};

export default MiniSidebar;
