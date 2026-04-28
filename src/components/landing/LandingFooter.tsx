import React from 'react';

// SVG Social Icons (lucide-react doesn't export Facebook/Instagram/etc.)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);
const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .126 4.144l3.918 1.504 2.25 6.75a.75.75 0 0 0 1.28.21l2.43-2.844 4.484 3.116a2.25 2.25 0 0 0 3.493-1.68l1.5-17.25a2.25 2.25 0 0 0-2.46-1.665z"/>
  </svg>
);

import { MessageCircle, Send } from 'lucide-react';

const LandingFooter = () => {
    const socialLinks = [
        { icon: FacebookIcon, color: 'bg-blue-600', path: '#' },
        { icon: LinkedinIcon, color: 'bg-blue-700', path: '#' },
        { icon: InstagramIcon, color: 'bg-pink-600', path: '#' },
        { icon: YoutubeIcon, color: 'bg-red-600', path: '#' },
        { icon: MessageCircle, color: 'bg-green-500', path: '#' },
        { icon: Send, color: 'bg-sky-500', path: '#' },
    ];

    const menuLinks = [
        { title: 'Contact us', links: [
            { name: 'qmirismayil@gmail.com', sub: '' },
            { name: '+994 55 424 81 26', sub: '' },
            { name: 'Bakı, N.Nərimanov Luxen Plaza', sub: '' },
            { name: 'Post index: AZ1011', sub: '' }
        ]},
        { title: 'Menu', links: [
            { name: 'Product', path: '/platform' },
            { name: 'Industries', path: '/industries' },
            { name: 'Explore SBP', path: '/explore' },
            { name: 'Learning Program', path: '/training' },
            { name: 'Careers', path: '/careers' },
            { name: 'FAQ', path: '/faq' }
        ]},
        { title: 'Term & Conditions', links: [
            { name: 'Privacy', path: '/privacy' },
            { name: 'Terms of Use', path: '/terms' },
            { name: 'Legal Disclosure', path: '/legal' },
            { name: 'Copyright', path: '/copyright' },
            { name: 'Trademark', path: '/trademark' },
            { name: 'Cookie Preferences', path: '/cookies' }
        ]}
    ];

    return (
        <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#2D5BFF] rounded-lg flex items-center justify-center text-white font-black text-xs">SBP</div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Solution to Business</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processes Management</span>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Azərbaycanın ən müasir ERP sistemi. Biznesinizi avtomatlaşdırmaq üçün bizimlə qalın.</p>
                    </div>
                    {menuLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <a href={(link as any).path || '#'} className="text-sm font-medium text-slate-500 hover:text-[#2D5BFF] transition-colors">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2024 "SBP" Solution to Business Process Management</p>
                    <div className="flex items-center space-x-3">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-widest mr-2">Follow us:</span>
                        {socialLinks.map((social, idx) => (
                            <a key={idx} href={social.path} className={`w-8 h-8 rounded-full ${social.color} flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
                                <social.icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
