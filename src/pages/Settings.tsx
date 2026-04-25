import { useState } from 'react';
import { 
  Settings as SettingsIcon, Landmark, Monitor,
  Save, Building, Users as UsersIcon, ShieldCheck,
  Percent, FileText, CheckCircle2, AlertCircle,
  Truck, Archive, Boxes, History, Plus, Trash2, 
  TrendingDown, TrendingUp, CircleDollarSign, 
  Copy, ExternalLink, CreditCard, ShieldAlert,
  Globe, Calendar as CalendarIcon, Clock, Hash, Coins, Info
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { useFormat } from '../context/FormatContext';
import { companyApi } from '../utils/api';
import { useLocalization } from '../context/LocalizationContext';
import type { Language } from '../utils/LocalizationEngine';

const Settings = () => {
  const { activeCompany, refreshCompanies } = useCompany();
  const { settings, updateSettings, formatDate, formatTime, formatNumber, formatCurrency } = useFormat();
  const { language, setLanguage } = useLocalization();
  const [activeTab, setActiveTab] = useState('accounting_policy');
  const [isSaving, setIsSaving] = useState(false);
  
  const languages: { code: Language, name: string, flag: string }[] = [
    { code: 'az', name: 'Azərbaycan dili', flag: '🇦🇿' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  ];
  
  // Simple toast mock since react-hot-toast is missing
  const toast = {
    success: (msg: string) => alert(msg),
    error: (msg: string) => alert('Xəta: ' + msg)
  };
  
  // Role check mock (In real app, get from Auth context)
  const userRole = 'Admin'; 
  const isAdmin = userRole === 'Admin' || userRole === 'Sub Admin';

  const tabs = [
    { id: 'profile', name: 'Profilim', icon: Landmark, adminOnly: false },
    { id: 'company_profile', name: 'Şirkət Profili', icon: Building, adminOnly: false },
    { id: 'accounting_policy', name: 'Uçot Siyasəti', icon: FileText, adminOnly: true },
    { id: 'tax_settings', name: 'Vergi & ƏDV', icon: Percent, adminOnly: true },
    { id: 'regional_format', name: 'Regional və Format', icon: Globe, adminOnly: false },
    { id: 'general_config', name: 'Sistem Konfiqurasiyası', icon: SettingsIcon, adminOnly: true },
    { id: 'security', name: 'Təhlükəsizlik', icon: ShieldCheck, adminOnly: true },
  ].filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto h-[calc(100vh-74px)] overflow-y-auto custom-scrollbar bg-[#F8F9FA] dark:bg-slate-950">
       <div className="mb-8 items-center flex justify-between">
          <div className="flex items-center space-x-2 text-[14px] text-slate-500 font-medium tracking-tight">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors text-slate-400 font-bold uppercase italic tracking-tighter">SmartAgent ERP</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 dark:text-slate-200 font-black uppercase italic tracking-tighter">Şirkət Tənzimləmələri</span>
          </div>
       </div>

       <div className="flex flex-col lg:flex-row gap-8 items-start pb-20">
          {/* Sidebar */}
          <div className="w-full lg:w-[300px] shrink-0 space-y-2 sticky top-0">
             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-3">
               {tabs.map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`w-full flex items-center px-6 py-4 rounded-[1.5rem] mb-1 transition-all text-[13px] ${
                     activeTab === tab.id 
                       ? 'bg-indigo-600 text-white font-black shadow-xl shadow-indigo-600/20 italic' 
                       : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold italic'
                   }`}
                 >
                   <tab.icon className={`w-5 h-5 mr-4 opacity-70`} />
                   {tab.name}
                 </button>
               ))}
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 w-full">
             
             {/* ACCOUNTING POLICY TAB */}
             {activeTab === 'accounting_policy' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10">
                     <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-4">
                        <div>
                           <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Uçot Siyasəti və Metodologiya</h2>
                           <p className="text-sm text-slate-500 font-medium italic mt-1 leading-none shadow-sm">Maya dəyəri, amortizasiya və uçot mühərriki parametrləri</p>
                        </div>
                        <button className="flex items-center space-x-2 px-8 py-4 bg-emerald-500 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 italic bg-emerald-500 border-none">
                           <Save className="w-4 h-4" />
                           <span>Dəyişiklikləri Saxla</span>
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Costing Method */}
                        <div className="space-y-6">
                           <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center italic">
                              <Archive className="w-4 h-4 mr-2" /> Maya Dəyəri Metodu (Costing)
                           </h3>
                           <div className="grid grid-cols-1 gap-3">
                              {['FIFO (First-In, First-Out)', 'AVCO (Weighted Average Cost)', 'LIFO (Last-In, First-Out) - Deaktiv'].map((method, i) => (
                                <label key={i} className={`flex items-center p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${method.includes('FIFO') ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-50 hover:bg-slate-50'}`}>
                                   <input type="radio" name="costing" defaultChecked={method.includes('FIFO')} disabled={method.includes('Deaktiv')} className="w-4 h-4 text-indigo-600" />
                                   <span className="ml-4 text-sm font-black text-slate-700 uppercase italic tracking-tight italic tabular-nums">{method}</span>
                                </label>
                              ))}
                           </div>
                           <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed px-2 shadow-sm">
                              * Maya dəyəri metodu seçildikdən və əməliyyat aparıldıqdan sonra maliyyə ili ərzində dəyişdirilməsi tövsiyə olunmur.
                           </p>
                        </div>

                        {/* Accounting Toggles */}
                        <div className="space-y-6">
                           <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center italic shadow-sm">
                              <CheckCircle2 className="w-4 h-4 mr-2 shadow-sm" /> Uçot Sistemləri
                           </h3>
                           <div className="space-y-3">
                             {[
                               { id: 'tax', name: 'Vergi Uçotu (Tax Accounting)', desc: 'AR Vergi Məcəlləsinə uyğun hesablama' },
                               { id: 'fin', name: 'Maliyyə Uçotu (IFRS/IAS)', desc: 'Beynəlxalq standartlara uyğun hesablama' },
                               { id: 'man', name: 'İdarəetmə Uçotu (Management)', desc: 'Daxili qərar qəbulu üçün xüsusi uçot' }
                             ].map(sys => (
                               <div key={sys.id} className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50">
                                  <div>
                                     <p className="text-xs font-black text-slate-800 dark:text-white uppercase italic tracking-tight shadow-sm">{sys.name}</p>
                                     <p className="text-[10px] text-slate-400 font-bold italic mt-1 italic shadow-sm">{sys.desc}</p>
                                  </div>
                                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in bg-indigo-600 rounded-full cursor-pointer shadow-sm">
                                     <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 transform translate-x-0 shadow-sm"></div>
                                  </div>
                               </div>
                             ))}
                           </div>
                        </div>

                        {/* Depreciation Methods */}
                        <div className="col-span-1 md:col-span-2 space-y-8 pt-8 border-t border-slate-50">
                           <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center italic shadow-sm">
                              <TrendingDown className="w-4 h-4 mr-2 shadow-sm" /> Amortizasiya Metodları və Dərəcələri
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 shadow-sm">Vergi Uçotu üzrə</label>
                                 <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-xs font-black uppercase italic shadow-sm">
                                    <option>Azalan Qalıq Metodu (Double Declining)</option>
                                    <option>Düzxətli Metod (Straight-line)</option>
                                 </select>
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 shadow-sm">Maliyyə Uçotu üzrə</label>
                                 <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-xs font-black uppercase italic shadow-sm">
                                    <option>Düzxətli Metod (Straight-line)</option>
                                    <option>İstifadə Müddəti üzrə (Units of Production)</option>
                                 </select>
                              </div>
                           </div>
                           
                           {/* Category Rates Table */}
                           <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                              <table className="w-full text-left">
                                 <thead>
                                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic border-b border-white">
                                       <th className="p-6">Aktiv Kateqoriyası</th>
                                       <th className="p-6">Maksimum Vergi Dərəcəsi (%)</th>
                                       <th className="p-6">Maliyyə Faydalı Ömür (İl)</th>
                                       <th className="p-6">Effective Date (Qüvvədədir)</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-white/50">
                                    {[
                                       { cat: 'Tikili və binalar', tax: '7%', life: '20-50', date: '01.01.2024' },
                                       { cat: 'Maşın və avadanlıqlar', tax: '20%', life: '5-10', date: '01.01.2024' },
                                       { cat: 'Nəqliyyat vasitələri', tax: '25%', life: '4-8', date: '01.01.2024' },
                                       { cat: 'Hesablama texnikası', tax: '25%', life: '3-4', date: '01.01.2024' }
                                    ].map((row, i) => (
                                       <tr key={i} className="group hover:bg-white transition-all shadow-sm">
                                          <td className="p-6 text-xs font-black text-slate-700 uppercase italic tabular-nums shadow-sm">{row.cat}</td>
                                          <td className="p-6 text-xs font-black text-rose-600 italic shadow-sm">{row.tax}</td>
                                          <td className="p-6 text-xs font-black text-indigo-600 italic shadow-sm">{row.life} il</td>
                                          <td className="p-6 text-[10px] font-black text-slate-400 italic flex items-center shadow-sm">
                                             <History className="w-3 h-3 mr-2 shadow-sm" /> {row.date}
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             )}

             {/* TAX SETTINGS TAB */}
             {activeTab === 'tax_settings' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                     <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight mb-2 italic">Vergi Parametrləri və Güzəştlər</h2>
                     <p className="text-sm text-slate-500 font-medium italic mb-10 shadow-sm leading-none italic">ƏDV dərəcələri və effective-date əsaslı istisnalar</p>

                     <div className="space-y-8">
                        <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm italic-none shadow-inner">
                           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-6">Mövcud ƏDV Dərəcələri</h4>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[
                                { name: 'Standart Dərəcə', value: '18%', status: 'Active', desc: 'Əksər mal və xidmətlər üçün' },
                                { name: 'Güzəştli Dərəcə', value: '5%', status: 'Active', desc: 'Kənd təsərrüfayı məhsulları (nümunə)' },
                                { name: 'Azad olunmuş (Exempt)', value: '0%', status: 'Active', desc: 'E-İxrac və xüsusi layihələr' }
                              ].map((rate, i) => (
                                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group shadow-inner">
                                   <div className="relative z-10 shadow-inner">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic shadow-inner">{rate.name}</p>
                                      <h5 className="text-3xl font-black text-indigo-600 italic tabular-nums shadow-inner italic">{rate.value}</h5>
                                      <p className="text-[9px] font-bold text-slate-400 italic mt-2 shadow-inner">{rate.desc}</p>
                                   </div>
                                   <Percent className="absolute -right-4 -bottom-4 w-16 h-16 opacity-5 rotate-12 group-hover:scale-125 transition-all text-indigo-900 shadow-inner" />
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-6 shadow-inner italic-none shadow-inner shadow-inner">
                           <div className="flex items-center justify-between px-2 italic-none shadow-inner shadow-inner">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest italic shadow-inner">Vergi Güzəştləri (Tax Exemptions)</h4>
                              <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 flex items-center uppercase italic shadow-inner">
                                 <Plus className="w-3 h-3 mr-1.5 shadow-inner" /> Yeni Güzəşt Əlavə Et
                              </button>
                           </div>
                           <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-inner italic-none shadow-inner shadow-inner shadow-inner shadow-inner">
                              <table className="w-full text-left">
                                 <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest italic text-slate-400 border-b border-slate-100">
                                    <tr>
                                       <th className="p-6 px-10">Güzəştin Adı / Maddə</th>
                                       <th className="p-6">Növü</th>
                                       <th className="p-6">Dərəcə</th>
                                       <th className="p-6">Başlama Tarixi</th>
                                       <th className="p-6">Bitmə Tarixi</th>
                                       <th className="p-6 text-right px-10">Status</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50 italic-none shadow-inner">
                                    {[
                                       { name: 'KOB klaster müəssisələri', type: 'Gəlir Vergisi', rate: '75% Güzəşt', start: '01.01.2024', end: '01.01.2031', status: 'Active' },
                                       { name: 'Texnologiya mərkəzləri', type: 'Əmək Haqqı (GV)', rate: '100% Güzəşt', start: '01.01.2023', end: '01.01.2033', status: 'Active' },
                                       { name: 'İdman mərc oyunları', type: 'ƏDV Azad', rate: '0%', start: '01.01.2020', end: '-', status: 'Expired' }
                                    ].map((row, i) => (
                                       <tr key={i} className="hover:bg-slate-50 transition-all shadow-inner">
                                          <td className="p-6 px-10 font-black text-xs text-slate-700 uppercase italic tracking-tight italic shadow-inner">{row.name}</td>
                                          <td className="p-6 text-[10px] font-black text-slate-400 uppercase italic shadow-inner italic">{row.type}</td>
                                          <td className="p-6 text-xs font-black text-emerald-600 italic shadow-inner italic">{row.rate}</td>
                                          <td className="p-6 text-[11px] font-black text-slate-500 tabular-nums italic shadow-inner italic">{row.start}</td>
                                          <td className="p-6 text-[11px] font-black text-slate-500 tabular-nums italic shadow-inner italic">{row.end}</td>
                                          <td className="p-6 text-right px-10">
                                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase italic shadow-inner ${row.status === 'Active' ? 'bg-emerald-50 text-emerald-600 shadow-inner' : 'bg-slate-100 text-slate-400 shadow-inner'}`}>
                                                {row.status}
                                             </span>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             )}

             {/* GENERAL CONFIG TAB */}
             {activeTab === 'general_config' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-12">
                     <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight mb-8 shadow-inner">Sistem Konfiqurasiyası</h2>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10 italic-none shadow-inner">
                        {/* Location Defaults */}
                        <div className="space-y-6 shadow-inner italic-none shadow-inner">
                           <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest italic border-b border-indigo-50 pb-2 flex items-center shadow-inner">
                              <Landmark className="w-4 h-4 mr-2 shadow-inner shadow-inner" /> Filial və Məkan Tənzimləmələri
                           </h3>
                           <div className="grid gap-4 italic-none shadow-inner">
                              <div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block italic shadow-inner">Default Şirkət Filialı</label>
                                 <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-xs font-black uppercase italic shadow-inner">
                                    <option>Mərkəzi Ofis (Bakı)</option>
                                    <option>Sumqayıt Filialı</option>
                                    <option>Gəncə Nümayəndəliyi</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block italic shadow-inner">Default Anbar (Warehouse)</label>
                                 <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-xs font-black uppercase italic shadow-inner">
                                    <option>Baş Anbar (Main)</option>
                                    <option>Paylaşım Mərkəzi</option>
                                    <option>E-commerce Stok</option>
                                 </select>
                              </div>
                           </div>
                        </div>

                        {/* Financial Defaults */}
                        <div className="space-y-6 shadow-inner italic-none shadow-inner shadow-inner">
                           <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest italic border-b border-indigo-50 pb-2 flex items-center shadow-inner">
                              <CircleDollarSign className="w-4 h-4 mr-2 shadow-inner shadow-inner shadow-inner" /> Maliyyə və Valyuta
                           </h3>
                           <div className="grid gap-4 italic-none shadow-inner shadow-inner">
                              <div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block italic shadow-inner shadow-inner">Əsas Uçot Valyutası (Functional)</label>
                                 <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-xs font-black uppercase italic shadow-inner shadow-inner">
                                    <option>AZN - Azərbaycan Manatı</option>
                                    <option>USD - ABŞ Dolları</option>
                                    <option>EUR - Avro</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block italic shadow-inner shadow-inner">Hesabat Valyutası (Reporting)</label>
                                 <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-xs font-black uppercase italic shadow-inner shadow-inner">
                                    <option>USD - ABŞ Dolları</option>
                                    <option>AZN - Azərbaycan Manatı</option>
                                 </select>
                              </div>
                           </div>
                        </div>

                        {/* Numbering Rules */}
                        <div className="col-span-1 md:col-span-2 space-y-6 pt-10 border-t border-slate-50 shadow-inner italic-none shadow-inner shadow-inner shadow-inner">
                           <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest italic flex items-center shadow-inner shadow-inner">
                              <Boxes className="w-4 h-4 mr-2 shadow-inner shadow-inner shadow-inner" /> Sənəd Nömrələmə Qaydaları (Numbering Rules)
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 italic-none shadow-inner shadow-inner shadow-inner">
                              {[
                                { name: 'Satış Fakturası', prefix: 'INV-', pads: '6' },
                                { name: 'Satınalma Sifarişi', prefix: 'PO-', pads: '5' },
                                { name: 'Kassa Mədaxil', prefix: 'KSR-', pads: '5' }
                              ].map((rule, i) => (
                                <div key={i} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex flex-col space-y-4 shadow-inner shadow-inner">
                                   <p className="text-[11px] font-black text-slate-800 uppercase italic tracking-tight shadow-inner shadow-inner">{rule.name}</p>
                                   <div className="flex gap-2 shadow-inner italic-none shadow-inner shadow-inner">
                                      <input type="text" defaultValue={rule.prefix} className="w-20 bg-white border-2 border-slate-100 rounded-xl p-2 text-xs font-black uppercase italic text-center text-indigo-600 shadow-inner shadow-inner shadow-inner" />
                                      <input type="text" defaultValue="000123" disabled className="flex-1 bg-slate-100 rounded-xl p-2 text-xs font-black uppercase tabular-nums text-center text-slate-400 shadow-inner" />
                                   </div>
                                   <p className="text-[9px] font-bold text-slate-400 italic shadow-inner">Format: {rule.prefix}000123 ({rule.pads} hənəli)</p>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-inner italic-none shadow-inner">
                     <div className="relative z-10 shadow-inner">
                        <h4 className="text-2xl font-black uppercase italic tracking-tight mb-2 shadow-inner">Tənzimləmələr Bitdi?</h4>
                        <p className="text-slate-400 font-medium italic shadow-inner">Sistem konfiqurasiyası real vaxt rejimində bütün tərəfdaşlar və modullar üzrə tətbiq olunacaq.</p>
                     </div>
                     <button className="relative z-10 px-12 py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/40 hover:-translate-y-1 transition-all active:scale-95 italic bg-indigo-600 border-none shadow-inner shadow-inner">
                        Bütün Qaydaları Təsdiqlə
                     </button>
                     <SettingsIcon className="absolute -right-12 -bottom-12 w-64 h-64 opacity-5 rotate-12" />
                  </div>
               </div>
             )}

              {/* REGIONAL & FORMAT TAB */}
              {activeTab === 'regional_format' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
                   <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm relative overflow-hidden">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6 relative z-10">
                         <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight mb-2">Regional və Format Tənzimləmələri</h2>
                            <p className="text-sm text-slate-500 font-medium italic">Sistem üzrə tarix, saat, rəqəm və valyuta göstəriliş üslublarını fərdiləşdirin</p>
                         </div>
                         <div className="flex items-center space-x-3">
                            {isAdmin && (
                              <button 
                                onClick={async () => {
                                  if (!activeCompany) return;
                                  setIsSaving(true);
                                  try {
                                    await companyApi.updateCompany(activeCompany.id, { 
                                      name: activeCompany.name,
                                      settings: settings 
                                    } as any);
                                    await refreshCompanies();
                                    toast.success('Şirkət tənzimləmələri yadda saxlanıldı');
                                  } catch (e) {
                                    toast.error('Xəta baş verdi');
                                  } finally {
                                    setIsSaving(false);
                                  }
                                }}
                                disabled={isSaving}
                                className="flex items-center space-x-2 px-6 py-4 bg-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 italic border-none"
                              >
                                {isSaving ? <History className="w-4 h-4 animate-spin" /> : <Building className="w-4 h-4" />}
                                <span>Şirkət üçün Saxla</span>
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                updateSettings(settings);
                                toast.success('Fərdi tənzimləmələriniz tətbiq edildi');
                              }}
                              className="flex items-center space-x-2 px-6 py-4 bg-emerald-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 italic border-none"
                            >
                              <Save className="w-4 h-4" />
                              <span>Özün üçün Saxla (Override)</span>
                            </button>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start relative z-10">
                         {/* Left Form Part */}
                         <div className="xl:col-span-8 flex flex-col space-y-10">
                            
                            {/* Date & Time */}
                            <div className="space-y-6">
                               <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center italic">
                                  <CalendarIcon className="w-4 h-4 mr-2" /> Tarix və Saat Formatı
                               </h3>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Tarix Göstərilişi</label>
                                     <select 
                                       value={settings.dateFormat}
                                       onChange={(e) => updateSettings({ dateFormat: e.target.value })}
                                       className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none text-[13px] font-black uppercase italic shadow-sm cursor-pointer"
                                     >
                                        <option value="DD.MM.YYYY">DD.MM.YYYY (31.10.2024)</option>
                                        <option value="MM.DD.YYYY">MM.DD.YYYY (10.31.2024)</option>
                                        <option value="YYYY.MM.DD">YYYY.MM.DD (2024.10.31)</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY (31/10/2024)</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY (10/31/2024)</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD (2024-10-31)</option>
                                     </select>
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Saat Sistemi</label>
                                     <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                        {[
                                          { id: '24h', name: '24 Saat (14:30)' },
                                          { id: '12h', name: '12 Saat (02:30 PM)' }
                                        ].map(opt => (
                                          <button
                                            key={opt.id}
                                            onClick={() => updateSettings({ timeFormat: opt.id as any })}
                                            className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase italic transition-all ${
                                              settings.timeFormat === opt.id 
                                                ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' 
                                                : 'text-slate-400'
                                            }`}
                                          >
                                            {opt.name}
                                          </button>
                                        ))}
                                     </div>
                                  </div>
                               </div>
                            </div>

                            {/* Numbers */}
                            <div className="space-y-6 pt-8 border-t border-slate-50 dark:border-slate-800">
                               <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center italic">
                                  <Hash className="w-4 h-4 mr-2" /> Rəqəm və Separatorlar
                               </h3>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Kəsr Ayırıcısı (Decimal)</label>
                                     <div className="flex gap-3">
                                        {[
                                          { val: '.', name: 'Nöqtə (.)', ex: '1500.75' },
                                          { val: ',', name: 'Vergül (,)', ex: '1500,75' }
                                        ].map(opt => (
                                          <button
                                            key={opt.val}
                                            onClick={() => updateSettings({ decimalSeparator: opt.val as any })}
                                            className={`flex-1 p-4 rounded-2xl border-2 transition-all group ${
                                              settings.decimalSeparator === opt.val 
                                                ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-900/10' 
                                                : 'border-slate-50 dark:border-slate-800 hover:bg-slate-50'
                                            }`}
                                          >
                                            <p className={`text-xs font-black uppercase italic ${settings.decimalSeparator === opt.val ? 'text-indigo-600' : 'text-slate-500'}`}>{opt.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1 opacity-60 italic tabular-nums">{opt.ex}</p>
                                          </button>
                                        ))}
                                     </div>
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Minlik Ayırıcısı (Thousands)</label>
                                     <select 
                                       value={settings.thousandsSeparator}
                                       onChange={(e) => updateSettings({ thousandsSeparator: e.target.value as any })}
                                       className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none text-[13px] font-black uppercase italic shadow-sm cursor-pointer"
                                     >
                                        <option value=" ">Boşluq (1 234 567)</option>
                                        <option value=",">Vergül (1,234,567)</option>
                                        <option value=".">Nöqtə (1.234.567)</option>
                                        <option value="">Ayırıcı Yoxdur (1234567)</option>
                                     </select>
                                  </div>
                               </div>
                               <div className="space-y-3 pt-4">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Mənfi Ədədlərin Göstərilməsi</label>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {[
                                       { val: '-', name: 'Standart (-1500.75)' },
                                       { val: '()', name: 'Maliyyə (1500.75)' }
                                     ].map(opt => (
                                       <button
                                         key={opt.val}
                                         onClick={() => updateSettings({ negativeFormat: opt.val as any })}
                                         className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                           settings.negativeFormat === opt.val 
                                             ? 'border-indigo-600 bg-indigo-50/20' 
                                             : 'border-slate-50 hover:bg-slate-50'
                                         }`}
                                       >
                                         <p className={`text-xs font-black uppercase italic ${settings.negativeFormat === opt.val ? 'text-indigo-600' : 'text-slate-500'}`}>{opt.name}</p>
                                       </button>
                                     ))}
                                  </div>
                               </div>
                            </div>

                            {/* Currencies */}
                            <div className="space-y-6 pt-8 border-t border-slate-50 dark:border-slate-800">
                               <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center italic">
                                  <Coins className="w-4 h-4 mr-2" /> Valyuta Göstərilişi
                               </h3>
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Simvol/Kod Yerləşməsi</label>
                                     <select 
                                       value={settings.currencyFormat.position}
                                       onChange={(e) => updateSettings({ currencyFormat: { ...settings.currencyFormat, position: e.target.value as any } })}
                                       className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none text-[13px] font-black uppercase italic shadow-sm cursor-pointer"
                                     >
                                        <option value="before">Əvvəl ($ 100)</option>
                                        <option value="after">Sonra (100 $)</option>
                                     </select>
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Simvol yoxsa ISO</label>
                                     <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                        <button
                                          onClick={() => updateSettings({ currencyFormat: { ...settings.currencyFormat, useSymbol: true } })}
                                          className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase italic transition-all ${settings.currencyFormat.useSymbol ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                                        >₼ Simvol</button>
                                        <button
                                          onClick={() => updateSettings({ currencyFormat: { ...settings.currencyFormat, useSymbol: false } })}
                                          className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase italic transition-all ${!settings.currencyFormat.useSymbol ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                                        >AZN Kod</button>
                                     </div>
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Aralıq Boşluq</label>
                                     <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                        <button
                                          onClick={() => updateSettings({ currencyFormat: { ...settings.currencyFormat, addSpace: true } })}
                                          className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase italic transition-all ${settings.currencyFormat.addSpace ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                                        >Bəli</button>
                                        <button
                                          onClick={() => updateSettings({ currencyFormat: { ...settings.currencyFormat, addSpace: false } })}
                                          className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase italic transition-all ${!settings.currencyFormat.addSpace ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}
                                        >Xeyr</button>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* Right Preview Part */}
                         <div className="xl:col-span-4 sticky top-6">
                            <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
                               <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                               <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 mb-8 italic flex items-center italic">
                                  <Monitor className="w-4 h-4 mr-3" /> Canlı Preview (Nümunə)
                               </h4>
                               <div className="space-y-12">
                                  <div className="space-y-6">
                                     <div className="opacity-40 italic">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1">Cari Tarix və Saat</p>
                                        <div className="h-px bg-white/20 w-8"></div>
                                     </div>
                                     <div className="space-y-3">
                                        <p className="text-3xl font-black italic tracking-tighter tabular-nums">{formatDate(new Date())}</p>
                                        <p className="text-xl font-bold text-indigo-300 italic tabular-nums">{formatTime(new Date())}</p>
                                     </div>
                                  </div>

                                  <div className="space-y-6">
                                     <div className="opacity-40 italic">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1">Maliyyə Məbləği</p>
                                        <div className="h-px bg-white/20 w-8"></div>
                                     </div>
                                     <div className="space-y-4">
                                        <p className="text-3xl font-black text-emerald-400 italic tracking-tighter tabular-nums">
                                          {formatCurrency(1234567.89, 'AZN')}
                                        </p>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                           <div className="flex justify-between items-center opacity-70">
                                              <span className="text-[9px] font-black uppercase italic">Mənfi Ədəd</span>
                                              <span className="text-xs font-black text-rose-400 tabular-nums italic">
                                                {formatCurrency(-1234.50, 'AZN')}
                                              </span>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                               </div>

                               <div className="mt-12 p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 flex items-start">
                                  <Info className="w-5 h-5 text-indigo-400 mr-4 shrink-0" />
                                  <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic uppercase">
                                     Seçimləriniz sistem üzrə bütün hesabatlarda, formlarda və çap sənədlərində dərhal tətbiq olunacaqdır.
                                  </p>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <Globe className="absolute -right-20 -bottom-20 w-80 h-80 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />
                   </div>
                </div>
              )}

              {/* SECURITY TAB (MOCK) */}
             {activeTab === 'security' && (
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-12 text-center h-[400px] flex flex-col items-center justify-center space-y-6 italic-none shadow-inner shadow-inner shadow-inner">
                   <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shadow-inner italic-none shadow-inner shadow-inner shadow-inner">
                      <ShieldAlert className="w-10 h-10 shadow-inner" />
                   </div>
                   <div className="shadow-inner italic-none shadow-inner shadow-inner">
                      <h3 className="text-xl font-black text-slate-800 uppercase italic shadow-inner italic">Təhlükəsizlik və Roller</h3>
                      <p className="text-slate-500 font-medium italic mt-2 shadow-inner italic">Bu bölmədə istifadəçi rolları və giriş icazələri (ACL) idarə olunur.</p>
                   </div>
                   <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-inner shadow-inner">Rolları İdarə Et</button>
                </div>
             )}

             {/* PROFILE TAB (MOCK) */}
             {activeTab === 'profile' && (
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-12 space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-sm">
                   <div className="flex items-center space-x-8 pb-10 border-b border-slate-50 dark:border-slate-800">
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-500/30 italic">
                         AQ
                      </div>
                      <div>
                         <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Qurban Abbasov</h2>
                         <p className="text-indigo-500 font-black uppercase tracking-widest text-xs italic mt-1 leading-none shadow-sm">Sistem Administratoru</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center italic shadow-sm">
                            <Globe className="w-4 h-4 mr-2" /> Sistem Dili Seçimi
                         </h3>
                         <div className="grid grid-cols-1 gap-3">
                            {languages.map((lang) => (
                              <button
                                key={lang.code}
                                onClick={() => {
                                  setLanguage(lang.code);
                                  toast.success(`${lang.name} seçildi`);
                                }}
                                className={`flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all ${
                                  language === lang.code 
                                    ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-900/10 shadow-sm' 
                                    : 'border-slate-50 dark:border-slate-800 hover:bg-slate-50 shadow-sm'
                                }`}
                              >
                                 <div className="flex items-center space-x-4">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className={`text-sm font-black uppercase italic tracking-tight ${language === lang.code ? 'text-indigo-600' : 'text-slate-500'}`}>
                                       {lang.name}
                                    </span>
                                 </div>
                                 {language === lang.code && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                              </button>
                            ))}
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed px-2 shadow-sm">
                            * Dil seçimi profiliniz üçün yadda saxlanılacaq və sistemin bütün hissələrinə dərhal tətbiq olunacaq.
                         </p>
                      </div>

                      <div className="space-y-6 shadow-sm">
                         <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center italic shadow-sm">
                            <ShieldAlert className="w-4 h-4 mr-2 shadow-sm" /> Şifrə və Təhlükəsizlik
                         </h3>
                         <div className="space-y-4 shadow-sm">
                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block italic shadow-sm">Cari Şifrə</label>
                               <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-sm shadow-sm" />
                            </div>
                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block italic shadow-sm">Yeni Şifrə</label>
                               <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-sm shadow-sm" />
                            </div>
                            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all italic border-none shadow-sm">
                               Şifrəni Yenilə
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* COMPANY PROFILE TAB (MOCK) */}
             {activeTab === 'company_profile' && (
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-12">
                   <div className="flex items-center space-x-8 mb-12">
                      <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-indigo-600/20 italic">
                         {activeCompany?.logo || activeCompany?.code?.substring(0, 2) || 'SA'}
                      </div>
                      <div>
                         <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tight">{activeCompany?.name || 'Seçilməyib'}</h2>
                         <p className="text-indigo-500 font-black uppercase tracking-widest text-xs italic mt-1">{activeCompany?.profile || 'Standart Şirkət Profili'}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic-none shadow-inner shadow-inner shadow-inner">
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block italic shadow-inner">VÖEN</label>
                         <input type="text" defaultValue="1234567891" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm shadow-inner italic" />
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block italic shadow-inner">Hüquqi Ünvan</label>
                         <input type="text" defaultValue="Azərbaycan, Bakı şəh." className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm shadow-inner italic" />
                      </div>
                   </div>
                </div>
             )}

          </div>
       </div>
    </div>
  );
};

export default Settings;
