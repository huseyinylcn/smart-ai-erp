import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronDown, Search, LogIn, Menu, X, Globe,
  Users, BarChart2, Briefcase, Phone, Package, ShoppingCart, TrendingUp, FileText,
  MousePointer2, MessageCircle, Share2, Database, Layout, ShieldCheck,
  Building2, Scale, HeartPulse, Truck, Utensils, Construction,
  Rocket, Zap, Smartphone, Settings, LayoutGrid, Monitor
} from 'lucide-react';

// Internal icon for task list as lucide check-circle-2 wasn't in the list
const CheckCircleIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const LandingHeader = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [activeLang, setActiveLang] = useState('AZ');
    const [scrolled, setScrolled] = useState(false);
    const [activeMega, setActiveMega] = useState<string | null>(null);
    const [activeSub, setActiveSub] = useState('Collaboration');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const productCategories = [
        { id: 'CRM', name: 'CRM', icon: Briefcase },
        { id: 'Tasks', name: 'TASKS & PROJECTS', icon: CheckCircleIcon },
        { id: 'Collaboration', name: 'COLLABORATION', icon: Share2 },
        { id: 'Sites', name: 'SITES & STORES', icon: ShoppingCart },
        { id: 'HR', name: 'HR & AUTOMATION', icon: Users },
        { id: 'Copilot', name: 'COPILOT', icon: Zap },
    ];

    const collaborationFeatures = [
        { title: 'Online workspace', desc: 'Use chat, activity feed, comments, reactions, company-wide video announcements' },
        { title: 'Online documents & file storage', desc: 'Store, share and edit documents online easily with co-workers using company drive' },
        { title: 'Workgroups', desc: 'Create workgroups, invite external users, set access permissions and work on tasks and projects' },
        { title: 'Online meetings', desc: 'Do more with video calls, video conferencing, screen sharing, call recording and custom backgrounds' },
        { title: 'Shared calendars', desc: 'Plan with company & personal calendar, open time slots, meeting room booking, calendar sync' },
        { title: 'Mobile communications', desc: 'Team messenger, video calls, comments, calendar, notifications anywhere' },
        { title: 'CoPilot in Chat', desc: 'Unlimited source of ideas, AI-generated texts, brainstorming, and more' },
    ];

    const solutionsData = [
        { title: 'ROLE', items: ['Marketing', 'HR', 'Project management', 'Customer service'], icon: Users },
        { title: 'INDUSTRY', items: ['Legal', 'Healthcare', 'Real estate', 'Transportation & storage', 'Restaurant', 'Consulting', 'Travel', 'Construction', 'Marketing agency', 'Software development teams', 'Retail'], icon: Building2 },
        { title: 'GOAL', items: ['Productivity', 'Communication', 'Mobility', 'Management & leadership'], icon: Rocket },
        { title: 'TOOL', items: ['Telephony', 'CRM', 'Calendars', 'Contact center', 'Tasks & projects', 'Website builder'], icon: Settings },
        { title: 'BUSINESS SIZE', items: ['Solo entrepreneur', 'Small business', 'Enterprise'], icon: LayoutGrid },
    ];

    const integrationsData = [
        { title: 'IMPORT & EXPORT', items: ['Tasks: completion time', 'Backup', 'SPA IMPORTER', 'ABC Analysis (Products)'], icon: Database },
        { title: 'SALES & CRM', items: ['[ADIGITRANS] Zalo OA for Bitrix24', 'PayU Integration', 'Edward. CRM assistant', 'Calculator in Deals'], icon: Briefcase },
        { title: 'MARKETING', items: ['SMSAPI', 'TextLocal SMS', 'RESALA', 'WA Connector for Gupshup'], icon: MessageCircle },
        { title: 'TASKS & PROJECTS', items: ['Miro Boards', 'REST Activity - Expands business process capabilities', 'Helpdesk', 'Project Expenses'], icon: CheckCircleIcon },
    ];

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
                scrolled 
                ? 'bg-white shadow-xl py-2' 
                : 'bg-[#2D5BFF] py-4'
            }`}
            onMouseLeave={() => setActiveMega(null)}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* LOGO */}
                    <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-lg ${
                            scrolled ? 'bg-[#2D5BFF] text-white' : 'bg-white text-[#2D5BFF]'
                        }`}>
                            <span className="font-black text-sm">SBP</span>
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-sm font-black uppercase tracking-tight leading-none ${
                                scrolled ? 'text-slate-800' : 'text-white'
                            }`}>Solution to Business</span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
                                scrolled ? 'text-slate-400' : 'text-white/60'
                            }`}>Processes Management</span>
                        </div>
                    </div>

                    {/* NAV */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        <button 
                            onMouseEnter={() => setActiveMega('product')}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-widest flex items-center space-x-1 rounded-lg transition-all ${
                                scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                            } ${activeMega === 'product' ? (scrolled ? 'text-[#2D5BFF]' : 'text-yellow-300') : ''}`}
                        >
                            <span>Məhsullar</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${activeMega === 'product' ? 'rotate-180' : ''}`} />
                        </button>

                        <button 
                            onMouseEnter={() => setActiveMega('solutions')}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-widest flex items-center space-x-1 rounded-lg transition-all ${
                                scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                            } ${activeMega === 'solutions' ? (scrolled ? 'text-[#2D5BFF]' : 'text-yellow-300') : ''}`}
                        >
                            <span>Həllərimiz</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${activeMega === 'solutions' ? 'rotate-180' : ''}`} />
                        </button>

                        <button 
                            onMouseEnter={() => setActiveMega('integrations')}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-widest flex items-center space-x-1 rounded-lg transition-all ${
                                scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                            } ${activeMega === 'integrations' ? (scrolled ? 'text-[#2D5BFF]' : 'text-yellow-300') : ''}`}
                        >
                            <span>İnteqrasiyalar</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${activeMega === 'integrations' ? 'rotate-180' : ''}`} />
                        </button>

                        {['Pricing', 'Partners', 'Why SBP'].map(item => (
                            <Link 
                                key={item} 
                                to="#" 
                                className={`px-4 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-all ${
                                    scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                                }`}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* ACTIONS */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <button className={`${scrolled ? 'text-slate-400 hover:text-[#2D5BFF]' : 'text-white/60 hover:text-white'} transition-colors`}>
                            <Search className="w-5 h-5" />
                        </button>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className={`flex items-center space-x-1 text-xs font-black px-3 py-2 rounded-lg transition-all ${
                                    scrolled ? 'text-slate-600 hover:bg-slate-50' : 'text-white hover:bg-white/10'
                                }`}
                            >
                                <Globe className="w-4 h-4" />
                                <span>{activeLang}</span>
                            </button>
                            {isLangOpen && (
                                <div className="absolute top-full right-0 mt-2 w-24 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden">
                                    {['AZ', 'EN', 'RU'].map(l => (
                                        <button key={l} onClick={() => { setActiveLang(l); setIsLangOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-[#2D5BFF]">{l}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={() => navigate('/auth/login')} className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                            scrolled 
                            ? 'bg-[#2D5BFF] text-white hover:bg-blue-600' 
                            : 'bg-white text-[#2D5BFF] hover:bg-blue-50'
                        }`}>
                            <LogIn className="w-4 h-4" />
                            <span>Daxil ol</span>
                        </button>
                    </div>

                    <button className="lg:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* MEGA MENU: PRODUCT */}
            {activeMega === 'product' && (
                <div className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-2xl font-sans" onMouseEnter={() => setActiveMega('product')}>
                    <div className="max-w-7xl mx-auto flex min-h-[500px]">
                        <div className="w-1/4 bg-slate-50 border-r border-slate-100 p-8 space-y-2">
                            {productCategories.map(cat => (
                                <button 
                                    key={cat.id}
                                    onMouseEnter={() => setActiveSub(cat.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                                        activeSub === cat.id ? 'bg-[#2D5BFF] text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <cat.icon className="w-5 h-5" />
                                        <span className="text-xs font-black uppercase tracking-widest">{cat.name}</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                                </button>
                            ))}
                            <div className="pt-8 mt-8 border-t border-slate-200">
                                <Link to="#" className="text-sm font-bold text-[#2D5BFF] hover:underline flex items-center space-x-2">
                                    <span>Bütün modullar</span>
                                    <ChevronDown className="w-4 h-4 -rotate-90" />
                                </Link>
                            </div>
                        </div>
                        <div className="w-3/4 p-12 bg-white">
                            <div className="flex items-center space-x-3 mb-10">
                                <Share2 className="w-6 h-6 text-[#2D5BFF]" />
                                <h3 className="text-2xl font-black text-slate-800">{activeSub}</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-x-12 gap-y-10">
                                {collaborationFeatures.map((f, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <h4 className="font-black text-slate-800 mb-2 group-hover:text-[#2D5BFF] transition-colors">{f.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{f.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MEGA MENU: SOLUTIONS */}
            {activeMega === 'solutions' && (
                <div className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-2xl font-sans" onMouseEnter={() => setActiveMega('solutions')}>
                    <div className="max-w-7xl mx-auto p-12 grid grid-cols-5 gap-10">
                        {solutionsData.map(col => (
                            <div key={col.title}>
                                <div className="flex items-center space-x-2 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <col.icon className="w-5 h-5 text-[#2D5BFF]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{col.title}</span>
                                </div>
                                <ul className="space-y-4">
                                    {col.items.map(item => (
                                        <li key={item}>
                                            <Link to="#" className="text-sm font-semibold text-slate-600 hover:text-[#2D5BFF] transition-colors">{item}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MEGA MENU: INTEGRATIONS */}
            {activeMega === 'integrations' && (
                <div className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-2xl font-sans" onMouseEnter={() => setActiveMega('integrations')}>
                    <div className="max-w-7xl mx-auto p-12 grid grid-cols-4 gap-12">
                        {integrationsData.map(col => (
                            <div key={col.title}>
                                <div className="flex items-center space-x-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <col.icon className="w-5 h-5 text-[#2D5BFF]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{col.title}</span>
                                </div>
                                <ul className="space-y-4">
                                    {col.items.map(item => (
                                        <li key={item} className="flex items-center space-x-3 group cursor-pointer">
                                            <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center group-hover:bg-[#2D5BFF] transition-colors">
                                                <Zap className="w-3 h-3 text-slate-400 group-hover:text-white" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};


export default LandingHeader;
