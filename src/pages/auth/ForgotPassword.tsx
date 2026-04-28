import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Loader2, AlertCircle, ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSent(true);
        } catch (err: any) {
            setError('Xəta baş verdi. Yenidən yoxlayın.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md space-y-8">
                
                <div className="flex flex-col items-center space-y-6">
                    <button 
                        onClick={() => navigate('/auth/login')}
                        className="group flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Giriş səhifəsinə qayıt</span>
                    </button>
                    
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                            <Globe className="text-white w-7 h-7" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">SmartAgent <span className="text-blue-600">ERP</span></span>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-10 md:p-12 border border-white">
                    {!isSent ? (
                        <>
                            <div className="space-y-2 mb-10 text-center">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Şifrəni bərpa et</h1>
                                <p className="text-slate-500 text-sm">Email ünvanınızı daxil edin, sizə bərpa linki göndərək</p>
                            </div>

                            {error && (
                                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-3 text-rose-600 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Ünvanı</label>
                                    <input 
                                        type="email"
                                        required
                                        placeholder="nümunə@tengry.az"
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-900"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3"
                                >
                                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            <Mail className="w-5 h-5" />
                                            <span>Link göndər</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Mail className="w-10 h-10 text-blue-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Email göndərildi</h2>
                            <p className="text-slate-500 mb-10 leading-relaxed">
                                <b>{email}</b> ünvanına bərpa linki göndərildi. Zəhmət olmasa emailinizi yoxlayın.
                            </p>
                            <button 
                                onClick={() => navigate('/auth/login')}
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl"
                            >
                                Giriş səhifəsinə qayıt
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-center text-xs text-slate-400 uppercase tracking-[0.2em]">
                    &copy; 2024 SmartAgent ERP
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
