import React, { useState } from "react";
import { Check, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";

interface StatusPageProps {
  onBack: () => void;
}

export default function StatusPage({ onBack }: StatusPageProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>("Just now");
  const [hoveredTick, setHoveredTick] = useState<{ service: string; index: number } | null>(null);

  // Status metrics: Always perfect 100.0% operational
  const [metrics, setMetrics] = useState({
    websiteUptime: "100.0%",
    dictationUptime: "100.0%",
  });

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    setTimeout(() => {
      setIsRefreshing(false);
      setMetrics({
        websiteUptime: "100.0%",
        dictationUptime: "100.0%",
      });
      const now = new Date();
      setLastChecked("Checked at " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
  };

  // Helper to generate 90 status ticks (with custom red outage tick for Authentication today)
  const renderTicks = (serviceName: string) => {
    return Array.from({ length: 90 }).map((_, idx) => {
      let colorClass = "bg-[#0e7c53]"; // Default beautiful emerald green
      let statusText = "Operational";
      let isOutage = false;

      const daysAgo = 89 - idx;
      const dateStr = daysAgo === 0 ? "Today" : `${daysAgo} days ago`;

      if (serviceName === "Authentication" && daysAgo === 0) {
        colorClass = "bg-red-600 animate-pulse";
        statusText = "Major Outage";
        isOutage = true;
      }

      return (
        <div
          key={idx}
          className={`relative group h-8 flex-1 rounded-[2px] cursor-pointer transition-all duration-150 ${colorClass} hover:opacity-80`}
          onMouseEnter={() => setHoveredTick({ service: serviceName, index: idx })}
          onMouseLeave={() => setHoveredTick(null)}
        >
          {/* Tooltip */}
          {hoveredTick?.service === serviceName && hoveredTick?.index === idx && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 border border-zinc-850 text-[10px] font-mono rounded text-white whitespace-nowrap z-50 shadow-xl">
              <span className="text-zinc-400">{dateStr}: </span>
              <span className={isOutage ? "text-red-400 font-bold" : "text-emerald-400"}>
                {statusText}
              </span>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="relative min-h-screen bg-black text-white py-16 px-6 sm:px-12 flex flex-col justify-start items-center overflow-hidden w-full select-none">
      {/* Background ambient glowing soft spots to replicate premium layout */}
      <div className="absolute top-[5%] left-[10%] w-[400px] h-[400px] bg-emerald-950/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] bg-zinc-950/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col space-y-12 w-full">
        
        {/* Navigation & Brand Header Header precisely matching the user's screenshot */}
        <div className="flex items-center justify-between w-full">
          {/* Left Brand Area */}
          <div className="flex items-center gap-4">
            {/* Geometric star/butterfly logo recreation from image replaced with custom logo */}
            <div 
              onClick={onBack}
              className="group cursor-pointer flex items-center justify-center p-1 rounded-xl hover:bg-zinc-950/50 transition-colors"
            >
              <img 
                src="/logo-dark.svg" 
                alt="Silencly Logo" 
                className="w-10 h-10 object-contain select-none pointer-events-none" 
                referrerPolicy="no-referrer"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                style={{ WebkitTouchCallout: "none", WebkitUserDrag: "none" }}
              />
            </div>
            
            {/* Quick Back Navigation indicator */}
            <button 
              onClick={onBack}
              className="text-xs font-semibold text-zinc-500 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 hover:translate-x-[-2px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </div>

          {/* Right Update / CTA Action Button matching screenshot */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-transparent hover:bg-zinc-900 border border-zinc-900 text-zinc-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all inline-flex items-center gap-1.5 cursor-pointer select-none active:scale-98 disabled:opacity-50"
              title="Refresh and verify live system nodes"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
              <span>{isRefreshing ? "Refreshing" : "Refresh"}</span>
            </button>
            <button 
              onClick={() => alert("You will be notified of any future service notices.")}
              className="px-4 py-2 bg-black border border-zinc-900 text-zinc-200 hover:text-white rounded-lg text-xs font-semibold hover:bg-zinc-950 hover:border-zinc-800 transition-colors cursor-pointer select-none active:scale-98"
            >
              Get updates
            </button>
          </div>
        </div>

        {/* Outer System Card container */}
        <div className="bg-[#040406] border border-[#141417] rounded-2xl p-6 sm:p-10 flex flex-col space-y-12 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          
          {/* Header Banner: Active service disruption */}
          <div className="flex flex-col items-center justify-center py-6 border-b border-zinc-900/60">
            <div className="flex items-center gap-3">
              {/* Pulsing alert warning SVG */}
              <div className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 animate-pulse">
                <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-white select-text">
                Active service disruption (Authentication)
              </h2>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-3 uppercase tracking-wider">{lastChecked}</p>
          </div>

          {/* Active Services - WEBSITE, DICTATION AND AUTHENTICATION */}
          <div className="space-y-10">
            
            {/* Service 1: Website */}
            <div className="flex flex-col space-y-3">
              {/* Title & Uptime Percent row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#10b981]/15 flex items-center justify-center text-[#10b981]">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-white tracking-tight">Website</span>
                </div>
                <span className="text-xs font-mono font-medium text-[#10b981]">
                  {metrics.websiteUptime} uptime
                </span>
              </div>

              {/* Status Ticks Row */}
              <div className="flex items-center gap-[2px] w-full bg-zinc-950/40 p-1.5 rounded-lg border border-zinc-900/40">
                {renderTicks("Website")}
              </div>

              {/* Status Ticks labels */}
              <div className="flex items-center justify-between text-zinc-600">
                <span className="text-[9px] font-bold font-mono tracking-widest uppercase">&lt; 90 DAYS AGO</span>
                <span className="text-[9px] font-bold font-mono tracking-widest uppercase">TODAY</span>
              </div>
            </div>

            {/* Service 2: Dictation API */}
            <div className="flex flex-col space-y-3">
              {/* Title & Uptime Percent row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#10b981]/15 flex items-center justify-center text-[#10b981]">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-white tracking-tight">Dictation Service</span>
                </div>
                <span className="text-xs font-mono font-medium text-[#10b981]">
                  {metrics.dictationUptime} uptime
                </span>
              </div>

              {/* Status Ticks Row */}
              <div className="flex items-center gap-[2px] w-full bg-zinc-950/40 p-1.5 rounded-lg border border-zinc-900/40">
                {renderTicks("Dictation Service")}
              </div>

              {/* Status Ticks labels */}
              <div className="flex items-center justify-between text-zinc-600">
                <span className="text-[9px] font-bold font-mono tracking-widest uppercase">&lt; 90 DAYS AGO</span>
                <span className="text-[9px] font-bold font-mono tracking-widest uppercase">TODAY</span>
              </div>
            </div>

            {/* Service 3: Authentication Service */}
            <div className="flex flex-col space-y-3">
              {/* Title & Uptime Percent row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500/15 flex items-center justify-center text-red-500 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  </div>
                  <span className="text-sm font-medium text-white tracking-tight">Authentication Service</span>
                </div>
                <span className="text-xs font-mono font-medium text-red-500 animate-pulse">
                  Major Outage Today
                </span>
              </div>

              {/* Status Ticks Row */}
              <div className="flex items-center gap-[2px] w-full bg-zinc-950/40 p-1.5 rounded-lg border border-zinc-900/40">
                {renderTicks("Authentication")}
              </div>

              {/* Status Ticks labels */}
              <div className="flex items-center justify-between text-zinc-600">
                <span className="text-[9px] font-bold font-mono tracking-widest uppercase">&lt; 90 DAYS AGO</span>
                <span className="text-[9px] font-bold font-mono tracking-widest uppercase text-red-500 font-bold animate-pulse">TODAY (OUTAGE)</span>
              </div>
            </div>

          </div>

          {/* Recent Notices Section */}
          <div className="pt-6 border-t border-zinc-900/60 text-left">
            <h3 className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase mb-4">
              RECENT NOTICES
            </h3>
            
            <div className="space-y-4">
              {/* Active Outage Incident */}
              <div className="p-4 bg-red-950/10 border border-red-900/30 rounded-xl flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-red-400">Authentication Service Disruption (Major Outage)</p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                    We are currently experiencing a critical issue with our core database and auth provider connection. Users are temporarily unable to Sign In, Sign Up, or complete OAuth login. 
                  </p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-light font-mono mt-2">
                    <span className="text-zinc-400 font-semibold">WORKAROUND:</span> We have deployed a Guest Mode allowing all users to try and use the complete workspace with all features (local storage caching) without signing in. Click the "Try Guest Workspace" option on the home page or in the auth menu.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-950/30 border border-zinc-900/60 rounded-xl flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-zinc-300">Core Transcription Service Operational</p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                    Transcription nodes, AI polish engine, and local browser-based session memory are completely unaffected and running smoothly.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Back Button underneath the main container */}
        <div className="flex justify-center pt-2">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 hover:scale-102 active:scale-98"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Application
          </button>
        </div>

      </div>
    </div>
  );
}
