import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const posts = [
  {
    category: 'ERP',
    title: 'ERP sisteminin biznesinizə 5 əsas faydası',
    excerpt: 'Müasir ERP sistemləri biznes proseslərini avtomatlaşdıraraq məhsuldarlığı artırır, xərcləri azaldır və şəffaflığı təmin edir.',
    date: '15 Aprel 2024',
    readTime: '5 dəqiqə',
    author: 'Əli Həsənov',
  },
  {
    category: 'AI',
    title: 'Süni intellekt ERP-də yeni era açır',
    excerpt: 'AI texnologiyaları biznes proqnozlaşdırmasında, avtomatlaşdırmada və analitikada inqilab yaradır.',
    date: '8 Aprel 2024',
    readTime: '7 dəqiqə',
    author: 'Nigar Məmmədova',
  },
  {
    category: 'HRM',
    title: 'Rəqəmsal HR: Əməkdaşları necə idarə etməli?',
    excerpt: 'Müasir HRM sistemləri işə qəbuldan tutmuş əmək haqqı hesablamasına qədər bütün HR proseslərini sadələşdirir.',
    date: '1 Aprel 2024',
    readTime: '6 dəqiqə',
    author: 'Ruslan Əliyev',
  },
  {
    category: 'Maliyyə',
    title: 'Maliyyə hesabatları avtomatlaşdırma üstünlükləri',
    excerpt: 'Manual hesabatlardan əl çəkin. Avtomatik maliyyə hesabatları vaxtınıza qənaət edir və xətaları azaldır.',
    date: '22 Mart 2024',
    readTime: '4 dəqiqə',
    author: 'Leyla Quliyeva',
  },
  {
    category: 'CRM',
    title: 'Müştəri münasibətlərini CRM ilə gücləndir',
    excerpt: 'CRM sistemi müştəri məlumatlarını mərkəzləşdirərək satış komandanızın səmərəliliyini artırır.',
    date: '15 Mart 2024',
    readTime: '5 dəqiqə',
    author: 'Tural Hüseynov',
  },
  {
    category: 'Anbar',
    title: 'Anbar idarəsi: Səhvlər və həlləri',
    excerpt: 'Anbar idarəsindəki ən çox rastlanan problemlər və onların müasir ERP sistemləri ilə həlli.',
    date: '5 Mart 2024',
    readTime: '8 dəqiqə',
    author: 'Aytən Babayeva',
  },
];

const categoryColors: Record<string, string> = {
  ERP: 'bg-violet-100 text-violet-700',
  AI: 'bg-cyan-100 text-cyan-700',
  HRM: 'bg-blue-100 text-blue-700',
  Maliyyə: 'bg-amber-100 text-amber-700',
  CRM: 'bg-emerald-100 text-emerald-700',
  Anbar: 'bg-orange-100 text-orange-700',
};

const Blog = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white font-sans">
      <LandingHeader />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 text-sm text-slate-400 font-medium">
            <a href="/landing" className="hover:text-[#2D5BFF]">Ana səhifə</a>
            <span className="mx-2">›</span>
            <span className="text-slate-700 font-bold">Bloq</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Bloq</h1>
          <p className="text-slate-500 text-lg mb-16">ERP, AI, biznes avtomatlaşdırma haqqında son məqalələr</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <article 
                key={idx} 
                onClick={() => navigate(`/blog/${idx}`)}
                className="group bg-white border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-[#2D5BFF] hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative">
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${categoryColors[post.category] || 'bg-slate-100 text-slate-600'}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h2 className="text-xl font-black text-slate-800 mb-4 group-hover:text-[#2D5BFF] transition-colors">{post.title}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1"><Calendar className="w-3.5 h-3.5" /><span>{post.date}</span></span>
                      <span className="flex items-center space-x-1"><Clock className="w-3.5 h-3.5" /><span>{post.readTime}</span></span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:text-[#2D5BFF] transition-colors" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default Blog;
