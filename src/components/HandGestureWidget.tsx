import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppTheme } from '../types';
import {
  Camera,
  CameraOff,
  Hand,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  Minimize2,
  Maximize2,
  Sparkles,
} from 'lucide-react';

interface HandGestureWidgetProps {
  isPaused: boolean;
  onTogglePause: () => void;
  theme?: AppTheme;
}

export const HandGestureWidget: React.FC<HandGestureWidgetProps> = ({
  isPaused,
  onTogglePause,
  theme = 'cyberpunk',
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [motionIntensity, setMotionIntensity] = useState(0);
  const [gestureDetected, setGestureDetected] = useState(false);
  const [lastActionTime, setLastActionTime] = useState<number>(0);
  const [gestureFeedback, setGestureFeedback] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);
  const waveHistoryRef = useRef<number[]>([]);

  // Toggle Camera stream
  const toggleCamera = async () => {
    if (isActive) {
      stopCamera();
    } else {
      await startCamera();
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsActive(true);
      startMotionDetection();
    } catch (err: any) {
      console.warn('Camera gesture access error:', err);
      setCameraError('Chưa cấp quyền camera hoặc không tìm thấy thiết bị. Bạn vẫn có thể dùng nút "Thử vẫy tay".');
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    setMotionIntensity(0);
    prevFrameDataRef.current = null;
    waveHistoryRef.current = [];
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Frame diffing and wave gesture detection loop
  const startMotionDetection = () => {
    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const width = 80;
          const height = 60;
          canvas.width = width;
          canvas.height = height;

          // Draw scaled-down frame for ultra-fast diffing
          ctx.drawImage(video, 0, 0, width, height);
          const currentFrame = ctx.getImageData(0, 0, width, height);
          const currentData = currentFrame.data;

          if (prevFrameDataRef.current) {
            let totalDiff = 0;
            let motionCenterLeft = 0;
            let motionCenterRight = 0;

            for (let i = 0; i < currentData.length; i += 4) {
              const rDiff = Math.abs(currentData[i] - prevFrameDataRef.current[i]);
              const gDiff = Math.abs(currentData[i + 1] - prevFrameDataRef.current[i + 1]);
              const bDiff = Math.abs(currentData[i + 2] - prevFrameDataRef.current[i + 2]);
              const pixelDiff = (rDiff + gDiff + bDiff) / 3;

              if (pixelDiff > 35) {
                totalDiff++;
                const x = (i / 4) % width;
                if (x < width / 2) {
                  motionCenterLeft++;
                } else {
                  motionCenterRight++;
                }
              }
            }

            const intensity = Math.min(100, Math.round((totalDiff / (width * height)) * 500));
            setMotionIntensity(intensity);

            // Detect horizontal waving pattern (shift left <-> right)
            const now = Date.now();
            const direction = motionCenterLeft > motionCenterRight ? -1 : 1;

            if (intensity > 25) {
              waveHistoryRef.current.push(direction);
              if (waveHistoryRef.current.length > 12) {
                waveHistoryRef.current.shift();
              }

              // Check for direction reversals (wave motion)
              let reversals = 0;
              for (let j = 1; j < waveHistoryRef.current.length; j++) {
                if (waveHistoryRef.current[j] !== waveHistoryRef.current[j - 1]) {
                  reversals++;
                }
              }

              // Trigger gesture if waving motion is confirmed and cooldown has passed
              if (reversals >= 3 && now - lastActionTime > 1800) {
                triggerGestureAction('wave');
                setLastActionTime(now);
                waveHistoryRef.current = [];
              }
            }
          }

          // Save previous frame
          prevFrameDataRef.current = new Uint8ClampedArray(currentData);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(processFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(processFrame);
  };

  const triggerGestureAction = (source: string) => {
    setGestureDetected(true);
    const willPause = !isPaused;
    const msg = willPause
      ? '👋 Phát hiện Vẫy tay: TẠM DỪNG Hoppi'
      : '👋 Phát hiện Vẫy tay: TIẾP TỤC Hoppi';

    setGestureFeedback(msg);
    onTogglePause();

    setTimeout(() => {
      setGestureDetected(false);
      setTimeout(() => setGestureFeedback(null), 2500);
    }, 1200);
  };

  return (
    <div
      className={`w-full rounded-2xl border p-4 backdrop-blur-md transition-all ${
        theme === 'cyberpunk'
          ? 'bg-slate-900/50 border-slate-800'
          : theme === 'deepspace'
          ? 'bg-[#090d15] border-neutral-800'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              isPaused
                ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                : 'bg-cyan-500/20 text-cyan-500 border-cyan-500/40'
            }`}
          >
            <Hand className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4
                className={`font-bold text-xs ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              >
                Nhận Diện Cử Chỉ Vẫy Tay
              </h4>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${
                  isPaused
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {isPaused ? 'ĐANG TẠM NGHỈ' : 'ĐANG HOẠT ĐỘNG'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Vẫy tay trước camera để Tạm dừng / Tiếp tục hoạt động
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Toggle Camera button */}
          <button
            onClick={toggleCamera}
            title={isActive ? 'Tắt camera nhận diện' : 'Bật camera nhận diện cử chỉ'}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {isActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
            <span>{isActive ? 'Camera: BẬT' : 'Camera: TẮT'}</span>
          </button>

          {/* Quick test wave button */}
          <button
            onClick={() => triggerGestureAction('manual')}
            title="Thử kích hoạt cử chỉ vẫy tay mô phỏng"
            className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>👋 Thử vẫy tay</span>
          </button>
        </div>
      </div>

      {/* Camera Live Preview & Motion HUD */}
      {isActive && (
        <div className="mt-3.5 space-y-2.5">
          <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Gesture HUD Detection Overlay */}
            <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                <span className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Optical Motion Engine
                </span>
                <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  Cường độ: {motionIntensity}%
                </span>
              </div>

              {/* Wave prompt reticle */}
              <div className="flex items-center justify-center">
                <div
                  className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold transition-all ${
                    gestureDetected
                      ? 'bg-emerald-500/90 text-slate-950 border-emerald-300 shadow-[0_0_20px_#34d399] scale-110'
                      : motionIntensity > 20
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60 shadow-[0_0_15px_#22d3ee]'
                      : 'bg-slate-950/70 text-slate-400 border-slate-700'
                  }`}
                >
                  {gestureDetected ? '✨ ĐÃ NHẬN DIỆN VẪY TAY!' : '👋 Vẫy tay qua lại để điều khiển'}
                </div>
              </div>

              {/* Motion Bar */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-100"
                  style={{ width: `${motionIntensity}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera error notification if any */}
      {cameraError && (
        <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Gesture Feedback notification */}
      <AnimatePresence>
        {gestureFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className={`mt-3 p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
              isPaused
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{gestureFeedback}</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">Cử chỉ thông minh</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
