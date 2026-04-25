
import React, { useState, useEffect } from 'react';
import { 
  FileSignature, 
  ClipboardList, 
  ShoppingCart, 
  FileCheck, 
  ChevronRight, 
  Play, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  desc: string;
  icon: any;
  actionLabel: string;
  status: 'PENDING' | 'DONE' | 'ACTIVE';
}

const SimulationWizard = ({ onCompleteStep }: { onCompleteStep?: (stepId: number) => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: 'Müqavilələr', desc: 'Təchizatçılarla hüquqi müqavilələrin hazırlanması', icon: FileSignature, actionLabel: 'Müqavilələri Yarat', status: 'ACTIVE' },
    { id: 2, title: 'QRP (Protokol)', desc: 'Qiymət razılaşma protokollarının təsdiqi', icon: ClipboardList, actionLabel: 'QRP-ləri Təsdiqlə', status: 'PENDING' },
    { id: 3, title: 'Satınalma Sifarişi', desc: 'BOM tələbatına uyğun sifarişlərin verilməsi', icon: ShoppingCart, actionLabel: 'Sifarişləri Yarad', status: 'PENDING' },
    { id: 4, title: 'Alış Qaiməsi', desc: 'Malların mədaxili və fakturalaşdırılması', icon: FileCheck, actionLabel: 'Alışı Tamamla', status: 'PENDING' },
  ]);

  useEffect(() => {
    // Sync status with currentStep
    setSteps(prev => prev.map(s => {
      if (s.id < currentStep) return { ...s, status: 'DONE' };
      if (s.id === currentStep) return { ...s, status: 'ACTIVE' };
      return { ...s, status: 'PENDING' };
    }));
  }, [currentStep]);

  const runStep = (id: number) => {
    if (id !== currentStep) return;

    // Simulate work
    setTimeout(() => {
      if (id === 1) {
        const scenarioContracts = [
          { id: 'CONT-SIM-01', partner: 'Metal Sənaye (Bakı) MMC', type: 'ALIBAL (Mallar)', date: '2024-09-15', expiryDate: '2025-09-15', amount: 45600, status: 'ACTIVE', qrp: false },
          { id: 'CONT-SIM-02', partner: 'Tekstil Dünyası Group', type: 'ALIBAL (Mallar)', date: '2024-09-16', expiryDate: '2025-09-16', amount: 12450, status: 'ACTIVE', qrp: false },
          { id: 'CONT-SIM-03', partner: 'Kimya və Boya Logistika', type: 'ALIBAL (Mallar)', date: '2024-09-17', expiryDate: '2025-09-17', amount: 8900, status: 'ACTIVE', qrp: false },
        ];
        localStorage.setItem('TENGRY_CONTRACTS_SIM', JSON.stringify(scenarioContracts));
        // Merge into main contracts
        const existing = JSON.parse(localStorage.getItem('TENGRY_CONTRACTS') || '[]');
        const merged = [...existing];
        scenarioContracts.forEach(c => { if(!merged.find(x => x.id === c.id)) merged.push(c); });
        localStorage.setItem('TENGRY_CONTRACTS', JSON.stringify(merged));
      }

      if (id === 2) {
        const scenarioQRPs = [
          { id: 'QRP-SIM-01', contractId: 'CONT-SIM-01', partner: 'Metal Sənaye (Bakı) MMC', itemCount: 15, date: '2024-09-20', status: 'ACTIVE', totalEstimated: 45600 },
          { id: 'QRP-SIM-02', contractId: 'CONT-SIM-02', partner: 'Tekstil Dünyası Group', itemCount: 8, date: '2024-09-21', status: 'ACTIVE', totalEstimated: 12450 },
          { id: 'QRP-SIM-03', contractId: 'CONT-SIM-03', partner: 'Kimya və Boya Logistika', itemCount: 10, date: '2024-09-22', status: 'ACTIVE', totalEstimated: 8900 },
        ];
        const existing = JSON.parse(localStorage.getItem('TENGRY_QRP') || '[]');
        const merged = [...existing];
        scenarioQRPs.forEach(q => { if(!merged.find(x => x.id === q.id)) merged.push(q); });
        localStorage.setItem('TENGRY_QRP', JSON.stringify(merged));
        
        // Also update contracts to show QRP indicator
        const contracts = JSON.parse(localStorage.getItem('TENGRY_CONTRACTS') || '[]');
        const updatedContracts = contracts.map((c: any) => c.id.startsWith('CONT-SIM-') ? { ...c, qrp: true } : c);
        localStorage.setItem('TENGRY_CONTRACTS', JSON.stringify(updatedContracts));
      }

      if (id === 3) {
        const scenarioOrders = [
          { id: 'PO-SIM-01', vendor: 'Metal Sənaye (Bakı) MMC', date: '2024-09-25', total: 45600, status: 'ORDERED' },
          { id: 'PO-SIM-02', vendor: 'Tekstil Dünyası Group', date: '2024-09-26', total: 12450, status: 'ORDERED' },
        ];
        localStorage.setItem('TENGRY_PURCHASE_ORDERS', JSON.stringify(scenarioOrders));
      }

      if (id === 4) {
        const scenarioInvoices = [
          { id: 'SIM_I_01', number: 'PINV-2024-10-01', vendor: 'Metal Sənaye (Bakı) MMC', date: '2024-10-01', total: 45600, status: 'COMPLETED', ref: 'PO-SIM-01', eInvNo: 'E-TAX-1001', eInvDate: '2024-10-01' },
          { id: 'SIM_I_02', number: 'PINV-2024-10-02', vendor: 'Tekstil Dünyası Group', date: '2024-10-02', total: 12450, status: 'COMPLETED', ref: 'PO-SIM-02', eInvNo: '', eInvDate: '' },
        ];
        localStorage.setItem('TENGRY_PURCHASE_INVOICES', JSON.stringify(scenarioInvoices));
        
        const scenarioReceipts = scenarioInvoices.map(inv => ({
          id: `SIM_R_${inv.id}`,
          number: `GRN-${inv.number.split('PINV-')[1]}`,
          vendor: inv.vendor,
          date: inv.date,
          warehouse: 'Əsas Anbar',
          status: 'COMPLETED',
          invoiceStatus: 'INVOICED'
        }));
        localStorage.setItem('TENGRY_PURCHASE_RECEIPTS', JSON.stringify(scenarioReceipts));
      }

      if (onCompleteStep) onCompleteStep(id);
      setCurrentStep(prev => prev + 1);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-white/5 overflow-hidden relative group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center">
              <Play className="w-5 h-5 mr-3 text-indigo-400 fill-indigo-400" /> Satınalma Simulyasiyası (İş axımı)
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">Sistemin ardıcıl işləməsini addım-addım izləyin</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
             <Clock className="w-3.5 h-3.5 text-indigo-400" />
             <span className="text-[10px] font-black text-slate-300 uppercase italic tabular-nums">Oktyabr 2024 Dövrü</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div 
              key={step.id}
              className={`relative p-6 rounded-3xl border transition-all duration-500 ${
                step.status === 'ACTIVE' ? 'bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-500/30 scale-105 z-20' : 
                step.status === 'DONE' ? 'bg-emerald-500/10 border-emerald-500/20 opacity-80' : 
                'bg-white/5 border-white/10 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  step.status === 'ACTIVE' ? 'bg-white text-indigo-600 shadow-lg' : 
                  step.status === 'DONE' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'
                }`}>
                  {step.status === 'DONE' ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-black uppercase italic ${step.status === 'ACTIVE' ? 'text-indigo-200' : 'text-slate-500'}`}>Addım {step.id}</span>
              </div>
              
              <h4 className={`text-xs font-black uppercase italic mb-2 ${step.status === 'ACTIVE' ? 'text-white' : 'text-slate-300'}`}>{step.title}</h4>
              <p className={`text-[9px] font-bold leading-relaxed mb-6 uppercase italic ${step.status === 'ACTIVE' ? 'text-indigo-100' : 'text-slate-500'}`}>{step.desc}</p>
              
              {step.status === 'ACTIVE' ? (
                <button 
                  onClick={() => runStep(step.id)}
                  className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-lg"
                >
                  {step.actionLabel}
                </button>
              ) : step.status === 'DONE' ? (
                <div className="flex items-center justify-center text-emerald-400 font-black text-[9px] uppercase italic">
                   <CheckCircle2 className="w-3 h-3 mr-2" /> Tamamlandı
                </div>
              ) : null}

              {/* Connector line */}
              {idx < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 translate-x-1/2 -translate-y-1/2 z-10 text-slate-700">
                  <ChevronRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimulationWizard;
