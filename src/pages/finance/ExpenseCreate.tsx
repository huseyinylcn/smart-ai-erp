import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, CheckCircle2, History, AlertTriangle, 
  Save, Info, Landmark, Wallet, DollarSign, FileText, 
  Calendar, User, Link, ShieldCheck, ChevronRight, 
  TrendingUp, CreditCard, Home, Lightbulb, Megaphone, 
  Settings, Wrench, Plus, FilePlus, Copy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';

type ExpenseCategory = 'RENT' | 'UTILITY' | 'MARKETING' | 'REPAIR' | 'BANK' | 'OTHER';

const ExpenseCreate = () => {
  const navigate = useNavigate();
  
  // 1. STATE
  const [category, setCategory] = useState<ExpenseCategory>('OTHER');
  const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
  const [isTemplate, setIsTemplate] = useState(false);
  
  const [formData, setFormData] = useState({
    accountId: '1',
    counterparty: '',
    amount: 0,
    vatStatus: 'Cəlb edilməyən',
    date: new Date().toISOString().split('T')[0],
    memo: '',
    // Category specific fields
    rentContract: '',
    rentObject: '',
    utilityType: 'İşıq',
    meterPrev: 0,
    meterCurrent: 0,
    marketingPlatform: '',
    repairAsset: '',
    bankRef: ''
  });

  const [docNumber] = useState(`EX-${new Date().getFullYear()}-0892`);

  // 2. MOCK DATA
  const categories = [
    { id: 'RENT', label: 'İcarə', icon: Home, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'UTILITY', label: 'Kommunal', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'MARKETING', label: 'Marketinq', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'REPAIR', label: 'Təmir', icon: Wrench, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'BANK', label: 'Bank Xərci', icon: Landmark, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'OTHER', label: 'Digər', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  const utilityProviders = ['Azərişıq', 'Azəristiliktəchizat', 'Azərsu', 'Azəriqaz', 'Delta Telecom'];

  // 3. LOGIC
  const utilityConsumption = useMemo(() => {
    return Math.max(0, formData.meterCurrent - formData.meterPrev);
  }, [formData.meterCurrent, formData.meterPrev]);

  const isEditable = currentStatus === 'DRAFT';

  return (
    <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 dark:text-slate-100">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400 shadow-sm">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center italic">
                        <FilePlus className="w-6 h-6 mr-2 text-primary-500" /> Xərc Sənədi
                    </h1>
                    <span className="px-2.5 py-1 bg-primary-50 text-primary-600 border border-primary-100 rounded-lg text-[9px] font-black uppercase tracking-widest italic leading-none">EXPENSE DOCUMENT</span>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                    <span>№ {docNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center font-black italic"><History className="w-3.5 h-3.5 mr-1 text-primary-500" /> {formData.date}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Copy className="w-4 h-4" /></button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => setCurrentStatus('POSTED')} className="flex items-center space-x-2 px-8 py-2.5 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20 active:scale-95 transition-all italic">
                <Save className="w-4 h-4" />
                <span>Sənədi Saxla</span>
            </button>
          </div>
        </div>
      </div>

      <DocumentStatusProgress currentStatus={currentStatus} />

      {/* 2. CATEGORY SELECTOR */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setCategory(cat.id as ExpenseCategory)}
                className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] transition-all group ${category === cat.id ? 'bg-primary-600 text-white shadow-xl shadow-primary-200' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                  <cat.icon className={`w-6 h-6 mb-2 ${category === cat.id ? 'text-white' : cat.color}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest italic ${category === cat.id ? 'text-white' : 'text-slate-500'}`}>{cat.label}</span>
              </button>
          ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* MAIN FORM */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 space-y-12">
                
                {/* Section 1: General Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <Landmark className="w-3.5 h-3.5 mr-2 text-primary-500" /> Ödəniş Hesabı
                        </label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-primary-500/10 shadow-inner italic uppercase">
                            <option value="1">Mərkəzi Kassa (AZN)</option>
                            <option value="2">ABB - Cari Hesab (AZN)</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <User className="w-3.5 h-3.5 mr-2 text-primary-500" /> Qarşı Tərəf / Təminatçı
                        </label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black outline-none focus:ring-4 focus:ring-primary-500/10 shadow-inner italic uppercase">
                                <option>Axtar və ya seç...</option>
                                {category === 'UTILITY' ? utilityProviders.map(p => <option key={p}>{p}</option>) : <option>Digər Təchizatçılar</option>}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <DollarSign className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Məbləğ
                        </label>
                        <div className="relative group">
                            <input 
                              type="number"
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-lg font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner italic tabular-nums" 
                              placeholder="0.00"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase italic">AZN</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                            <ShieldCheck className="w-3.5 h-3.5 mr-2 text-primary-500" /> ƏDV statusu
                        </label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-primary-500/10 shadow-inner italic uppercase">
                            <option>ƏDV-li</option>
                            <option>ƏDV-dən azad (0%)</option>
                            <option>Cəlb edilməyən</option>
                        </select>
                    </div>
                </div>

                {/* Section 2: Dynamic Category Fields */}
                <div className="pt-10 border-t border-slate-50 dark:border-slate-800">
                    <h3 className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-10 flex items-center italic">
                        {categories.find(c => c.id === category)?.label} Məlumatları
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 animate-in fade-in slide-in-from-top-2 duration-500">
                        {category === 'RENT' && (
                            <>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Müqavilə №</label>
                                    <input placeholder="R-2024-001" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none leading-none" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Obyekt / Ofis</label>
                                    <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none uppercase leading-none">
                                        <option>Mərkəzi Ofis</option>
                                        <option>Anbar (Binə)</option>
                                        <option>Mağaza 1</option>
                                    </select>
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">İcarə Dövrü</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="date" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" />
                                        <input type="date" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none" />
                                    </div>
                                </div>
                            </>
                        )}

                        {category === 'UTILITY' && (
                            <>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Sayğac №</label>
                                    <input placeholder="SN-88212" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none leading-none" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Göstərici Növü</label>
                                    <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none uppercase leading-none">
                                        <option>Kvt / Saat</option>
                                        <option>Kubometr</option>
                                        <option>Aylıq Paket</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Əvvəlki Göstərici</label>
                                    <input 
                                      type="number" 
                                      value={formData.meterPrev}
                                      onChange={(e) => setFormData({...formData, meterPrev: Number(e.target.value)})}
                                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none leading-none" 
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Son Göstərici</label>
                                    <input 
                                      type="number" 
                                      value={formData.meterCurrent}
                                      onChange={(e) => setFormData({...formData, meterCurrent: Number(e.target.value)})}
                                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none leading-none" 
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex justify-between items-center italic">
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Hesablanmış Sərfiyyat:</span>
                                        <span className="text-sm font-black text-indigo-700">{utilityConsumption} vahid</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {category === 'MARKETING' && (
                            <>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Platforma / Kanal</label>
                                    <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none uppercase leading-none">
                                        <option>Facebook Ads</option>
                                        <option>Google Ads</option>
                                        <option>Billboard (Outdoor)</option>
                                        <option>TV / Radio</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Kampaniya Adı</label>
                                    <input placeholder="Yaz Endirimi 2026" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none leading-none" />
                                </div>
                            </>
                        )}

                        {category === 'REPAIR' && (
                            <>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Təmir Obyekti (Asset)</label>
                                    <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none uppercase leading-none">
                                        <option>Nəqliyyat Vəsaitləri</option>
                                        <option>Ofis Avadanlığı</option>
                                        <option>Bina / Tikili</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Təmirin Təsviri</label>
                                    <input placeholder="Mühərrikin yağ dəyişimi" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none leading-none" />
                                </div>
                            </>
                        )}
                        
                        {/* Always show for other or at bottom */}
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Açıqlama / Qeyd</label>
                            <textarea rows={2} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] py-4 px-6 text-sm font-bold shadow-inner outline-none italic resize-none" placeholder="Əlavə məlumat..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-28">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic leading-none">Status & Seçimlər</h3>
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={() => setIsTemplate(!isTemplate)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isTemplate ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                    >
                        <div className="flex items-center space-x-3 leading-none">
                            <Copy className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Şablon kimi saxla</span>
                        </div>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isTemplate ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300'}`}>
                            {isTemplate && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                    </button>
                    <p className="text-[8px] text-slate-400 font-bold uppercase italic px-4">Aylıq təkrarlanan xərclər üçün şablon yaradaraq növbəti dəfə avtomatik doldura bilərsiniz.</p>
                </div>

                <div className="pt-8 border-t border-slate-50 dark:border-slate-800 space-y-4 leading-none">
                    <div className="flex justify-between items-center italic">
                        <span className="text-[9px] font-black text-slate-400 uppercase italic">Xərc Tipi:</span>
                        <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase italic">{category}</span>
                    </div>
                    <div className="flex justify-between items-center italic">
                        <span className="text-[9px] font-black text-slate-400 uppercase italic">Hesab Balansı:</span>
                        <span className="text-[10px] font-black text-slate-800 dark:text-white italic tabular-nums">14,520 AZN</span>
                    </div>
                    <div className="flex justify-between items-center italic">
                        <span className="text-[9px] font-black text-slate-400 uppercase italic">Qalıq (Proqnoz):</span>
                        <span className="text-[10px] font-black text-primary-600 italic tabular-nums">14,210 AZN</span>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center space-x-2">
                        <Link className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Sənəd Qoşmaları</h4>
                    </div>
                    <div className="border-2 border-dashed border-slate-700 rounded-3xl p-8 text-center group-hover:border-indigo-500/50 transition-colors">
                        <Plus className="w-6 h-6 mx-auto mb-3 text-slate-500" />
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Qəbz və ya Fakturanı üzərinə sürüşdürün</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCreate;
