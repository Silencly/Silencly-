import { useState, useEffect, useRef, MouseEvent, FormEvent, ChangeEvent, ReactNode } from "react";
import { motion } from "motion/react";
import { useAppAuth } from "./lib/supabase-service";
import {
  Mic,
  Copy,
  Download,
  Trash2,
  History,
  Sparkles,
  RefreshCw,
  Edit2,
  Check,
  AlertTriangle,
  Volume2,
  CheckCheck,
  BookOpen,
  Square,
  Loader2,
  Eye,
  EyeOff,
  Settings,
  X,
  Database,
  Star,
  ArrowRight,
  Lock,
  Zap,
  Play,
  Pause,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  BarChart3,
  Rocket,
  Users,
  Menu,
  Heart,
  Triangle,
  Chrome,
  Github,
  Twitter,
  Circle,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Sun,
  Moon
} from "lucide-react";
import Waveform from "./components/Waveform";
import HistoryDrawer from "./components/HistoryDrawer";
import DictionaryDrawer, { DictionaryItem } from "./components/DictionaryDrawer";
import PricingSection from "./components/ui/pricing-section-4";
import { Testimonials } from "./components/ui/twitter-testimonial-cards";
import { DictationSession, ToneOption, TONE_OPTIONS } from "./types";

const marqueeLogos = [
  { name: "Procure", url: "https://svgl.app/library/preact.svg", gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" },
  { name: "Shopify", url: "https://svgl.app/library/shopify.svg", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
  { name: "Blender", url: "https://svgl.app/library/blender.svg", gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" },
  { name: "Figma", url: "https://svgl.app/library/figma.svg", gradient: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)" },
  { name: "Spotify", url: "https://svgl.app/library/spotify.svg", gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)" },
  { name: "Lottielab", url: "https://svgl.app/library/lottielab.svg", gradient: "linear-gradient(135deg, #eab308 0%, #22c55e 100%)" },
  { name: "Google Cloud", url: "https://svgl.app/library/google-cloud.svg", gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)" },
  { name: "Bing", url: "https://svgl.app/library/bing.svg", gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }
];

const faqData = {
  "General": [
    {
      q: "What is Silencly?",
      a: "Traditional voice-to-text transcribes your words literally, keeping all filler words, grammar mistakes, and disjointed pacing. Silencly acts as an real-time professional editor—listening to your raw thoughts and instantly rewriting them into perfectly organized bullet points, clean paragraphs, or checklists."
    },
    {
      q: "Who is this for?",
      a: "For creators, researchers, professionals, and anyone who thinks faster than they type. If you regularly use scratchpads or voice memos to braindump unorganized thoughts, Silencly will save you hours of editing."
    },
    {
      q: "Do I need prior experience with AI?",
      a: "Not at all. Silencly is designed to be completely intuitive. Just press record, speak naturally, and the AI handles all the formatting and cleanup automatically."
    },
    {
      q: "How long does it take?",
      a: "It transcribes and polishes your voice in near real-time, delivering the final formatted text instantly after you finish speaking."
    },
    {
      q: "Is there a community?",
      a: "Yes! We have an active Discord community where power users share custom dictionary setups, style presets, and workflow tips."
    }
  ],
  "AI & Capabilities": [
    {
      q: "How does the custom dictionary feature work?",
      a: "In your workspace settings, you can add custom vocabulary, names, technology acronyms, or specific product references. Silencly prioritizes these mappings during the AI polishing stage, ensuring terms are spelled perfectly every time."
    },
    {
      q: "Can I customize the tone and style?",
      a: "Yes, you can choose from various preset tones (like Professional, Casual, Bullet Points) or upgrade to Pro to create fully customizable style instructions."
    },
    {
      q: "What languages do you support?",
      a: "Silencly currently supports English for optimal tone parsing, but our raw transcription engine supports over 50 languages. We are actively expanding AI formatting for more languages."
    }
  ],
  "Integrations & Security": [
    {
      q: "Is my audio and transcription data secure?",
      a: "Yes, completely. Silencly is owned and operated privately, meaning we do not rent or sell your data, nor do we feed your recordings into external public models to train them. Your privacy is structurally locked."
    },
    {
      q: "Can I export my transcripts?",
      a: "Yes, you can easily copy your text, export it to markdown, or sync it with your connected note-taking apps."
    },
    {
      q: "Where is my data stored?",
      a: "All your data is securely encrypted at rest and in transit. Paid workspace plans offer multi-device cloud secure history backup."
    }
  ]
};



const AboutPage = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-zinc-950 text-zinc-50 p-12 mt-20">
    <button onClick={onBack} className="mb-8 text-blue-600 hover:underline">← Back to home</button>
    <h1 className="text-4xl font-bold mb-4">About Silencly</h1>
    <p className="max-w-2xl text-lg text-zinc-300">Silencly is building the foundation of the new digital epoch. We empower builders, enterprises, and communities with decentralized tools.</p>
  </div>
);

export default function App() {
  const {
    user,
    isCheckingAuth,
    error: authError,
    setError: setAuthError,
    isSupabaseConfigured,
    signInWithEmail,
    signUpWithEmail,
    signOut: handleSignOut,
    signInWithSocial,
  } = useAppAuth();

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [page, setPage] = useState<"home" | "about">("home");
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Landing Page States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [playgroundTab, setPlaygroundTab] = useState<"thought" | "meeting" | "ideas">("thought");
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [demoTextStage, setDemoTextStage] = useState<"idle" | "listening" | "transcribing" | "polishing" | "done">("idle");
  const [demoProgress, setDemoProgress] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqCategory, setFaqCategory] = useState<"General" | "AI & Capabilities" | "Integrations & Security">("General");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoCopied, setDemoCopied] = useState(false);
  const [stellarTab, setStellarTab] = useState<"analyse" | "train" | "testing" | "deploy">("analyse");

  useEffect(() => {
    const tabs: Array<"analyse" | "train" | "testing" | "deploy"> = ["analyse", "train", "testing", "deploy"];
    const interval = setInterval(() => {
      setStellarTab((prev) => {
        const currentIndex = tabs.indexOf(prev);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Core Dictation States
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<"idle" | "recording" | "transcribing" | "polishing">("idle");
  const [duration, setDuration] = useState(0);
  const [rawText, setRawText] = useState("");
  const [polishedText, setPolishedText] = useState("");
  const [selectedTone, setSelectedTone] = useState<ToneOption>("polished");
  const [title, setTitle] = useState("New Dictation");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // History & Drawer States
  const [sessions, setSessions] = useState<DictationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Custom Dictionary States
  const [dictionaryItems, setDictionaryItems] = useState<DictionaryItem[]>([]);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);

  // Action feedback states
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedPolished, setCopiedPolished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio & Recording Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialTextRef = useRef("");

  // Fetch history and dictionary from backend on load
  useEffect(() => {
    fetchHistory();
    fetchDictionary();
  }, []);

  // Preset demo options for the interactive playground
  const demoPresets = {
    thought: {
      title: "Messy Brainstorm",
      duration: "0:24",
      raw: "okay so let's see we need to definitely plan the launch of Silencly next tuesday but wait before that we need to make sure we set up the google cloud console javascript origins and verify the build works on vercel also Johan wanted us to double-check the billing webhook which is super important of course",
      polished: `### 🚀 Silencly Launch Preparation Checklist

*   **Timeline:** Target launch date is next Tuesday.
*   **Deployment & Auth Setup:**
    *   Configure Authorized JavaScript Origins in the Google Cloud Console.
    *   Verify complete build stability on Vercel.
*   **Billing Integration:**
    *   Double-check and validate the billing webhooks (Critical priority).`
    },
    meeting: {
      title: "Scrum Team Alignment",
      duration: "0:36",
      raw: "um so for the landing page we want to show a nice bento grid list of features and definitely an interactive sandbox or playground where people can see how raw speech gets cleaned up by AI and then we should put a pricing page with monthly and yearly plans so they can upgrade to Pro for unlimited usage and also some reviews of developers loving it",
      polished: `### 📝 Landing Page Design Requirements

1.  **Layout & Features:**
    *   Implement a high-converting **Bento Grid** showcasing features.
2.  **Interactive Playground:**
    *   Build an engaging simulation showing raw-to-polished voice transcription.
3.  **Monetization & Plans:**
    *   Add a flexible pricing table supporting monthly and annual tiers.
4.  **Social Proof:**
    *   Incorporate developer testimonials and verified user reviews.`
    },
    ideas: {
      title: "Product Marketing Insight",
      duration: "0:18",
      raw: "i should probably write a blog post about how traditional speech-to-text gets details wrong and how our custom dictionary actually fixes that because like you can save your own tech words so it doesn't spell them like standard english words which is incredibly helpful for coding and specialized research",
      polished: `### 💡 Content Outline: The Power of Custom Dictionaries

*   **The Problem:** Traditional speech-to-text tools frequently fail with technical jargon and custom acronyms.
*   **The Solution (Silencly):** Custom terminology mapping ensures acronyms and developer terms are recognized flawlessly.
*   **Key Talking Points:**
    *   Why standard English dictionaries fall short in specialized fields.
    *   How custom shorthand maps save hours of manual correction.`
    }
  };

  // Playground simulation effect
  useEffect(() => {
    if (!isPlayingDemo) {
      setDemoProgress(0);
      setDemoTextStage("idle");
      return;
    }

    setDemoTextStage("listening");
    setDemoProgress(0);

    let listenInterval: NodeJS.Timeout;
    let transcribingInterval: NodeJS.Timeout;
    let polishingInterval: NodeJS.Timeout;

    let curProgress = 0;
    listenInterval = setInterval(() => {
      curProgress += 4;
      setDemoProgress(Math.min(curProgress, 100));
      if (curProgress >= 100) {
        clearInterval(listenInterval);
        setDemoTextStage("transcribing");
        setDemoProgress(0);
        
        let transcribingProgress = 0;
        transcribingInterval = setInterval(() => {
          transcribingProgress += 10;
          setDemoProgress(Math.min(transcribingProgress, 100));
          if (transcribingProgress >= 100) {
            clearInterval(transcribingInterval);
            setDemoTextStage("polishing");
            setDemoProgress(0);
            
            let polishingProgress = 0;
            polishingInterval = setInterval(() => {
              polishingProgress += 12;
              setDemoProgress(Math.min(polishingProgress, 100));
              if (polishingProgress >= 100) {
                clearInterval(polishingInterval);
                setDemoTextStage("done");
                setIsPlayingDemo(false);
              }
            }, 100);
          }
        }, 100);
      }
    }, 80);

    return () => {
      clearInterval(listenInterval);
      clearInterval(transcribingInterval);
      clearInterval(polishingInterval);
    };
  }, [isPlayingDemo, playgroundTab]);

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError("Please fill in email and password fields.");
      return;
    }
    try {
      await signInWithEmail(authEmail, authPassword);
      setAuthEmail("");
      setAuthPassword("");
    } catch (err) {}
  };

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim() || authName;
    if (!authEmail || !authPassword || !fullName) {
      setAuthError("Please fill in all sign-up fields.");
      return;
    }
    try {
      await signUpWithEmail(authEmail, authPassword, fullName);
    } catch (err) {}
  };

  const openOAuthPopup = async (provider: string) => {
    try {
      await signInWithSocial(provider as any);
    } catch (err) {}
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error("Failed to load history from backend, falling back to local storage", err);
      const cached = localStorage.getItem("ai_dictation_history");
      if (cached) {
        setSessions(JSON.parse(cached));
      }
    }
  };

  const fetchDictionary = async () => {
    try {
      const res = await fetch("/api/dictionary");
      if (res.ok) {
        const data = await res.json();
        setDictionaryItems(data);
      }
    } catch (err) {
      console.error("Failed to load dictionary from backend", err);
    }
  };

  const addDictionaryItem = async (word: string, replaceWith?: string) => {
    try {
      const res = await fetch("/api/dictionary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, replaceWith })
      });
      if (res.ok) {
        const newItem = await res.json();
        setDictionaryItems(prev => [...prev, newItem]);
      }
    } catch (err) {
      console.error("Failed to add dictionary item", err);
    }
  };

  const deleteDictionaryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/dictionary/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setDictionaryItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete dictionary item", err);
    }
  };

  const saveHistorySession = async (session: DictationSession) => {
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session)
      });
      if (res.ok) {
        const saved = await res.json();
        // Refresh local sessions list
        setSessions((prev) => {
          const updated = [...prev];
          const idx = updated.findIndex((s) => s.id === saved.id);
          if (idx > -1) {
            updated[idx] = saved;
          } else {
            updated.unshift(saved);
          }
          localStorage.setItem("ai_dictation_history", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to save history session to backend", err);
      // Fallback local save
      setSessions((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((s) => s.id === session.id);
        if (idx > -1) {
          updated[idx] = session;
        } else {
          updated.unshift(session);
        }
        localStorage.setItem("ai_dictation_history", JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Setup Web Speech API for real-time browser dictation stream
  const initSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const sessionText = (finalTranscript + interimTranscript).trim();
        if (sessionText) {
          setRawText(initialTextRef.current + sessionText);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e.error);
        if (e.error === "not-allowed") {
          setError("Microphone access was denied. Please grant permissions.");
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("SpeechRecognition is not natively supported in this browser. Fallback to full record transcription.");
    }
  };

  // Toggle record trigger
  const handleToggleRecord = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  // Start Voice Recording
  const startRecording = async () => {
    setError(null);
    setDuration(0);
    audioChunksRef.current = [];

    // Auto-save existing dictation session so nothing is lost, then clear workspace
    if (rawText.trim() || polishedText.trim()) {
      const sessionId = activeSessionId || crypto.randomUUID();
      const sessionToAutoSave: DictationSession = {
        id: sessionId,
        createdAt: new Date().toISOString(),
        title: title || `Dictation ${new Date().toLocaleDateString()}`,
        rawText: rawText,
        polishedText: polishedText,
        durationSeconds: duration || 0
      };
      await saveHistorySession(sessionToAutoSave);
    }

    // Reset workspace completely for a fresh, unmixed dictation session
    setRawText("");
    setPolishedText("");
    setActiveSessionId(null);
    initialTextRef.current = "";

    try {
      // 1. Get User Media Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Setup Web Audio API Analyser for Waveform
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // 3. Setup Native Media Recorder
      const options = { mimeType: "audio/webm" };
      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch {
        mediaRecorder = new MediaRecorder(stream); // Fallback standard format
      }

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 4. Setup browser-level SpeechRecognition for live stream
      initSpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      // 5. Start systems
      mediaRecorder.start(250); // Slice audio every 250ms
      setIsRecording(true);
      setStatus("recording");

      // Set Title if starting fresh
      const formattedDate = new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setTitle(`Dictation ${formattedDate}`);

      // Start stopwatch interval
      timerIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access failed:", err);
      setError("Failed to open microphone. Please check permissions and ensure no other application is using it.");
      setIsRecording(false);
      setStatus("idle");
    }
  };

  // Stop Voice Recording
  const stopRecording = () => {
    if (!isRecording) return;

    setIsRecording(false);
    setStatus("transcribing");

    // Clear timers
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Stop real-time browser Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping SpeechRecognition", err);
      }
    }

    // Stop Media Recorder & trigger server processing
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = async () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        // Convert audio Blob to Base64 to safely transmit to server
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(",")[1];
          await processAudioAndPolish(base64Audio, mimeType);
        };
      };
      recorder.stop();
    } else {
      setStatus("idle");
    }

    // Stop micro-amp tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
  };

  // Process transcription via Gemini and polish text immediately
  const processAudioAndPolish = async (base64Audio: string, mimeType: string) => {
    try {
      // 1. Send base64 audio to full server-side Gemini transcriber
      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: base64Audio, mimeType })
      });

      let transcribedText = rawText; // Fallback to live browser Speech Recognition if available

      if (transcribeRes.ok) {
        const transcribeData = await transcribeRes.json();
        if (transcribeData.text && transcribeData.text.trim() !== "") {
          transcribedText = transcribeData.text.trim();
          setRawText(transcribedText);
        }
      } else {
        const errorText = await transcribeRes.text();
        let errorMsg = "Unknown error";
        try { errorMsg = JSON.parse(errorText).error || errorText; } catch(e) { errorMsg = errorText; }
        console.error("Transcription API Error:", errorMsg);
        console.warn("Gemini server-side transcription failed. Falling back to browser SpeechRecognition text.");
      }

      if (!transcribedText || transcribedText.trim() === "") {
        setStatus("idle");
        setError("No clear speech detected. Please speak closer to the microphone and try again.");
        return;
      }

      // 2. Polish raw text into the selected style tone
      setStatus("polishing");
      const polishRes = await fetch("/api/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcribedText, tone: selectedTone })
      });

      let polishedResult = "";
      if (polishRes.ok) {
        const polishData = await polishRes.json();
        polishedResult = polishData.polishedText;
        setPolishedText(polishedResult);
      } else {
        const errorText = await polishRes.text();
        let errorMsg = "Unknown error";
        try { errorMsg = JSON.parse(errorText).error || errorText; } catch(e) { errorMsg = errorText; }
        throw new Error(`Failed to polish text: ${errorMsg}`);
      }

      // 3. Create session & save to history
      const sessionId = activeSessionId || crypto.randomUUID();
      setActiveSessionId(sessionId);

      const newSession: DictationSession = {
        id: sessionId,
        createdAt: new Date().toISOString(),
        title: title || "New Dictation",
        rawText: transcribedText,
        polishedText: polishedResult,
        durationSeconds: duration || 5
      };

      await saveHistorySession(newSession);
      setStatus("idle");
    } catch (err: any) {
      console.error("Processing flow failed:", err);
      setError(err.message || "An error occurred while refining your dictation.");
      setStatus("idle");
    }
  };

  // Re-run text polishing when a different tone is chosen
  const handleToneChange = async (tone: ToneOption) => {
    setSelectedTone(tone);
    if (!rawText || rawText.trim() === "") return;

    setStatus("polishing");
    setError(null);

    try {
      const res = await fetch("/api/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText, tone })
      });

      if (res.ok) {
        const data = await res.json();
        setPolishedText(data.polishedText);

        // Update active history item if exists
        if (activeSessionId) {
          const currentSession = sessions.find((s) => s.id === activeSessionId);
          if (currentSession) {
            const updatedSession: DictationSession = {
              ...currentSession,
              polishedText: data.polishedText
            };
            await saveHistorySession(updatedSession);
          }
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to re-polish draft.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to polish draft in the new tone.");
    } finally {
      setStatus("idle");
    }
  };

  // Save current manual edits of raw or polished text
  const handleSaveChanges = async () => {
    if (!activeSessionId) {
      // Create session first
      const sessionId = crypto.randomUUID();
      setActiveSessionId(sessionId);
      const newSession: DictationSession = {
        id: sessionId,
        createdAt: new Date().toISOString(),
        title: title,
        rawText: rawText,
        polishedText: polishedText,
        durationSeconds: duration || 0
      };
      await saveHistorySession(newSession);
    } else {
      const currentSession = sessions.find((s) => s.id === activeSessionId);
      if (currentSession) {
        const updatedSession: DictationSession = {
          ...currentSession,
          title: title,
          rawText: rawText,
          polishedText: polishedText
        };
        await saveHistorySession(updatedSession);
      }
    }
  };

  // History Drawer Select
  const handleSelectSession = (session: DictationSession) => {
    setActiveSessionId(session.id);
    setTitle(session.title);
    setRawText(session.rawText);
    setPolishedText(session.polishedText);
    setDuration(session.durationSeconds);
    setIsHistoryOpen(false);
    setError(null);
  };

  // Delete history item
  const handleDeleteSession = async (id: string, e: MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSessions((prev) => {
          const updated = prev.filter((s) => s.id !== id);
          localStorage.setItem("ai_dictation_history", JSON.stringify(updated));
          return updated;
        });
        if (activeSessionId === id) {
          handleClearWorkspace();
        }
      }
    } catch (err) {
      console.error("Delete session failed", err);
    }
  };

  // Clear all history
  const handleClearHistory = async () => {
    if (confirm("Are you sure you want to clear all history sessions? This is irreversible.")) {
      try {
        const res = await fetch("/api/history", { method: "DELETE" });
        if (res.ok) {
          setSessions([]);
          localStorage.removeItem("ai_dictation_history");
          handleClearWorkspace();
          setIsHistoryOpen(false);
        }
      } catch (err) {
        console.error("Clear history failed", err);
      }
    }
  };

  // Reset current screen
  const handleClearWorkspace = () => {
    setRawText("");
    setPolishedText("");
    setDuration(0);
    setActiveSessionId(null);
    setTitle("New Dictation");
    setError(null);
  };

  // Copy text helper
  const handleCopyToClipboard = (text: string, type: "raw" | "polished") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "raw") {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    } else {
      setCopiedPolished(true);
      setTimeout(() => setCopiedPolished(false), 2000);
    }
  };

  // Export .txt file helper
  const handleExportTxt = (text: string, fileName: string) => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        return "Transcribing voice notes...";
      case "polishing":
        return "Refining style guidelines...";
      default:
        return "Ready to record. Tap mic to start.";
    }
  };

  if (window.location.pathname === "/auth/callback" || window.location.pathname === "/sso-callback") {
    if (!isCheckingAuth) {
      window.location.href = "/";
    }
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-zinc-100 antialiased font-sans">
        <RefreshCw className="w-8 h-8 text-zinc-400 animate-spin mb-3" />
        <p className="text-xs font-mono text-zinc-500 tracking-wider">COMPLETING SECURE SSO CALLBACK...</p>
      </div>
    );
  }

  if (isCheckingAuth && !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-zinc-100 antialiased font-sans">
        <RefreshCw className="w-8 h-8 text-zinc-400 animate-spin mb-3" />
        <p className="text-xs font-mono text-zinc-500 tracking-wider">SECURE AUTHORIZATION IN PROGRESS...</p>
      </div>
    );
  }

  if (!user) {
    if (showAuthModal) {
      return (
        <main className="flex min-h-screen w-full bg-black selection:bg-zinc-950/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4 text-white">
          {/* Left Column (Hero) */}
          <div className="hidden lg:flex w-[52%] relative flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4"
                type="video/mp4"
              />
            </video>

            {/* Content Over the Video */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.2,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
              className="z-10 w-full max-w-xs space-y-8"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="flex items-center gap-2"
              >
                <Circle className="w-5 h-5 fill-white text-white" />
                <span className="text-xl font-semibold tracking-tight">Silencly</span>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="space-y-2"
              >
                <h2 className="text-4xl font-medium tracking-tight whitespace-nowrap">Join Silencly</h2>
                <p className="text-white/60 text-sm leading-relaxed px-4">
                  Follow these 3 quick phases to activate your space.
                </p>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="space-y-3"
              >
                <StepItem number={1} text="Register your identity" active={true} />
                <StepItem number={2} text="Configure your studio" />
                <StepItem number={3} text="Finalize your profile" />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column (Sign Up Form) */}
          <div className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden relative bg-black">
            {/* Close Button to return to landing page */}
            <button
              onClick={() => {
                setShowAuthModal(false);
                setAuthError(null);
              }}
              className="absolute top-6 right-6 lg:top-8 lg:right-8 text-white/40 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-zinc-950/5"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10"
            >
              <div className="text-left">
                <h1 className="text-3xl font-medium tracking-tight text-white">
                  {authMode === "signup" ? "Create New Profile" : "Welcome Back"}
                </h1>
                <p className="text-white/40 text-sm mt-1.5">
                  {authMode === "signup"
                    ? "Input your basic details to begin the journey."
                    : "Input your credentials to continue the journey."}
                </p>
              </div>

              {/* Supabase config warning if not configured */}
              {!isSupabaseConfigured && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-350 text-left flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-bold tracking-wider text-[10px] uppercase text-amber-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Supabase Config Needed</span>
                  </div>
                  <p className="leading-relaxed">
                    To enable production authentication, please add your Supabase credentials to your environment secrets in AI Studio:
                  </p>
                  <code className="bg-zinc-950/5 p-2 rounded-lg font-mono text-[10px] block break-all text-amber-200">
                    VITE_SUPABASE_URL<br/>
                    VITE_SUPABASE_ANON_KEY
                  </code>
                </div>
              )}

              {/* Error Alert */}
              {authError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-left flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <SocialButton
                  icon={Chrome}
                  label="Google"
                  onClick={() => openOAuthPopup("google")}
                />
                <SocialButton
                  icon={Github}
                  label="GitHub"
                  onClick={() => openOAuthPopup("github")}
                />
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative bg-black px-4 text-xs font-medium text-white/40 uppercase tracking-widest">
                  Or
                </span>
              </div>

              {/* Auth Form */}
              <form
                onSubmit={authMode === "signin" ? handleEmailSignIn : handleEmailSignUp}
                className="space-y-6 text-left"
              >
                {authMode === "signup" && (
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup
                      label="First Name"
                      placeholder="Anubhav"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <InputGroup
                      label="Last Name"
                      placeholder="Sapkota"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <InputGroup
                  label="Email Address"
                  placeholder="name@domain.com"
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                />

                <div className="space-y-1">
                  <InputGroup
                    label="Password"
                    placeholder="••••••••"
                    type={passwordVisible ? "text" : "password"}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                  >
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      {passwordVisible ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </InputGroup>
                  {authMode === "signup" && (
                    <p className="text-[11px] text-white/40 mt-1">Requires at least 8 symbols.</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-zinc-950 text-zinc-50 font-semibold rounded-xl hover:bg-zinc-950/90 active:scale-[0.98] mt-4 transition-all cursor-pointer flex items-center justify-center"
                >
                  {authMode === "signup" ? "Create Account" : "Sign In"}
                </button>
              </form>

              {/* Footer Switch Link */}
              <div className="text-center mt-6">
                {authMode === "signup" ? (
                  <p className="text-sm text-white/40">
                    Member of the team?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signin");
                        setAuthError(null);
                      }}
                      className="font-medium text-white hover:underline cursor-pointer"
                    >
                      Log in
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-white/40">
                    New to Silencly?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signup");
                        setAuthError(null);
                      }}
                      className="font-medium text-white hover:underline cursor-pointer"
                    >
                      Create Account
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      );
    }

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col antialiased font-sans selection:bg-zinc-900 relative overflow-hidden">
        {/* Soft, beautiful grid overlay in light gray */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e05_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left Brand */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img src="https://i.ibb.co/Q742H44R/gemini-watermark-removed.png" alt="Silencly Logo" className="w-6.5 h-6.5 object-contain" referrerPolicy="no-referrer" />
              <span className="text-lg font-bold font-display tracking-tight text-zinc-50 select-none">Silencly</span>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-400">
              <a href="#features" className="hover:text-zinc-50 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-zinc-50 transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-zinc-50 transition-colors">FAQ</a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setAuthMode("signin");
                  setShowAuthModal(true);
                }}
                className="text-sm font-semibold text-zinc-400 hover:text-zinc-50 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setShowAuthModal(true);
                }}
                className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold px-4.5 py-2 rounded-full transition-all active:scale-[0.98] cursor-pointer shadow-xs flex items-center gap-1.5 font-sans"
              >
                <span>Get started free</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32 max-w-7xl mx-auto text-center">
          {/* Reviews Badge */}
          <div className="inline-flex items-center gap-2 mb-8 bg-black border border-zinc-800 px-3.5 py-1.5 rounded-full shadow-xs animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <div className="w-6 h-6 border border-gray-300 bg-zinc-950 rounded flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-zinc-50 fill-black" />
            </div>
            <span className="text-sm font-medium text-zinc-50">4.9 rating from 18.3K+ users</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-sans font-normal leading-[1.1] tracking-tight mb-5 text-zinc-50 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            Work Smarter. Move Faster.<br />
            <span className="bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent font-medium">
              AI Powers You Up.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            Intelligent automation syncs with the tools you love to streamline tasks, boost output, and save time.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up mb-12" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <button
              onClick={() => {
                setAuthMode("signup");
                setShowAuthModal(true);
              }}
              className="bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors cursor-pointer shadow-lg active:scale-[0.98]"
            >
              Begin Free Trial
            </button>
          </div>

          {/* Video and Tabs Removed */}

          {/* Company Logos */}
          <div className="mt-24 border-t border-zinc-900 pt-12 w-full animate-fade-in-up" style={{ animationDelay: '0.8s', opacity: 0 }}>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest text-center mb-8">Trusted by industry leaders worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-gray-400 select-none">
              {/* INTERSCOPE */}
              <span className="text-xs font-black tracking-[0.2em] text-gray-400 hover:text-zinc-50 transition-colors font-sans">INTERSCOPE</span>
              {/* SPOTIFY */}
              <span className="text-xs font-extrabold tracking-[0.05em] text-gray-400 hover:text-zinc-50 transition-colors flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-gray-200 rounded-full flex items-center justify-center text-[7px] text-white">●</span>
                <span>SPOTIFY</span>
              </span>
              {/* Nexera */}
              <span className="text-xs font-bold tracking-[0.1em] text-gray-400 hover:text-zinc-50 transition-colors flex items-center gap-1">
                <div className="grid grid-cols-2 gap-0.5 w-2 h-2">
                  <div className="w-0.5 h-0.5 bg-gray-400 rounded-full" />
                  <div className="w-0.5 h-0.5 bg-gray-400 rounded-full" />
                  <div className="w-0.5 h-0.5 bg-gray-400 rounded-full" />
                  <div className="w-0.5 h-0.5 bg-gray-400 rounded-full" />
                </div>
                <span>Nexera</span>
              </span>
              {/* M3 */}
              <span className="text-sm font-serif italic font-extrabold tracking-wide text-gray-400 hover:text-zinc-50 transition-colors">M3</span>
              {/* LAURA COLE */}
              <span className="text-xs font-light tracking-[0.15em] text-gray-400 hover:text-zinc-50 transition-colors flex items-center gap-1.5">
                <span className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center text-[7px] font-bold">LC</span>
                <span>LAURA COLE</span>
              </span>
              {/* vertex */}
              <span className="text-xs font-semibold tracking-[0.1em] text-gray-400 hover:text-zinc-50 transition-colors flex items-center gap-1">
                <span>vertex</span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
              </span>
            </div>
          </div>
        </section>

        {/* Core Features Marketing Section */}
        <section id="features" className="py-20 md:py-28 border-t border-zinc-900 max-w-7xl mx-auto px-6 w-full flex justify-center bg-[#ffffff]">
          <div className="c1-container py-20 px-5 flex flex-col items-center">
            
            {/* Header Block */}
            <div className="mb-12 text-center max-w-3xl mx-auto">
              <span className="c1-badge">Core Features</span>
              <h2 className="c1-title">Built for Speed & Quality</h2>
              <p className="c1-subtitle">
                Everything you need to go<br />from idea to image
              </p>
            </div>

            {/* Grid */}
            <div className="c1-grid w-full">
              
              {/* Card 1 — Smart Prompt Suggestions */}
              <div className="c1-card c1-card-1">
                {/* Prompt box */}
                <div className="absolute top-[30px] left-[24px] right-[24px] bg-zinc-950 rounded-[12px] p-[16px] text-[0.8rem] text-[#475569] leading-[1.6] shadow-[0_8px_20px_rgba(0,0,0,0.04)] text-left select-none">
                  A bright, high-resolution 3D illustration of a <span className="c1-blur-text">cheerful cartoon</span> of a <span className="c1-blur-text">girl character</span> <span className="c1-blur-text">centred against a</span> smooth blue background
                </div>
                
                {/* "Add more details" pill button */}
                <button
                  type="button"
                  className="absolute top-[180px] left-[40px] bg-zinc-950 border border-black py-[5px] px-[14px] rounded-[20px] text-[0.75rem] font-semibold text-[#1e293b] shadow-[0_4px_15px_rgba(0,0,0,0.08)] flex items-center gap-[6px] select-none pointer-events-none"
                >
                  <span>Add more details</span>
                  <span style={{ color: '#a855f7', fontSize: '1rem' }}>✦</span>
                </button>

                {/* Cursor SVG arrow */}
                <svg
                  className="absolute top-[205px] left-[110px] w-6 h-6 select-none pointer-events-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)] z-10"
                  viewBox="0 0 24 24"
                  fill="#0f172a"
                  stroke="#ffffff"
                  strokeWidth="1"
                >
                  <path d="M4 2L20 11L11 13L9 22L4 2Z" />
                </svg>

                <h3 className="relative z-10">Smart Prompt Suggestions</h3>
              </div>

              {/* Card 2 — API Access */}
              <div className="c1-card c1-card-2">
                <div className="c1-api-visual absolute top-0 left-0 right-0 bottom-[70px] flex items-center justify-center px-[24px]">
                  <img
                    className="c1-network-img w-full h-[180px] object-contain mt-[20px]"
                    src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/network.svg"
                    alt="Network visualization"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="relative z-10">API Access</h3>
              </div>

              {/* Card 3 — Project Library */}
              <div className="c1-card c1-card-3">
                {/* Mesh overlay */}
                <div className="c1-mesh" />

                {/* Folder image */}
                <img
                  className="c1-folder absolute top-[50px] left-1/2 -translate-x-1/2 w-[170px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.08)]"
                  src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/library%20icon.svg"
                  alt="Library folder icon"
                  referrerPolicy="no-referrer"
                />

                {/* Search pill */}
                <div className="c1-search absolute top-[220px] left-1/2 -translate-x-1/2 bg-zinc-950 border border-black py-[6px] px-[18px] rounded-[20px] text-[0.75rem] font-medium text-[#1e293b] shadow-[0_8px_20px_rgba(0,0,0,0.06)] whitespace-nowrap flex items-center gap-[8px] select-none pointer-events-none">
                  {/* lucide-style search SVG */}
                  <svg
                    className="w-[14px] h-[14px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Search in library</span>
                </div>

                <h3 className="relative z-10">Project Library</h3>
              </div>

            </div>
          </div>
        </section>

        {/* Modern Landing Page Section */}
        <section id="epoch" className="py-20 md:py-28 bg-black w-full px-5 md:px-10 flex flex-col items-center justify-center font-sans border-t border-zinc-900">
          <div className="w-full max-w-[1400px] mx-auto text-center flex flex-col items-center">
            
            {/* Main Hero Container */}
            <div className="relative w-full rounded-[48px] bg-zinc-950 border border-zinc-800/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
              
              {/* Background Video */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-105 transition-transform duration-1000"
                >
                  <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Hero Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start text-left"
              >
                {/* Headline */}
                <h1 className="font-display text-[42px] md:text-[56px] font-medium tracking-tight text-zinc-50 leading-none mb-4">
                  Foundation of the<br />new voice epoch
                </h1>

                {/* Subheadline */}
                <p className="font-sans text-[14px] md:text-[15px] text-[#64748b] max-w-xl leading-relaxed mb-8">
                  Designing products, powering ecosystems and laying the foundation of a decentralized vocal web for enterprises, builders and communities alike.
                </p>

                {/* Contact Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#0a152d] text-white px-8 py-3 rounded-full font-semibold text-sm shadow-md transition-all cursor-pointer hover:bg-[#0f2142]"
                >
                  Contact Us
                </motion.button>
              </motion.div>

              {/* Floating Bottom Navbar */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
                <motion.nav
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="flex items-center bg-zinc-950/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-zinc-800/40"
                >
                  {/* Small circular logo placeholder */}
                  <div className="w-9 h-9 bg-zinc-950 border border-zinc-900 shadow-sm flex items-center justify-center rounded-full text-slate-500 font-semibold select-none mr-2">
                    ✦
                  </div>

                  {/* Two standard text buttons */}
                  <button className="text-[12px] font-semibold text-slate-500 hover:text-zinc-50 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer">
                    Products
                  </button>
                  <button className="text-[12px] font-semibold text-slate-500 hover:text-zinc-50 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer mr-2">
                    Docs
                  </button>

                  {/* Get in touch button */}
                  <button className="bg-zinc-950 px-5 py-2 rounded-full text-[12px] font-semibold text-zinc-50 border border-zinc-800/60 shadow-sm hover:border-zinc-700 transition-all flex items-center gap-1 shrink-0 cursor-pointer">
                    <span>Get in touch</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </motion.nav>
              </div>

            </div>

            {/* Seamless Marquee Logo Scroller Component */}
            <div className="w-full mt-10 overflow-hidden marquee-mask select-none">
              <div className="animate-marquee flex gap-6 py-4">
                {/* Double list to ensure seamless scroll */}
                {[...marqueeLogos, ...marqueeLogos].map((logo, index) => (
                  <div
                    key={index}
                    className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-zinc-950 border border-zinc-800/60 shadow-sm hover:border-zinc-700 transition-all overflow-hidden cursor-pointer"
                  >
                    {/* Hover dynamic gradient backing */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 scale-[1.5] group-hover:scale-100 transition-all duration-500 pointer-events-none z-0"
                      style={{ background: logo.gradient }}
                    />
                    {/* Logo Image */}
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="w-12 h-12 object-contain transition-all duration-300 z-10 group-hover:brightness-0 group-hover:invert"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection onAuthClick={() => {
          setAuthMode("signup");
          setShowAuthModal(true);
        }} />

        {/* User Reviews / Testimonials */}
        <section id="reviews" className="py-20 md:py-28 border-t border-zinc-900 max-w-7xl mx-auto px-6 w-full overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-bold font-mono tracking-wider text-zinc-50 uppercase bg-black border border-zinc-800 px-3 py-1 rounded-full">
              Social Proof
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-zinc-50 tracking-tight mt-4">
              Loved by Fast Builders
            </h2>
            <p className="text-sm text-gray-650 mt-3 font-light leading-relaxed">
              See how developers, managers, and creators supercharge their workflow using Silencly.
            </p>
          </div>

          <div className="max-w-5xl mx-auto font-sans flex justify-center">
            <Testimonials />
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 md:py-28 max-w-6xl mx-auto px-6 w-full">
          <div className="flex flex-col md:flex-row gap-16">
            {/* Left Column */}
            <div className="w-full md:w-1/3 flex flex-col">
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full mb-6">
                  <div className="w-1 h-1 rounded-full bg-zinc-500"></div>
                  FAQ
                </span>
                <h2 className="text-3xl md:text-4xl font-semibold text-zinc-50 tracking-tight leading-tight">
                  Answers to the questions that come up most.
                </h2>
              </div>
              
              <div className="hidden md:flex mt-8 flex-col space-y-1">
                {(Object.keys(faqData) as Array<keyof typeof faqData>).map((category) => (
                  <button
                    key={category}
                    onClick={() => { setFaqCategory(category); setExpandedFaq(null); }}
                    className={`text-left px-5 py-3 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      faqCategory === category 
                        ? "bg-zinc-800/50 text-zinc-50 border border-zinc-700/50 shadow-sm" 
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Mobile Category Select */}
              <div className="md:hidden mt-6 mb-8">
                <select 
                  value={faqCategory}
                  onChange={(e) => { setFaqCategory(e.target.value as any); setExpandedFaq(null); }}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                >
                  {Object.keys(faqData).map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="mt-8 bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6">
                <h3 className="text-lg font-medium text-zinc-50 mb-2">Got Questions?</h3>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                  Need help with something? Our team is here to make things easy. Don't hesitate to reach out.
                </p>
                <a href="#contact" className="text-sm font-medium text-zinc-50 hover:text-zinc-300 flex items-center gap-1 cursor-pointer">
                  Email us <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-2/3">
              <div className="mb-10 text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg hidden md:block mt-8">
                Learn how Silencly works, what it covers, how the workflow flows, and what you can expect day to day.
              </div>

              <div className="space-y-3">
                {faqData[faqCategory].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden transition-all hover:bg-zinc-900/60"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between text-zinc-50 font-medium text-sm md:text-base cursor-pointer"
                    >
                      <span className="pr-4">{item.q}</span>
                      <div className={`w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 pb-6 pt-0 text-sm md:text-base text-zinc-400 leading-relaxed font-light">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Public Footer */}
        <footer className="bg-[#0a0a0a] border-t border-zinc-900 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              {/* Column 1 */}
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <img src="https://i.ibb.co/Q742H44R/gemini-watermark-removed.png" alt="Silencly Logo" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                  <span className="text-xl font-bold text-zinc-50 tracking-tight">Silencly</span>
                </div>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  Join our newsletter for the latest updates and exclusive offers.
                </p>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-2.5 pl-4 pr-12 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700"
                  />
                  <button className="absolute right-1 top-1 bottom-1 bg-white text-black rounded-full w-8 flex items-center justify-center hover:bg-zinc-200 transition-colors cursor-pointer">
                    <Send className="w-4 h-4 ml-[-2px]" />
                  </button>
                </div>
              </div>

              {/* Column 2 */}
              <div>
                <h3 className="text-zinc-50 font-semibold mb-6">Quick Links</h3>
                <ul className="space-y-4">
                  <li><button onClick={() => { window.scrollTo(0, 0); setPage("home"); }} className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm cursor-pointer">Home</button></li>
                  <li><button onClick={() => setPage("about")} className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm cursor-pointer">About Us</button></li>
                  <li><a href="#features" className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm cursor-pointer">Features</a></li>
                  <li><a href="#pricing" className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm cursor-pointer">Pricing</a></li>
                  <li><a href="#contact" className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm cursor-pointer">Contact</a></li>
                </ul>
              </div>

              {/* Column 3 */}
              <div>
                <h3 className="text-zinc-50 font-semibold mb-6">Contact Us</h3>
                <ul className="space-y-4 text-sm text-zinc-400">
                  <li>123 AI Boulevard</li>
                  <li>Tech City, TC 12345</li>
                  <li>Phone: (123) 456-7890</li>
                  <li>Email: hello@silencly.com</li>
                </ul>
              </div>

              {/* Column 4 */}
              <div>
                <h3 className="text-zinc-50 font-semibold mb-6">Follow Us</h3>
                <div className="flex items-center gap-3 mb-8">
                  <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 transition-all cursor-pointer">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://x.com/thinkwispr" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 transition-all cursor-pointer">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 transition-all cursor-pointer">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 transition-all cursor-pointer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-zinc-400">
                  <Sun className="w-4 h-4" />
                  <div className="w-12 h-6 bg-white rounded-full p-1 flex items-center cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-black shadow-sm transform translate-x-6 transition-transform"></div>
                  </div>
                  <Moon className="w-4 h-4 text-zinc-50" />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
              <p>© 2026 Silencly. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-zinc-300 cursor-pointer">Privacy Policy</a>
                <a href="#" className="hover:text-zinc-300 cursor-pointer">Terms of Service</a>
                <a href="#" className="hover:text-zinc-300 cursor-pointer">Cookie Settings</a>
              </div>
            </div>
          </div>
        </footer>

        {/* About Section */}
        <section id="about" className={`min-h-screen bg-zinc-950 text-zinc-50 p-12 mt-20 ${page === "about" ? "block" : "hidden"}`}>
          <button onClick={() => setPage("home")} className="mb-8 text-blue-600 hover:underline">← Back to home</button>
          <h1 className="text-4xl font-bold mb-4">About Silencly</h1>
          <p className="max-w-2xl text-lg text-zinc-300">Silencly is building the foundation of the new digital epoch. We empower builders, enterprises, and communities with decentralized tools.</p>
        </section>


      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col antialiased font-sans">
      {/* Workspace Header Panel */}
      <header className="border-b border-zinc-900 bg-black px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="https://i.ibb.co/Q742H44R/gemini-watermark-removed.png" alt="Silencly Logo" className="w-6.5 h-6.5 object-contain" referrerPolicy="no-referrer" />
            <span className="text-base font-bold font-display tracking-tight text-white">Silencly Workspace</span>
          </div>

          {/* User profile with Sign Out */}
          <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl px-3.5 py-1.5 shadow-sm">
            <img src={user.image} className="w-5.5 h-5.5 rounded-full border border-zinc-800" referrerPolicy="no-referrer" />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-zinc-100 leading-none">{user.name}</span>
              <span className="text-[8px] text-zinc-500 font-mono tracking-wide leading-none uppercase mt-0.5">{user.provider || "email"}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="ml-1 text-zinc-500 hover:text-red-400 text-[9px] font-bold uppercase transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
        {/* Error Notification Alert */}
        {error && (
          <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-2xl flex items-start gap-3 text-red-300 text-sm fade-in">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-white">System Notice</p>
              <p className="text-xs text-zinc-400 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs hover:underline font-semibold text-zinc-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Editing Session Title Header */}
        <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
          <div className="flex items-center gap-2 flex-1">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 w-full max-w-md">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => {
                    setIsEditingTitle(false);
                    handleSaveChanges();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingTitle(false);
                      handleSaveChanges();
                    }
                  }}
                  autoFocus
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1 text-base font-display font-bold text-white w-full focus:outline-hidden focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600"
                />
                <button
                  onClick={() => {
                    setIsEditingTitle(false);
                    handleSaveChanges();
                  }}
                  className="p-1.5 hover:bg-zinc-900 rounded text-zinc-300"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group max-w-full">
                <h2 className="text-xl font-display text-white font-bold line-clamp-1">
                  {title}
                </h2>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 hover:bg-zinc-900 rounded text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  title="Rename session"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="view-dictionary-btn"
              onClick={() => setIsDictionaryOpen(true)}
              className="p-2 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open custom dictionary"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Dictionary</span>
              {dictionaryItems.length > 0 && (
                <span className="bg-zinc-800 text-zinc-300 border border-zinc-700/50 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {dictionaryItems.length}
                </span>
              )}
            </button>

            <button
              id="view-history-btn"
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open history panel"
            >
              <History className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">History</span>
              {sessions.length > 0 && (
                <span className="bg-zinc-800 text-zinc-300 border border-zinc-700/50 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {sessions.length}
                </span>
              )}
            </button>

            {(rawText || polishedText) && (
              <button
                id="clear-workspace-btn"
                onClick={handleClearWorkspace}
                className="p-2 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset workspace"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Audio Output / Single Polished Answer Layout */}
        <div className="w-full mt-2">
          {/* Polished Text Right Panel */}
          <div className="bg-black border border-zinc-900 rounded-3xl overflow-hidden flex flex-col min-h-[420px] shadow-lg">
            {/* Panel Header */}
            <div className="px-6 py-4 border-b border-zinc-900 flex flex-col gap-4 bg-black">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Unified Title, Recording Button, Timer, & Status */}
                <div className="flex items-center gap-3">
                  <button
                    id="mic-action-btn"
                    onClick={handleToggleRecord}
                    disabled={status === "transcribing" || status === "polishing"}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm shrink-0 cursor-pointer ${
                      isRecording
                        ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                        : status === "transcribing" || status === "polishing"
                        ? "bg-zinc-850 text-zinc-600 cursor-not-allowed"
                        : "bg-zinc-800 hover:bg-zinc-750 text-white hover:scale-105"
                    }`}
                    title={isRecording ? "Stop recording" : "Start recording"}
                  >
                    {status === "transcribing" ? (
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                    ) : status === "polishing" ? (
                      <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                    ) : isRecording ? (
                      <Square className="w-4 h-4 fill-white stroke-[2.5]" />
                    ) : (
                      <Mic className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </button>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>AI Polished Draft</span>
                      <span className={`font-mono text-xs font-bold tracking-wider ${isRecording ? "text-red-400 animate-pulse" : "text-zinc-500"}`}>
                        {formatTime(duration)}
                      </span>
                    </h3>
                    <p className={`text-[11px] font-medium ${isRecording ? "text-red-400 animate-pulse" : "text-zinc-500"}`}>
                      {getStatusText()}
                    </p>
                  </div>
                </div>

                {polishedText && (
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      onClick={() => handleCopyToClipboard(polishedText, "polished")}
                      className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors relative"
                      title="Copy refined text"
                    >
                      {copiedPolished ? (
                        <CheckCheck className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleExportTxt(polishedText, `${title}_Polished`)}
                      className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      title="Export refined as .txt"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Tone Option Pills Selection */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-2 px-2 no-scrollbar">
                {TONE_OPTIONS.map((opt) => {
                  const isActive = selectedTone === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleToneChange(opt.id)}
                      disabled={!rawText || status === "polishing"}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-zinc-100 text-zinc-950 font-bold shadow-xs"
                          : !rawText
                          ? "bg-zinc-900/20 text-zinc-700 border border-zinc-900/40 cursor-not-allowed"
                          : "bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                      }`}
                      title={opt.description}
                    >
                      <span className="mr-1">{opt.emoji}</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel Editor Textarea */}
            <div className="flex-1 p-6 flex flex-col relative bg-black">
              <textarea
                value={polishedText}
                onChange={(e) => {
                  setPolishedText(e.target.value);
                  handleSaveChanges();
                }}
                disabled={status === "polishing"}
                placeholder="The AI refined version will output here in your chosen format style (e.g. email, bullets, professional text) with stutters and filler words removed automatically..."
                className="flex-1 w-full h-full min-h-[220px] bg-transparent text-sm text-zinc-150 leading-relaxed resize-none focus:outline-hidden disabled:text-zinc-600 placeholder:text-zinc-700"
              />

              {/* Loader indicator overlay */}
              {status === "polishing" && (
                <div className="absolute inset-0 bg-black/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 transition-all duration-300">
                  <RefreshCw className="w-8 h-8 text-zinc-400 animate-spin mb-2" />
                  <p className="text-xs font-semibold text-white">Polishing using Llama 3.1 8B...</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Applying the '{TONE_OPTIONS.find(t => t.id === selectedTone)?.label}' style guidelines</p>
                </div>
              )}

              {polishedText && status !== "polishing" && (
                <div className="absolute bottom-4 right-4 text-[10px] text-zinc-600 font-mono italic select-none">
                  Editable field • Changes auto-saved
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* History panel drawer component */}
      <HistoryDrawer
        sessions={sessions}
        activeSessionId={activeSessionId}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onClearHistory={handleClearHistory}
      />

      {/* Dictionary panel drawer component */}
      <DictionaryDrawer
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        items={dictionaryItems}
        onAddItem={addDictionaryItem}
        onDeleteItem={deleteDictionaryItem}
      />

    </div>
  );
}

interface StepItemProps {
  number: number;
  text: string;
  active?: boolean;
}

function StepItem({ number, text, active = false }: StepItemProps) {
  return (
    <div className="flex items-center gap-3.5 text-left">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border ${
          active
            ? "bg-zinc-950 text-zinc-50 border-white shadow-md"
            : "bg-transparent text-white/30 border-white/20"
        }`}
      >
        {number}
      </div>
      <span
        className={`text-sm transition-colors duration-300 font-medium ${
          active ? "text-white" : "text-white/40"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

interface SocialButtonProps {
  icon: any;
  label: string;
  onClick: () => void;
}

function SocialButton({ icon: Icon, label, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-12 w-full bg-[#1A1A1A] hover:bg-zinc-900 border border-white/10 hover:border-white/20 text-white text-xs sm:text-sm font-medium rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.98]"
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

interface InputGroupProps {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  children?: ReactNode;
}

function InputGroup({
  label,
  placeholder,
  type,
  value,
  onChange,
  required = false,
  children,
}: InputGroupProps) {
  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-[10px] font-bold font-mono text-white/40 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full h-12 bg-[#1A1A1A] border border-white/10 hover:border-white/20 focus:border-white focus:outline-hidden rounded-xl px-4 text-xs sm:text-sm text-white placeholder-white/20 transition-all font-sans"
        />
        {children}
      </div>
    </div>
  );
}

