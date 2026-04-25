import { X, QrCode, Scan } from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'qr' | 'barcode';
}

const ScannerModal = ({ isOpen, onClose, type }: ScannerModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                {type === 'qr' ? <QrCode className="w-5 h-5" /> : <Scan className="w-5 h-5" />}
             </div>
             <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">
                {type === 'qr' ? 'QR Code Skaner' : 'Barcode Skaner'}
             </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-10 flex flex-col items-center text-center">
           <div className="w-64 h-64 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden group">
              {/* Mock Scanning Animation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent h-20 -top-full group-hover:top-full transition-all duration-[2s] infinite-scan shadow-[0_0_20px_rgba(99,102,241,0.3)]"></div>
              
              <div className="w-full h-full flex items-center justify-center">
                 <div className="w-48 h-48 border-2 border-slate-300 dark:border-slate-600 rounded-3xl opacity-50"></div>
              </div>

              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_#6366f1] animate-pulse"></div>
           </div>

           <p className="mt-8 text-slate-500 dark:text-slate-400 font-medium max-w-xs">
              Məhsulu və ya kodu kameraya yaxınlaşdırın. Skaner avtomatik olaraq kodu tanıyacaqdır.
           </p>

           <div className="mt-8 grid grid-cols-2 gap-3 w-full">
              <button className="py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-100 dark:border-slate-700">Kamera Seç</button>
              <button className="py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/30">Əl ilə daxil et</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerModal;
