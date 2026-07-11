import React from "react";
import { Shield, Check, Mail, ArrowUpRight, Lock, EyeOff, Server, HardDrive } from "lucide-react";

interface PrivacyPageProps {
  onBack: () => void;
}

export default function PrivacyPage({ onBack }: PrivacyPageProps) {
  return (
    <section id="privacy-policy" className="relative min-h-screen bg-black text-white py-32 px-6 flex flex-col justify-start items-center overflow-hidden w-full">
      {/* Decorative Gradients */}
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-zinc-900/20 rounded-full blur-[160px] mix-blend-screen pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-indigo-950/10 rounded-full blur-[160px] mix-blend-screen pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col space-y-16 w-full">
        {/* Header Block */}
        <div className="text-center space-y-4 animate-fade-in">
          <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase bg-zinc-900/50 border border-zinc-800/60 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Privacy First Architecture
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-semibold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed font-light">
            Silencly is built from the ground up to respect your digital sovereignty. Learn how we handle and lock down your dictation sessions, voice files, and transcripts.
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-zinc-500 font-mono">
            <span>Last Updated: June 9, 2026</span>
            <span>•</span>
            <span>Version 1.4</span>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900/40 to-zinc-950 border border-zinc-800/80 rounded-3xl p-8 backdrop-blur-md flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 shrink-0">
            <Lock className="w-8 h-8 text-green-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-zinc-100">Our Structural Commitment</h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              We do not store your raw audio data or transcripts on remote database servers. By architecture, Silencly leverages advanced client-side processing and local browser caching to keep your voice logs and transcript histories locked locally in your browser.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-12">
          {/* Section 1: Data Collection & Processing */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 flex items-center gap-2">
              <span className="text-zinc-600 font-mono">01.</span> Data Collection & Processing
            </h2>
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-6 sm:p-8 space-y-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              <p>
                When you use Silencly to dictate or transcribe audio, the audio conversion is executed directly in your browser or through secure, temporary API requests depending on the active model configuration. Your audio files are streamed directly to the transcription endpoint and processed on the fly.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4">
                  <EyeOff className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">No Permanent Audio Logs</h4>
                    <p className="text-xs text-zinc-500">We do not keep or store audio recordings on any server. Raw voice recordings are discarded immediately after transcription.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4">
                  <HardDrive className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Local Storage Caching</h4>
                    <p className="text-xs text-zinc-500">Transcripts are saved directly within your browser’s private state database, accessible only by you on your machine.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Non-Commercial & Anti-Ad Promise */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 flex items-center gap-2">
              <span className="text-zinc-600 font-mono">02.</span> Non-Commercial & Anti-Ad Promise
            </h2>
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-6 sm:p-8 space-y-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              <p>
                Silencly is fully dedicated to remaining an ad-free, secure sanctuary for builders and thinkers.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span><strong>No Data Monetization:</strong> We never lease, trade, or sell your recorded files, processed transcripts, or personal metadata to any third party under any circumstances.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span><strong>No Training on Your Thoughts:</strong> We do not use your private transcripts or speech inputs to train public machine learning models or algorithms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span><strong>Completely Ad-Free:</strong> There are no trackers, promotional third-party cookies, or pop-up ads within the application.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Identity & Official Channels */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 flex items-center gap-2">
              <span className="text-zinc-600 font-mono">03.</span> Official Channels & Creator Verification
            </h2>
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-6 sm:p-8 space-y-6 text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              <p>
                To maintain complete clarity and security, ensure you only interface with official Silencly builds published by the founding team.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3 bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl">
                  <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Founding Developers</h4>
                  <ul className="space-y-2 text-xs text-zinc-400">
                    <li className="flex items-center gap-2"><span className="text-zinc-600">•</span> Anubhav Sapkota</li>
                    <li className="flex items-center gap-2"><span className="text-zinc-600">•</span> Daksh shetty</li>
                    <li className="flex items-center gap-2"><span className="text-zinc-600">•</span> Johan Jovin Cheeran</li>
                  </ul>
                </div>

                <div className="space-y-3 bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl">
                  <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Verified App Domains</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-400 font-mono">
                    <li className="text-green-400">✔ silencly.com</li>
                    <li>✔ thinkwispr.netlify.app</li>
                    <li>✔ thinkwispr.dev</li>
                    <li>✔ thinkwispr.me</li>
                    <li>✔ silencly1.vercel.app</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: User Controls & Data Erasure */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 flex items-center gap-2">
              <span className="text-zinc-600 font-mono">04.</span> User Controls & Immediate Erasure
            </h2>
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-6 sm:p-8 space-y-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              <p>
                You retain absolute ownership over all transcribing states. You can wipe your entire cache of session transcripts instantly using our system dashboard.
              </p>
              <p>
                All local transcript collections are deleted permanently from the memory storage layers upon triggering the "Clear All History" action. No lingering back-ups exist within our systems.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Block */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-4 text-center">
          <Mail className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-lg font-semibold text-zinc-100">Questions or Concerns?</h3>
          <p className="text-sm text-zinc-400 font-light max-w-lg mx-auto">
            If you have questions about this Privacy Policy, your cached local transcripts, or security audits, contact us directly:
          </p>
          <p className="text-base font-semibold font-mono text-zinc-200">
            hello@silencly.com
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center items-center pt-6">
          <button
            onClick={() => {
              onBack();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="bg-white hover:bg-zinc-100 text-black px-8 py-3.5 rounded-full text-sm font-semibold transition-all cursor-pointer shadow-lg inline-flex items-center gap-2"
          >
            Go Back to Home
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
