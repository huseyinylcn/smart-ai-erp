import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Globe, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../utils/api';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Validasiya tokeni tapılmadı.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Şifrələr uyğun gəlmir.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await authApi.setPassword({ token, password: formData.password });
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.data?.error || 'Şifrə təyini zamanı xəta baş verdi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md space-y-8">
                
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                            <Globe className="text-white w-7 h-7" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">SmartAgent <span className="text-blue-600">ERP</span></span>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-10 md:p-12 border border-white">
                    {!isSuccess ? (
                        <>
                            <div className="space-y-2 mb-10 text-center">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Şifrəni Təyin Et</h1>
                                <p className="text-slate-500 text-sm">Sistemə daxil olmaq üçün yeni şifrə yaradın</p>
                            </div>

                            {error && (
                                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-3 text-rose-600 text-sm animate-in fade-in zoom-in duration-300">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Yeni Şifrə</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-900 pr-14"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
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

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Şifrənin Təkrarı</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-900 pr-14"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isLoading || !token}
                                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Təsdiqlə'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Uğurlu!</h2>
                            <p className="text-slate-500 mb-10 leading-relaxed">
                                Şifrəniz təyin edildi. İndi sistemə daxil ola bilərsiniz.
                            </p>
                            <button 
                                onClick={() => navigate('/auth/login')}
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25"
                            >
                                Giriş et
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

export default ResetPassword;
