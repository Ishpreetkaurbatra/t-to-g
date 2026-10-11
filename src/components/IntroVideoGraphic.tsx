import React, { useState, useEffect, useRef } from 'react';
import { TtoGLogo } from './TtoGLogo';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ArrowRight,
  Radio,
  CheckCircle2,
} from 'lucide-react';

interface IntroVideoGraphicProps {
  onComplete: () => void;
  onSkip: () => void;
  isOpen: boolean;
}

export const IntroVideoGraphic: React.FC<IntroVideoGraphicProps> = ({
  onComplete,
  onSkip,
  isOpen,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 8 seconds
  const [isMuted, setIsMuted] = useState(true);
  const totalDuration = 8; // seconds

  // Audio Context ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play sci-fi audio tone
  const playSynthesizerTone = (timeSec: number) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      // Modulate frequency based on phase
      const freq = 220 + Math.sin(timeSec * 2) * 80 + (timeSec > 5.5 ? 200 : 50);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio autoplay policy handled silently
    }
  };

  // Timer loop for video playback
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.1;
        if (next >= totalDuration) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return totalDuration;
        }
        if (Math.floor(next * 2) !== Math.floor(prev * 2)) {
          playSynthesizerTone(next);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, isMuted]);

  // Canvas visualizer loop (Blue & Green Neumorphic / Cyber Matrix Visual)
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 480);

      // Deep obsidian-blue background with soft gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#040d1a');   // Deep Midnight Blue
      bgGrad.addColorStop(0.5, '#021e2f'); // Oceanic Dark Teal
      bgGrad.addColorStop(1, '#021812');   // Deep Pine Emerald
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Perspective Grid Lines (Blue & Green)
      ctx.lineWidth = 1;
      const horizonY = height * 0.65;
      const gridOffset = (frame * 1.5) % 30;

      for (let y = horizonY; y < height; y += 15) {
        const progress = (y - horizonY) / (height - horizonY);
        ctx.strokeStyle = `rgba(16, 185, 129, ${progress * 0.25})`; // Emerald Green grid
        ctx.beginPath();
        ctx.moveTo(0, y + gridOffset * progress);
        ctx.lineTo(width, y + gridOffset * progress);
        ctx.stroke();
      }

      // Vertical converging lines
      const vanishingX = width / 2;
      for (let x = -width; x < width * 2; x += 35) {
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.18)'; // Cyan Blue rays
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // 2. Radar Sweep Beam (Rotating in Blue & Green)
      const centerX = width / 2;
      const centerY = height * 0.4;
      const radarRadius = Math.min(width * 0.38, 120);

      // Radar concentric rings
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius * 0.4, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, radarRadius * 0.7, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, radarRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Radar Sweep Angle
      const angle = (frame * 0.04) % (Math.PI * 2);
      const sweepGrad = ctx.createLinearGradient(
        centerX,
        centerY,
        centerX + Math.cos(angle) * radarRadius,
        centerY + Math.sin(angle) * radarRadius
      );
      sweepGrad.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
      sweepGrad.addColorStop(1, 'rgba(2, 132, 199, 0.0)');

      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radarRadius, angle - 0.4, angle);
      ctx.closePath();
      ctx.fill();

      // Radar scan arm
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radarRadius,
        centerY + Math.sin(angle) * radarRadius
      );
      ctx.stroke();

      // 3. Audio/Signal Spectrum Bars (Bottom Equalizer)
      const numBars = 24;
      const barWidth = width / (numBars * 1.5);
      const barBaseY = height * 0.88;

      for (let i = 0; i < numBars; i++) {
        const barHeight =
          Math.sin(frame * 0.12 + i * 0.4) * 22 +
          Math.cos(frame * 0.08 - i * 0.2) * 15 +
          30;

        const xPos = width * 0.1 + i * (barWidth + 4);
        const barGrad = ctx.createLinearGradient(0, barBaseY, 0, barBaseY - barHeight);
        barGrad.addColorStop(0, '#0284c7'); // Blue
        barGrad.addColorStop(0.5, '#0d9488'); // Teal
        barGrad.addColorStop(1, '#10b981'); // Emerald Green

        ctx.fillStyle = barGrad;
        ctx.fillRect(xPos, barBaseY - barHeight, barWidth, barHeight);

        // Bright tip
        ctx.fillStyle = '#6ee7b7';
        ctx.fillRect(xPos, barBaseY - barHeight - 2, barWidth, 2);
      }

      // 4. Floating Data Nodes (Trend Signals)
      const nodes = [
        { label: '+184% Protein Toasties', ox: 0.2, oy: 0.22, color: '#38bdf8' },
        { label: 'Sangamner Micro-Demand', ox: 0.78, oy: 0.28, color: '#34d399' },
        { label: '68% Margin Index', ox: 0.22, oy: 0.52, color: '#6ee7b7' },
        { label: 'Expert Verified', ox: 0.75, oy: 0.58, color: '#60a5fa' },
      ];

      nodes.forEach((node, idx) => {
        const nx = width * node.ox + Math.sin(frame * 0.03 + idx) * 8;
        const ny = height * node.oy + Math.cos(frame * 0.04 + idx) * 6;

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '9px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillText(node.label, nx + 6, ny + 3);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Cinematic Subtitle Stages based on elapsed seconds
  const getStageInfo = () => {
    if (currentTime < 2.0) {
      return {
        stage: 'PHASE 01 // DETECTION',
        title: 'Scanning Global & Regional Signals',
        desc: 'Ingesting 140K+ food, retail & lifestyle trend feeds across India...',
        badge: 'TREND FINDER ACTIVE',
        color: 'from-blue-500 to-sky-400',
      };
    } else if (currentTime < 4.0) {
      return {
        stage: 'PHASE 02 // RELEVANCE FILTER',
        title: 'Targeting Local Business Fit',
        desc: 'Calculating consumer purchasing power, margin viability & local demand...',
        badge: 'AI GEMINI SYNC',
        color: 'from-cyan-400 to-teal-400',
      };
    } else if (currentTime < 6.0) {
      return {
        stage: 'PHASE 03 // ACTION PROTOCOL',
        title: 'Human Expert Validation',
        desc: 'Reviewing pilot blueprints, risk buffers & certified go-to-market strategies...',
        badge: 'STRATEGIST VERIFIED',
        color: 'from-teal-400 to-emerald-400',
      };
    } else {
      return {
        stage: 'PHASE 04 // LAUNCH SYSTEM',
        title: 'Trend Analyzer Ready',
        desc: 'Turning raw market signals into measurable, profitable business growth.',
        badge: 'SYSTEM ONLINE',
        color: 'from-emerald-400 to-green-300',
      };
    }
  };

  const currentStage = getStageInfo();
  const progressPercent = (currentTime / totalDuration) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Video Container Shell (Mobile Aspect Ratio & Neumorphic Border) */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-blue-500/30 flex flex-col">
        {/* Top Video Header Bar */}
        <div className="absolute top-0 inset-x-0 z-20 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-slate-950/90 to-transparent">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              VIDEO GRAPHIC INTRO
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              HD 60FPS
            </span>
          </div>

          <button
            onClick={onSkip}
            className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Skip Intro"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Canvas Graphic Stage */}
        <div className="relative w-full h-[380px] sm:h-[420px] bg-slate-950 flex items-center justify-center overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

          {/* Center Brand Cinematic Reveal Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
            {/* Logo Centerpiece */}
            <div
              className={`transition-all duration-700 transform ${
                currentTime > 5.5
                  ? 'scale-110 drop-shadow-[0_0_35px_rgba(16,185,129,0.7)]'
                  : 'scale-95 drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]'
              }`}
            >
              <div className="p-3.5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/20 shadow-2xl">
                <TtoGLogo size="xl" showSubtitle={false} animated={true} variant="glow" />
              </div>
            </div>

            {/* Dynamic Animated Typography */}
            <div className="mt-5 space-y-1.5 max-w-xs transition-all duration-300">
              <span className="inline-block text-[10px] font-mono font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                {currentStage.stage}
              </span>

              <h2
                className={`text-base sm:text-lg font-black tracking-tight bg-gradient-to-r ${currentStage.color} bg-clip-text text-transparent`}
              >
                {currentStage.title}
              </h2>

              <p className="text-[11px] text-slate-300/90 font-medium leading-relaxed">
                {currentStage.desc}
              </p>
            </div>
          </div>

          {/* Telemetry Corner Accents */}
          <div className="absolute bottom-14 left-4 z-10 text-[9px] font-mono text-cyan-400/80 space-y-0.5 pointer-events-none">
            <div>SIGNAL: STABLE 99.8%</div>
            <div>SECTOR: TIER-2/3 INDIA</div>
          </div>
          <div className="absolute bottom-14 right-4 z-10 text-[9px] font-mono text-emerald-400/80 text-right space-y-0.5 pointer-events-none">
            <div>LATENCY: 12ms</div>
            <div>STATUS: {currentStage.badge}</div>
          </div>
        </div>

        {/* Video Scrubber & Controls Panel */}
        <div className="px-4 py-3 bg-slate-900/95 border-t border-slate-800 flex flex-col gap-2.5">
          {/* Progress Timeline Scrubber */}
          <div className="w-full flex items-center gap-2.5 text-[10px] font-mono text-slate-400">
            <span>
              0:0{Math.floor(currentTime)}
            </span>
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span>0:0{totalDuration}</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play / Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              {/* Replay */}
              <button
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(true);
                }}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
                title="Restart Graphic"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Audio Synthesizer Tone Mute */}
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (isMuted) {
                    playSynthesizerTone(currentTime);
                  }
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer ${
                  !isMuted
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
                title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
              >
                {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Launch App / Enter Button */}
            <button
              onClick={onComplete}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer transition active:scale-95"
            >
              <span>Enter Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
