import React from "react";
import { Scale, Check, Mail, ArrowUpRight, ShieldCheck, HelpCircle, Copyright, UserCheck } from "lucide-react";

interface TermsPageProps {
  onBack: () => void;
}

export default function TermsPage({ onBack }: TermsPageProps) {
  return (
    <section id="terms-of-service" className="relative min-h-screen bg-black text-white py-32 px-6 flex flex-col justify-start items-center overflow-hidden w-full">
      {/* Decorative Gradients */}
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-zinc-900/20 rounded-full blur-[160px] mix-blend-screen pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-indigo-950/10 rounded-full blur-[160px] mix-blend-screen pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col space-y-16 w-full">
        {/* Header Block */}
        <div className="text-center space-y-4 animate-fade-in">
          <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase bg-zinc-900/50 border border-zinc-800/60 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Legal Agreements
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-semibold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed font-light">
            Please read these terms and conditions carefully before using the Silencly application or accessing our dictation platform.
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-zinc-500 font-mono">
            <span>Effective Date: June 9, 2026</span>
            <span>•</span>
            <span>Version 1.2</span>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900/40 to-zinc-950 border border-zinc-800/80 rounded-3xl p-8 backdrop-blur-md flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 shrink-0">
            <Scale className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-zinc-100">Simple, Clear Terms</h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              By accessing our services at Silencly, you agree to be bound by these terms. We aim to keep our agreements free of hidden clauses or aggressive legal jargon, so you always know your rights and responsibilities.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-12">
          {/* Section 1: Use of Service */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 flex items-center gap-2">
              <span className="text-zinc-600 font-mono">01.</span> Scope of Service & Acceptable Use
            </h2>
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-6 sm:p-8 space-y-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              <p>
                Silencly provides a high-performance, web-based speech dictation tool that leverages custom AI speech parsing. We grant you a personal, non-exclusive, revocable license to access and use Silencly for your workflow, drafting, and personal recording.
              </p>
              <h4 className="text-zinc-200 font-semibold font-sans text-sm mt-4">Prohibited Behaviors:</h4>
              <ul className="space-y-2.5 text-sm pl-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                  <span>Do not exploit the platform to build scraper engines, reverse engineer voice-parsing APIs, or launch denial-of-service queries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                  <span>Do not upload audio content containing explicit malicious data, virus packages, or high-risk executable code.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                  <span>Do not use the service for automated telecommunications abuse, phishing, or high-density fake review generation.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: Intellectual Property */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 flex items-center gap-2">
              <span className="text-zinc-600 font-mono">02.</span> Intellectual Property & Copyright
            </h2>
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-6 sm:p-8 space-y-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              <div className="flex items-start gap-4">
                <Copyright className="w-5 h-5 text-indigo-400 shrink-0 mt-1" />
                <div className="space-y-3">
                  <p>
                    All proprietary graphics, code files, custom logos, visual styling layouts, and software architectures under the Silencly platform remain the protected intellectual property of Silencly. No assets, visual structures, or logic elements may be replicated without prior explicit written authorization from our verified leadership.
                  </p>
                  <p>
                    <strong>Your Output Ownership:</strong> All transcribed text documents, voice files, custom notes, and parsed content generated by you using the Silencly app belong entirely to you. Silencly claims no intellectual ownership over your generated documents.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Founding Developers & Verified Domains */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 flex items-center gap-2">
              <span className="text-zinc-600 font-mono">03.</span> Leadership Identity & Verified Domains
            </h2>
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-6 sm:p-8 space-y-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              <p>
                This platform is owned and supported by the creators of Silencly:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Verified Founding Team</h4>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      Anubhav Sapkota, Daksh shetty, and Johan Jovin Cheeran. Only modifications and terms issued by this team are recognized.
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider font-semibold">Genuine Access Channels</h4>
                    <p className="text-xs text-zinc-500 mt-1 font-mono">
                      silencly.com, thinkwispr.netlify.app, thinkwispr.dev, thinkwispr.me, silencly1.vercel.app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Limitation of Liability */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 flex items-center gap-2">
              <span className="text-zinc-600 font-mono">04.</span> Disclaimer & Limitation of Liability
            </h2>
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-6 sm:p-8 space-y-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              <p>
                The Silencly platform, including all integrated models, dictation waveform layers, and transcription utilities, is provided on an "as-is" and "as-available" basis without any express or implied warranties.
              </p>
              <p>
                In no event will Silencly, its founders, or contributors be held liable for any data loss, service interruptions, voice processing failures, or indirect damages stemming from the use or inability to use the dictation systems.
              </p>
            </div>
          </div>
        </div>

        {/* Support Block */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-4 text-center">
          <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-lg font-semibold text-zinc-100">Need Clarification?</h3>
          <p className="text-sm text-zinc-400 font-light max-w-lg mx-auto">
            If you have questions regarding these Terms of Service or want to request commercial permissions, contact our legal desk:
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
