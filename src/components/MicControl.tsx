import { Mic, Square, Sparkles, Loader2 } from "lucide-react";

interface MicControlProps {
  isRecording: boolean;
  status: "idle" | "recording" | "transcribing" | "polishing";
  duration: number;
  onToggleRecord: () => void;
}

export default function MicControl({
  isRecording,
  status,
  duration,
  onToggleRecord,
}: MicControlProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusText = () => {
    switch (status) {
      case "recording":
        return "Listening to your voice...";
      case "transcribing":
        return "Transcribing with AssemblyAI Universal 3.5 Pro...";
      case "polishing":
        return "Refining with Llama 3.1 8B...";
      default:
        return "Tap the microphone to start dictating";
    }
  };

  const isProcessing = status === "transcribing" || status === "polishing";

  return (
    <div id="mic-control-box" className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-[#e4e4d9] relative overflow-hidden">
      {/* Decorative background grid subtle effect */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#1a1a18_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Stopwatch Counter */}
      <div id="stopwatch-counter" className={`font-mono text-4xl font-bold tracking-wider mb-2 select-none transition-colors duration-300 ${
        isRecording ? "text-zinc-400 animate-pulse" : "text-neutral-400"
      }`}>
        {formatTime(duration)}
      </div>

      <div className="text-xs font-medium text-neutral-400 mb-8 tracking-wide font-mono">
        RECORD TIME
      </div>

      {/* Main trigger button with outer pulsing circles */}
      <div className="relative flex items-center justify-center mb-8">
        {isRecording && (
          <>
            <div className="absolute w-28 h-28 rounded-full bg-zinc-900 border border-zinc-800 animate-ping opacity-45 pointer-events-none" />
            <div className="absolute w-36 h-36 rounded-full bg-zinc-900/60 border border-zinc-800 animate-pulse opacity-30 pointer-events-none" />
          </>
        )}

        <button
          id="mic-action-btn"
          onClick={onToggleRecord}
          disabled={isProcessing}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
            isRecording
              ? "bg-zinc-800 hover:bg-zinc-700 text-white shadow-zinc-900"
              : isProcessing
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "bg-[#1a1a18] hover:bg-[#2c2c28] text-white hover:scale-105"
          }`}
          title={isRecording ? "Stop recording" : "Start recording"}
        >
          {status === "transcribing" ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : status === "polishing" ? (
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          ) : isRecording ? (
            <Square className="w-8 h-8 fill-white stroke-[2.5]" />
          ) : (
            <Mic className="w-8 h-8 stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* Status Indicators */}
      <div id="mic-status-label" className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1.5 h-6">
          {status === "recording" && (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-400"></span>
            </span>
          )}
          {isProcessing && (
            <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
          )}
          <span className={`text-sm font-semibold transition-colors duration-200 ${
            isRecording ? "text-zinc-400" : isProcessing ? "text-neutral-600" : "text-[#1a1a18]"
          }`}>
            {getStatusText()}
          </span>
        </div>
        <p className="text-xs text-neutral-400 font-serif italic max-w-sm">
          {isRecording 
            ? "Your voice is streamed live and captured. Tap again when done."
            : isProcessing 
            ? "Processing using state-of-the-art AI intelligence..."
            : "No credentials required. High-fidelity voice capturing and formatting are fully connected."
          }
        </p>
      </div>
    </div>
  );
}
