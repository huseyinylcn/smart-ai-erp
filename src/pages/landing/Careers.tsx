import React, { useState } from 'react';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  ChevronRight, Clock, MapPin, DollarSign, Star, 
  Heart, Share2, Send, Bookmark, ExternalLink 
} from 'lucide-react';

const Careers = () => {
  const [activeTab, setActiveTab] = useState('Vakansiya');
  const [selectedJobId, setSelectedJobId] = useState(2);

  const tabs = ['Hamısı', 'Bloqlar', 'Events', 'Yenilik', 'Hesabat', 'Xəbər', 'Tezliklə', 'Vakansiya'];

  const jobs = [
    { 
      id: 1,
      title: 'Caregiver For Veterans', 
      company: 'Rockstar Games New York, Inc',
      location: 'Las Vegas, NV 89107, USA',
      posted: '2 days ago',
      tags: ['Full-time', 'Remote'],
      salary: '$83,000 - $110,000 / year',
      daysLeft: 35,
      rating: 4,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Rockstar_Games_Logo.svg',
      color: 'bg-emerald-500'
    },
    { 
      id: 2,
      title: 'Senior UI/UX Designer', 
      company: 'Rockstar Games New York',
      location: 'Las Vegas, NV 89107, USA',
      posted: '2 days ago',
      tags: ['Part-time', 'On-site'],
      salary: '$83,000 - $110,000 / year',
      daysLeft: 32,
      rating: 5,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Rockstar_Games_Logo.svg',
      color: 'bg-blue-500'
    },
    { 
      id: 3,
      title: 'Systems Operator', 
      company: 'Big Fish Games, Inc',
      location: 'Las Vegas, NV 89107, USA',
      posted: '2 days ago',
      tags: ['Contract', 'Remote'],
      salary: '$83,000 - $110,000 / year',
      daysLeft: 27,
      rating: 4,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Globe_Icon.svg/1024px-Globe_Icon.svg.png',
      color: 'bg-sky-500'
    },
    { 
      id: 4,
      title: 'Project Manager', 
      company: 'FullStack Labs, Inc',
      location: 'Las Vegas, NV 89107, USA',
      posted: '2 days ago',
      tags: ['Temporary', 'Remote'],
      salary: '$83,000 - $110,000 / year',
      daysLeft: 24,
      rating: 4,
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      color: 'bg-orange-500'
    }
  ];

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-8 font-bold uppercase tracking-widest">
            <a href="/landing" className="hover:text-[#2D5BFF]">Home</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800">Vakansiya</span>
          </nav>

          <h1 className="text-4xl font-black mb-12">Vakansiya</h1>

          <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
            {/* Left: Job List */}
            <div className="lg:w-[30%] space-y-4">
              {jobs.map(job => (
                <div 
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-xl ${
                    selectedJobId === job.id ? 'border-[#2D5BFF] bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex space-x-3">
                      <div className={`w-10 h-10 rounded-xl ${job.color} flex items-center justify-center text-white font-black shadow-lg overflow-hidden shrink-0`}>
                        <img src={job.logo} alt={job.company} className="w-7 h-7 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-[#2D5BFF] transition-colors">{job.title}</h4>
                        <div className="flex flex-col space-y-1 mt-1">
                          <span className="text-[10px] text-[#2D5BFF] font-black uppercase tracking-widest truncate">{job.company}</span>
                          <div className="flex items-center text-[10px] text-slate-400 font-bold">
                            <MapPin className="w-3 h-3 mr-1 shrink-0" /> <span className="truncate">{job.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-pink-500 transition-colors shrink-0 ml-2">
                      <Heart className={`w-4 h-4 ${selectedJobId === job.id ? 'fill-pink-500 text-pink-500' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-1">
                      {job.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 rounded-md">{tag}</span>
                      ))}
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-2.5 h-2.5 ${i < job.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="flex items-center font-bold text-slate-700">
                      <DollarSign className="w-3 h-3 text-[#2D5BFF]" />
                      <span className="text-[11px]">{job.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Job Details */}
            <div className="hidden lg:block lg:w-[70%]">
              <div className="sticky top-32 bg-white rounded-3xl border-2 border-slate-100 p-10 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex space-x-6">
                    <div className={`w-16 h-16 rounded-2xl ${selectedJob.color} flex items-center justify-center text-white shadow-xl`}>
                       <img src={selectedJob.logo} alt={selectedJob.company} className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedJob.title}</h2>
                      <div className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                        <span className="text-[#2D5BFF] mr-3">{selectedJob.company}</span>
                        <MapPin className="w-4 h-4 mr-1" /> {selectedJob.location}
                        <Clock className="w-4 h-4 ml-4 mr-1" /> {selectedJob.posted}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-pink-500 transition-all border border-slate-100">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="px-8 py-3 bg-[#2D5BFF] text-white rounded-xl font-black text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                      Apply Now
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-10 pb-8 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    {selectedJob.tags.map(tag => (
                      <span key={tag} className="px-4 py-2 bg-slate-100 text-xs font-bold text-slate-600 rounded-xl">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center font-black text-slate-800 ml-6">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    <span className="text-lg">{selectedJob.salary}</span>
                  </div>
                  <div className="ml-auto flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < selectedJob.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>

                <div className="prose prose-slate max-w-none space-y-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-4">Full Job Description</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      Are you a User Experience Designer with a track record of delivering intuitive digital experiences that drive results? Are you a strategic storyteller and systems thinker who can concept and craft smart, world-class campaigns across a variety of mediums?
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-4">The Work You'll Do:</h3>
                    <ul className="space-y-3 text-slate-500 font-medium list-disc pl-5">
                      <li>Support the Creative Directors and Associate Creative Directors of experience design to concept and oversee the production of bold, innovative, award-winning campaigns.</li>
                      <li>Make strategic and tactical UX decisions related to design and usability as well as features and functions.</li>
                      <li>Creates low- and high-fidelity wireframes that represent a user's journey.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-4">Qualifications:</h3>
                    <ul className="space-y-3 text-slate-500 font-medium list-disc pl-5">
                      <li>Bachelor's degree preferred, or equivalent experience.</li>
                      <li>At least 5-8 years of experience with UX and UI design.</li>
                      <li>Strong portfolio showing expert concept, layout, and typographic skills.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Social Profiles:</span>
                    <div className="flex space-x-3">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#2D5BFF] hover:text-white transition-all cursor-pointer">
                          <Share2 className="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="text-xs font-bold text-slate-400 flex items-center hover:text-red-500 transition-colors">
                    <AlertCircleIcon className="w-4 h-4 mr-2" /> Report job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

const AlertCircleIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default Careers;
