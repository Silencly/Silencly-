import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Play, Square, RefreshCw, Check, ArrowUpRight, Wand2, FileText, CheckSquare, MessageSquare, ArrowLeft, Volume2 } from "lucide-react";

interface DemoPageProps {
  onBack: () => void;
  onLaunchWorkspace: () => void;
}

const SAMPLE_DUMPS = [
  {
    id: "brain_dump_1",
    label: "Creative Pitch Draft",
    rawAudioText: "Uh so basically like the app should let users click a button and dump all their thoughts right so like wait if they say something messy like uh oh I need a reminder to buy milk and wait did I finish the report and basically the AI should tidy that up so it looks professional and neat without any uhs and likes you know?",
    outputs: {
      raw: "Uh so basically like the app should let users click a button and dump all their thoughts right so like wait if they say something messy like uh oh I need a reminder to buy milk and wait did I finish the report and basically the AI should tidy that up so it looks professional and neat without any uhs and likes you know?",
      formatted: "The app should enable users to capture their raw thoughts instantly with a single button. For example, if a user speaks a disorganized stream of consciousness, the AI will automatically clean up the transcript, removing filler words (like 'uh', 'basically', and 'like') and presenting a polished, professional document.",
      summary: "Pitch for a speech-to-text application that removes verbal fillers and structures messy spoken thoughts into professional documentation automatically.",
      actions: [
        "Create raw voice recording button trigger.",
        "Implement filler word deletion engine ('uh', 'like', 'basically').",
        "Generate formatted text export structures."
      ]
    }
  },
  {
    id: "brain_dump_2",
    label: "Monday Morning Action Items",
    rawAudioText: "Okay so morning team meeting we need to first check if Daksh finished the database schemas of Silencly and oh wait Johan needs to review the security rules for Firebase or wait did we deploy the netlify build yet? Also Anubhav wants us to audit the landing page headers to make sure they're completely clean and pixel-perfect.",
    outputs: {
      raw: "Okay so morning team meeting we need to first check if Daksh finished the database schemas of Silencly and oh wait Johan needs to review the security rules for Firebase or wait did we deploy the netlify build yet? Also Anubhav wants us to audit the landing page headers to make sure they're completely clean and pixel-perfect.",
      formatted: "During the morning team meeting, we reviewed several high-priority tasks. First, we need to verify if Daksh has completed the Silencly database schemas. Next, Johan will review the security rules for the Firebase deployment. Finally, Anubhav requested a complete visual audit of the landing page headers to guarantee a pixel-perfect, polished presentation.",
      summary: "Weekly sync meeting covering database schemas, Firebase security setups, Netlify deployments, and visual assets audits.",
      actions: [
        "Daksh: Finalize the Silencly database schemas.",
        "Johan: Review Firebase security rules.",
        "Anubhav: Audit and polish landing page headers for perfect responsiveness."
      ]
    }
  },
  {
    id: "brain_dump_3",
    label: "Journal Entry",
    rawAudioText: "Man today was so productive like we worked until 3 AM on the Spotlight search and we made sure the transitions look really cool and smooth. It feels so satisfying when the code finally runs and compiles perfectly with zero errors. I think Silencly is going to be a game changer for writers who hate typing out their draft scripts.",
    outputs: {
      raw: "Man today was so productive like we worked until 3 AM on the Spotlight search and we made sure the transitions look really cool and smooth. It feels so satisfying when the code finally runs and compiles perfectly with zero errors. I think Silencly is going to be a game changer for writers who hate typing out their draft scripts.",
      formatted: "Today was an incredibly productive day. The team worked until 3:00 AM refining the Spotlight Search interactions and ensuring all animations and transition states are smooth and elegant. There is a deep satisfaction in watching code compile successfully without warnings. Silencly has clear potential to revolutionize drafting workflows for writers.",
      summary: "Reflections on a late-night coding sprint focusing on Spotlight Search, visual refinements, and the future product market fit.",
      actions: [
        "Optimize Spotlight Search input keyboard listeners.",
        "Conduct user testing among early-stage drafts writers."
      ]
    }
  }
];

export default function DemoPage({ onBack, onLaunchWorkspace }: DemoPageProps) {
  const [selectedDump, setSelectedDump] = useState(SAMPLE_DUMPS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [currentTab, setCurrentTab] = useState<"raw" | "formatted" | "summary" | "actions">("formatted");
  const [typedText, setTypedText] = useState("");
  const [visualizerBars, setVisualizerBars] = useState<number[]>([]);

  const visualizerInterval = useRef<any>(null);
  const recordingTimer = useRef<any>(null);
  const processingTimer = useRef<any>(null);

  // Generate visualizer bars
  useEffect(() => {
    const barsCount = 36;
    setVisualizerBars(Array.from({ length: barsCount }, () => Math.floor(Math.random() * 8) + 2));
  }, []);

  // Handle visualizer animation when recording
  useEffect(() => {
    if (isRecording) {
      visualizerInterval.current = setInterval(() => {
        setVisualizerBars(prev =>
          prev.map(() => Math.floor(Math.random() * 32) + 6)
        );
      }, 80);
    } else {
      clearInterval(visualizerInterval.current);
      setVisualizerBars(Array.from({ length: 36 }, () => Math.floor(Math.random() * 6) + 2));
    }
    return () => clearInterval(visualizerInterval.current);
  }, [isRecording]);

  // Handle typing effect for transcribing text
  useEffect(() => {
    if (!isProcessing && !isRecording && selectedDump) {
      setTypedText("");
      let index = 0;
      const textToType =
        currentTab === "raw"
          ? selectedDump.outputs.raw
          : currentTab === "formatted"
          ? selectedDump.outputs.formatted
          : currentTab === "summary"
          ? selectedDump.outputs.summary
          : selectedDump.outputs.actions.map(a => `• ${a}`).join("\n");

      const interval = setInterval(() => {
        if (index < textToType.length) {
          setTypedText(textToType.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 8);
      return () => clearInterval(interval);
    }
  }, [isProcessing, isRecording, selectedDump, currentTab]);

  const startDemoRecording = () => {
    setIsRecording(true);
    setRecordingProgress(0);
    setTypedText("");

    let count = 0;
    recordingTimer.current = setInterval(() => {
      count += 2.5;
      setRecordingProgress(count);
      if (count >= 100) {
        clearInterval(recordingTimer.current);
        finishDemoRecording();
      }
    }, 100);
  };

  const finishDemoRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    setProcessingStep(0);

    const steps = [
      "Calibrating audio layers...",
      "Analyzing verbal speech patterns...",
      "Structuring unstructured brain dumps...",
      "Synthesizing vocabulary dictionaries...",
      "Punctuation and formatting applied successfully!"
    ];

    let currentStep = 0;
    processingTimer.current = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProcessingStep(currentStep);
      } else {
        clearInterval(processingTimer.current);
        setIsProcessing(false);
        setCurrentTab("formatted");
      }
    }, 1200);
  };

  const handleSelectDump = (dump: typeof SAMPLE_DUMPS[0]) => {
    if (isRecording || isProcessing) return;
    setSelectedDump(dump);
    setCurrentTab("formatted");
  };

  const currentStepMessage = [
    "Calibrating audio layers...",
    "Analyzing verbal speech patterns...",
    "Structuring unstructured brain dumps...",
    "Synthesizing vocabulary dictionaries...",
    "Punctuation and formatting applied successfully!"
  ][processingStep];

  return (
    <section id="demo-page" className="relative min-h-screen bg-black text-white py-32 px-6 flex flex-col justify-start items-center overflow-hidden w-full">
      {/* Decorative Blur Gradients */}
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-zinc-900/20 rounded-full blur-[160px] mix-blend-screen pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-indigo-950/10 rounded-full blur-[160px] mix-blend-screen pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col space-y-12 w-full">
        
        {/* Header Title Block */}
        <div className="text-center space-y-4">
          <button
            onClick={onBack}
            className="text-zinc-500 hover:text-zinc-300 text-xs font-mono tracking-widest uppercase flex items-center gap-2 mx-auto transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </button>
          <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase bg-zinc-900/50 border border-zinc-800/60 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            Interactive Simulation
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-semibold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Interactive Demo
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed font-light">
            Experience Silencly’s core transcribing flow. Choose a raw spoken brain dump sample below, trigger the simulated recorder, and witness how messy thoughts transform instantly.
          </p>
        </div>

        {/* Demo App Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          
          {/* Left Column: Preset Selector */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold font-mono tracking-wider text-zinc-400 uppercase">Select Spoken Dump</h3>
              <p className="text-xs text-zinc-500 font-light">Choose from sample raw streams of speech to simulate.</p>
            </div>
            
            <div className="flex flex-col gap-3">
              {SAMPLE_DUMPS.map(dump => {
                const isSelected = selectedDump.id === dump.id;
                return (
                  <button
                    key={dump.id}
                    onClick={() => handleSelectDump(dump)}
                    disabled={isRecording || isProcessing}
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-zinc-900/80 border-zinc-700 shadow-lg text-white"
                        : "bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:bg-zinc-900/30 hover:border-zinc-800"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 className={`w-3.5 h-3.5 ${isSelected ? "text-purple-400" : "text-zinc-600"}`} />
                      <span className="text-xs font-semibold font-mono tracking-tight">{dump.label}</span>
                    </div>
                    <p className="text-xs font-light text-zinc-500 line-clamp-2 italic leading-relaxed">
                      "{dump.rawAudioText}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Simulated App Interface */}
          <div className="lg:col-span-2 bg-[#0d0d0d] border border-zinc-800/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-8 shadow-2xl relative min-h-[480px]">
            
            {/* Interface Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-xs font-bold font-mono tracking-wider text-zinc-300 uppercase">Silencly OS v1.4</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
                Client Mode
              </div>
            </div>

            {/* Visualizer & Recorder Area */}
            <div className="flex-1 flex flex-col justify-center items-center py-6">
              {isProcessing ? (
                /* Processing Screen */
                <div className="flex flex-col items-center text-center space-y-4">
                  <RefreshCw className="w-10 h-10 text-purple-400 animate-spin" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold font-mono tracking-wide text-zinc-200">AI Structuring Speech</h4>
                    <p className="text-xs text-zinc-500 animate-pulse">{currentStepMessage}</p>
                  </div>
                  {/* Progress Line */}
                  <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500" 
                      style={{ width: `${(processingStep + 1) * 20}%` }}
                    />
                  </div>
                </div>
              ) : isRecording ? (
                /* Recording Screen */
                <div className="flex flex-col items-center text-center space-y-4 w-full">
                  {/* Waveform Bars */}
                  <div className="flex items-end justify-center gap-1.5 h-16 px-4">
                    {visualizerBars.map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-purple-600 via-pink-500 to-purple-400 rounded-full transition-all duration-75"
                        style={{ height: `${h * 2}px` }}
                      />
                    ))}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold font-mono tracking-wide text-red-500 animate-pulse flex items-center gap-1 justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                      REC LIVE: SIMULATION
                    </h4>
                    <p className="text-xs text-zinc-500">Transcribing voice stream: {recordingProgress.toFixed(0)}%</p>
                  </div>
                  <button
                    onClick={finishDemoRecording}
                    className="p-4 bg-red-500 hover:bg-red-600 rounded-full text-white cursor-pointer transition-transform hover:scale-105"
                    title="Stop Simulation"
                  >
                    <Square className="w-5 h-5 fill-white" />
                  </button>
                </div>
              ) : typedText ? (
                /* Result Screen */
                <div className="w-full flex flex-col space-y-4 animate-in fade-in duration-300">
                  {/* Tabs */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-zinc-900 pb-2">
                    {[
                      { id: "formatted", label: "Formatted", icon: Wand2 },
                      { id: "raw", label: "Raw Transcript", icon: FileText },
                      { id: "summary", label: "Summary", icon: MessageSquare },
                      { id: "actions", label: "Action Items", icon: CheckSquare }
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isCurrent = currentTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setCurrentTab(tab.id as any)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                            isCurrent
                              ? "bg-zinc-100 text-black font-semibold"
                              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60"
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Text Output Block */}
                  <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 min-h-[160px] max-h-[220px] overflow-y-auto text-sm leading-relaxed text-zinc-300 font-light select-text">
                    {currentTab === "actions" ? (
                      <div className="space-y-2">
                        {typedText.split("\n").map((line, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs font-mono">
                            <span className="text-purple-400 font-bold">✔</span>
                            <span>{line.replace(/^• /, "")}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={currentTab === "raw" ? "font-mono text-xs text-zinc-400 italic bg-zinc-950 p-2.5 rounded-lg border border-zinc-900" : "font-sans"}>
                        {typedText}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Idle Screen */
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Static Waveform Icon */}
                  <div className="flex items-end justify-center gap-1.5 h-12 px-4 opacity-30">
                    {visualizerBars.slice(0, 16).map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-zinc-400 rounded-full"
                        style={{ height: `${h * 1.5}px` }}
                      />
                    ))}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold font-mono tracking-wide text-zinc-300">Ready to Dictate</h4>
                    <p className="text-xs text-zinc-500">Press record to capture the active voice dump.</p>
                  </div>
                  <button
                    onClick={startDemoRecording}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-full text-sm font-semibold transition-all cursor-pointer shadow-lg hover:shadow-purple-900/20"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Record Voice Dump
                  </button>
                </div>
              )}
            </div>

            {/* Prompt Warning */}
            <div className="text-[10px] text-zinc-600 border-t border-zinc-900 pt-4 flex items-center justify-between">
              <span>Interactive Simulator Mode</span>
              <button 
                onClick={onLaunchWorkspace}
                className="text-purple-400 hover:text-purple-300 transition-colors font-mono uppercase tracking-wider cursor-pointer"
              >
                Go to live workspace →
              </button>
            </div>

          </div>

        </div>

        {/* Call to action section */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-8 space-y-6 text-center">
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">Ready for the real thing?</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Experience the full client dashboard where you can record your own live microphone stream, apply multiple AI formatting prompts, use customizable dictionaries, and export files instantly.
            </p>
          </div>
          <button
            onClick={onLaunchWorkspace}
            className="bg-white hover:bg-zinc-100 text-black px-8 py-4 rounded-full text-sm font-semibold transition-all cursor-pointer shadow-lg inline-flex items-center gap-2 font-display"
          >
            Launch Active Workspace
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
