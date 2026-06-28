import { useState, useEffect, useRef, MouseEvent, FormEvent } from "react";
import { useAppAuth } from "./lib/clerk-service";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
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
  Database
} from "lucide-react";
import Waveform from "./components/Waveform";
import HistoryDrawer from "./components/HistoryDrawer";
import DictionaryDrawer, { DictionaryItem } from "./components/DictionaryDrawer";
import { DictationSession, ToneOption, TONE_OPTIONS } from "./types";

export default function App() {
  const {
    user,
    isCheckingAuth,
    isClerkActive,
    clerkPublishableKey,
    pendingVerification,
    error: authError,
    setError: setAuthError,
    saveClerkPublishableKey,
    signInWithEmail,
    signUpWithEmail,
    verifyEmailCode,
    signOut: handleSignOut,
    signInWithSocial,
  } = useAppAuth();

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [verificationCode, setVerificationCode] = useState("");
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

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
    if (!authEmail || !authPassword || !authName) {
      setAuthError("Please fill in all sign-up fields.");
      return;
    }
    try {
      await signUpWithEmail(authEmail, authPassword, authName);
    } catch (err) {}
  };

  const handleVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      setAuthError("Please enter the verification code.");
      return;
    }
    try {
      await verifyEmailCode(verificationCode);
      setVerificationCode("");
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
        const errorData = await transcribeRes.json().catch(() => ({}));
        console.warn("Gemini server-side transcription failed. Falling back to browser SpeechRecognition text.", errorData);
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
        const errorData = await polishRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to polish text using Gemini.");
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

  if (window.location.pathname === "/sso-callback") {
    if (isClerkActive) {
      return (
        <div className="min-h-screen bg-[#060608] flex flex-col items-center justify-center text-zinc-100 antialiased font-sans">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
          <p className="text-xs font-mono text-zinc-400 tracking-wider">COMPLETING SECURE SSO CALLBACK...</p>
          <AuthenticateWithRedirectCallback />
        </div>
      );
    } else {
      window.location.href = "/";
      return null;
    }
  }

  if (isCheckingAuth && !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 antialiased font-sans">
        <RefreshCw className="w-8 h-8 text-zinc-400 animate-spin mb-3" />
        <p className="text-xs font-mono text-zinc-500 tracking-wider">SECURE AUTHORIZATION IN PROGRESS...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#060608] text-zinc-100 flex flex-col justify-between antialiased font-sans relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header/Logo */}
        <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <img src="https://i.ibb.co/Q742H44R/gemini-watermark-removed.png" alt="Silencly Logo" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
            <span className="text-xl font-bold font-display tracking-tight text-white">Silencly</span>
          </div>
        </header>

        {/* Auth Body Panel */}
        <div className="max-w-7xl mx-auto w-full px-6 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 py-8 relative z-10">
          
          {/* Left panel info */}
          <div className="flex-1 flex flex-col text-left max-w-xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white leading-tight">
              Speak Silently.<br />
              <span className="text-zinc-400">Dictate faster.</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-6 leading-relaxed font-sans font-light">
              Silencly dictates 100X faster than most of AI dictation apps.
            </p>

            {/* List of features */}
            <ul className="mt-8 space-y-4 text-xs sm:text-sm text-zinc-350">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2 shrink-0" />
                <div>
                  <strong className="text-white font-medium font-display">Free to use</strong>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2 shrink-0" />
                <div>
                  <strong className="text-white font-medium font-display">Owned by a private company</strong>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2 shrink-0" />
                <div>
                  <strong className="text-white font-medium font-display">Connection to many apps</strong>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2 shrink-0" />
                <div>
                  <strong className="text-white font-medium font-display">Works everywhere</strong>
                </div>
              </li>
            </ul>

            {/* Quote Slider */}
            <div className="mt-12 p-6 bg-[#0f0f13] border border-zinc-850/65 rounded-2xl relative overflow-hidden flex flex-col">
              <p className="text-xs sm:text-sm text-zinc-350 italic leading-relaxed">
                "Silencly is an AI-powered dictation tool that helps you dictate your messy thoughts into clear formatted text. Your data stays private and safe, and it works over any app."
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Anubhav Sapkota & Johan Jovin Cheeran</div>
                  <div className="text-[10px] text-zinc-500">Creators of Silencly</div>
                </div>
                <span className="text-zinc-600 text-lg">★</span>
              </div>
            </div>
          </div>

          {/* Right panel login forms */}
          <div className="w-full max-w-md bg-[#0c0c0f] border border-zinc-850 p-8 rounded-3xl shadow-xl flex flex-col relative">
            
            {pendingVerification ? (
              <>
                <h2 className="text-2xl font-bold font-display text-white text-left">Verify email</h2>
                <p className="text-xs text-zinc-500 text-left mt-1.5">
                  We've sent a 6-digit confirmation code to <span className="text-zinc-300 font-medium">{authEmail}</span>.
                </p>

                {authError && (
                  <p className="text-xs font-semibold text-red-400 mt-4 bg-red-950/20 border border-red-900/40 p-3 rounded-xl flex items-center gap-2 text-left">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{authError}</span>
                  </p>
                )}

                <form onSubmit={handleVerificationSubmit} className="space-y-4 text-left mt-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold font-mono text-zinc-500 uppercase">Verification Code</label>
                    <input
                      type="text"
                      required
                      placeholder="••••••"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-xl px-3.5 py-2.5 text-center text-lg tracking-widest text-zinc-100 placeholder-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600"
                    />
                  </div>

                  {!isClerkActive && (
                    <div className="text-[10px] bg-zinc-900/40 border border-zinc-850 p-2.5 rounded-xl text-zinc-400 mt-2 leading-relaxed">
                      ℹ️ <strong className="text-white">Simulator Mode:</strong> Enter <strong className="text-amber-400">123456</strong> or any 6 digits to bypass the email code requirement.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl shadow-md mt-4 cursor-pointer active:scale-[0.98] transition-all"
                  >
                    Confirm Code
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setAuthError(null)}
                    className="text-xs font-semibold text-zinc-400 hover:text-zinc-350 underline underline-offset-4 cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold font-display text-white text-left">
                  {authMode === "signin" ? "Welcome back" : "Create account"}
                </h2>
                <p className="text-xs text-zinc-500 text-left mt-1.5">
                  {authMode === "signin"
                    ? "Sign in to access your research history and continue where you left off."
                    : "Create a secure workspace account to polish your speech guidelines."}
                </p>

                {/* Social Logins */}
                <div className="mt-8 space-y-3">
                  {/* Google */}
                  <button
                    onClick={() => openOAuthPopup("google")}
                    className="w-full bg-[#131316] hover:bg-[#1a1a1f] border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs sm:text-sm font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* GitHub */}
                  <button
                    onClick={() => openOAuthPopup("github")}
                    className="w-full bg-[#131316] hover:bg-[#1a1a1f] border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs sm:text-sm font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 text-white fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    <span>Continue with GitHub</span>
                  </button>

                  {/* X */}
                  <button
                    onClick={() => openOAuthPopup("twitter")}
                    className="w-full bg-[#131316] hover:bg-[#1a1a1f] border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs sm:text-sm font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 text-white fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>Continue with X</span>
                  </button>
                </div>

                {/* Separator */}
                <div className="my-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-zinc-850" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">or email auth</span>
                  <div className="flex-1 h-px bg-zinc-850" />
                </div>

                {/* Error notifications */}
                {authError && (
                  <p className="text-xs font-semibold text-red-400 mb-4 bg-red-950/20 border border-red-900/40 p-3 rounded-xl flex items-center gap-2 text-left">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{authError}</span>
                  </p>
                )}

                {/* Email Form */}
                <form onSubmit={authMode === "signin" ? handleEmailSignIn : handleEmailSignUp} className="space-y-4 text-left">
                  {authMode === "signup" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold font-mono text-zinc-500 uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Anubhav Sapkota"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-700 focus:outline-hidden focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold font-mono text-zinc-500 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-700 focus:outline-hidden focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold font-mono text-zinc-500 uppercase">Password</label>
                    </div>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-700 focus:outline-hidden focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl shadow-md shadow-zinc-950/20 mt-6 cursor-pointer active:scale-[0.98] transition-all"
                  >
                    {authMode === "signin" ? "Sign In" : "Create Account"}
                  </button>
                </form>

                {/* Form Toggle Links */}
                <div className="mt-6 text-center">
                  <span className="text-xs text-zinc-500">
                    {authMode === "signin" ? "No account? " : "Already have an account? "}
                  </span>
                  <button
                    onClick={() => {
                      setAuthMode(authMode === "signin" ? "signup" : "signin");
                      setAuthError(null);
                    }}
                    className="text-xs font-semibold text-zinc-400 hover:text-zinc-300 underline underline-offset-4 cursor-pointer"
                  >
                    {authMode === "signin" ? "Sign up" : "Sign in"}
                  </button>
                </div>

                <p className="text-[10px] text-zinc-600 text-center mt-6 leading-relaxed">
                  By continuing you agree to our Terms and Privacy Policy.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer info stats */}
        <footer className="max-w-7xl mx-auto w-full px-6 py-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-6">
            <span><strong>5M+</strong> searches</span>
            <span><strong>100K+</strong> users</span>
            <span><strong>11K+</strong> GitHub stars</span>
          </div>
          <div className="select-none text-[10px] tracking-widest text-zinc-600 uppercase">
            SOCIALLY SECURED BY BETTER AUTH
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased font-sans">
      {/* Workspace Header Panel */}
      <header className="border-b border-zinc-900 bg-zinc-900/10 px-6 py-4">
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
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col min-h-[420px] shadow-lg">
            {/* Panel Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex flex-col gap-4 bg-zinc-950/40">
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
            <div className="flex-1 p-6 flex flex-col relative bg-zinc-900/10">
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
                <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 transition-all duration-300">
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

      {/* Footer Branding */}
      <footer className="border-t border-zinc-900 py-6 bg-zinc-900/10 mt-12 text-center text-zinc-500">
        <p className="text-xs font-mono select-none">
          CRAFTED WITH ASSEMBLYAI UNIVERSAL 3.5 PRO & LLAMA 3.1 8B • LOCAL DURABILITY SYNC
        </p>
      </footer>
    </div>
  );
}

