import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  ChevronRight, Briefcase, CheckCircle2, Share2, 
  ShoppingCart, Users, Zap
} from 'lucide-react';

const AllModules = () => {
  const categories = [
    {
      id: 'crm',
      name: 'CRM',
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      features: ['Contact Center', 'Sales Pipeline', 'Invoicing', 'Customer Support', 'Marketing Automation']
    },
    {
      id: 'tasks',
      name: 'Tasks & Projects',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      features: ['Gantt Chart', 'Kanban Board', 'Time Tracking', 'Task Templates', 'Workgroups']
    },
    {
      id: 'collaboration',
      name: 'Collaboration',
      icon: Share2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      features: ['Online Workspace', 'Online Documents', 'Shared Calendars', 'Workgroups', 'Video Calls']
    },
    {
      id: 'sites',
      name: 'Sites & Stores',
      icon: ShoppingCart,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      features: ['Landing Pages', 'E-commerce', 'Visual Editor', 'SEO Tools', 'Forms']
    },
    {
      id: 'hr',
      name: 'HR & Automation',
      icon: Users,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      features: ['Employee Directory', 'Time & Attendance', 'Payroll', 'Recruitment', 'Workflow Automation']
    },
    {
      id: 'copilot',
      name: 'CoPilot (AI)',
      icon: Zap,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      features: ['AI Text Generation', 'Smart Search', 'Task Automation', 'Predictive Analytics', 'Voice Assistant']
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />

      <main className="pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className="text-5xl font-black text-slate-900 mb-6">Bütün Modullar və Funksiyalar</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
              SBP platformasının təklif etdiyi bütün imkanları burada kəşf edin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-[3rem] p-10 border-2 border-slate-50 hover:border-[#2D5BFF] hover:shadow-2xl transition-all group">
                <div className={`w-16 h-16 ${cat.bgColor} ${cat.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center justify-between">
                  {cat.name}
                  <Link to={`/product/${cat.id}`} className="text-[#2D5BFF] hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-6 h-6" />
                  </Link>
                </h3>

                <ul className="space-y-4 mb-8">
                  {cat.features.map((feature) => (
                    <li key={feature}>
                      <Link 
                        to={`/product/${cat.id}/${feature.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-slate-500 hover:text-[#2D5BFF] font-bold text-sm flex items-center space-x-2 transition-colors"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#2D5BFF] transition-colors" />
                        <span>{feature}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default AllModules;
