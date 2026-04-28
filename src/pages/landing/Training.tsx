import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { useAuth } from '../../context/AuthContext';
import { Lock, Play, Clock, ChevronDown, ChevronRight } from 'lucide-react';

const modules = [
  {
    name: 'Banka sahəsı bağlı',
    open: true,
    videos: [
      { title: 'MMC-nin müsbət tərəfləri nəldir?', duration: '7 dəq', youtubeId: 'dQw4w9WgXcQ' },
      { title: 'MMC-nin müsbət tərəfləri nəldir?', duration: '5 dəq', youtubeId: 'dQw4w9WgXcQ' },
      { title: 'MMC-nin müsbət tərəfləri nəldir?', duration: '3 dəq', youtubeId: 'dQw4w9WgXcQ' },
    ]
  },
  { name: 'Naliyyat yaratlar', open: false, videos: [] },
  { name: 'Şirkətin qurulması üçün', open: false, videos: [] },
  { name: 'Ünlüqlər', open: false, videos: [] },
  { name: 'Pul vəsaitlərin hərəkəti', open: false, videos: [] },
  { name: 'Hesabat dövründan sonra', open: false, videos: [] },
];

const Training = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeVideo, setActiveVideo] = useState(modules[0].videos[0]);
  const [openModule, setOpenModule] = useState(0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <LandingHeader />
        <main className="pt-40 pb-24 flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Tədris Proqramı</h1>
          <p className="text-lg text-slate-500 mb-10 max-w-md">Bu bölməyə baxmaq üçün sisteme daxil olmalısınız.</p>
          <button
            onClick={() => navigate('/auth/login')}
            className="px-10 py-5 bg-[#2D5BFF] text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl"
          >
            Daxil ol
          </button>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <LandingHeader />
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-4 text-sm text-slate-400 font-medium">
            <a href="/landing" className="hover:text-[#2D5BFF]">Ana səhifə</a>
            <span className="mx-2">›</span>
            <span className="text-slate-700 font-bold">Tədris proqramı</span>
          </div>
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-80 shrink-0">
              <div className="bg-[#2D5BFF] text-white rounded-2xl p-4 mb-3 text-sm font-black">
                {activeVideo?.title || 'Video seçin'}
                <div className="text-blue-200 text-xs font-medium mt-1">{activeVideo?.duration}</div>
              </div>
              <div className="space-y-2">
                {modules.map((mod, mIdx) => (
                  <div key={mIdx} className="bg-slate-50 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenModule(openModule === mIdx ? -1 : mIdx)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <span>{mod.name}</span>
                      {openModule === mIdx ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {openModule === mIdx && mod.videos.map((vid, vIdx) => (
                      <button
                        key={vIdx}
                        onClick={() => setActiveVideo(vid)}
                        className={`w-full text-left px-4 py-3 flex items-center space-x-3 text-sm transition-colors border-t border-slate-100 ${activeVideo?.title === vid.title ? 'bg-blue-50 text-[#2D5BFF]' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        <Play className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="font-medium">{vid.title}</div>
                          <div className="text-xs text-slate-400 flex items-center mt-0.5"><Clock className="w-3 h-3 mr-1" />{vid.duration}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Video Player */}
            <div className="flex-1">
              <h1 className="text-2xl font-black text-slate-900 mb-6">{activeVideo?.title}</h1>
              <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl mb-8">
                {activeVideo?.youtubeId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">Video seçin</div>
                )}
              </div>
              <div className="prose max-w-none text-slate-600 leading-relaxed">
                <p>Bu video dərsdə platforma haqqında ətraflı məlumat verilir. Modulu tamamladıqdan sonra sertifikat ala bilərsiniz.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default Training;
