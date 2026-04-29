import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  ChevronRight, Plus, Minus, Search, HelpCircle, 
  MessageSquare, BookOpen, Settings, Zap, Globe
} from 'lucide-react';

const AllProducts = () => {
  const [expanded, setExpanded] = useState<string | null>('crm');

  const modules = [
    {
      id: 'crm',
      name: 'CRM',
      subcategories: [
        {
          name: 'First steps',
          links: ['CRM Implementation steps', 'Choose a CRM mode', 'CRM overview', 'Visit option in CRM', 'Add products to lead, deal, estimate and invoice forms']
        },
        {
          name: 'Leads',
          links: ['Create leads', 'Convert leads', 'Lead statuses', 'Lead reports']
        },
        {
          name: 'Deals',
          links: ['Manage deals', 'Sales pipelines', 'Recurring deals', 'Deal analytics']
        }
      ]
    },
    {
      id: 'tasks',
      name: 'Tasks and Projects',
      subcategories: [
        {
          name: 'Basic tasks',
          links: ['Create tasks', 'Task roles', 'Checklists', 'Task statuses']
        },
        {
          name: 'Project management',
          links: ['Workgroups and Projects', 'Gantt chart', 'Kanban for tasks', 'Efficiency']
        }
      ]
    },
    {
      id: 'ai',
      name: 'CoPilot - AI in SBP',
      subcategories: [
        {
          name: 'Getting started',
          links: ['What is CoPilot?', 'AI settings', 'Available models']
        }
      ]
    },
    {
      id: 'drive',
      name: 'SBP Drive',
      subcategories: [
        {
          name: 'File management',
          links: ['Upload files', 'Share settings', 'Version history', 'Disk cleaning']
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <LandingHeader />

      <main className="pt-40 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar / Left Column: Accordion List */}
            <div className="lg:w-1/3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-fit">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-900">Məhsul Kataloqu</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {modules.map((mod) => (
                  <div key={mod.id} className="overflow-hidden">
                    <button 
                      onClick={() => setExpanded(expanded === mod.id ? null : mod.id)}
                      className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          expanded === mod.id ? 'bg-[#2D5BFF] text-white' : 'bg-blue-100 text-[#2D5BFF]'
                        }`}>
                          {expanded === mod.id ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                        <span className={`font-black text-sm uppercase tracking-widest ${
                          expanded === mod.id ? 'text-[#2D5BFF]' : 'text-slate-700'
                        }`}>
                          {mod.name}
                        </span>
                      </div>
                    </button>
                    
                    {expanded === mod.id && (
                      <div className="px-10 pb-8 space-y-8 animate-in slide-in-from-top-4 duration-300">
                        {mod.subcategories.map((sub, i) => (
                          <div key={i}>
                            <h4 className="text-xs font-black text-[#2D5BFF] uppercase tracking-widest mb-4 flex items-center">
                              <ChevronRight className="w-3 h-3 mr-2 rotate-90" />
                              {sub.name}
                            </h4>
                            <ul className="space-y-3 pl-5 border-l-2 border-slate-50">
                              {sub.links.map((link, j) => (
                                <li key={j}>
                                  <Link 
                                    to={`/product/${mod.id}/${link.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-sm font-medium text-slate-500 hover:text-[#2D5BFF] transition-colors block"
                                  >
                                    {link}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Search & Featured */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm mb-12">
                <h1 className="text-4xl font-black text-slate-900 mb-8">Sizə necə kömək edə bilərik?</h1>
                <div className="relative mb-12">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Mövzu, modul və ya funksiya axtarın..." 
                    className="w-full pl-16 pr-8 py-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-[#2D5BFF] focus:bg-white transition-all font-medium text-slate-700 outline-none shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-[2rem] bg-blue-50 border border-blue-100 group hover:bg-[#2D5BFF] transition-all cursor-pointer">
                    <BookOpen className="w-10 h-10 text-[#2D5BFF] mb-6 group-hover:text-white transition-all" />
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-white transition-all">Təlimatlar</h3>
                    <p className="text-slate-500 text-sm font-medium group-hover:text-blue-100 transition-all">Modulların istifadəsi üzrə addım-addım sənədlər.</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100 group hover:bg-emerald-600 transition-all cursor-pointer">
                    <Zap className="w-10 h-10 text-emerald-600 mb-6 group-hover:text-white transition-all" />
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-white transition-all">Yeniliklər</h3>
                    <p className="text-slate-500 text-sm font-medium group-hover:text-emerald-50 transition-all">Son əlavə edilən funksiyalar və yenilənmələr.</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Dəstək', icon: MessageSquare, color: 'text-pink-500' },
                  { title: 'Video Kurslar', icon: Globe, color: 'text-indigo-500' },
                  { title: 'Ayarlamalar', icon: Settings, color: 'text-amber-500' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center space-x-4 hover:shadow-lg transition-all cursor-pointer">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                    <span className="font-black text-xs uppercase tracking-widest text-slate-700">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default AllProducts;
