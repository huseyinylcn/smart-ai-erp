import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ClipboardList, Plus, Save, 
  Trash2, Info, Building2, Package, Search,
  ChevronDown, AlertCircle, Loader2
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

const PriceAgreementCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('contractId') || '';
  const isEdit = !!id;
  
  const [currentStatus] = useState<DocumentStatus>('DRAFT');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    agreementNo: `QRP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    vendor: '',
    contractId: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [activeContracts, setActiveContracts] = useState<string[]>([]);

  const vendors = [
    { id: 'V-001', name: 'Metal Sənaye (Bakı) MMC', contracts: ['CONT-2024-001', 'CONT-2024-088'] },
    { id: 'V-002', name: 'Tekstil Dünyası Group', contracts: ['CONT-2024-005'] },
    { id: 'V-003', name: 'Kimya və Boya Logistika', contracts: ['CONT-2024-012', 'CONT-2024-099'] },
    { id: 'V-004', name: 'Supplier Group MMC', contracts: ['CONT-SIM-01'] },
  ];

  const [items, setItems] = useState([
    { id: 1, name: 'Ofis kreslosu', unit: 'ədəd', price: 120, quantity: 100 },
    { id: 2, name: 'Metal masa', unit: 'ədəd', price: 250, quantity: 50 },
  ]);

  useEffect(() => {
    if (isEdit) {
      // Mock fetch
      setFormData({
        agreementNo: id || '',
        vendor: 'Metal Sənaye (Bakı) MMC',
        contractId: 'CONT-SIM-01',
        date: '2024-09-20',
        description: 'Oktyabr ayı üçün qiymət razılaşması'
      });
      setItems([
        { id: 1, name: 'Profil 40x40', unit: 'metr', price: 4.5, quantity: 500 },
        { id: 2, name: 'Boya (Qara)', unit: 'kq', price: 12, quantity: 100 },
      ]);
    }
  }, [isEdit, id]);

  const handleVendorChange = (vendorName: string) => {
    const vendor = vendors.find(v => v.name === vendorName);
    setFormData({ ...formData, vendor: vendorName, contractId: '' });
    setActiveContracts(vendor ? vendor.contracts : []);
  };

  const addRow = () => {
    setItems([...items, { id: Date.now(), name: '', unit: 'ədəd', price: 0, quantity: 0 }]);
  };

  const removeRow = (id: number) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-900 dark:text-slate-100 italic-none">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-primary-100 dark:border-primary-900/30 -mx-8 px-8 py-4 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-primary-50 transition-all text-slate-400 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center italic">
                    <ClipboardList className="w-6 h-6 mr-2 text-amber-500 shadow-sm" /> {isEdit ? 'QRP Redaktə Et' : 'Yeni Qiymət Razılaşma Protokolu (QRP)'}
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic tracking-tighter">
                   PROTOKOL: {formData.agreementNo}
                </p>
            </div>
          </div>

          <button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2 px-8 py-2.5 bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 active:scale-95 shadow-sm">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin shadow-sm" /> : <Save className="w-4 h-4 mr-2 shadow-sm" />}
              <span>{isEdit ? 'Yenilə' : 'Təsdiqlə və Yadda Saxla'}</span>
          </button>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* CORE INFO */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic mb-4 shadow-sm">
                    <Info className="w-4 h-4 mr-2 shadow-sm" /> Protokolun Əsas Məlumatları
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 shadow-sm">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-sm shadow-sm">Kontragent (Təchizatçı)</label>
                        <select 
                          value={formData.vendor}
                          onChange={(e) => handleVendorChange(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none"
                        >
                            <option value="">Seçin...</option>
                            {vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-4 shadow-sm">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-sm">Bağlı Müqavilə</label>
                        <select 
                          disabled={!formData.vendor}
                          value={formData.contractId}
                          onChange={(e) => setFormData({...formData, contractId: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none disabled:opacity-50"
                        >
                            <option value="">Müqavilə seçin...</option>
                            {activeContracts.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-4 shadow-sm shadow-sm">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1 shadow-sm">Protokol Tarixi</label>
                        <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner outline-none" />
                    </div>
                </div>
            </div>

            {/* ITEMS SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-8 shadow-sm">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic shadow-sm">
                        <Package className="w-4 h-4 mr-2 text-indigo-500" /> Məhsul və Qiymət Siyahısı
                    </h3>
                    <button onClick={addRow} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-primary-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary-50 active:scale-95 transition-all shadow-sm">
                        <Plus className="w-3.5 h-3.5 mr-2 inline shadow-sm" /> Məhsul Əlavə Et
                    </button>
                </div>
                
                <div className="overflow-hidden border border-slate-50 dark:border-slate-800 rounded-3xl">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic shadow-sm">Məhsul Adı</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic shadow-sm text-center">Vahid</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic text-right shadow-sm">Qiymət (₼)</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic text-right shadow-sm">Maks. Miqdar</th>
                                <th className="px-6 py-4 w-10 shadow-sm"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-primary-50/20 transition-colors">
                                    <td className="px-6 py-4">
                                       <div className="relative group">
                                          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                          <input type="text" defaultValue={item.name} className="w-full bg-transparent border-none p-0 text-xs font-black italic outline-none text-slate-700 dark:text-slate-200 group-hover:pl-6 transition-all" placeholder="Axtar və ya yaz..." />
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                       <input type="text" defaultValue={item.unit} className="w-16 bg-transparent border-none p-0 text-xs font-black italic outline-none text-slate-400 text-center" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                       <input type="number" defaultValue={item.price} className="w-24 bg-transparent border-none p-0 text-xs font-black italic text-right outline-none text-primary-600 tabular-nums" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                       <input type="number" defaultValue={item.quantity} className="w-24 bg-transparent border-none p-0 text-xs font-black italic text-right outline-none text-slate-700 dark:text-slate-200 tabular-nums" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => removeRow(item.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-all">
                                            <Trash2 className="w-4 h-4 shadow-sm" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-sm">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-black italic uppercase text-amber-800">Vacib Qeyd</span>
                </div>
                <p className="text-[11px] text-amber-700 font-bold leading-relaxed italic uppercase border-l-2 border-amber-300 pl-4">
                   Bu protokol təsdiqləndikdən sonra Satınalma Sifarişləri (PO) üçün əsas qiymət mənbəyi olacaqdır. Müddət ərzində qiymətlər bu limitlər daxilində tənzimlənəcək.
                </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4">Əlavə Təsvir</h3>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl p-6 text-xs font-black italic shadow-inner outline-none min-h-[150px] resize-none"
                  placeholder="Protokol haqqında xüsusi qeydlər..."
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAgreementCreate;
