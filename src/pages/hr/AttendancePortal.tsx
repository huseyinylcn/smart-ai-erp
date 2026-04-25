import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import * as faceapi from 'face-api.js';
import { 
  Camera, QrCode, MapPin, UserCheck, ShieldCheck, 
  AlertTriangle, CheckCircle2, Loader2, ArrowLeft, RefreshCw 
} from 'lucide-react';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';

const MODEL_URL = '/models';
const STRICT_DISTANCE_THRESHOLD = 0.45; // ~55% Similarity. Lower is stricter.
const CONSECUTIVE_FRAMES_REQUIRED = 3;

const AttendancePortal = () => {
    const { activeCompany } = useCompany();
    const companyId = activeCompany?.id || 'COM-001';

    // Steps: SCAN -> VERIFY (Identify) -> PROFILE (Selection) -> SUCCESS
    const [step, setStep] = useState<'SCAN' | 'VERIFY' | 'PROFILE' | 'SUCCESS' | 'ERROR'>('VERIFY');
    const [qrData, setQrData] = useState<any>(null);
    const [selectedMovement, setSelectedMovement] = useState<string>('');
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
    const [faceStatus, setFaceStatus] = useState<'IDLE' | 'LOADING' | 'MATCHED' | 'FAILED'>('IDLE');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);

    const [scanProgress, setScanProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [note, setNote] = useState('');
    const [identifiedStaff, setIdentifiedStaff] = useState<any>(null);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<string>('Yüklənir...');
    const [debugInfo, setDebugInfo] = useState<{label: string, confidence: number}[]>([]);
    const [showDebug, setShowDebug] = useState(true); // Can be toggled

    const videoRef = useRef<HTMLVideoElement>(null);
    const scannerRef = useRef<any>(null);

    const [movementCategory, setMovementCategory] = useState<'ENTRANCE' | 'EXIT'>('ENTRANCE');

    const movements: Record<'ENTRANCE' | 'EXIT', {id: string, label: string, icon: React.ReactNode}[]> = {
        'ENTRANCE': [
            { id: 'WORK_IN', label: 'İşə Gəliş', icon: <UserCheck /> },
            { id: 'LUNCH_IN', label: 'Nahardan Qayıdış', icon: <RefreshCw /> },
            { id: 'MEETING_IN', label: 'Görüşdən Qayıdış', icon: <MapPin /> },
            { id: 'PERMIT_PAID_IN', label: 'Ödənişli İcazədən Qayıdış', icon: <ShieldCheck /> },
            { id: 'PERMIT_UNPAID_IN', label: 'Ödənişsiz İcazədən Qayıdış', icon: <ShieldCheck /> },
        ],
        'EXIT': [
            { id: 'WORK_OUT', label: 'İşdən Çıxış', icon: <ArrowLeft /> },
            { id: 'LUNCH_OUT', label: 'Nahara Gediş', icon: <RefreshCw /> },
            { id: 'MEETING_OUT', label: 'Görüşə Gediş', icon: <MapPin /> },
            { id: 'PERMIT_PAID_OUT', label: 'Ödənişli İcazə ilə Gediş', icon: <ShieldCheck /> },
            { id: 'PERMIT_UNPAID_OUT', label: 'Ödənişsiz İcazə ilə Gediş', icon: <ShieldCheck /> },
        ]
    };

    // Real-time Clock Effect
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Initialize models and gallery
    useEffect(() => {
        const loadResources = async () => {
            try {
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);
                console.log('Attendance Portal (Tiny) Models Loaded');
                setIsModelsLoaded(true);
                setVerificationStatus('İşçi bazası oxunur...');

                // Load Gallery
                const employees = await hrApi.getFaceGallery(companyId);
                const labeledDescriptors = employees
                    .filter((e: any) => e.faceTemplates && e.faceTemplates.length > 0)
                    .map((e: any) => {
                        const descriptors = e.faceTemplates.map((t: any) => new Float32Array(t));
                        return new faceapi.LabeledFaceDescriptors(e.id, descriptors);
                    });

                if (labeledDescriptors.length > 0) {
                    // Use the constant for future-ready configuration
                    setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors, STRICT_DISTANCE_THRESHOLD)); 
                    setVerificationStatus('Skan üçün hazırdır');
                } else {
                    console.log("Face Gallery is empty for this company.");
                    setFaceMatcher(null); // Explicitly null
                    setVerificationStatus('İşçi bazası boşdur');
                }
            } catch (err) {
                console.error("Resource loading error", err);
                setError("Modellər və ya işçi bazası yüklənmədi.");
            }
        };
        loadResources();
    }, [companyId]);

    // Auto-start Biometrics if step is VERIFY
    useEffect(() => {
        if (step === 'VERIFY') {
            startBiometrics();
        }
    }, [step]);

    // Enumerate devices on mount
    useEffect(() => {
        const getDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = devices.filter(d => d.kind === 'videoinput');
                setVideoDevices(videoInputs);
                if (videoInputs.length > 0 && !selectedDeviceId) {
                    setSelectedDeviceId(videoInputs[0].deviceId);
                }
            } catch (err) {
                console.error("Error enumerating devices", err);
            }
        };
        getDevices();
    }, []);

    // QR Scanner Effect
    useEffect(() => {
        let scanner: Html5Qrcode | null = null;
        
        const startScanner = async () => {
            if (step === 'SCAN' && selectedDeviceId) {
                try {
                    scanner = new Html5Qrcode("reader");
                    scannerRef.current = scanner;
                    await scanner.start(
                        { deviceId: { exact: selectedDeviceId } },
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        onScanSuccess,
                        onScanError
                    );
                } catch (err) {
                    console.error("Scanner start error", err);
                    try {
                        await scanner?.start(
                            { facingMode: "user" },
                            { fps: 10, qrbox: { width: 250, height: 250 } },
                            onScanSuccess,
                            onScanError
                        );
                    } catch (e2) {
                        console.error("Scanner fallback error", e2);
                    }
                }
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current) {
                const s = scannerRef.current;
                if (s.isScanning) {
                    s.stop().then(() => s.clear()).catch(console.error);
                }
            }
        };
    }, [step, selectedDeviceId]);

    // Recognition Loop logic for VERIFY step
    useEffect(() => {
        let active = true;
        let progressTimer: any = null;
        let matchCounter = 0;
        let candidateId: string | null = null;

        const runRecognition = async () => {
            if (step !== 'VERIFY') return;
            
            // Reset state for new session
            setIdentifiedStaff(null);
            setDebugInfo([]);
            setScanProgress(0);
            if (!isModelsLoaded) {
                setVerificationStatus('Modellər yüklənir...');
                return;
            }
            if (!faceMatcher) {
                setVerificationStatus('İşçi bazası yüklənmədi...');
                return;
            }
            if (!isCameraActive) {
                setVerificationStatus('Kamera gözlənilir...');
                return;
            }

            setVerificationStatus('Skan edilir...');

            // Start progress visual
            progressTimer = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 98) return 98;
                    return prev + 1;
                });
            }, 200);

            try {
                while (active && step === 'VERIFY') {
                    if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || videoRef.current.readyState < 2) {
                        await new Promise(r => setTimeout(r, 500));
                        continue;
                    }
                    
                    // Use TinyFaceDetector for speed and responsiveness
                    const detection = await faceapi.detectSingleFace(
                        videoRef.current, 
                        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
                    ).withFaceLandmarks().withFaceDescriptor();

                    if (detection) {
                        const results = faceMatcher.labeledDescriptors.map(ld => {
                            const bestMatch = new faceapi.FaceMatcher([ld]).findBestMatch(detection.descriptor);
                            // Convert distance to Confidence Percentage: (1 - dist) * 100
                            const confidence = Math.max(0, (1 - bestMatch.distance) * 100);
                            return { label: ld.label, confidence };
                        }).sort((a,b) => b.confidence - a.confidence).slice(0, 3);

                        setDebugInfo(results);

                        const match = faceMatcher.findBestMatch(detection.descriptor);
                        
                        // STABLE IDENTIFICATION: 3-frame confirmation logic
                        if (match.label !== 'unknown') {
                            if (match.label === candidateId) {
                                matchCounter++;
                            } else {
                                candidateId = match.label;
                                matchCounter = 1;
                            }

                            if (matchCounter >= CONSECUTIVE_FRAMES_REQUIRED) {
                                const staffId = match.label;
                                setFaceStatus('MATCHED');
                                setScanProgress(100);
                                if (progressTimer) clearInterval(progressTimer);
                                
                                // UNIVERSAL MAPPING: Get real staff info based on FINAL recognition ID
                                try {
                                    const staffList = await hrApi.getEmployees(companyId);
                                    const staff = staffList.find((s: any) => s.id === staffId);
                                    if (staff) {
                                        setIdentifiedStaff({
                                            id: staffId,
                                            name: staff?.fullName || 'Tanınmış İşçi',
                                            position: staff?.position || 'Əməkdaş'
                                        });
                                    }
                                } catch (e) {
                                    console.error("Staff lookup failed", e);
                                    setIdentifiedStaff({ id: staffId, name: 'Tanınmış İşçi' });
                                }

                                const hour = new Date().getHours();
                                setMovementCategory(hour >= 14 ? 'EXIT' : 'ENTRANCE');
                                setSelectedMovement(hour >= 14 ? 'WORK_OUT' : 'WORK_IN');

                                setTimeout(() => setStep('PROFILE'), 700);
                                break;
                            }
                        } else {
                            matchCounter = 0;
                            candidateId = null;
                        }
                    } else {
                        matchCounter = 0;
                        candidateId = null;
                        setDebugInfo([]);
                    }
                    await new Promise(r => setTimeout(r, 150)); 
                }
            } catch (e) {
                console.error("Recognition Loop Error", e);
            } finally {
                if (progressTimer) clearInterval(progressTimer);
            }
        };

        runRecognition();
        return () => { 
            active = false; 
            if (progressTimer) clearInterval(progressTimer);
        };
    }, [step, isModelsLoaded, faceMatcher, isCameraActive]);

    const toggleCamera = async () => {
        if (videoDevices.length <= 1) return;
        
        const currentIdx = videoDevices.findIndex(d => d.deviceId === selectedDeviceId);
        const nextIdx = (currentIdx + 1) % videoDevices.length;
        const nextId = videoDevices[nextIdx].deviceId;
        setSelectedDeviceId(nextId);

        if (step === 'VERIFY') {
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            }
            const constraints = { video: { deviceId: { exact: nextId } } };
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (e) {
                console.error("Switch camera error", e);
            }
        }
    };

    const onScanSuccess = (decodedText: string) => {
        try {
            const data = JSON.parse(decodedText);
            if (data.companyId !== companyId) {
                setError('Xəta: QR kod bu şirkətə məxsus deyil.');
                setStep('ERROR');
                return;
            }
            setQrData(data);
            setStep('VERIFY'); // Jump directly to Screening
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
            startBiometrics();
        } catch (e) {
            setError('Keçərsiz QR kod formatı.');
            setStep('ERROR');
        }
    };

    const onScanError = (err: any) => {};

    const startBiometrics = async () => {
        setScanProgress(0);
        setFaceStatus('LOADING');
        
        // Background location fetch
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => {
                    console.error("Location error", err);
                    // We don't block the camera for location error here anymore
                    // We will only block at the 'finalize' stage if location is missing
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }

        try {
            const constraints = selectedDeviceId 
                ? { video: { deviceId: { exact: selectedDeviceId } } }
                : { video: { facingMode: 'user' } };
                
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (e) {
            console.error("Biometric init error", e);
            setIsCameraActive(false);
            setError("Kameraya giriş imtina edildi və ya tapılmadı (Permissions Error).");
            setStep('ERROR');
        }
    };

    const finalizeAttendance = async () => {
        if (!location) {
            setError("Məkan məlumatı hələ alınmayıb.");
            setStep('ERROR');
            return;
        }
        if (!selectedMovement) {
            setError("Hərəkət növünü seçin.");
            return;
        }

        setIsLoading(true);
        try {
            const moveLabel = movements[movementCategory].find((m: any) => m.id === selectedMovement)?.label || selectedMovement;

            const payload = {
                employeeId: identifiedStaff?.id,
                movementType: selectedMovement,
                qrType: movementCategory === 'ENTRANCE' ? 'ENTRY' : 'EXIT',
                locationLat: location?.lat,
                locationLng: location?.lng,
                faceVerified: true,
                faceConfidence: 0.98,
                note: note ? `[${moveLabel}] ${note}` : moveLabel,
                companyId: activeCompany?.id
            };

            const response = await hrApi.registerAttendanceLog(payload, companyId);

            if (response.success) {
                setStep('SUCCESS');
            } else {
                setError(response.message || 'Hərəkət qeydə alınmadı (Məsafə və ya Biometrik xəta).');
                setStep('ERROR');
            }
        } catch (e: any) {
            setError(e.message || 'Server xətası baş verdi.');
            setStep('ERROR');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500/30">
            {/* Top Navigation */}
            <div className="p-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                     <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-[14px] font-black uppercase tracking-widest italic leading-none">SmartAgent ERP</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase italic tracking-tighter mt-1">Attendance Portal</p>
                  </div>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[12px] font-black italic text-emerald-500 uppercase tracking-widest">
                    {currentTime.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className="text-[8px] font-black text-slate-600 uppercase italic">Baku Real-Time</span>
               </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .scan-line {
                    position: absolute;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(to right, transparent, #10b981, transparent);
                    box-shadow: 0 0 15px #10b981;
                    z-index: 30;
                    animation: scan 2s linear infinite;
                }
            `}</style>

            <main className="max-w-md mx-auto p-6 pt-12">
                {step === 'SCAN' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                           <h2 className="text-[24px] font-black uppercase italic leading-tight">Xoş gəlmisiniz</h2>
                           <p className="text-slate-400 text-[12px] mt-2 font-medium italic">Giriş və ya Çıxış QR kodunu oxudun</p>
                        </div>
                        
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                             <div id="reader" className="relative bg-black rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl min-h-[350px]">
                                {/* QR Scanner Content */}
                             </div>
                             {videoDevices.length > 1 && (
                                <button 
                                  onClick={(e) => { e.preventDefault(); toggleCamera(); }}
                                  className="absolute top-4 right-4 z-20 p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-black/80 transition-all active:scale-95 flex items-center gap-2"
                                >
                                   <RefreshCw className="w-4 h-4" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Kameranı Dəyiş</span>
                                </button>
                             )}
                        </div>
                    </div>
                )}

                {step === 'VERIFY' && (
                    <div className="space-y-8 animate-in fade-in duration-500 text-center">
                         <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-black border-4 border-slate-800 shadow-2xl">
                            <video 
                              ref={videoRef} 
                              autoPlay 
                              muted 
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Scanning Line Animation */}
                            {scanProgress < 100 && <div className="scan-line" />}
                            
                            {/* Progress Border SVG */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 p-1" viewBox="0 0 100 100">
                                <rect 
                                    x="2" y="2" width="96" height="96" rx="12"
                                    fill="none" 
                                    stroke="#10b981" 
                                    strokeWidth="2" 
                                    strokeDasharray="400"
                                    strokeDashoffset={400 - (400 * scanProgress / 100)}
                                    className="transition-all duration-100 ease-linear shadow-[0_0_10px_#10b981]"
                                />
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                                <div className="bg-black/50 backdrop-blur-xl p-6 rounded-[2.5rem] flex flex-col items-center gap-4 border border-white/10 shadow-2xl transition-all pointer-events-auto">
                                   {!isCameraActive ? (
                                       <div className="flex flex-col items-center gap-6 p-4">
                                           <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center animate-pulse">
                                               <Camera className="w-8 h-8 text-slate-500" />
                                           </div>
                                           <div className="text-center space-y-4">
                                               <p className="text-[14px] font-black uppercase italic text-white leading-tight">{verificationStatus}</p>
                                               <button 
                                                 onClick={() => startBiometrics()}
                                                 className="px-8 py-4 bg-indigo-600 rounded-[1.5rem] text-[12px] font-black uppercase italic shadow-lg shadow-indigo-500/40 hover:bg-indigo-500 active:scale-95 transition-all flex items-center gap-2"
                                               >
                                                   <RefreshCw className="w-4 h-4" />
                                                   Skanı Başlat
                                               </button>
                                           </div>
                                       </div>
                                   ) : scanProgress < 100 ? (
                                      <>
                                         <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                         <div className="text-center text-white">
                                            <p className="text-[24px] font-black text-emerald-500 uppercase italic tracking-[0.2em]">{scanProgress}%</p>
                                            <p className="text-[10px] font-black uppercase italic tracking-widest animate-pulse">{verificationStatus}</p>
                                         </div>
                                         
                                         {/* DEBUG OVERLAY - Only shows if showDebug is true */}
                                         {showDebug && (
                                            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xl p-3 rounded-2xl border border-white/10 z-50 pointer-events-none shadow-2xl">
                                                <div className="flex items-center justify-between mb-2 border-b border-indigo-500/20 pb-2">
                                                    <p className="text-[9px] font-black text-indigo-400 uppercase italic tracking-widest">Diagnostics</p>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                </div>
                                                {debugInfo.length > 0 ? (
                                                    debugInfo.map((d, i) => (
                                                        <div key={d.label} className="flex flex-col mb-2 last:mb-0">
                                                            <div className="flex justify-between items-end gap-6 mb-1">
                                                                <span className="text-[8px] text-white/50 font-mono truncate max-w-[70px]">UID: {d.label.split('-')[0]}...</span>
                                                                <span className={`text-[10px] font-black italic ${d.confidence > (1-STRICT_DISTANCE_THRESHOLD)*100 ? 'text-emerald-400' : 'text-rose-400/50'}`}>
                                                                    {d.confidence.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                            <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full transition-all duration-300 ${d.confidence > (1-STRICT_DISTANCE_THRESHOLD)*100 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500/20'}`} 
                                                                    style={{ width: `${d.confidence}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-[8px] text-white/30 italic">Şəxs axtarılır...</p>
                                                )}
                                                <div className="mt-2 pt-1 border-t border-white/5">
                                                    <p className="text-[7px] text-white/20 font-bold uppercase tracking-tighter">Required: {((1-STRICT_DISTANCE_THRESHOLD)*100).toFixed(0)}% Similarity</p>
                                                </div>
                                            </div>
                                         )}
                                      </>
                                   ) : (
                                      <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-500">
                                          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border-4 border-emerald-500 shadow-[0_0_50px_#10b981]">
                                             <CheckCircle2 className="w-10 h-10 text-emerald-500 font-bold" />
                                          </div>
                                          <div className="text-center">
                                              <p className="text-[12px] font-black text-emerald-500 uppercase italic tracking-widest">Eyniləşdirmə Uğurlu</p>
                                              <p className="text-[22px] font-black text-white uppercase italic mt-1">{identifiedStaff?.name}</p>
                                          </div>
                                      </div>
                                   )}
                                </div>
                             </div>

                             {/* Floating Camera Controls for VERIFY step */}
                             <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
                                {videoDevices.length > 1 && (
                                    <button 
                                        onClick={(e) => { e.preventDefault(); toggleCamera(); }}
                                        className="p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-xl hover:bg-black/80 transition-all active:scale-95"
                                        title="Kameranı Dəyiş"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                )}
                             </div>
                            
                            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3 z-30">
                                <div className="flex items-center justify-between p-4 bg-black/60 backdrop-blur-md rounded-[1.5rem] border border-white/10">
                                   <div className="flex flex-col text-left">
                                      <div className="flex items-center gap-2">
                                         <MapPin className={`w-3 h-3 ${location ? 'text-emerald-500' : 'text-slate-500'}`} />
                                         <span className="text-[8px] font-black uppercase text-slate-400">Authentication Node</span>
                                      </div>
                                      <span className="text-[10px] font-black uppercase italic text-white mt-1 leading-none">
                                        {location ? `GEO: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'GPRS Signal Search...'}
                                      </span>
                                   </div>
                                   <ShieldCheck className="w-5 h-5 text-indigo-500 animate-pulse" />
                                </div>
                             </div>
                         </div>
                    </div>
                )}

                {step === 'PROFILE' && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-500">
                         <div className="text-center bg-slate-800/40 p-8 rounded-[3rem] border border-slate-800 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600 mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/30 ring-4 ring-indigo-500/20">
                               <UserCheck className="w-12 h-12" />
                            </div>
                            <h2 className="text-[24px] font-black uppercase italic leading-none relative z-10">{identifiedStaff?.name}</h2>
                            <p className="text-slate-500 text-[12px] mt-2 font-black uppercase italic relative z-10">{identifiedStaff?.position} • {activeCompany?.name || 'SmartAgent'}</p>
                         </div>

                         {/* Movement Category Tabs */}
                         <div className="flex bg-slate-800/50 p-1 rounded-[1.5rem] border border-slate-700">
                             <button 
                                onClick={() => {
                                    setMovementCategory('ENTRANCE');
                                    setSelectedMovement('WORK_IN');
                                }}
                                className={`flex-1 py-4 rounded-[1.2rem] text-[12px] font-black uppercase italic transition-all ${movementCategory === 'ENTRANCE' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                             >
                                İşə Giriş
                             </button>
                             <button 
                                onClick={() => {
                                    setMovementCategory('EXIT');
                                    setSelectedMovement('WORK_OUT');
                                }}
                                className={`flex-1 py-4 rounded-[1.2rem] text-[12px] font-black uppercase italic transition-all ${movementCategory === 'EXIT' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                             >
                                İşdən Çıxış
                             </button>
                         </div>

                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 italic ml-4">
                                {movementCategory === 'ENTRANCE' ? 'Giriş Səbəbi:' : 'Çıxış Səbəbi:'}
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {movements[movementCategory].map((move: any) => (
                                    <button 
                                      key={move.id}
                                      onClick={() => setSelectedMovement(move.id)}
                                      className={`flex items-center gap-4 p-4 border rounded-[1.5rem] transition-all group ${selectedMovement === move.id ? 'bg-indigo-600 border-indigo-400 scale-[1.02] shadow-xl shadow-indigo-500/20' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
                                    >
                                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedMovement === move.id ? 'bg-indigo-500' : 'bg-slate-900 shadow-inner'}`}>
                                          {React.isValidElement(move.icon) 
                                            ? React.cloneElement(move.icon as React.ReactElement<any>, { className: "w-5 h-5" })
                                            : move.icon}
                                       </div>
                                       <span className="text-[13px] font-black uppercase italic leading-tight tracking-wider">{move.label}</span>
                                       {selectedMovement === move.id && (
                                           <div className="ml-auto w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                               <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                           </div>
                                       )}
                                    </button>
                                ))}
                             </div>
                         </div>

                         <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-500 italic ml-4">Əlavə Qeyd (Könüllü):</label>
                             <textarea 
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Məsələn: Gecikmə səbəbi, və s."
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-[1.5rem] p-5 text-[12px] italic focus:border-indigo-500 focus:outline-none min-h-[80px] transition-all"
                             />
                         </div>

                         <button 
                            onClick={finalizeAttendance}
                            disabled={!selectedMovement || isLoading}
                            className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 disabled:grayscale text-[16px] font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-indigo-500/40 transition-all flex items-center justify-center gap-4 mt-4 active:scale-95 group"
                         >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                            Təsdiq Et
                         </button>
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="space-y-8 animate-in zoom-in-95 duration-500 text-center">
                        <div className="w-32 h-32 rounded-[3.5rem] bg-emerald-500/20 flex items-center justify-center mx-auto border-4 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                           <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                        </div>
                        <div>
                           <h2 className="text-[32px] font-black uppercase italic leading-tight text-emerald-500 tracking-tighter">Əməliyyat Uğurludur</h2>
                           <p className="text-slate-400 text-[14px] mt-4 font-medium italic">Davamiyyət bazasına qeyd olundu.<br />Rəsmi Vaxt: {currentTime.toLocaleTimeString('az-AZ')}</p>
                        </div>
                        
                        <div className="p-8 bg-slate-800/50 rounded-[2.5rem] border border-slate-800 space-y-4 text-left shadow-2xl">
                           <div className="flex justify-between border-b border-slate-700/50 pb-4">
                              <span className="text-[10px] text-slate-500 font-black uppercase italic">İşçi</span>
                              <span className="text-[10px] text-white font-black uppercase italic">{identifiedStaff?.name}</span>
                           </div>
                           <div className="flex justify-between border-b border-slate-700/50 pb-4">
                              <span className="text-[10px] text-slate-500 font-black uppercase italic">Proses</span>
                              <span className="text-[10px] text-emerald-400 font-black uppercase italic">{selectedMovement.replace('_', ' ')}</span>
                           </div>
                           <div className="flex justify-between pt-2">
                              <span className="text-[10px] text-slate-500 font-black uppercase italic">Lokasiya</span>
                              <span className="text-[10px] text-indigo-400 font-black uppercase italic">Təsdiq Edildi</span>
                           </div>
                        </div>

                        <button 
                          onClick={() => setStep('SCAN')}
                          className="w-full py-5 rounded-[2.5rem] bg-white text-slate-900 text-[14px] font-black uppercase tracking-[0.2em] italic transition-all hover:scale-105 active:scale-95 shadow-2xl"
                        >
                          Ana Səhifəyə Qayıt
                        </button>
                    </div>
                )}

                {step === 'ERROR' && (
                    <div className="space-y-8 animate-in shake duration-500 text-center">
                        <div className="w-24 h-24 rounded-[3rem] bg-rose-500/20 flex items-center justify-center mx-auto border-4 border-rose-500/30">
                           <AlertTriangle className="w-12 h-12 text-rose-500 shadow-xl" />
                        </div>
                        <div>
                           <h2 className="text-[28px] font-black uppercase italic text-rose-500 tracking-tight">Xəta Baş Verdi</h2>
                           <p className="text-slate-400 text-[13px] mt-4 px-6 italic leading-relaxed">{error || 'Məlum olmayan bir xəta.'}</p>
                        </div>
                        <button 
                          onClick={() => {
                             if (error.includes("məkan")) {
                                window.location.reload();
                             } else {
                                setStep('SCAN');
                             }
                          }}
                          className="w-full py-6 rounded-[2.5rem] bg-slate-800 text-white text-[14px] font-black uppercase tracking-[0.2em] italic hover:bg-slate-700 active:scale-95 shadow-xl"
                        >
                          {error.includes("məkan") ? 'Səhifəni Yenilə' : 'Yenidən Cəhd Et'}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AttendancePortal;
