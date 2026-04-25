import { 
  TrendingUp, TrendingDown, DollarSign, 
  ShoppingCart, Users, Target, 
  ChevronRight, ArrowUpRight, ArrowDownRight,
  Calendar, Download, MoreHorizontal,
  PieChart, BarChart3, Rocket
} from 'lucide-react';

const SalesDashboard = () => {
  // Stat card data
  const stats = [
    { 
      title: "Cari Ay Satış", 
      value: "₼ 284,500", 
      trend: "+12.5%", 
      isUp: true, 
      icon: DollarSign,
      color: "indigo"
    },
    { 
      title: "Yeni Sifarişlər", 
      value: "42", 
      trend: "+8.2%", 
      isUp: true, 
      icon: ShoppingCart,
      color: "emerald"
    },
    { 
      title: "Konversiya Faizi", 
      value: "32.4%", 
      trend: "-2.1%", 
      isUp: false, 
      icon: Target,
      color: "amber"
    },
    { 
      title: "Aktiv Müştərilər", 
      value: "1,248", 
      trend: "+5.4%", 
      isUp: true, 
      icon: Users,
      color: "purple"
    }
  ];

  // Top products
  const topProducts = [
    { name: "Armatur A500C 12mm", revenue: "₼ 125,000", share: 45, color: "bg-indigo-500" },
    { name: "Beton M400", revenue: "₼ 82,000", share: 30, color: "bg-emerald-500" },
    { name: "Sement Holcim 40kg", revenue: "₼ 45,500", share: 15, color: "bg-amber-500" },
    { name: "Digər", revenue: "₼ 32,000", share: 10, color: "bg-slate-300" }
  ];

  // Recent opportunities
  const opportunities = [
    { name: "Gilan Holding Project", value: "₼ 450,000", probability: 75, rep: "Fuad M.", status: "Negotiation" },
    { name: "Baku Mall Supply", value: "₼ 120,500", probability: 90, rep: "Aysel Q.", status: "Proposal" },
    { name: "Sumqayıt Tech Park", value: "₼ 89,000", probability: 40, rep: "Murad E.", status: "Qualification" },
  ];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20 text-slate-800 dark:text-slate-100 italic-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest italic tracking-tighter">İcra Paneli</span>
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Mart 2026 Üzrə Hesabat</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Satış Dashboard</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm italic">
            <Calendar className="w-4 h-4 shadow-sm" />
            <span>Son 30 Gün</span>
          </button>
          <button className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic">
            <Download className="w-4 h-4 shadow-sm" />
            <span>Hesabatı Yüklə</span>
          </button>
        </div>
      </div>

      {/* QUICK STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-50 dark:bg-${stat.color}-900/10 rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-700`}></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-14 h-14 bg-${stat.color}-50 dark:bg-${stat.color}-900/30 text-${stat.color}-600 rounded-[1.25rem] flex items-center justify-center mb-6 shadow-sm`}>
                <stat.icon className="w-7 h-7 shadow-sm" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2 tracking-tighter">{stat.title}</p>
              <h3 className="text-3xl font-black italic tabular-nums text-slate-800 dark:text-white mb-3 tracking-tight">{stat.value}</h3>
              <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black italic ${stat.isUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'}`}>
                {stat.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN ANALYTICS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* REVENUE CHART PLACEHOLDER */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl shadow-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">Gəlir Dinamikası</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic tracking-tighter">İllik müqayisəli analiz</p>
              </div>
            </div>
            <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl shadow-inner">
               <button className="px-5 py-2 bg-white dark:bg-slate-700 shadow-sm rounded-lg text-[10px] font-black uppercase tracking-widest italic text-indigo-600">Həftə</button>
               <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest italic text-slate-400 hover:text-slate-600">Ay</button>
               <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest italic text-slate-400 hover:text-slate-600 text-nowrap">İl</button>
            </div>
          </div>
          
          {/* Custom Styled Chart Columns */}
          <div className="flex-1 flex items-end justify-between space-x-4 px-4 mb-8">
            {[45, 65, 35, 85, 55, 75, 45, 95, 65, 80, 40, 60].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex flex-col items-center">
                  <div 
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-t-2xl relative overflow-hidden group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all duration-500"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-500 bg-slate-800 text-white text-[10px] font-black px-3 py-1 rounded-lg italic shadow-xl z-20">
                    ₼ {(height * 1200).toLocaleString()}
                  </div>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase italic mt-4 opacity-70">M{i+1}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-indigo-500 rounded-full shadow-sm shadow-indigo-200"></span>
                <span className="text-[10px] font-black uppercase italic text-slate-500 tracking-tight">Cari İL</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-slate-200 rounded-full"></span>
                <span className="text-[10px] font-black uppercase italic text-slate-400 tracking-tight">Əvvəlki İL</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-full italic shadow-sm">
               <ArrowUpRight className="w-4 h-4" />
               <span>Yüksəliş Trendi: +24%</span>
            </div>
          </div>
        </div>

        {/* TOP CATEGORIES / PRODUCTS */}
        <div className="bg-indigo-600 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col min-h-[500px] group transition-all duration-700">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
           <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-sm">
                       <PieChart className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tight">Populyar Mallar</h3>
                       <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest italic tracking-tighter">Satış Payına Görə Analiz</p>
                    </div>
                 </div>
                 <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all shadow-sm">
                    <MoreHorizontal className="w-5 h-5 text-nowrap" />
                 </button>
              </div>

              <div className="space-y-8 mt-10">
                 {topProducts.map((product, idx) => (
                    <div key={idx} className="space-y-3 group/item cursor-pointer">
                       <div className="flex justify-between items-end">
                          <p className="text-sm font-black italic uppercase tracking-tight group-hover/item:translate-x-2 transition-transform duration-500">{product.name}</p>
                          <p className="text-xs font-black tabular-nums tracking-tighter italic">{product.revenue}</p>
                       </div>
                       <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden shadow-inner flex p-[1px]">
                          <div 
                             className={`${product.color} rounded-full relative group-hover/item:brightness-110 transition-all duration-700 shadow-sm`}
                             style={{ width: `${product.share}%` }}
                          >
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-1000"></div>
                          </div>
                       </div>
                       <div className="flex justify-between text-[10px] font-bold text-white/40 italic uppercase tracking-widest">
                          <span>Pay: {product.share}%</span>
                          <span className="opacity-0 group-hover/item:opacity-100 transition-opacity">Detallara Bax →</span>
                       </div>
                    </div>
                 ))}
              </div>
              
              <div className="mt-12 p-8 bg-white/10 rounded-[2.5rem] border border-white/10 backdrop-blur-sm group-hover:bg-white/15 transition-all">
                 <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500">
                       <Rocket className="w-6 h-6 text-indigo-600 shadow-sm" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest italic text-white/70 tracking-tighter">İl Boyu Hədəf</p>
                       <h4 className="text-2xl font-black italic tabular-nums tracking-tight tracking-tighter italic">₼ 3,420,000</h4>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* LOWER SECTION - OPPORTUNITIES & ACTIVITY */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         
         {/* RECENT OPPORTUNITIES Registry */}
         <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center space-x-4 text-nowrap">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl shadow-sm">
                     <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight tracking-tighter shadow-sm text-nowrap">Aktiv Satış İmkanları</h3>
               </div>
               <button className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest italic tracking-tighter hover:underline underline-offset-4 shadow-sm text-nowrap">Hamsına Bax →</button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800 shadow-sm">
                        <th className="pb-4 shadow-sm">Layihə / Şirkət</th>
                        <th className="pb-4 text-right shadow-sm">Məbləğ</th>
                        <th className="pb-4 text-center shadow-sm">Ehtimal</th>
                        <th className="pb-4 text-right shadow-sm">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {opportunities.map((opp, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer shadow-sm">
                           <td className="py-5 shadow-sm">
                              <p className="text-sm font-black text-slate-800 dark:text-white italic uppercase tracking-tight shadow-sm tracking-tighter text-nowrap">{opp.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 italic shadow-sm shadow-sm">{opp.rep}</p>
                           </td>
                           <td className="py-5 text-right shadow-sm">
                              <p className="text-sm font-black tabular-nums italic text-slate-800 dark:text-white shadow-sm tracking-tighter">{opp.value}</p>
                           </td>
                           <td className="py-5 shadow-sm">
                              <div className="flex flex-col items-center shadow-sm shadow-sm">
                                 <span className="text-[11px] font-black italic tabular-nums text-indigo-600 mb-1">{opp.probability}%</span>
                                 <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-indigo-500 rounded-full shadow-sm" style={{ width: `${opp.probability}%` }}></div>
                                 </div>
                              </div>
                           </td>
                           <td className="py-5 text-right shadow-sm shadow-sm">
                              <span className="px-3 py-1 bg-amber-50 text-amber-600 dark:bg-amber-900/20 rounded-lg text-[9px] font-black uppercase italic tracking-widest shadow-sm">
                                 {opp.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* SALES TREND & KPI Section */}
         <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-500 opacity-50 shadow-sm"></div>
            
            <div>
               <h3 className="text-4xl font-black italic mb-2 tracking-tighter shadow-sm">₼ 2,845,000</h3>
               <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest italic mb-10 tracking-tighter">İllik Satış Performansı</p>
               
               <div className="grid grid-cols-2 gap-8 shadow-sm">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all cursor-pointer shadow-sm shadow-sm">
                     <div className="flex items-center space-x-3 mb-4">
                        <ArrowUpRight className="w-5 h-5 text-emerald-400 shadow-sm shadow-sm shadow-sm" />
                        <span className="text-[10px] font-black uppercase italic text-white/50 tracking-widest tracking-tighter shadow-sm">Ümumi Margin</span>
                     </div>
                     <h4 className="text-2xl font-black italic tracking-tight tracking-tighter italic shadow-sm shadow-sm">24.5%</h4>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all cursor-pointer shadow-sm shadow-sm shadow-sm shadow-sm">
                     <div className="flex items-center space-x-3 mb-4 shadow-sm shadow-sm shadow-sm shadow-sm">
                        <ArrowDownRight className="w-5 h-5 text-rose-400 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" />
                        <span className="text-[10px] font-black uppercase italic text-white/50 tracking-widest tracking-tighter shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">Returns</span>
                     </div>
                     <h4 className="text-2xl font-black italic tracking-tight tracking-tighter italic shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">1.8%</h4>
                  </div>
               </div>
            </div>

            <div className="mt-12 flex items-center justify-between p-8 bg-indigo-500 rounded-[2.5rem] shadow-xl shadow-indigo-500/20 group-hover:scale-[1.02] transition-all duration-500">
               <div className="shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest italic text-indigo-100 mb-1 tracking-tighter shadow-sm">Mart Ayı Hedefi</p>
                  <h4 className="text-2xl font-black italic tabular-nums tracking-tighter shadow-sm shadow-sm shadow-sm shadow-sm">₼ 320,000 / 92%</h4>
               </div>
               <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm">
                  <ChevronRight className="w-8 h-8 text-white shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm shadow-sm" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
