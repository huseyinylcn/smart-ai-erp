import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Loader2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [loginValue, setLoginValue] = useState(''); // Email or VOEN
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await authApi.login({ login: loginValue, password });
            authLogin(response.token, response.user);
            navigate('/'); // Redirect to platform
        } catch (err: any) {
            setError(err.data?.error || 'Giriş zamanı xəta baş verdi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md space-y-8">
                
                {/* LOGO & BACK */}
                <div className="flex flex-col items-center space-y-6">
                    <button 
                        onClick={() => navigate('/landing')}
                        className="group flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Ana səhifəyə qayıt</span>
                    </button>
                    
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                            <Globe className="text-white w-7 h-7" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">SmartAgent <span className="text-blue-600">ERP</span></span>
                    </div>
                </div>

                {/* FORM CARD */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-10 md:p-12 border border-white">
                    <div className="space-y-2 mb-10 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Xoş gəlmisiniz</h1>
                        <p className="text-slate-500 text-sm">Giriş etmək üçün məlumatlarınızı daxil edin</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-3 text-rose-600 text-sm animate-in fade-in zoom-in duration-300">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email və ya VÖEN</label>
                            <input 
                                type="text"
                                required
                                placeholder="nümunə@tengry.az"
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                                value={loginValue}
                                onChange={(e) => setLoginValue(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Şifrə</label>
                                <Link 
                                    to="/auth/forgot-password"
                                    className="text-xs font-bold text-blue-600 hover:underline"
                                >
                                    Şifrəni unutmusunuz?
                                </Link>
                            </div>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300 pr-14"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Daxil ol'}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-500">
                            Hesabınız yoxdur? {' '}
                            <Link to="/auth/register" className="text-blue-600 font-bold hover:underline">
                                Qeydiyyatdan keçin
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 uppercase tracking-[0.2em]">
                    &copy; 2024 SmartAgent ERP
                </p>
            </div>
        </div>
    );
};

export default Login;
