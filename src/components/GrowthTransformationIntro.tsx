import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, ArrowRight, X, Sparkles } from 'lucide-react';
import { TtoGLogo } from './TtoGLogo';

interface GrowthTransformationIntroProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const GrowthTransformationIntro: React.FC<GrowthTransformationIntroProps> = ({
  isOpen,
  onComplete,
  onSkip,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isCompletedPhase, setIsCompletedPhase] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound chime when golden arrow curves upwards
  const playGrowthTone = (t: number) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';

      // Ascending frequency as arrow shoots up
      const baseFreq = 240 + Math.pow(t, 2) * 520;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 180, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio autoplay policy handled silently
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let animFrameId: number;
    let startTime: number | null = null;
    const duration = 4200; // 4.2 seconds full cinematic cycle
    const particles: Particle[] = [];

    // Pre-create realistic chart coordinates
    // Drop then sharp surge
    const rawPoints = [
      { rx: 0.05, ry: 0.24 },
      { rx: 0.10, ry: 0.18 },
      { rx: 0.14, ry: 0.30 },
      { rx: 0.18, ry: 0.22 },
      { rx: 0.22, ry: 0.38 },
      { rx: 0.26, ry: 0.32 },
      { rx: 0.30, ry: 0.48 },
      { rx: 0.34, ry: 0.42 },
      { rx: 0.38, ry: 0.58 },
      { rx: 0.42, ry: 0.52 },
      { rx: 0.47, ry: 0.76 }, // Trough / lowest point (Red decline)
      { rx: 0.52, ry: 0.62 }, // Reversal starts
      { rx: 0.56, ry: 0.68 },
      { rx: 0.61, ry: 0.46 },
      { rx: 0.66, ry: 0.50 },
      { rx: 0.71, ry: 0.34 },
      { rx: 0.76, ry: 0.38 },
      { rx: 0.81, ry: 0.22 },
      { rx: 0.86, ry: 0.26 },
      { rx: 0.90, ry: 0.14 },
      { rx: 0.94, ry: 0.08 }, // Peak surge
    ];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastToneTick = 0;

    const render = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      setProgress(t);

      if (t >= 0.98 && !isCompletedPhase) {
        setIsCompletedPhase(true);
      }

      // Audio trigger when upward surge starts
      if (t > 0.45 && t < 0.92) {
        if (Math.floor(elapsed / 180) !== lastToneTick) {
          lastToneTick = Math.floor(elapsed / 180);
          playGrowthTone((t - 0.45) / 0.5);
        }
      }

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Dark high-tech financial canvas
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#070b14');
      bgGrad.addColorStop(0.5, '#0a101f');
      bgGrad.addColorStop(1, '#050811');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Cartesian Grid Coordinates & Reference Levels
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      // Horizontal dashed benchmark lines
      ctx.setLineDash([4, 6]);
      const levels = [
        { y: height * 0.22, label: '28,450.0  SURGE THRESHOLD' },
        { y: height * 0.46, label: '23,587.1  BASELINE RESISTANCE' },
        { y: height * 0.70, label: '13,317.9  LOCAL TROUGH' },
      ];

      levels.forEach((lvl) => {
        ctx.beginPath();
        ctx.moveTo(40, lvl.y);
        ctx.lineTo(width - 40, lvl.y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(lvl.label, width - 210, lvl.y - 6);
      });
      ctx.setLineDash([]);

      // Vertical time coordinate lines
      for (let x = 80; x < width - 60; x += Math.max(90, width / 7)) {
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, height - 30);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.font = '9px ui-monospace, SFMono-Regular, monospace';
        const minute = Math.floor(20 + (x / width) * 20);
        ctx.fillText(`23:${minute}:00`, x - 18, height - 12);
      }

      // Convert raw points to pixel coordinates
      const chartPoints = rawPoints.map((pt) => ({
        x: pt.rx * width,
        y: pt.ry * height,
      }));

      // 3. Arrow position interpolation along trajectory
      // Arrow starts outside left at t=0.25, hits dip at t=0.55, shoots to top-right by t=0.95
      let arrowX = -80;
      let arrowY = height * 0.5;
      let arrowAngle = 0;
      const arrowActive = t > 0.2;

      if (arrowActive) {
        const arrowT = Math.min(1, Math.max(0, (t - 0.2) / 0.75));
        if (arrowT < 0.4) {
          // Swoop down to lowest dip point
          const p = arrowT / 0.4;
          const startX = -40;
          const startY = height * 0.38;
          const targetX = chartPoints[10].x;
          const targetY = chartPoints[10].y;
          arrowX = startX + (targetX - startX) * p;
          arrowY = startY + (targetY - startY) * Math.sin((p * Math.PI) / 2);
          arrowAngle = Math.atan2(targetY - startY, targetX - startX) * 0.4;
        } else {
          // Rocket upward along green surge trajectory
          const p = (arrowT - 0.4) / 0.6;
          const startX = chartPoints[10].x;
          const startY = chartPoints[10].y;
          const targetX = chartPoints[chartPoints.length - 1].x + 30;
          const targetY = chartPoints[chartPoints.length - 1].y - 20;

          // Power easing curve for explosive rocket rise
          const eased = Math.pow(p, 1.4);
          arrowX = startX + (targetX - startX) * eased;
          arrowY = startY + (targetY - startY) * eased;

          // Tangent angle pointing sharply up and right
          arrowAngle = -0.58 - (1 - p) * 0.15;

          // Emit golden sparkling particles from arrow tip & trailing edges
          if (arrowX < width) {
            for (let i = 0; i < 4; i++) {
              particles.push({
                x: arrowX - Math.cos(arrowAngle) * 20 + (Math.random() - 0.5) * 12,
                y: arrowY - Math.sin(arrowAngle) * 20 + (Math.random() - 0.5) * 12,
                vx: -Math.cos(arrowAngle) * (2 + Math.random() * 4) + (Math.random() - 0.5) * 3,
                vy: -Math.sin(arrowAngle) * (2 + Math.random() * 4) + (Math.random() - 0.5) * 3,
                size: 1.5 + Math.random() * 3,
                alpha: 1,
                color: Math.random() > 0.4 ? '#fde047' : '#f59e0b',
              });
            }
          }
        }
      }

      // 4. Draw the Chart Lines: Transition Red → Green based on Arrow X
      // Draw red declining segment
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Red line
      ctx.strokeStyle = '#ef4444';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      let hasRed = false;
      for (let i = 0; i < chartPoints.length; i++) {
        const pt = chartPoints[i];
        if (i === 0) {
          ctx.moveTo(pt.x, pt.y);
          hasRed = true;
        } else {
          // If past arrow position after dip, stop red line
          if (arrowActive && pt.x > arrowX && i > 10) {
            ctx.lineTo(arrowX, arrowY);
            break;
          }
          ctx.lineTo(pt.x, pt.y);
        }
      }
      if (hasRed) ctx.stroke();
      ctx.shadowBlur = 0;

      // Green surging segment (Behind the golden arrow as it rises)
      if (arrowActive && arrowX > chartPoints[10].x) {
        ctx.strokeStyle = '#10b981';
        ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
        ctx.shadowBlur = 16;
        ctx.lineWidth = 4;

        ctx.beginPath();
        let greenStarted = false;
        for (let i = 10; i < chartPoints.length; i++) {
          const pt = chartPoints[i];
          if (!greenStarted) {
            ctx.moveTo(pt.x, pt.y);
            greenStarted = true;
          } else {
            if (pt.x > arrowX) {
              ctx.lineTo(arrowX, arrowY);
              break;
            }
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Subtle green area gradient under the rising line
        const areaGrad = ctx.createLinearGradient(0, height * 0.1, 0, height);
        areaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
        areaGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        ctx.fillStyle = areaGrad;
        ctx.beginPath();
        ctx.moveTo(chartPoints[10].x, height * 0.76);
        for (let i = 10; i < chartPoints.length; i++) {
          const pt = chartPoints[i];
          if (pt.x > arrowX) {
            ctx.lineTo(arrowX, arrowY);
            ctx.lineTo(arrowX, height * 0.85);
            break;
          }
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineTo(chartPoints[10].x, height * 0.85);
        ctx.closePath();
        ctx.fill();
      }

      // 5. Update & Render Golden Sparkling Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        p.size = Math.max(0.5, p.size * 0.96);

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#fef08a';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. Draw 3D Metallic Golden Arrow (Sleek Beveled Design)
      if (arrowActive && arrowX > -20 && arrowX < width + 120) {
        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(arrowAngle);

        // Arrow glow
        ctx.shadowColor = 'rgba(251, 191, 36, 0.9)';
        ctx.shadowBlur = 25;

        // Arrow geometry
        const arrowLength = 72;
        const arrowHeadLength = 34;
        const shaftHeight = 16;
        const headWidth = 38;

        // Metallic Gold Gradient for main body
        const goldBody = ctx.createLinearGradient(-arrowLength, 0, 0, 0);
        goldBody.addColorStop(0, '#d97706');
        goldBody.addColorStop(0.3, '#f59e0b');
        goldBody.addColorStop(0.6, '#fef08a'); // Gleaming specular shine
        goldBody.addColorStop(0.85, '#fbbf24');
        goldBody.addColorStop(1, '#f59e0b');

        // Path for 3D arrow
        ctx.beginPath();
        // Tip of arrowhead
        ctx.moveTo(arrowHeadLength, 0);
        // Top barb
        ctx.lineTo(0, -headWidth / 2);
        // Top shoulder
        ctx.lineTo(0, -shaftHeight / 2);
        // Top shaft end
        ctx.lineTo(-arrowLength, -shaftHeight / 2);
        // Tail chevron notch
        ctx.lineTo(-arrowLength + 14, 0);
        // Bottom shaft end
        ctx.lineTo(-arrowLength, shaftHeight / 2);
        // Bottom shoulder
        ctx.lineTo(0, shaftHeight / 2);
        // Bottom barb
        ctx.lineTo(0, headWidth / 2);
        ctx.closePath();

        ctx.fillStyle = goldBody;
        ctx.fill();

        // 3D Bevel edge (Top highlight for realistic metallic depth)
        const bevelGrad = ctx.createLinearGradient(0, -headWidth / 2, 0, 0);
        bevelGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        bevelGrad.addColorStop(1, 'rgba(245, 158, 11, 0.1)');

        ctx.strokeStyle = bevelGrad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-arrowLength, -shaftHeight / 2);
        ctx.lineTo(0, -shaftHeight / 2);
        ctx.lineTo(0, -headWidth / 2);
        ctx.lineTo(arrowHeadLength, 0);
        ctx.stroke();

        // Central ridge highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-arrowLength + 14, 0);
        ctx.lineTo(arrowHeadLength - 2, 0);
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();

      if (t < 1) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#090d18] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-[#070a13]/90 z-20">
          <div className="flex items-center gap-3">
            <TtoGLogo size="sm" showSubtitle={false} />
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="text-amber-400 font-bold">Trend to Growth</span>
              <span>•</span>
              <span>Market Signal Catalyst Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setTimeout(() => setIsPlaying(true), 50);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Replay Animation"
              aria-label="Replay"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onSkip}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer ml-2"
            >
              <span>Skip</span>
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Cinematic Canvas Centerpiece */}
        <div className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] bg-[#070b14] overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Floating transformation label banner */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pointer-events-none space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                TRANSFORMATION SEQUENCE
              </span>
              <span className="text-slate-500 text-[11px] font-mono">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
              {progress < 0.45 ? (
                <span className="text-red-400 flex items-center gap-1.5">
                  <span>Downside Trajectory</span>
                  <span className="text-xs text-slate-400 font-normal">Without Trend Foreknowledge</span>
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span>Surging Growth Breakout</span>
                  <span className="text-xs text-amber-400 font-semibold">• T→G Golden Catalyst</span>
                </span>
              )}
            </h3>
          </div>

          {/* Real-time KPI Card Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-10 flex flex-wrap items-center gap-2.5 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-sm text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Market Risk</span>
              <span className="text-red-400 font-bold font-mono">Mitigated (92%)</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-sm text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Growth Velocity</span>
              <span className="text-emerald-400 font-bold font-mono">+248% Surge</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-sm text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Human Expert</span>
              <span className="text-amber-400 font-bold font-mono">Validated</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA & Story Bar */}
        <div className="px-4 sm:px-6 py-4 bg-[#0a0f1d] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">
              Trend to Growth (T→G)
            </h4>
            <p className="text-xs text-slate-400">
              Turn volatile downward market shifts into validated, high-margin business expansion.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                setIsPlaying(false);
                setTimeout(() => setIsPlaying(true), 50);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>

            <button
              onClick={onComplete}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
