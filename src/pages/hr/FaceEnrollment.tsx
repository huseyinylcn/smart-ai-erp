import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import { 
  Camera, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  ShieldCheck,
  Scan,
  MapPin
} from 'lucide-react';
import { hrApi } from '../../utils/api';

const FaceEnrollment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const employeeId = searchParams.get('employeeId');
  const companyId = searchParams.get('companyId');
  const fullName = searchParams.get('fullName');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const loadModels = async () => {
    try {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      console.log('FaceAPI (SSD) Models Loaded');
    } catch (err) {
      console.error('Error loading face-api models:', err);
      setErrorMessage('Modellərin yüklənməsi zamanı xəta baş verdi.');
    }
  };

  // Initialize models, camera and location
  useEffect(() => {
    const init = async () => {
      try {
        await loadModels();
        // Enumerate devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        setVideoDevices(videoInputs);
        
        // Default to first camera or 'user' facing if not set
        const initialId = selectedDeviceId || videoInputs[0]?.deviceId;
        if (initialId) setSelectedDeviceId(initialId);

        const constraints = initialId ? { video: { deviceId: { exact: initialId } } } : { video: { facingMode: 'user' } };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) videoRef.current.srcObject = stream;
        
        navigator.geolocation.getCurrentPosition(
          (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => setErrorMessage('Məkan məlumatı alınmadı. Zəhmət olmasa icazə verin.')
        );
      } catch (err) {
        setErrorMessage('Kameraya giriş imtina edildi və ya tapılmadı.');
        setStatus('ERROR');
      }
    };
    init();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [selectedDeviceId]);

  const toggleCamera = () => {
    if (videoDevices.length <= 1) return;
    const currentIdx = videoDevices.findIndex(d => d.deviceId === selectedDeviceId);
    const nextIdx = (currentIdx + 1) % videoDevices.length;
    setSelectedDeviceId(videoDevices[nextIdx].deviceId);
  };

  const startScan = () => {
    setStatus('SCANNING');
    setErrorMessage('');
    let p = 0;
    let detectedDescriptor: Float32Array | null = null;
    
    const interval = setInterval(async () => {
      p += 2;
      setProgress(p);

      // Try detection while scanning
      if (!detectedDescriptor && videoRef.current && videoRef.current.readyState === 4) {
        try {
          const det = await faceapi.detectSingleFace(
            videoRef.current, 
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.45 })
          ).withFaceLandmarks().withFaceDescriptor();
          
          if (det) {
            detectedDescriptor = det.descriptor;
          }
        } catch (e) {
          console.error("Continuous detection error", e);
        }
      }

      if (p >= 100) {
        clearInterval(interval);
        handleEnrollment(detectedDescriptor);
      }
    }, 60);
  };

  const handleEnrollment = async (existingDescriptor: Float32Array | null) => {
    if (!employeeId || !companyId || !location) {
      setErrorMessage('Məlumatlar tam deyil. Zəhmət olmasa yenidən cəhd edin.');
      setStatus('ERROR');
      return;
    }

    try {
      let descriptor = existingDescriptor;

      if (!descriptor) {
        // Final retry if not detected during progress
        if (videoRef.current && videoRef.current.readyState === 4) {
          const det = await faceapi.detectSingleFace(
            videoRef.current, 
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 })
          ).withFaceLandmarks().withFaceDescriptor();
          if (det) descriptor = det.descriptor;
        }
      }

      if (!descriptor) {
        setErrorMessage('Üz tapılmadı. Zəhmət olmasa işıqlı otaqda kameraya birbaşa baxaraq yenidən cəhd edin.');
        setStatus('ERROR');
        return;
      }

      setStatus('PROCESSING');
      
      // Add a 15-second timeout to the registration call
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 15000)
      );

      const registrationPromise = hrApi.registerFaceTemplate(
        employeeId,
        [Array.from(descriptor)],
        companyId
      );

      const response = await Promise.race([registrationPromise, timeoutPromise]) as any;
      
      if (response.success) {
        const audio = new Audio('/success.mp3');
        audio.play().catch(() => {});
        
        setStatus('SUCCESS');
        setProgress(100);
        setTimeout(() => navigate('/hr/face-registry'), 2000);
      } else {
        setErrorMessage(response.message || 'Qeydiyyat zamanı xəta baş verdi.');
        setStatus('ERROR');
      }
    } catch (err: any) {
      console.error('Enrollment error:', err);
      if (err.message === 'TIMEOUT') {
        setErrorMessage('Server cavab vermir. Zəhmət olmasa yenidən cəhd edin.');
      } else {
        setErrorMessage('Qeydiyyat zamanı xəta baş verdi: ' + (err.message || 'Naməlum xəta'));
      }
      setStatus('IDLE');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
      {/* Background Aesthetic */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 py-12 flex flex-col h-screen">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
            <ShieldCheck className="w-4 h-4 text-indigo-400 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Biometrik Təhlükəsizlik</span>
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Face <span className="text-indigo-400">ID</span> Qeydiyyatı
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">SmartAgent ERP • HR Modulu</p>
        </div>

        {/* Video Container */}
        <div className="relative flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square max-w-[320px] rounded-[3rem] overflow-hidden border-4 border-slate-800 shadow-2xl shadow-black/50 group">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={`w-full h-full object-cover transition-all duration-700 ${status === 'IDLE' ? 'grayscale opacity-70' : 'grayscale-0 scale-105'}`}
            />
            
            {/* Scanning Overlay */}
            {status === 'SCANNING' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="absolute inset-0 bg-indigo-500/10" />
                <div className="w-full h-[2px] bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.8)] animate-scan-line" />
                <Scan className="w-24 h-24 text-white/20 absolute opacity-50 animate-pulse" />
              </div>
            )}

            {/* Status Overlays */}
            {status === 'SUCCESS' && (
              <div className="absolute inset-0 bg-emerald-500/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500">
                <CheckCircle2 className="w-20 h-20 text-white mb-6 animate-bounce" />
                <h3 className="text-2xl font-black uppercase italic italic leading-tight">Məlumatlar Yadda Saxlanıldı</h3>
                <p className="text-white/80 text-sm mt-4 font-medium uppercase tracking-widest">Toğrul Qəmbərov üçün Face ID aktivdir</p>
              </div>
            )}

            {status === 'ERROR' && (
              <div className="absolute inset-0 bg-rose-500/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500">
                <AlertCircle className="w-20 h-20 text-white mb-6" />
                <h3 className="text-xl font-black uppercase italic">{errorMessage}</h3>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 px-8 py-3 bg-white text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-transform active:scale-95"
                >
                  Yenidən Cəhd Et
                </button>
              </div>
            )}

            {/* Camera Switch Toggle */}
            {videoDevices.length > 1 && status === 'IDLE' && (
              <button 
                onClick={toggleCamera}
                className="absolute top-6 right-6 z-20 p-3 bg-black/50 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-black/70 transition-all active:scale-95 flex items-center gap-2"
                title="Kameranı Dəyiş"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Kameranı Dəyiş ({videoDevices.length})</span>
              </button>
            )}
            <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-white/30 rounded-tl-xl" />
            <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-white/30 rounded-tr-xl" />
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-white/30 rounded-bl-xl" />
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-white/30 rounded-br-xl" />
          </div>

          {/* User Info Card */}
          <div className="mt-8 w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Qeydiyyatdan keçən</p>
                <h2 className="text-lg font-black uppercase text-indigo-100 italic">{fullName || 'Yüklənir...'}</h2>
              </div>
            </div>
            {location && (
              <div className="mt-4 flex items-center gap-2 text-emerald-400">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Məkan Təsdiqləndi</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-8">
          {status === 'IDLE' && (
            <button 
              onClick={startScan}
              className="group relative w-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-indigo-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative border-2 border-indigo-600 py-6 rounded-3xl flex items-center justify-center gap-4 transition-colors group-hover:text-white">
                <Camera className="w-6 h-6" />
                <span className="text-sm font-black uppercase tracking-[0.2em]">Skanı Başlat</span>
              </div>
            </button>
          )}

          {status === 'SCANNING' && (
            <div className="space-y-4">
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 animate-pulse">
                Üz strukturu analiz edilir... {progress}%
              </p>
            </div>
          )}

          {status === 'PROCESSING' && (
            <div className="flex items-center justify-center gap-4 py-6">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
              <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 italic">Məlumatlar Şifrələnir...</span>
            </div>
          )}

          {status === 'SUCCESS' && (
            <button 
              onClick={() => navigate('/hr/attendance-portal')}
              className="w-full py-6 bg-white text-slate-900 rounded-3xl text-sm font-black uppercase tracking-[0.2em] transition-transform active:scale-95 shadow-xl shadow-emerald-500/10"
            >
              Davamiyyət Portalı
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan-line {
          position: absolute;
          animation: scan-line 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FaceEnrollment;
