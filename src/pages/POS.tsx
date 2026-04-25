import { useState } from 'react';
import { 
  ArrowLeft, Search, ShoppingCart, User, 
  Trash2, Plus, Minus, CreditCard, Banknote 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const POS = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);

  const categories = ['Bütün', 'İçkilər', 'Qəlyanaltı', 'Yeməklər', 'Şirniyyat'];
  const products = [
    { id: 1, name: 'Kapuçino', price: 4.50, category: 'İçkilər', image: '☕' },
    { id: 2, name: 'Sandviç', price: 6.00, category: 'Qəlyanaltı', image: '🥪' },
    { id: 3, name: 'Pasta', price: 12.50, category: 'Yeməklər', image: '🍝' },
    { id: 4, name: 'Keks', price: 3.50, category: 'Şirniyyat', image: '🧁' },
    { id: 5, name: 'Americano', price: 4.00, category: 'İçkilər', image: '☕' },
    { id: 6, name: 'Burger', price: 8.50, category: 'Yeməklər', image: '🍔' },
  ];

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden font-sans select-none animate-in fade-in duration-300">
      {/* POS Header */}
      <header className="h-16 bg-indigo-600 flex items-center justify-between px-6 shrink-0 shadow-lg z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors flex items-center font-bold text-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Dashboard
          </button>
          <div className="h-6 w-px bg-white/20 mx-2"></div>
          <span className="text-white font-black tracking-tighter text-xl">SmartAgent <span className="text-indigo-200">POS</span></span>
        </div>
        
        <div className="flex items-center space-x-6">
           <div className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/10">
              <User className="w-4 h-4 text-indigo-100 mr-2" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">Kassir: Ali Əliyev</span>
           </div>
           <span className="text-white font-black text-lg tabular-nums">{new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </header>

      {/* POS Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Product Grid */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
           {/* Top Search & Category */}
           <div className="flex space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Məhsul adı və ya barkod axtarın..." 
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
           </div>

           <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
              {categories.map(cat => (
                <button key={cat} className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${cat === 'Bütün' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
                  {cat}
                </button>
              ))}
           </div>

           {/* Grid */}
           <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pr-2 custom-scrollbar">
              {products.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => addToCart(product)}
                  className="bg-white p-4 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-slate-100 group"
                >
                   <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
                      {product.image}
                   </div>
                   <h4 className="font-bold text-slate-800 mb-1">{product.name}</h4>
                   <div className="flex justify-between items-center mt-2">
                      <span className="text-indigo-600 font-black">{product.price.toFixed(2)} AZN</span>
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Plus className="w-4 h-4" />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Side: Cart / Checkout */}
        <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-10">
           <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center">
                <ShoppingCart className="w-5 h-5 mr-3 text-indigo-600" /> Sifariş Siyahısı
              </h3>
              <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black">{cart.length} ELEMENT</span>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                   <div className="w-20 h-20 border-4 border-dashed border-slate-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-8 h-8 opacity-20" />
                   </div>
                   <p className="font-bold">Səbət boşdur</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                     <div className="flex items-center">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 text-lg">{item.image}</div>
                        <div>
                           <div className="text-sm font-bold text-slate-800">{item.name}</div>
                           <div className="text-[11px] font-black text-indigo-500">{item.price.toFixed(2)} AZN</div>
                        </div>
                     </div>
                     <div className="flex items-center space-x-2">
                        <button className="w-6 h-6 rounded bg-white text-slate-400 hover:text-indigo-600 flex items-center justify-center shadow-sm"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-black w-6 text-center">{item.qty}</span>
                        <button className="w-6 h-6 rounded bg-white text-slate-400 hover:text-indigo-600 flex items-center justify-center shadow-sm"><Plus className="w-3 h-3" /></button>
                     </div>
                  </div>
                ))
              )}
           </div>

           {/* Totals */}
           <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="space-y-2 mb-6">
                 <div className="flex justify-between text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <span>Cəmi</span>
                    <span>{total.toFixed(2)} AZN</span>
                 </div>
                 <div className="flex justify-between text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <span>ƏDV (0%)</span>
                    <span>0.00 AZN</span>
                 </div>
                 <div className="flex justify-between text-slate-800 font-black text-xl pt-2 border-t border-slate-200 mt-2">
                    <span>Yekun</span>
                    <span className="text-indigo-600">{total.toFixed(2)} AZN</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                 <button className="flex flex-col items-center justify-center py-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-indigo-400 transition-all group">
                    <Banknote className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 mb-2" />
                    <span className="text-[11px] font-black uppercase text-slate-500">Nəğd</span>
                 </button>
                 <button className="flex flex-col items-center justify-center py-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-indigo-400 transition-all group">
                    <CreditCard className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 mb-2" />
                    <span className="text-[11px] font-black uppercase text-slate-500">Kart</span>
                 </button>
              </div>

              <button className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 hover:-translate-y-1 transition-all active:scale-95">
                 Ödəniş Et
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
