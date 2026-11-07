import React, { useEffect, useRef, useState } from 'react';
import { ExpressiveMood, AppTheme } from '../types';
import { Volume2, Activity, Zap } from 'lucide-react';

interface AudioWaveformVisualizerProps {
  isSpeaking: boolean;
  mood: ExpressiveMood;
  theme?: AppTheme;
  lowPowerMode?: boolean;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  isSpeaking,
  mood,
  theme = 'cyberpunk',
  lowPowerMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);
  const [audioLevelDb, setAudioLevelDb] = useState<number>(-48);

  // Palette per mood
  const moodColors = {
    happy: {
      primary: '#f59e0b', // warm gold
      secondary: '#fbbf24', // luminous amber
      glow: 'rgba(245, 158, 11, 0.55)',
      gradient: ['#fef08a', '#fbbf24', '#f59e0b'],
    },
    curious: {
      primary: '#38bdf8', // sky-400
      secondary: '#c084fc', // purple-400
      glow: 'rgba(56, 189, 248, 0.45)',
      gradient: ['#38bdf8', '#c084fc', '#bae6fd'],
    },
    focused: {
      primary: '#22d3ee', // cyan-400
      secondary: '#60a5fa', // blue-400
      glow: 'rgba(34, 211, 238, 0.55)',
      gradient: ['#22d3ee', '#60a5fa', '#a5f3fc'],
    },
    empathetic: {
      primary: '#fb7185', // rose-400
      secondary: '#f472b6', // pink-400
      glow: 'rgba(251, 113, 133, 0.45)',
      gradient: ['#fb7185', '#f472b6', '#fecdd3'],
    },
    critical: {
      primary: '#ef4444', // red-500
      secondary: '#dc2626', // red-600
      glow: 'rgba(239, 68, 68, 0.65)',
      gradient: ['#fca5a5', '#ef4444', '#b91c1c'],
    },
  }[mood] || {
    primary: '#f59e0b',
    secondary: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.55)',
    gradient: ['#fef08a', '#fbbf24', '#f59e0b'],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    const targetFps = lowPowerMode ? 20 : 60;
    const frameInterval = 1000 / targetFps;

    const render = (time: number) => {
      const elapsed = time - lastTime;
      if (elapsed > frameInterval) {
        lastTime = time - (elapsed % frameInterval);

        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        if (isSpeaking) {
          phaseRef.current += lowPowerMode ? 0.08 : 0.15;
          const currentPhase = phaseRef.current;

          // Simulated dynamic voice intensity modulation
          const voiceIntensity = 0.5 + Math.sin(currentPhase * 0.7) * 0.25 + Math.cos(currentPhase * 1.3) * 0.2;
          const currentDb = Math.round(-32 + voiceIntensity * 26);
          setAudioLevelDb(currentDb);

          // Draw multi-bar spectrum visualizer
          const barCount = lowPowerMode ? 14 : 24;
          const barWidth = 3;
          const gap = (width - barCount * barWidth) / (barCount - 1);
          const centerY = height / 2;

          for (let i = 0; i < barCount; i++) {
            // Symmetrical frequency bell curve with dynamic jitter
            const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
            const bell = Math.exp(-distFromCenter * distFromCenter * 2.5);
            const frequencyHarmonic =
              Math.sin(currentPhase * 2 + i * 0.4) * 0.4 +
              Math.sin(currentPhase * 4 + i * 0.8) * 0.3 +
              0.3;

            const barHeight = Math.max(4, bell * height * 0.85 * voiceIntensity * Math.abs(frequencyHarmonic));
            const x = i * (barWidth + gap);
            const y = centerY - barHeight / 2;

            // Gradient per bar
            const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
            grad.addColorStop(0, moodColors.primary);
            grad.addColorStop(0.5, moodColors.secondary);
            grad.addColorStop(1, moodColors.primary);

            ctx.fillStyle = grad;
            ctx.shadowBlur = lowPowerMode ? 0 : 8;
            ctx.shadowColor = moodColors.glow;

            // Rounded rectangle bar
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, 2);
            ctx.fill();
          }

          // Draw central dynamic sinusoidal voice wave overlay
          if (!lowPowerMode) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 6;
            ctx.shadowColor = moodColors.primary;

            for (let x = 0; x < width; x += 2) {
              const relX = x / width;
              const envelope = Math.sin(relX * Math.PI);
              const waveY =
                centerY +
                Math.sin(x * 0.12 + currentPhase * 3) * 8 * envelope * voiceIntensity +
                Math.cos(x * 0.05 + currentPhase * 2) * 4 * envelope;

              if (x === 0) {
                ctx.moveTo(x, waveY);
              } else {
                ctx.lineTo(x, waveY);
              }
            }
            ctx.stroke();
          }
        } else {
          // Idle state: Subtle breathing flatline
          setAudioLevelDb(-48);
          const width = canvas.width;
          const height = canvas.height;
          const centerY = height / 2;

          ctx.beginPath();
          ctx.strokeStyle =
            theme === 'light'
              ? 'rgba(100, 116, 139, 0.3)'
              : 'rgba(148, 163, 184, 0.2)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;

          // Gentle ambient ripple
          const idlePhase = performance.now() * 0.002;
          for (let x = 0; x < width; x += 4) {
            const relX = x / width;
            const envelope = Math.sin(relX * Math.PI);
            const waveY = centerY + Math.sin(x * 0.05 + idlePhase) * 1.5 * envelope;
            if (x === 0) ctx.moveTo(x, waveY);
            else ctx.lineTo(x, waveY);
          }
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpeaking, mood, theme, lowPowerMode, moodColors]);

  return (
    <div className="w-full flex flex-col items-center mt-2 select-none">
      <div
        className={`w-full px-3 py-1.5 rounded-xl border flex items-center justify-between gap-2 text-[10px] font-mono transition-all ${
          isSpeaking
            ? theme === 'light'
              ? 'bg-cyan-50/80 border-cyan-300 shadow-sm'
              : 'bg-slate-950/80 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
            : theme === 'light'
            ? 'bg-slate-50 border-slate-200 text-slate-500'
            : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Volume2
            className={`w-3 h-3 ${
              isSpeaking
                ? 'text-cyan-400 animate-pulse'
                : 'text-slate-400'
            }`}
          />
          <span
            className={`font-semibold ${
              isSpeaking
                ? theme === 'light'
                  ? 'text-cyan-800'
                  : 'text-cyan-300'
                : 'text-slate-400'
            }`}
          >
            {isSpeaking ? 'Web Speech TTS' : 'Audio Standby'}
          </span>
        </div>

        {/* Real-time Spectrum Meter Canvas */}
        <div className="flex-1 max-w-[130px] sm:max-w-[160px] h-6 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={160}
            height={24}
            className="w-full h-full block"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`font-mono text-[9px] ${
              isSpeaking ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            {isSpeaking ? `${audioLevelDb} dB` : '-INF'}
          </span>
          {lowPowerMode && (
            <span
              title="Low Power Mode: Giảm tốc độ khung hình và hoạt họa âm thanh để tiết kiệm pin"
              className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono"
            >
              ECO
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
