import { useEffect, useRef } from "react";

interface WaveformProps {
  isRecording: boolean;
  analyser: AnalyserNode | null;
  compact?: boolean;
}

export default function Waveform({ isRecording, analyser, compact = false }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Setup buffers for real-time analyser
    const bufferLength = analyser ? analyser.frequencyBinCount : 0;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Clear with background color matching the warm minimalist palette
      ctx.clearRect(0, 0, width, height);

      if (isRecording) {
        if (analyser) {
          // Real-time audio data visualization
          analyser.getByteTimeDomainData(dataArray);

          // Render gorgeous real-time bars with glowing zinc and greys
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          
          const barCount = compact ? 32 : 48;
          const barWidth = compact ? 3 : 4;
          const gap = compact ? 3 : 4;
          const totalWidth = barCount * barWidth + (barCount - 1) * gap;
          const startX = (width - totalWidth) / 2;

          for (let i = 0; i < barCount; i++) {
            // Map the analyser data
            const percentIdx = Math.floor((i / barCount) * bufferLength);
            // Time domain is around 128 (0 to 255)
            const amplitude = Math.abs(dataArray[percentIdx] - 128);
            // Amplify slightly for visualization
            const value = (amplitude / 128) * height * (compact ? 0.9 : 1.5);
            
            // Add a small ambient pulse so it's never perfectly flat
            const minHeight = (compact ? 3 : 4) + Math.sin(phaseRef.current + i * 0.15) * 3;
            const barHeight = Math.max(minHeight, value);

            const x = startX + i * (barWidth + gap);
            const y = (height - barHeight) / 2;

            // Gradient fill
            const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
            grad.addColorStop(0, "#f4f4f5"); // zinc-100
            grad.addColorStop(0.5, "#a1a1aa"); // zinc-400
            grad.addColorStop(1, "#52525b"); // zinc-600

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, 2);
            ctx.fill();
          }
        } else {
          // Simulated smooth speech waveform (sine waves overlay)
          ctx.lineWidth = 2;
          
          // Draw 3 layers of smooth waves for an elegant "Siri-like" high-quality look
          const waves = compact ? [
            { amplitude: 15, frequency: 0.03, speed: 0.08, color: "rgba(244, 244, 245, 0.75)" },
            { amplitude: 8, frequency: 0.05, speed: -0.05, color: "rgba(161, 161, 170, 0.45)" }
          ] : [
            { amplitude: 35, frequency: 0.02, speed: 0.08, color: "rgba(244, 244, 245, 0.75)" },
            { amplitude: 20, frequency: 0.04, speed: -0.05, color: "rgba(161, 161, 170, 0.45)" },
            { amplitude: 10, frequency: 0.06, speed: 0.12, color: "rgba(113, 113, 122, 0.3)" }
          ];

          waves.forEach((w) => {
            ctx.beginPath();
            ctx.strokeStyle = w.color;
            for (let x = 0; x < width; x++) {
              // Create a nice envelope that fades out at the edges (bell curve)
              const envelope = Math.sin((x / width) * Math.PI);
              const y = (height / 2) + Math.sin(x * w.frequency + phaseRef.current * w.speed) * w.amplitude * envelope;
              if (x === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.stroke();
          });
        }
        
        phaseRef.current += 1.2; // advance physics engine
      } else {
        // Ambient idle visualization (a subtle gentle pulse)
        ctx.beginPath();
        ctx.strokeStyle = "rgba(20, 20, 18, 0.12)"; // soft off-dark border color
        ctx.lineWidth = 1.5;
        
        for (let x = 0; x < width; x++) {
          const envelope = Math.sin((x / width) * Math.PI);
          const y = (height / 2) + Math.sin(x * 0.015 + phaseRef.current * 0.01) * (compact ? 3 : 6) * envelope;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        
        phaseRef.current += 0.5;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, analyser, compact]);

  return (
    <div
      id="waveform-container"
      className={`w-full bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden relative ${
        compact ? "h-16" : "h-36"
      }`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 font-mono tracking-wider text-zinc-500 select-none uppercase ${
        compact ? "text-[7px]" : "text-[10px]"
      }`}>
        {isRecording ? "Live audio capture active" : "Microphone in standby"}
      </div>
    </div>
  );
}
