import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShoppingBag, Landmark, Clock, 
  Globe, FileDigit, Loader2, MapPin, 
  Receipt, Calculator, Edit2, History
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { crmApi, financeApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

const VendorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { activeCompany } = useCompany();
    const [vendor, setVendor] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!activeCompany || !id) return;
            try {
                const [vRes, aRes] = await Promise.all([
                    crmApi.getCounterparties(activeCompany.id, 'SUPPLIER'),
                    financeApi.getAccounts(activeCompany.id)
                ]);
                const found = vRes.data.find((v: any) => v.id === id);
                setVendor(found);
                setAccounts(aRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [activeCompany, id]);

    if (isLoading) return (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        </div>
    );

    if (!vendor) return (
        <div className="p-20 text-center">
            <ShoppingBag className="w-20 h-20 text-slate-100 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-400 uppercase italic">Təchizatçı tapılmadı</h2>
            <button onClick={() => navigate(-1)} className="mt-8 px-8 py-3 bg-primary-600 text-white rounded-2xl font-black uppercase italic tracking-widest">Geri Qayıt</button>
        </div>
    );

    const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || id;

    return (
        <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
            {/* HEADER */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-6">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-primary-600 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic flex items-center">
                            {vendor.name}
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mt-1">{vendor.code} • {vendor.taxId || 'VÖEN qeyd edilməyib'}</p>
                    </div>
                </div>
                <button 
                  onClick={() => navigate(`/purchase/vendors/edit/${vendor.id}`)}
                  className="px-8 py-3.5 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary-500/20 flex items-center italic"
                >
                    <Edit2 className="w-4 h-4 mr-2" /> Redaktə Et
                </button>
            </div>

            {/* DASHBOARD SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Ümumi Borc</p>
                    <h3 className="text-3xl font-black italic tabular-nums text-rose-500">0.00 <span className="text-sm font-bold opacity-50">AZN</span></h3>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Verilmiş Avans</p>
                    <h3 className="text-3xl font-black italic tabular-nums text-emerald-500">0.00 <span className="text-sm font-bold opacity-50">AZN</span></h3>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Açıq Sifarişlər</p>
                    <h3 className="text-3xl font-black italic tabular-nums text-indigo-600">0</h3>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Son Əməliyyat</p>
                    <h3 className="text-sm font-black italic text-slate-400 uppercase italic">Tapılmadı</h3>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* DETAILS */}
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 space-y-10">
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic border-b pb-4">Şirkət Profili</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase italic">VÖEN</span>
                                        <span className="text-sm font-black text-slate-800 dark:text-white font-mono">{vendor.taxId || '---'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase italic">Növ</span>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase italic ${vendor.isForeign ? 'bg-indigo-50 text-indigo-600' : 'bg-primary-50 text-primary-600'}`}>
                                            {vendor.isForeign ? 'Xarici' : 'Yerli'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase italic">ƏDV Ödəyicisi</span>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase italic ${vendor.isVatPayer ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                            {vendor.isVatPayer ? 'Bəli' : 'Xeyr'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic border-b pb-4">Maliyyə Hesabları</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase italic">Kreditor Hesabı</span>
                                        <span className="text-xs font-black text-slate-600 dark:text-slate-300 italic">{getAccountName(vendor.payableAccountId)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase italic">Avans Hesabı</span>
                                        <span className="text-xs font-black text-slate-600 dark:text-slate-300 italic">{getAccountName(vendor.advanceAccountId)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BANK ACCOUNTS */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic border-b pb-4">Bank Rekvizitləri</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {vendor.bankAccounts?.map((bank: any, idx: number) => (
                                    <div key={`${bank.iban}-${idx}`} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400">
                                                <Landmark className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800 dark:text-white uppercase italic">{bank.bankName}</p>
                                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest italic">{bank.iban}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-md italic">{bank.currency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-6 flex items-center">
                            <History className="w-4 h-4 mr-2" /> Əməliyyat Tarixçəsi
                        </h3>
                        <div className="space-y-6">
                            <div className="text-center py-10">
                                <Clock className="w-10 h-10 text-slate-100 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-slate-300 uppercase italic">Məlumat yoxdur</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetail;
