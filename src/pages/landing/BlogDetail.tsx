import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';
import { Calendar, Clock, User, Search, ChevronRight, Tag } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();

  // Mock data for the specific post (based on reference image)
  const post = {
    title: '5 Rules to keep in mind when negotiating a job',
    category: 'Marketing',
    author: 'Avitex',
    date: '2 gün öncə',
    readTime: '8 dəqiqə',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
    content: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum sed mauris eu imperdiet. Donec congue orci nec mi luctus, ut faucibus mauris scelerisque. Donec orci lorem, volutpat a mauris nec, sodales imperdiet urna. Sed dictum enim libero, interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas ligula libero, pharetra non dolor et, tempor bibendum magna. Mauris a efficitur nisi.

      Praesent interdum lacus ac est viverra hendrerit. Aliquam dapibus, ante vitae mattis gravida, purus sapien interdum magna, convallis volutpat est turpis pulvinar dui. Aenean eu turpis est. In hac habitasse platea dictumst. Integer at lobortis metus. Proin molestie eget massa vel gravida. Suspendisse nec ante vel augue consectetur mollis.
    `,
    subImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600'
    ],
    secondaryTitle: 'How To Deal With Employee Quitting',
    secondaryContent: `
      Donec eu dui condimentum, laoreet nulla vitae, venenatis ipsum. Donec luctus sem sit amet varius laoreet. Aliquam fermentum sit amet urna fringilla tincidunt. Vestibulum ullamcorper nec lacus ac molestie. Curabitur congue neque sed nisi auctor consequat. Pellentesque rhoncus tortor vitae ipsum sagittis tempor.

      Vestibulum et pharetra arcu. In porta lobortis turpis. Ut faucibus fermentum posuere. Suspendisse potenti. Mauris a metus sed est semper vestibulum. Mauris tortor sem, consectetur vehicula vulputate id, suscipit vel leo.
    `,
    points: [
      '15+ years of industry experience designing, building, and supporting large-scale distributed systems in production, with recent experience in building large scale cloud services.',
      'Deep knowledge and experience with different security areas like identity and access management, cryptography, network security, etc.',
      'Experience with database systems and database internals, such as query engines and optimizers are a big plus.',
      'Strong fundamentals in computer science skills.',
      'Expert-level development skills in Java or C++.',
      'Knowledge of industry standard security concepts and protocols like SAML, SCIM, OAuth, RBAC, cryptography is a plus.',
      'Advanced degree in Computer Science or related degree.',
      'Ph.D. in the related field is a plus.'
    ],
    footerContent: `
      Curabitur aliquam ac arcu in mattis. Phasellus pulvinar erat at aliquam hendrerit. Nam ut velit dolor. Sed fermentum tempus odio, ac faucibus elit scelerisque consequat. Fusce ac malesuada elit. Nam at aliquam libero, quis lacinia erat. In hac habitasse platea dictumst. Suspendisse id dolor orci. Vivamus at aliquam tellus. Vestibulum a augue ac purus suscipit varius non eget lectus. Nam lobortis mauris luctus tristique feugiat. Nulla eleifend risus sit amet nisi feugiat, id eleifend sapien malesuada. Phasellus venenatis convallis mattis. Duis vel tempor eros. Mauris semper sollicitudin neque, imperdiet ultrices urna maximus id.
    `
  };

  const recentPosts = [
    { title: 'September Most-Loved Best Selling Fall Pieces', date: 'Oct 12, 2024', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=150', category: 'Development' },
    { title: '5 Rules To Keep In Mind When Negotiating A Job', date: 'Oct 10, 2024', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150', category: 'Design' },
    { title: 'Strategies To Increase Salary With Job Offers', date: 'Oct 08, 2024', image: 'https://images.unsplash.com/photo-1454165833767-026544978b71?auto=format&fit=crop&q=80&w=150', category: 'Business' },
  ];

  const categories = [
    { name: 'Business', count: 12 },
    { name: 'Interview', count: 8 },
    { name: 'Career', count: 5 },
    { name: 'Company', count: 3 },
  ];

  const tags = ['Featured', 'Experience', 'Interview', 'Skill', 'Business', 'Featured'];

  return (
    <div className="min-h-screen bg-white font-sans">
      <LandingHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left Content Column */}
            <div className="lg:w-3/4">
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8 font-medium">
                <Link to="/landing" className="hover:text-[#2D5BFF]">Ana səhifə</Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/blog" className="hover:text-[#2D5BFF]">Bloq</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-800 font-bold truncate">{post.title}</span>
              </nav>

              {/* Header */}
              <div className="mb-10">
                <span className="inline-block px-4 py-1.5 bg-[#2D5BFF]/10 text-[#2D5BFF] text-xs font-black uppercase rounded-lg mb-6">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                  {post.title}
                </h1>
                <div className="flex items-center space-x-6 text-sm text-slate-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>by <span className="text-slate-900 font-bold">{post.author}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime} oxuma</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl">
                <img src={post.image} alt={post.title} className="w-full h-[500px] object-cover" />
              </div>

              {/* Article Content */}
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed mb-10 whitespace-pre-line font-medium">
                  {post.content}
                </p>

                {/* Sub-images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {post.subImages.map((img, idx) => (
                    <div key={idx} className="rounded-3xl overflow-hidden shadow-xl">
                      <img src={img} alt={`Detail ${idx}`} className="w-full h-64 object-cover" />
                    </div>
                  ))}
                </div>

                <h2 className="text-3xl font-black text-slate-900 mb-8">{post.secondaryTitle}</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-10 whitespace-pre-line font-medium">
                  {post.secondaryContent}
                </p>

                {/* Points List */}
                <ul className="space-y-4 mb-12">
                  {post.points.map((point, idx) => (
                    <li key={idx} className="flex items-start space-x-4 text-slate-600 font-medium leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-[#2D5BFF] mt-2.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-lg text-slate-600 leading-relaxed mb-10 whitespace-pre-line font-medium">
                  {post.footerContent}
                </p>
              </div>
            </div>

            {/* Right Sidebar Column */}
            <div className="lg:w-1/4">
              <div className="sticky top-32 space-y-12">
                
                {/* Search */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 focus:border-[#2D5BFF] focus:outline-none transition-all font-medium"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                    Categories
                  </h3>
                  <div className="space-y-4">
                    {categories.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-slate-500 font-bold group-hover:text-[#2D5BFF] transition-colors">{cat.name}</span>
                        <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-[#2D5BFF]/10 group-hover:text-[#2D5BFF] transition-all">
                          {cat.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Posts */}
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center">
                    Recent Posts
                  </h3>
                  <div className="space-y-8">
                    {recentPosts.map((rp, idx) => (
                      <div key={idx} className="flex gap-4 group cursor-pointer">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                          <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-[10px] font-black text-[#2D5BFF] uppercase tracking-wider mb-1.5">
                            {rp.category}
                          </span>
                          <h4 className="text-sm font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-[#2D5BFF] transition-colors">
                            {rp.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Tags */}
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-500 text-[11px] font-bold rounded-xl hover:bg-[#2D5BFF] hover:text-white transition-all cursor-pointer border border-slate-100 shadow-sm uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
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

export default BlogDetail;
