import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, 
  Globe, Briefcase, CreditCard, ShieldCheck,
  History, Info, AlertTriangle, Edit2, Download,
  CheckCircle2, DollarSign, Calendar, Landmark, 
  Receipt, Building2, Layout, Sparkles, TrendingUp,
  FileText, ArrowUpRight, ArrowDownRight, Clock, Calculator
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { crmApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      if (id && activeCompany) {
        setIsLoading(true);
        try {
          const res = await crmApi.getCounterparty(id);
          setCustomer(res.data?.data || res.data);
        } catch (e) {} finally { setIsLoading(false); }
      }
    };
    fetch();
  }, [id, activeCompany]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-black italic">
        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-[10px] uppercase text-slate-400 tracking-widest">Yüklənir...</p>
      </div>
    );
  }

  if (!customer) return <div>Tapılmadı</div>;

  return (
    <div className="flex flex-col min-h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 text-slate-800 dark:text-slate-100 italic relative">
      
      {/* PREMIUM HEADER BAR */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-6 mb-4 flex items-center justify-between shadow-sm font-black italic">
          <div className="flex items-center space-x-6 leading-none">
            <button onClick={() => navigate(-1)} className="group p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-white hover:shadow-xl transition-all outline-none border-none pointer-events-auto">
                <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-primary-600 transition-all font-black" />
            </button>
            <div className="leading-none">
              <div className="flex items-center gap-2 mb-1.5 leading-none"><Sparkles className="w-4 h-4 text-emerald-500" /><h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic leading-none">Müştəri Detalları</h1></div>
              <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest leading-none">BAXIŞ REJİMİ | {customer.code}</p>
            </div>
          </div>
          <div className="flex items-center space-x-5 leading-none font-black italic">
             <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-emerald-600 transition-all shadow-sm"><Download className="w-6 h-6"/></button>
             <button onClick={() => navigate(`/crm/customers/edit/${id}`)} className="px-12 py-4.5 bg-primary-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] shadow-2xl shadow-primary-500/30 transition-all hover:scale-105 active:scale-95 flex items-center outline-none border-none leading-none">
                <Edit2 className="w-5 h-5 mr-3" /><span>Məlumatları Redaktə Et</span>
             </button>
          </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
          
          {/* PROFILE SUMMARY WIDGET */}
          <div className="col-span-12 lg:col-span-4 space-y-10">
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 shadow-sm font-black italic uppercase relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary-600/5 -mr-10 -mt-10 rounded-full blur-3xl group-hover:bg-primary-600/10 transition-all duration-1000"></div>
                  <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                      <div className="w-28 h-28 bg-primary-600 text-white rounded-[2.5rem] flex items-center justify-center text-4xl shadow-2xl shadow-primary-500/40 relative">
                          {customer.name[0].toUpperCase()}
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-900 rounded-full p-2.5 shadow-xl border border-slate-50">
                              {customer.isForeign ? <Globe className="w-full h-full text-indigo-500" /> : <MapPin className="w-full h-full text-emerald-500" />}
                          </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{customer.name}</h2>
                        <div className="flex items-center justify-center gap-3">
                            <span className="px-5 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-[9px] font-black italic text-slate-400 border border-slate-100">{customer.code}</span>
                            <span className={`px-5 py-2 rounded-full text-[9px] font-black italic border ${customer.isForeign ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{customer.isForeign ? '🌍 XARİCİ' : '🇦🇿 YERLİ'}</span>
                        </div>
                      </div>
                  </div>
                  
                  <div className="mt-12 space-y-4 pt-10 border-t border-slate-50 dark:border-slate-800 font-black italic uppercase">
                      <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl"><span className="text-[10px] text-slate-400">VÖEN (TIN)</span><span className="text-[11px] font-black font-mono tracking-tighter">{customer.taxId || '----'}</span></div>
                      <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl"><span className="text-[10px] text-slate-400">Əlaqə</span><span className="text-[11px] font-black">{customer.phone || '---'}</span></div>
                      <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl"><span className="text-[10px] text-slate-400">E-Poçt</span><span className="text-[11px] font-black normal-case">{customer.email || '---'}</span></div>
                  </div>
              </div>

              {/* QUICK STATS */}
              <div className="bg-slate-900 text-white rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group">
                  <div className="absolute bottom-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-all duration-1000 rotate-12"><TrendingUp className="w-64 h-64" /></div>
                  <h3 className="text-sm font-black uppercase mb-8 flex items-center gap-4"><Calculator className="w-6 h-6 text-primary-500" /> Balans İcmalı</h3>
                  <div className="space-y-8 relative z-10">
                      <div><p className="text-[10px] text-slate-500 uppercase italic mb-2">Ümumi Debitor Borcu</p><p className="text-4xl font-black italic tracking-tighter">0.00 <span className="text-lg text-primary-500">AZN</span></p></div>
                      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5 font-black italic uppercase">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner"><p className="text-[9px] text-slate-500 mb-2">Son Ödəniş</p><p className="text-xs font-black">-- / --</p></div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner"><p className="text-[9px] text-slate-500 mb-2">Avans</p><p className="text-xs font-black">0.00 ₼</p></div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-10">
              {/* OBJECT DETAILS SECTION */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-8"><h3 className="text-xs font-black text-slate-400 uppercase italic tracking-widest flex items-center font-black italic uppercase leading-none"><Layout className="w-5 h-5 mr-3 text-primary-500" /> Obyekt və Mühasibat Konfiqurasiyası</h3><span className={`px-5 py-2 rounded-full text-[9px] font-black italic border ${customer.isVatPayer ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{customer.isVatPayer ? '✅ ƏDV ÖDƏYİCİSİ' : '❌ ƏDV ÖDƏYİCİSİ DEYİL'}</span></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-50"><p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-2">Obyekt Kodu / Adı</p><div className="flex items-center gap-4"><div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm font-black italic uppercase text-xs text-primary-600 border border-slate-100">{customer.objectCode || '---'}</div><p className="text-sm font-black italic">{customer.objectName || 'Qeyd edilməyib'}</p></div></div>
                     <div className="space-y-4 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-50"><p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-2">Rəsmi Müxabirləşmə Hesabları</p><div className="flex items-center gap-4 py-2"><span className="bg-slate-900 text-white px-5 py-3 rounded-xl text-xs shadow-lg font-black">{customer.payableAccountId || '---'}</span><span className="text-slate-300 font-black">➜</span><span className="bg-emerald-600 text-white px-5 py-3 rounded-xl text-xs shadow-lg font-black">{customer.advanceAccountId || '---'}</span></div></div>
                  </div>
              </div>

              {/* BANK ACCOUNTS SECTION */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase">
                  <div className="flex items-center border-b border-slate-50 pb-8"><Landmark className="w-5 h-5 mr-3 text-indigo-500" /><h3 className="text-xs font-black text-slate-400 uppercase italic tracking-widest leading-none font-black italic uppercase">Bank Rekvizitləri</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-black italic uppercase">
                      {customer.bankAccounts && customer.bankAccounts.length > 0 ? (
                        customer.bankAccounts.map((acc: any, i: number) => (
                          <div key={i} className="p-8 bg-slate-50/50 border-2 border-slate-50 rounded-[2.5rem] relative group font-black italic uppercase">
                             <p className="text-[10px] text-slate-400 mb-3 uppercase italic leading-none">{acc.bankName}</p>
                             <p className="text-sm font-black font-mono tracking-tighter mb-4 leading-none">{acc.iban}</p>
                             <div className="flex items-center justify-between font-black italic uppercase">
                                <span className="px-4 py-2 bg-white text-primary-600 rounded-xl text-[10px] font-black border border-slate-100">{acc.currency}</span>
                                <span className={`flex items-center gap-2 text-[9px] font-black ${acc.isActive ? 'text-emerald-600' : 'text-slate-300'}`}><Clock className="w-3 h-3" /> {acc.isActive ? 'AKTİV' : 'PASİV'}</span>
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 py-10 text-center text-slate-300 uppercase italic text-[11px] font-black italic uppercase leading-none">Bank hesabı qeyd edilməyib</div>
                      )}
                  </div>
              </div>

              {/* RECENT ACTIVITY SECTION */}
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-12 space-y-10 shadow-sm font-black italic uppercase">
                  <div className="flex items-center border-b border-slate-50 pb-8"><History className="w-5 h-5 mr-3 text-amber-500" /><h3 className="text-xs font-black text-slate-400 uppercase italic tracking-widest leading-none font-black italic uppercase">Son Əməliyyatlar</h3></div>
                  <div className="space-y-6">
                      <div className="flex items-center justify-center p-14 border-2 border-dashed border-slate-100 rounded-[3.5rem] bg-slate-50/20"><div className="text-center group font-black italic uppercase leading-none"><FileText className="w-12 h-12 text-slate-100 mx-auto mb-4 group-hover:scale-110 transition-all font-black italic uppercase" /><p className="text-[10px] text-slate-300 uppercase tracking-widest">Hələlik heç bir faktura tapılmadı</p></div></div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
