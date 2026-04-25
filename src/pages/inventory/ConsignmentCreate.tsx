import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, ChevronDown, PackageOpen, Store, UserSquare2, ShieldAlert, BadgeInfo
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DocumentStatusProgress, { type DocumentStatus } from '../../components/DocumentStatusProgress';
import { crmApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

const ConsignmentCreate = () => {
    const navigate = useNavigate();
    const { activeCompany } = useCompany();
    const [searchParams] = useSearchParams();
    const initType = searchParams.get('type') as 'OUT' | 'SALE' | 'RETURN' || 'OUT';
    
    const [currentStatus, setCurrentStatus] = useState<DocumentStatus>('DRAFT');
    const [docType] = useState(initType);
    const [docNumber] = useState(`CNS-${initType.substring(0,3)}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`);
    const [party, setParty] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const titleMap = {
        'OUT': 'MAL GÖNDƏRMƏ (OUT)',
        'SALE': 'KONSİQNASİYA SATIŞI (SALE)',
        'RETURN': 'MƏHSUL QAYTARILMASI (RETURN)'
    };

    const headerIconMap = {
        'OUT': <PackageOpen className="w-12 h-12 text-blue-500 opacity-20 absolute -bottom-2 -right-2" />,
        'SALE': <CheckCircle2 className="w-12 h-12 text-emerald-500 opacity-20 absolute -bottom-2 -right-2" />,
        'RETURN': <ArrowLeft className="w-12 h-12 text-rose-500 opacity-20 absolute -bottom-2 -right-2" />
    };

    const [partners, setPartners] = useState<any[]>([]);

    useEffect(() => {
        if (!activeCompany) return;
        const fetchPartners = async () => {
            try {
                const res = await crmApi.getCounterparties(activeCompany.id);
                const agentList = res.data?.filter((p: any) => p.isConsignmentAgent) || [];
                setPartners(agentList);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPartners();
    }, [activeCompany]);

    const [items, setItems] = useState<any[]>([
        { id: '1', name: 'Armatur A500C 12mm', code: 'ARM-001', uom: 'TON', size: '12M', qty: 0, price: 1250 }
    ]);

    const handleSave = () => {
        if (!party) {
            alert('Tərəfdaş (Partner) seçilməlidir');
            return;
        }
        
        const newDoc = {
            id: `cns-${Date.now()}`,
            docNumber,
            date: new Date(date).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric' }),
            partyName: partners.find(p => p.id === party)?.name || party,
            type: docType,
            totalValue: items.reduce((s, i) => s + (i.qty * i.price), 0),
            itemsCount: items.reduce((s, i) => s + Number(i.qty), 0),
            status: 'POSTED',
            items: [...items]
        };

        const saved = localStorage.getItem('erp_consignments');
        const existing = saved ? JSON.parse(saved) : [];
        localStorage.setItem('erp_consignments', JSON.stringify([newDoc, ...existing]));

        setCurrentStatus('POSTED');
        setTimeout(() => {
            navigate('/inventory/consignment');
        }, 1500);
    };

    return (
        <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500 pb-24 text-slate-800 dark:text-slate-100">
            {/* STICKY HEADER */}
            <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 -mx-8 px-8 py-4 mb-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate(-1)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all text-slate-400">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center space-x-3">
                                <h1 className="text-xl font-black uppercase tracking-tight flex items-center italic">
                                    Konsiqnasiya Sənədi
                                </h1>
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest italic ${
                                    docType === 'OUT' ? 'bg-blue-50 text-blue-600' : 
                                    docType === 'SALE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}>{titleMap[docType]}</span>
                            </div>
                            <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>№ {docNumber}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={handleSave} className="flex items-center space-x-2 px-8 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Təsdiqlə (Post)</span>
                        </button>
                    </div>
                </div>
            </div>

            <DocumentStatusProgress currentStatus={currentStatus} />

            <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-12 lg:col-span-9 space-y-8">
                    
                    {/* General Information Box */}
                    <div className={"bg-white dark:bg-slate-900 rounded-[2.5rem] border shadow-sm p-8 space-y-6 relative overflow-hidden " + (docType === 'OUT' ? 'border-blue-100 dark:border-blue-900/30' : docType === 'SALE' ? 'border-emerald-100 dark:border-emerald-900/30' : 'border-rose-100 dark:border-rose-900/30')}>
                        {headerIconMap[docType]}
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                    docType === 'OUT' ? 'bg-blue-50 text-blue-600' : 
                                    docType === 'SALE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                   <Store className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black uppercase italic tracking-widest">Əsas Məlumatlar</h2>
                                    <p className="text-[10px] text-slate-400 font-bold italic mt-0.5">Sənədin aid olduğu tərəfdaş və tarix ayarları</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                    <UserSquare2 className="w-3.5 h-3.5 mr-2" /> Konsiqnasiya Agent / Mağaza
                                </label>
                                <select 
                                    value={party} 
                                    onChange={(e) => setParty(e.target.value)} 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none transition-all"
                                >
                                    <option value="">Seçim edin...</option>
                                    {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center italic">
                                     Tarix
                                </label>
                                <input 
                                    type="date" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black italic shadow-inner outline-none transition-all" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAFBFD] dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800">
                                <tr>
                                    <th className="px-8 py-5">Kod / Məhsul</th>
                                    <th className="px-5 py-5 text-center">Ölçüsü / Vəzn</th>
                                    <th className="px-5 py-5 text-right w-32">Nəzərdə Tutulan Miqdar</th>
                                    <th className="px-5 py-5 text-right w-40 text-indigo-600">{docType === 'SALE' ? 'Satış Qiyməti' : 'Maya Dəyəri (Uçot)'}</th>
                                    <th className="px-5 py-5 text-right w-40">Cəmi</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs font-bold text-slate-600 dark:text-slate-300 italic divide-y divide-slate-50 dark:divide-slate-800">
                                {items.map((item, index) => (
                                    <tr key={index} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{item.code}</span>
                                                <span className="font-black text-slate-800 dark:text-white">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-5 text-center">{item.size} / {item.uom}</td>
                                        <td className="px-5 py-5 text-right">
                                             <input type="number" value={item.qty === 0 ? '' : item.qty} onChange={(e) => {
                                                const news = [...items];
                                                news[index].qty = Number(e.target.value);
                                                setItems(news);
                                            }} className="w-full bg-slate-50 dark:bg-slate-800 rounded-lg py-1.5 px-3 text-right font-black shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/20" />
                                        </td>
                                        <td className="px-5 py-5 text-right font-mono tabular-nums text-slate-400">
                                             <input type="number" value={item.price} onChange={(e) => {
                                                const news = [...items];
                                                news[index].price = Number(e.target.value);
                                                setItems(news);
                                             }} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-lg py-1.5 px-3 text-right font-black tracking-widest text-indigo-600 outline-none focus:border-indigo-300" />
                                        </td>
                                        <td className="px-5 py-5 text-right font-black tabular-nums text-indigo-600">{(item.qty * item.price).toLocaleString()} ₼</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* SIDEBAR */}
                <div className="col-span-12 lg:col-span-3 space-y-6">
                    <div className={`rounded-[2rem] p-6 space-y-4 shadow-sm border ${
                        docType === 'OUT' ? 'bg-blue-50/30 border-blue-100 text-blue-900' :
                        docType === 'SALE' ? 'bg-emerald-50/30 border-emerald-100 text-emerald-900' :
                        'bg-rose-50/30 border-rose-100 text-rose-900'
                    }`}>
                        <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center italic mb-4">
                           <BadgeInfo className="w-3.5 h-3.5 mr-2" /> Sənədin İzlənici Təbii
                        </h4>
                        <p className="text-[11px] font-bold leading-relaxed opacity-80">
                           {docType === 'OUT' && 'Siz malları göndərirsiniz. Mülkiyyət sizdə qalır (Gəlir yoxdur). Sistem 205.1-dən 205.2-yə (Konsiqnasiya Stokuna) hesablararası hərəkət yazacaq.'}
                           {docType === 'SALE' && 'Müştəri Konsiqnasiyadakı malları satdığını raport etdi. Bu sənəd təsdiqləndikdə Satış Gəliri (601) və Maya Dəyəri Xərci (701) tanınacaq.'}
                           {docType === 'RETURN' && 'Satılmayan mallar əsas anbara geri qaytarılır. Sistem 205.2-ni azaldıb 205.1-i artırır.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsignmentCreate;
