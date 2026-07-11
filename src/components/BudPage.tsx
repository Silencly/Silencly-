import React, { useState, useEffect, useRef } from "react";
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from "@/components/ui/chat-input";
import { useAppAuth } from "../lib/supabase-service";
import { safeStorage } from "../lib/safe-storage";
import {
  Plus,
  MessageSquare,
  Search,
  PanelLeft,
  Sparkles,
  Zap,
  Sliders,
  Layers,
  MoreHorizontal,
  Send,
  Cpu,
  Laptop,
  ChevronRight,
  Terminal,
  FileText,
  Video,
  Calendar,
  Mail,
  Globe,
  ChevronDown,
  ArrowUpRight,
  X,
  Play,
  ArrowUp,
  MessageCircle,
  Clock,
  Info,
  CheckCircle2,
  CirclePlus,
  Shapes,
  Repeat2,
  Repeat,
  Brain,
  Atom,
  Check,
  Lock
} from "lucide-react";

interface BudPageProps {
  onBack: () => void;
  user: any;
  onAuthClick: () => void;
}

interface Message {
  id: string;
  role: "user" | "model" | "system";
  content: string;
  timestamp: Date;
}

export default function BudPage({ onBack, user, onAuthClick }: BudPageProps) {
  const auth = useAppAuth();
  const activeUser = auth?.user || user;

  // Local onboarding states
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(true);
  
  const [onboardingStep, setOnboardingStep] = useState<"auth" | "name" | "apps" | "plans">(() => {
    return (auth?.user || user) ? "name" : "auth";
  });

  const [onboardingName, setOnboardingName] = useState("");
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("free");
  const [connectingApp, setConnectingApp] = useState<string | null>(null);

  // Auth fields for portal within onboarding:
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [authLoading, setAuthLoading] = useState(false);
  const [localAuthError, setLocalAuthError] = useState("");

  // Sync profile name when activeUser changes
  useEffect(() => {
    if (activeUser) {
      setOnboardingName(prev => prev || activeUser.name || "");
      if (onboardingStep === "auth") {
        setOnboardingStep("name");
      }
    }
  }, [activeUser, onboardingStep]);

  // Sync completion flag if current logged in user changes
  useEffect(() => {
    setOnboardingCompleted(true);
  }, [activeUser]);

  const [activeTab, setActiveTab] = useState<"chat" | "skills" | "automations" | "personalization" | "models">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dubaiTime, setDubaiTime] = useState("");
  const [activeReplay, setActiveReplay] = useState<any | null>(null);
  const [replayStage, setReplayStage] = useState<number>(0);
  const [replayLogs, setReplayLogs] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dynamic live Dubai clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: "Asia/Dubai",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        };
        const formatter = new Intl.DateTimeFormat("en-US", options);
        setDubaiTime(formatter.format(new Date()));
      } catch (e) {
        // Fallback if Dubai timezone is not supported
        const now = new Date();
        const hrs = now.getHours() % 12 || 12;
        const mins = String(now.getMinutes()).padStart(2, "0");
        const ampm = now.getHours() >= 12 ? "PM" : "AM";
        setDubaiTime(`${hrs}:${mins} ${ampm}`);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to chat bottom (scrolling inside viewport container to avoid main layout shifting)
  useEffect(() => {
    if (chatEndRef.current) {
      const parent = chatEndRef.current.parentElement;
      if (parent) {
        parent.scrollTop = parent.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Handle Quick Action clicks
  const handleQuickAction = (text: string) => {
    setInputText(text);
    // Autofocus input
    const inputEl = document.getElementById("bud-chat-input");
    inputEl?.focus();
  };

  // Submit a message to Bud AI
  const handleSubmitMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!textToSend) {
      setInputText("");
    }

    // Add user message
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/bud/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          email: activeUser?.email
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Bud AI.");
      }

      const data = await response.json();
      
      // Add Bud reply
      const budMsg: Message = {
        id: crypto.randomUUID(),
        role: "model",
        content: data.reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, budMsg]);
    } catch (err: any) {
      console.error(err);
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: "system",
        content: `Error: ${err.message || "Something went wrong while waking up Bud. Please check your internet connection."}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Replay scenarios
  const replays = [
    {
      id: "heart-disease",
      icon: Terminal,
      title: "Analyze heart disease dataset and build predictive model",
      steps: [
        { log: "➜ Connecting to workspace server... OK", delay: 1000 },
        { log: "➜ Loading 'heart_disease.csv' [4,210 records]", delay: 1200 },
        { log: "➜ Initializing scikit-learn random forest classifier...", delay: 1100 },
        { log: "➜ Splitting dataset: 80% Train, 20% Test...", delay: 800 },
        { log: "➜ Training Random Forest model with 100 estimators...", delay: 1500 },
        { log: "➜ Evaluating predictions on holdout set...", delay: 1000 },
        { log: "✦ Model training finished! Accuracy: 94.2% | F1-Score: 0.938", delay: 1200 },
        { log: "➜ Exporting model weights to 'heart_model.pkl' & plotting ROC curve...", delay: 1300 },
        { log: "✔ Successfully completed autonomous machine learning cycle in 7.3s!", delay: 500 }
      ]
    },
    {
      id: "fraud-research",
      icon: FileText,
      title: "Research and make a deck on uncovered fraud in Minnesota",
      steps: [
        { log: "➜ Initializing headless crawler: search='Minnesota charity fraud indictment 2026'", delay: 1100 },
        { log: "➜ Found 14 federal filings & local news reports. Extracting timelines...", delay: 1300 },
        { log: "➜ Compiling key entities: 4 suspect organizations, $12.4M misappropriated...", delay: 1200 },
        { log: "➜ Formulating slide deck architecture (Executive Summary, Scheme, Audit Trail, Actions)...", delay: 1400 },
        { log: "➜ Formatting PPTX slides with modern dark-mode minimalist layout...", delay: 1500 },
        { log: "➜ Generating executive summary brief PDF...", delay: 1000 },
        { log: "✔ Done! Slides & research brief uploaded to your 'Workspace' folder.", delay: 800 }
      ]
    },
    {
      id: "ferrari-video",
      icon: Video,
      title: "Make a video of a Ferrari driving through the streets of Monaco",
      steps: [
        { log: "➜ Activating generative video diffusion model (v2.5 High-Fi)...", delay: 1200 },
        { log: "➜ Compiling prompt: 'Red Ferrari SF90 Stradale racing through Monaco harbor tunnels, cinematically lit, 8k'", delay: 1500 },
        { log: "➜ Synthesizing frame rate matching (24fps cinematic, 4s clip)...", delay: 1800 },
        { log: "➜ Adding realistic audio track: engine rev, exhaust Echo in Monaco tunnels...", delay: 1400 },
        { log: "➜ Rendering final output MP4...", delay: 1300 },
        { log: "✔ Video generated successfully! Saved to your multimedia folder.", delay: 800 }
      ]
    },
    {
      id: "stock-checker",
      icon: Calendar,
      title: "Every morning at 8 am PST get me the stock prices of the Mag 7",
      steps: [
        { log: "➜ Setting cron trigger: '0 8 * * 1-5' (Mon-Fri 8:00 AM PST)...", delay: 900 },
        { log: "➜ Linking Alpha Vantage stock ticker API & Google Finance live socket...", delay: 1100 },
        { log: "➜ Designing digest notification payload template (APPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA)...", delay: 1200 },
        { log: "➜ Testing immediate run... Fetching ticker valuations...", delay: 1300 },
        { log: "✦ Live Valuation: APPL $193.2, MSFT $415.6, NVDA $875.1, GOOGL $172.3...", delay: 1000 },
        { log: "✔ Automation sequence is now ACTIVE. You will receive an SMS and email digest daily.", delay: 900 }
      ]
    },
    {
      id: "gmail-integration",
      icon: Mail,
      title: "Go through my Gmail for issues and turn them into Linear tickets",
      steps: [
        { log: "➜ Authentication check: Gmail OAuth valid (impersio.me/auth)...", delay: 1000 },
        { log: "➜ Querying unread messages matching label: 'Bug' OR 'Issue'...", delay: 1200 },
        { log: "➜ Found 3 matching emails. Reading headers & bodies...", delay: 1100 },
        { log: "➜ Extracting Linear payload details: Title, Description, Priority...", delay: 1300 },
        { log: "➜ Calling Linear API to generate active issues under board 'ENG'...", delay: 1400 },
        { log: "✦ Created Linear Tickets: [ENG-402] Database crash, [ENG-403] UI flicker...", delay: 1200 },
        { log: "✔ Sync complete. Archiving processed emails to tag: 'Processed-Linear'.", delay: 1000 }
      ]
    },
    {
      id: "stockx-shopper",
      icon: Globe,
      title: "Go to stockx.com and find the cheapest pair of New Balance 550",
      steps: [
        { log: "➜ Initializing StockX agent broker web scraper session...", delay: 1100 },
        { log: "➜ Navigating to 'https://stockx.com/search?s=new+balance+550'...", delay: 1400 },
        { log: "➜ Bypassing Cloudflare check... Success (residential proxy active)...", delay: 1500 },
        { log: "➜ Extracting price matrices across all sizes...", delay: 1300 },
        { log: "✦ Cheapest found: 'New Balance 550 White Green' (Size 9) - $84.00", delay: 1200 },
        { log: "➜ Compiling purchase summary and direct check-out link...", delay: 1000 },
        { log: "✔ Done! Sent direct checkout URL to your messaging interface.", delay: 800 }
      ]
    }
  ];

  // Start executing a replay simulation
  const startReplay = (replay: any) => {
    setActiveReplay(replay);
    setReplayStage(0);
    setReplayLogs(["➜ Initializing autonomous replay broker..."]);
    
    // Play step by step
    let currentStep = 0;
    const runNextStep = () => {
      if (currentStep < replay.steps.length) {
        const step = replay.steps[currentStep];
        setTimeout(() => {
          setReplayLogs(prev => [...prev, step.log]);
          setReplayStage(currentStep + 1);
          currentStep++;
          runNextStep();
        }, step.delay);
      }
    };

    setTimeout(runNextStep, 800);
  };

  // Onboarding action handlers
  const handleLocalSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setLocalAuthError("Please enter email and password.");
      return;
    }
    setAuthLoading(true);
    setLocalAuthError("");
    try {
      const generatedName = authEmail.split("@")[0];
      await auth.signUpWithEmail(authEmail, authPassword, generatedName);
      setOnboardingStep("name");
    } catch (err: any) {
      setLocalAuthError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLocalSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setLocalAuthError("Please enter email and password.");
      return;
    }
    setAuthLoading(true);
    setLocalAuthError("");
    try {
      await auth.signInWithEmail(authEmail, authPassword);
      setOnboardingStep("name");
    } catch (err: any) {
      setLocalAuthError(err.message || "Invalid credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setAuthLoading(true);
    setLocalAuthError("");
    try {
      await auth.signInWithSocial(provider);
      setOnboardingStep("name");
    } catch (err: any) {
      setLocalAuthError(err.message || `Failed to sign in with ${provider}.`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingName.trim()) return;
    setAuthLoading(true);
    try {
      await auth.updateProfileName(onboardingName.trim());
      setOnboardingStep("apps");
    } catch (err: any) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Listen for Composio popup callback success messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "COMPOSIO_AUTH_SUCCESS") {
        const appName = event.data.appName;
        setConnectedApps(prev => prev.includes(appName) ? prev : [...prev, appName]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Fetch active connected apps on mount or activeUser change
  useEffect(() => {
    if (!activeUser) return;
    const fetchConnectedApps = async () => {
      try {
        const entityId = activeUser.id || activeUser.email || "anonymous_dev";
        const res = await fetch(`/api/composio/connected?entityId=${encodeURIComponent(entityId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.connectedApps) {
            setConnectedApps(data.connectedApps);
          }
        }
      } catch (err) {
        console.error("Failed to load connected apps from backend:", err);
      }
    };
    fetchConnectedApps();
  }, [activeUser]);

  const handleConnectApp = async (appId: string) => {
    if (connectedApps.includes(appId)) return;
    setConnectingApp(appId);
    try {
      const res = await fetch("/api/composio/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: appId,
          entityId: activeUser?.id || activeUser?.email || "anonymous_dev"
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.redirectUrl) {
          // Open popup for connection auth
          const width = 500;
          const height = 650;
          const left = window.screen.width / 2 - width / 2;
          const top = window.screen.height / 2 - height / 2;
          const popup = window.open(
            data.redirectUrl,
            `ComposioAuth-${appId}`,
            `width=${width},height=${height},left=${left},top=${top},status=no,location=no,toolbar=no,menubar=no`
          );
          
          // Poll to see if popup is closed or blocked
          const timer = setInterval(() => {
            if (!popup || popup.closed) {
              clearInterval(timer);
              setConnectingApp(null);
              // Optimistic verification fallback
              if (!connectedApps.includes(appId) && !data.isReal) {
                setConnectedApps(prev => [...prev, appId]);
              }
            }
          }, 1000);
        } else {
          setConnectedApps(prev => [...prev, appId]);
          setConnectingApp(null);
        }
      } else {
        throw new Error("Failed to connect via backend");
      }
    } catch (err) {
      console.error("Composio connect error:", err);
      // Fallback for seamless offline use
      setConnectedApps(prev => [...prev, appId]);
      setConnectingApp(null);
    }
  };

  const handleFinishOnboarding = () => {
    const email = activeUser?.email || "anonymous";
    safeStorage.setItem(`bud_onboarding_done_${email}`, "true");
    setOnboardingCompleted(true);
  };

  const renderOnboardingSteps = () => {
    const steps = [
      { key: "auth", label: "Account" },
      { key: "name", label: "Name" },
      { key: "apps", label: "Connect Apps" },
      { key: "plans", label: "Plans" }
    ];
    
    const getStepIndex = (s: string) => {
      if (s === "auth") return 0;
      if (s === "name") return 1;
      if (s === "apps") return 2;
      return 3;
    };
    
    const currentIdx = getStepIndex(onboardingStep);
    
    return (
      <div className="flex items-center justify-between w-full max-w-xl mx-auto mb-10 px-4 select-none">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIdx || (activeUser && idx === 0);
          const isActive = idx === currentIdx;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1.5 relative z-10">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border ${
                    isCompleted 
                      ? "bg-zinc-950 text-white border-zinc-950" 
                      : isActive 
                      ? "bg-white text-zinc-950 border-zinc-950 ring-4 ring-zinc-100" 
                      : "bg-zinc-50 text-zinc-400 border-zinc-200"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-[10px] font-bold tracking-tight uppercase ${isActive ? "text-zinc-950" : "text-zinc-400"}`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-zinc-100 mx-2 -translate-y-3.5 relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-zinc-900 transition-all duration-500" 
                    style={{ width: idx < currentIdx ? "100%" : (idx === currentIdx && onboardingStep !== "auth" ? "50%" : "0%") }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const appsList = [
    { id: "gmail", name: "Gmail", desc: "Let Bud read, draft, and organize inbox emails autonomously.", icon: Mail, color: "text-red-500 bg-red-50 border-red-100" },
    { id: "slack", name: "Slack", desc: "Post logs, alerts, and collaborate with teams directly on channels.", icon: MessageSquare, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
    { id: "github", name: "GitHub", desc: "Manage pull requests, issues, and sync code templates easily.", icon: Laptop, color: "text-zinc-800 bg-zinc-100 border-zinc-200" },
    { id: "telegram", name: "Telegram", desc: "Direct messaging access for secure alerts on your phone.", icon: Send, color: "text-blue-500 bg-blue-50 border-blue-100" },
    { id: "linear", name: "Linear", desc: "Create tasks, file issues, and track development ticket logs.", icon: Sliders, color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
  ];

  const plansList = [
    { id: "free", name: "Developer Free", price: "$0", desc: "Perfect for testing and building basic workflows.", features: ["100 model runs / month", "Standard Qwen processing", "Connect up to 2 apps", "1 active developer workflow"] },
    { id: "pro", name: "Developer Pro", price: "$19", desc: "Tailored for heavy workspace automations.", features: ["10,000 model runs / month", "High-speed Qwen 3.6 model", "Connect all Composio apps", "Priority task execution queue", "Unlimited active pipelines"], popular: true },
    { id: "enterprise", name: "Enterprise Custom", price: "$99", desc: "Infinite scale with container separation.", features: ["Infinite runs & actions", "Dedicated sandbox server instance", "Custom API integration logs", "24/7 priority support SLAs", "Composio enterprise workspace"] }
  ];

  // If onboarding is not completed, display the gorgeous interactive setup wizard
  // Bypassed completely so user directly enters Bud workspace


  return (
    <div className="flex h-screen w-full bg-white text-zinc-900 font-sans select-none overflow-hidden relative">
      
      {/* 1. Left Sidebar */}
      <aside className="w-[280px] bg-zinc-50 border border-zinc-200/80 rounded-2xl flex flex-col justify-between shrink-0 h-[calc(100vh-24px)] my-3 ml-3 p-4.5 shadow-sm">
        
        {/* Sidebar Header & Brand */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            {/* Gemini generated logo */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer animate-fade-in"
              onClick={onBack}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Silencly-logo-transparent.png" 
                alt="Bud Logo" 
                className="w-8 h-8 rounded-lg object-cover shadow-sm border border-zinc-200/50 select-none pointer-events-none" 
                referrerPolicy="no-referrer"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                style={{ WebkitTouchCallout: "none", WebkitUserDrag: "none" }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-zinc-950 font-display">Bud</span>
                <span className="text-[10px] text-zinc-500 font-mono">By Impersio</span>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1">
              <button 
                title="Search knowledge" 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-200/60 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
              <button 
                onClick={onBack}
                title="Back to Silencly" 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-200/60 transition-all cursor-pointer"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nav Item Lists */}
          <div className="space-y-1">
            {/* New Chat Button (Grouped with Navigation) */}
            <button
              onClick={() => {
                setActiveTab("chat");
                setMessages([]);
              }}
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all hover:bg-zinc-200/60 text-zinc-900 hover:text-black cursor-pointer text-left"
            >
              <CirclePlus className="w-4 h-4 text-black" />
              <span>New chat</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "chat" 
                  ? "bg-zinc-200/60 text-black border border-zinc-300/40" 
                  : "text-zinc-900 hover:text-black hover:bg-zinc-200/60"
              }`}
            >
              <MessageCircle className="w-4 h-4 text-black" />
              <span>Chats</span>
            </button>

            <div className="pt-2 pb-1">
              <div className="h-px bg-zinc-200 w-full" />
            </div>

            <button
              onClick={() => setActiveTab("skills")}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "skills" 
                  ? "bg-zinc-200/60 text-black border border-zinc-300/40" 
                  : "text-zinc-900 hover:text-black hover:bg-zinc-200/60"
              }`}
            >
              <Shapes className="w-4 h-4 text-black" />
              <span>Skills</span>
            </button>

            <button
              onClick={() => setActiveTab("automations")}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "automations" 
                  ? "bg-zinc-200/60 text-black border border-zinc-300/40" 
                  : "text-zinc-900 hover:text-black hover:bg-zinc-200/60"
              }`}
            >
              <Repeat2 className="w-4 h-4 text-black" />
              <span>Automations</span>
            </button>

            <button
              onClick={() => setActiveTab("personalization")}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "personalization" 
                  ? "bg-zinc-200/60 text-black border border-zinc-300/40" 
                  : "text-zinc-900 hover:text-black hover:bg-zinc-200/60"
              }`}
            >
              <Brain className="w-4 h-4 text-black" />
              <span>Personalization</span>
            </button>

            <button
              onClick={() => setActiveTab("models")}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "models" 
                  ? "bg-zinc-200/60 text-black border border-zinc-300/40" 
                  : "text-zinc-900 hover:text-black hover:bg-zinc-200/60"
              }`}
            >
              <Atom className="w-4 h-4 text-black" />
              <span>Models</span>
            </button>
          </div>
        </div>

        {/* Bottom Pinned SidebarCard & More Menu */}
        <div className="space-y-4">
          
          {/* Tip Card / Bud 101 */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 relative overflow-hidden group shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-7.5 h-7.5 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Silencly-logo-transparent.png" 
                  alt="Bud 101 logo" 
                  className="w-full h-full object-cover select-none pointer-events-none" 
                  referrerPolicy="no-referrer"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ WebkitTouchCallout: "none", WebkitUserDrag: "none" }}
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-zinc-900">Bud 101</span>
                <span className="text-[10px] text-zinc-500 leading-relaxed">Learn what Bud can do in your custom automations workspace.</span>
              </div>
            </div>
            <button 
              onClick={() => handleQuickAction("Teach me Bud 101 and how to get started")}
              className="mt-3 w-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-[10px] font-semibold text-zinc-700 hover:text-black py-1.5 px-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-between"
            >
              <span>Explore guide</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          {/* More menu item */}
          <div className="flex items-center justify-between text-zinc-500 hover:text-black transition-all cursor-pointer px-1">
            <div className="flex items-center gap-3 text-xs font-semibold">
              <MoreHorizontal className="w-4.5 h-4.5" />
              <span>More Options</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-15 flex items-center justify-between px-8 shrink-0 z-10 bg-white/80 backdrop-blur-md">
          {/* Left spacer for balancing center links */}
          <div className="flex-1" />

          {/* Center Links */}
          <div className="flex items-center gap-8 text-xs font-semibold text-zinc-500">
            <button onClick={() => handleQuickAction("Explain Bud 101")} className="hover:text-black transition-colors cursor-pointer font-sans">Bud 101</button>
            <button onClick={onBack} className="hover:text-black transition-colors cursor-pointer font-sans">Pricing</button>
          </div>

          {/* Right Action */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-1.5">
                  <img src={user.image} className="w-5 h-5 rounded-full border border-zinc-200 select-none pointer-events-none" draggable={false} onContextMenu={(e) => e.preventDefault()} style={{ WebkitTouchCallout: "none", WebkitUserDrag: "none" }} referrerPolicy="no-referrer" />
                  <span className="text-xs font-semibold text-zinc-800">{user.name}</span>
                </div>
              ) : (
                <>
                  <button onClick={onAuthClick} className="text-xs font-semibold text-zinc-500 hover:text-black transition-colors cursor-pointer">Sign in</button>
                  <button onClick={onAuthClick} className="bg-black hover:bg-zinc-900 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer shadow-sm">Sign up</button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col justify-between max-w-4xl mx-auto w-full relative z-0">
          
          {/* Conditional view: if activeTab !== "chat", show informational panels */}
          {activeTab !== "chat" ? (
            <div className="flex-1 flex flex-col justify-center py-12">
              <button 
                onClick={() => setActiveTab("chat")}
                className="text-xs text-black font-mono mb-6 hover:underline cursor-pointer flex items-center gap-1"
              >
                ← Back to Bud Assistant Chat
              </button>
              
              <div className="bg-white border border-zinc-200 p-8 rounded-3xl space-y-6 max-w-2xl mx-auto w-full shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                    {activeTab === "skills" && <Shapes className="w-6 h-6 text-black" />}
                    {activeTab === "automations" && <Repeat2 className="w-6 h-6 text-black" />}
                    {activeTab === "personalization" && <Brain className="w-6 h-6 text-black" />}
                    {activeTab === "models" && <Atom className="w-6 h-6 text-black" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 capitalize">{activeTab} Hub</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Configure and review Bud's custom integration modules</p>
                  </div>
                </div>

                <div className="h-px bg-zinc-200" />

                <div className="space-y-4">
                  {activeTab === "skills" && (
                    <>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        Skills are active functional blocks that allow Bud to interact with external environments. These include reading web pages, formatting spreadsheets, generating visual models, and scraping directories.
                      </p>

                      <div className="space-y-3 pt-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Connected & Available Apps</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                          {appsList.map((app) => {
                            const isConnected = connectedApps.includes(app.id);
                            const isConnecting = connectingApp === app.id;
                            const Icon = app.icon;
                            return (
                              <div 
                                key={app.id}
                                className={`border p-4 rounded-2xl flex items-start gap-3.5 transition-all ${isConnected ? "bg-zinc-50/50 border-zinc-300" : "bg-white border-zinc-200"}`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${app.color}`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                
                                <div className="flex-1 min-w-0 text-left">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-950">{app.name}</span>
                                    {isConnected && (
                                      <span className="text-[9px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md px-1.5 py-0.5 font-bold flex items-center gap-0.5">
                                        <Check className="w-2.5 h-2.5" />
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-zinc-500 leading-relaxed mt-1 truncate">{app.desc}</p>
                                  
                                  <button
                                    onClick={() => handleConnectApp(app.id)}
                                    disabled={isConnected || isConnecting}
                                    className={`mt-2 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                                      isConnected 
                                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                                        : isConnecting 
                                        ? "bg-zinc-50 text-zinc-500 cursor-wait animate-pulse" 
                                        : "bg-zinc-950 hover:bg-zinc-800 text-white cursor-pointer"
                                    }`}
                                  >
                                    {isConnecting ? "Securing link..." : isConnected ? "Connected" : "Connect App"}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="h-px bg-zinc-200 my-4" />

                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Core Capabilities</h3>
                      <div className="grid grid-cols-2 gap-3.5 pt-2">
                        <div onClick={() => handleQuickAction("Explain how to use your Web Search skill")} className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl hover:border-zinc-400 transition-all cursor-pointer">
                          <span className="text-xs font-bold text-zinc-900 block">Web Search & Browse</span>
                          <span className="text-[10px] text-zinc-500 block mt-1">Allows Bud to scrape site schemas and parse live price matrices.</span>
                        </div>
                        <div onClick={() => handleQuickAction("Explain how to use your Database Query skill")} className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl hover:border-zinc-400 transition-all cursor-pointer">
                          <span className="text-xs font-bold text-zinc-900 block">Data Structuring</span>
                          <span className="text-[10px] text-zinc-500 block mt-1">Converts unstructured text files to SQLite or CSV indices.</span>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "automations" && (
                    <>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        Automations configure recurring system executions or event-driven pipelines. For example, syncing dictation backups every evening, or converting bug transcripts into active linear issues.
                      </p>
                      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-black" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-800">Daily Stock Price Checker</span>
                            <span className="text-[10px] text-zinc-500 mt-0.5">Cron trigger: 8:00 AM PST (Mon-Fri)</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-950 bg-zinc-100 border border-zinc-300 px-2.5 py-0.5 rounded-full">ACTIVE</span>
                      </div>
                    </>
                  )}

                  {activeTab === "personalization" && (
                    <>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        Tailor Bud's persona, dictionary, and tone parameters. You can upload custom vocabulary to increase spelling accuracy on specialized industrial jargon or name entities.
                      </p>
                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                          <span className="text-xs font-medium text-zinc-600">AI Personality style</span>
                          <span className="text-xs font-bold text-zinc-900">Direct & Professional</span>
                        </div>
                        <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                          <span className="text-xs font-medium text-zinc-600">Default Vocabulary Boosting</span>
                          <span className="text-xs font-bold text-black">ENABLED</span>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "models" && (
                    <>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        Bud runs on a combined multi-model pipeline. Primary text operations utilize high-context models, while speech-to-text operations employ our universal model matrices for high accuracy.
                      </p>
                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                          <div>
                            <span className="text-xs font-bold text-zinc-900 block">Gemini 3.5 Flash</span>
                            <span className="text-[10px] text-zinc-500 block mt-0.5">Primary language processing & smart formatting</span>
                          </div>
                          <span className="text-[10px] text-black bg-zinc-100 border border-zinc-300 px-2 py-0.5 rounded-full font-semibold">DEFAULT</span>
                        </div>
                        <div className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                          <div>
                            <span className="text-xs font-bold text-zinc-900 block">Groq Llama 3.1 8B</span>
                            <span className="text-[10px] text-zinc-500 block mt-0.5">Secondary lightning-fast text fallback model</span>
                          </div>
                          <span className="text-[10px] text-zinc-600 bg-white border border-zinc-200 px-2 py-0.5 rounded-full font-semibold font-sans">FALLBACK</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setActiveTab("chat")}
                    className="w-full bg-black hover:bg-zinc-900 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Go Back to Chat
                  </button>
                </div>
              </div>
            </div>
          ) : messages.length > 0 ? (
            
            /* Active Chat Stream Interface */
            <div className="flex-1 flex flex-col justify-between h-[calc(100vh-170px)] pb-4">
              {/* Chat messages scroll viewport */}
              <div className="flex-1 overflow-y-auto space-y-5.5 pr-2">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  
                  // Parse thinking block
                  const thinkRegex = /<think>([\s\S]*?)<\/think>/i;
                  const match = msg.content.match(thinkRegex);
                  const thinking = match ? match[1].trim() : null;
                  const mainContent = match ? msg.content.replace(thinkRegex, "").trim() : msg.content;

                  return (
                    <div
                      key={msg.id}
                      className="w-full flex justify-start"
                    >
                      <div className={`flex flex-col ${isUser ? "w-full" : "max-w-[85%]"} gap-1`}>
                        {/* Thinking block in Jakarta Sans as a dropdown */}
                        {!isUser && thinking && (
                          <details className="group max-w-full mb-2 bg-zinc-50 border border-zinc-200/50 rounded-2xl p-3.5 transition-all animate-fade-in select-none">
                            <summary className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-semibold font-jakarta cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                              <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-open:rotate-90 transition-transform shrink-0" />
                              <Brain className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <span>Thought for {((thinking.length / 150) || 0.8).toFixed(1)}s</span>
                            </summary>
                            <div className="whitespace-pre-line text-[11px] text-zinc-500/90 leading-relaxed font-jakarta mt-2.5 pt-2.5 border-t border-zinc-100 pl-5">
                              {thinking}
                            </div>
                          </details>
                        )}

                        {/* Message body */}
                        {(isUser || mainContent) && (
                          <div
                            className={`rounded-2xl p-4 text-xs leading-relaxed ${
                              isUser
                                ? "bg-zinc-100 text-zinc-900 border border-zinc-200/80 w-full text-left rounded-3xl px-6 py-3.5"
                                : msg.role === "system"
                                ? "bg-red-50 text-red-900 border border-red-200"
                                : "bg-zinc-50 text-zinc-900 border-none rounded-3xl px-6 py-4"
                            }`}
                          >
                            <div className="whitespace-pre-line space-y-2">
                              {mainContent.split("\n").map((line, idx) => {
                                if (line.startsWith("- ") || line.startsWith("* ")) {
                                  return (
                                    <li key={idx} className={`list-disc ml-4 pl-1 ${isUser ? "text-zinc-800" : "text-zinc-700"}`}>
                                      {line.substring(2)}
                                    </li>
                                  );
                                }
                                if (line.startsWith("### ")) {
                                  return (
                                    <h4 key={idx} className={`text-sm font-bold pt-2 ${isUser ? "text-zinc-900" : "text-zinc-900"}`}>
                                      {line.substring(4)}
                                    </h4>
                                  );
                                }
                                if (line.startsWith("## ")) {
                                  return (
                                    <h3 key={idx} className={`text-base font-bold pt-2 ${isUser ? "text-zinc-900" : "text-zinc-900"}`}>
                                      {line.substring(3)}
                                    </h3>
                                  );
                                }
                                return (
                                  <p key={idx} className={isUser ? "text-zinc-800" : "text-zinc-800"}>
                                    {line}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        <span className={`text-[9px] text-zinc-400 font-mono pl-1 ${isUser ? "self-start pl-6" : "self-start"}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-50 border-none rounded-2xl px-4 py-3 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

          ) : (
            
            /* Landing / Dashboard Interface (Shifted up with mt-[-100px]) */
            <div className="flex-1 flex flex-col justify-center py-4 space-y-10 mt-[-100px]">
              
              {/* Hero Section */}
              <div className="text-center flex flex-col items-center space-y-4">
                {/* Custom Logo Mascot (Transparent background, no shadow, no border) */}
                <div className="relative flex items-center justify-center group animate-fade-in">
                  <div className="absolute inset-0 rounded-full bg-yellow-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                  
                  <div className="w-16 h-16 relative z-10 overflow-hidden">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Silencly-logo-transparent.png" 
                      alt="Bud Mascot Logo" 
                      className="w-full h-full object-cover rounded-2xl select-none pointer-events-none" 
                      referrerPolicy="no-referrer"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      style={{ WebkitTouchCallout: "none", WebkitUserDrag: "none" }}
                    />
                  </div>
                </div>

                {/* Location / Dynamic Dubai time (No border/background as requested) */}
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
                  <span>{dubaiTime || "9:17 AM"} · Dubai</span>
                </div>

                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight font-display">
                  Your AI Worker
                </h1>
                
                <p className="text-zinc-500 text-xs max-w-sm leading-relaxed">
                  Bud has a computer, browser, and number to code, run autonomously, and get work done.
                </p>
              </div>

              {/* Quick Action Pill Button Rows */}
              <div className="flex flex-col items-center gap-2.5">
                {/* Row 1 */}
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handleQuickAction("Text +1 (628) 287-2920 directly")}
                    className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                    <span>Text +1 (628) 287-2920</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction("Teach me how to connect with Bud on Telegram")}
                    className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-500" />
                    <span>Message on Telegram</span>
                  </button>
                </div>

                {/* Row 2 */}
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => { setActiveTab("skills"); }}
                    className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <Shapes className="w-3.5 h-3.5 text-black" />
                    <span>Skills</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("automations"); }}
                    className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <Repeat className="w-3.5 h-3.5 text-black" />
                    <span>Automations</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction("Initialize a remote virtual computer instance")}
                    className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <Laptop className="w-3.5 h-3.5 text-black" />
                    <span>Computer</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* 3. Bottom Chat Input Bar (Standard for both chat & dashboard view) */}
          {activeTab === "chat" && (
            <div className="mt-8 shrink-0 relative">
              <ChatInput
                variant="default"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onSubmit={() => handleSubmitMessage()}
                loading={isTyping}
                onStop={() => setIsTyping(false)}
                className="bg-white border border-zinc-300 shadow-lg rounded-2xl p-2.5 flex flex-col gap-2 relative focus-within:ring-1 focus-within:ring-zinc-400 focus-within:border-zinc-400"
              >
                <ChatInputTextArea
                  id="bud-chat-input"
                  placeholder="Ask anything..."
                  className="w-full bg-transparent text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none resize-none px-3.5 pt-2 max-h-[120px] font-sans min-h-0"
                />

                <div className="w-full flex items-center justify-between border-t border-zinc-100 pt-2 px-1 mt-1">
                  {/* Attach / Plus icon */}
                  <button 
                    onClick={() => handleQuickAction("Demonstrate uploading a codebase or document")}
                    className="w-8 h-8 rounded-xl bg-transparent hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-black transition-colors cursor-pointer border-none"
                    title="Attach files or documentation"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Send Button */}
                  <ChatInputSubmit
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white hover:bg-zinc-900 transition-colors border-none cursor-pointer disabled:bg-zinc-100 disabled:text-zinc-400"
                  />
                </div>
              </ChatInput>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
