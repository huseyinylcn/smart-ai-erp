import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Loader2, AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../utils/api';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        taxId: '',
        adminEmail: '',
        adminPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.adminPassword !== formData.confirmPassword) {
            setError('Şifrələr uyğun gəlmir.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await authApi.registerCompany(formData);
            setStep(3); // Success step
        } catch (err: any) {
            setError(err.data?.error || 'Qeydiyyat zamanı xəta baş verdi.');
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
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-10 md:p-12 border border-white relative overflow-hidden">
                    
                    {step < 3 && (
                        <div className="absolute top-0 left-0 h-1 bg-slate-100 w-full">
                            <div className={`h-full bg-blue-600 transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-10 duration-500">
                            <div className="space-y-2 mb-10 text-center">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Şirkət Qeydiyyatı</h1>
                                <p className="text-slate-500 text-sm">Biznesiniz üçün profil yaradın</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Şirkətin Adı</label>
                                    <input 
                                        type="text"
                                        placeholder="Məs: Tengry Supply MMC"
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-900"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">VÖEN (10 rəqəmli)</label>
                                    <input 
                                        type="text"
                                        maxLength={10}
                                        placeholder="1234567890"
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-900"
                                        value={formData.taxId}
                                        onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                                    />
                                </div>

                                <button 
                                    onClick={() => setStep(2)}
                                    disabled={!formData.companyName || formData.taxId.length < 10}
                                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3"
                                >
                                    <span>Davam et</span>
                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-10 duration-500">
                            <div className="space-y-2 mb-10 text-center">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Hesabı</h1>
                                <p className="text-slate-500 text-sm">Giriş məlumatlarınızı təyin edin</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-3 text-rose-600 text-sm">
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
                                        placeholder="admin@sirket.az"
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-900"
                                        value={formData.adminEmail}
                                        onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Şifrə</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-900 pr-14"
                                            value={formData.adminPassword}
                                            onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
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

                                <div className="flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 bg-slate-50 text-slate-500 py-5 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                                    >
                                        Geri
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-[0.98] flex items-center justify-center"
                                    >
                                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Tamamla'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-10 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Təbriklər!</h2>
                            <p className="text-slate-500 mb-10 leading-relaxed">
                                Şirkətiniz uğurla qeydiyyatdan keçdi. İndi daxil olaraq işə başlaya bilərsiniz.
                            </p>
                            <button 
                                onClick={() => navigate('/auth/login')}
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25"
                            >
                                Giriş et
                            </button>
                        </div>
                    )}

                    <div className="mt-10 pt-10 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-500">
                            Artıq qeydiyyatdan keçmisiniz? {' '}
                            <Link to="/auth/login" className="text-blue-600 font-bold hover:underline">
                                Giriş edin
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

export default Register;
