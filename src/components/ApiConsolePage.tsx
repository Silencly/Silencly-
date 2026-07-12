import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Terminal, 
  Cpu, 
  Layers, 
  Sliders, 
  Code, 
  Copy, 
  Check, 
  Search, 
  Mic, 
  Volume2, 
  SlidersHorizontal, 
  FileAudio, 
  ArrowLeft, 
  Sparkles, 
  Database, 
  Braces, 
  Loader2, 
  ExternalLink,
  Lock,
  ArrowRight,
  RefreshCw,
  Clock,
  Coins
} from "lucide-react";

export interface ModelInfo {
  id: string;
  name: string;
  provider: 'AssemblyAI' | 'Mistral' | 'Groq' | 'OpenAI' | 'Alibaba' | 'Meta' | 'Canopy Labs';
  category: 'Speech to Text' | 'Text Generation' | 'Text to Speech';
  description: string;
  maxTokens: number;
  latency: string;
  costPer1k: string;
}

export const MODELS_LIST: ModelInfo[] = [
  // Speech to Text
  {
    id: "silencly-mythos-3",
    name: "Silencly Mythos 3 (Universal 3 Pro)",
    provider: "AssemblyAI",
    category: "Speech to Text",
    description: "AssemblyAI's flagship gold-standard speech recognition model. Offers industry-leading accuracy with near-zero word error rates and native voice-formatting capabilities.",
    maxTokens: 2048,
    latency: "800ms",
    costPer1k: "$0.0012"
  },
  {
    id: "silencly-2-flash",
    name: "Silencly 2.0 Flash",
    provider: "AssemblyAI",
    category: "Speech to Text",
    description: "AssemblyAI's ultra-low latency model engineered for real-time dictation, fast formatting, and instant transcript streams.",
    maxTokens: 1024,
    latency: "200ms",
    costPer1k: "$0.0006"
  },
  {
    id: "whisper-v3-turbo",
    name: "Whisper v3 Turbo",
    provider: "Groq",
    category: "Speech to Text",
    description: "OpenAI's latest state-of-the-art open-weights speech model, accelerated on Groq LPU hardware for blazing-fast transcription speeds.",
    maxTokens: 1024,
    latency: "150ms",
    costPer1k: "$0.0001"
  },
  {
    id: "whisper-c3-base",
    name: "Whisper C3 Base",
    provider: "Groq",
    category: "Speech to Text",
    description: "A compact, highly resource-efficient version of Whisper, tailored for ultra-fast, cost-effective standard dictations.",
    maxTokens: 512,
    latency: "100ms",
    costPer1k: "$0.00005"
  },

  // Text Generation
  {
    id: "mistral-large-3",
    name: "Mistral Large 3",
    provider: "Mistral",
    category: "Text Generation",
    description: "Flagship frontier language model from Mistral AI, delivering world-class reasoning, structured outputs, and complex multilingual processing.",
    maxTokens: 8192,
    latency: "400ms",
    costPer1k: "$0.0025"
  },
  {
    id: "mistral-medium",
    name: "Mistral Medium 3.5",
    provider: "Mistral",
    category: "Text Generation",
    description: "Perfect blend of speed and reasoning, optimized for code completion, structured analysis, and agentic workflows.",
    maxTokens: 4096,
    latency: "300ms",
    costPer1k: "$0.0015"
  },
  {
    id: "codestral-2501",
    name: "Codestral 2501",
    provider: "Mistral",
    category: "Text Generation",
    description: "State-of-the-art specialized model built for software developers, supporting code generation, debugging, and multi-language synthesis.",
    maxTokens: 4096,
    latency: "250ms",
    costPer1k: "$0.0010"
  },
  {
    id: "mistral-small-3",
    name: "Mistral Small 3",
    provider: "Mistral",
    category: "Text Generation",
    description: "An efficient, high-performance compact model engineered for high-volume text editing, low-latency API tasks, and rapid summaries.",
    maxTokens: 2048,
    latency: "180ms",
    costPer1k: "$0.0005"
  },
  {
    id: "gpt-oss-20b",
    name: "GPT OSS 20B",
    provider: "OpenAI",
    category: "Text Generation",
    description: "A specialized open-weight general-purpose instruct model fine-tuned for high-adherence structured responses.",
    maxTokens: 2048,
    latency: "220ms",
    costPer1k: "$0.0002"
  },
  {
    id: "gpt-oss-120b",
    name: "GPT OSS 120B",
    provider: "OpenAI",
    category: "Text Generation",
    description: "A highly deep-reasoning, heavy cognitive transformer designed to tackle complex multi-step logical problems.",
    maxTokens: 4096,
    latency: "550ms",
    costPer1k: "$0.0018"
  },
  {
    id: "qwen-3-32b",
    name: "Qwen 3 (32B)",
    provider: "Alibaba",
    category: "Text Generation",
    description: "Alibaba's advanced multilingual model with world-class mathematical and software engineering capabilities.",
    maxTokens: 4096,
    latency: "280ms",
    costPer1k: "$0.0004"
  },
  {
    id: "qwen-3-6-27b",
    name: "Qwen 3.6 (27B)",
    provider: "Alibaba",
    category: "Text Generation",
    description: "The next-generation medium-scale transformer balancing elite accuracy, native multilingual understanding, and speed.",
    maxTokens: 4096,
    latency: "240ms",
    costPer1k: "$0.0003"
  },
  {
    id: "llama-4-scout",
    name: "Llama 4 Scout",
    provider: "Meta",
    category: "Text Generation",
    description: "Meta's lightweight agentic model optimized for fast processing, data extraction, lookups, and lightning-fast action calls.",
    maxTokens: 2048,
    latency: "120ms",
    costPer1k: "$0.0001"
  },
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick",
    provider: "Meta",
    category: "Text Generation",
    description: "Meta's flagship high-intelligence frontier model designed for deep logical reasoning and complex structural tasks.",
    maxTokens: 8192,
    latency: "450ms",
    costPer1k: "$0.0015"
  },
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 (70B)",
    provider: "Meta",
    category: "Text Generation",
    description: "Versatile, highly capable open model offering exceptional balance of conversation flow, safety, and deep context processing.",
    maxTokens: 4096,
    latency: "350ms",
    costPer1k: "$0.0008"
  },
  {
    id: "safety-gpt-oss-20b",
    name: "Safety GPT OSS 20B",
    provider: "OpenAI",
    category: "Text Generation",
    description: "Enterprise aligned instruction model loaded with state-of-the-art guardrails, red-teaming checks, and bias reduction.",
    maxTokens: 2048,
    latency: "230ms",
    costPer1k: "$0.0002"
  },
  {
    id: "llama-3-1-instant",
    name: "Llama 3.1 Instant",
    provider: "Meta",
    category: "Text Generation",
    description: "Ultra-high speed 8B parameters text model optimized on Groq LPU architecture for responsive, instantaneous text streams.",
    maxTokens: 1024,
    latency: "90ms",
    costPer1k: "$0.00008"
  },

  // Text to Speech
  {
    id: "canopy-arabic-saudi",
    name: "Canopy Orpheus (Arabic Saudi)",
    provider: "Canopy Labs",
    category: "Text to Speech",
    description: "High-fidelity Saudi dialect Arabic voice synthesis engine. Captures nuanced inflections, native regional pauses, and cultural cadence.",
    maxTokens: 512,
    latency: "600ms",
    costPer1k: "$0.0040"
  },
  {
    id: "canopy-v1-english",
    name: "Canopy V1 English (Natural Narration)",
    provider: "Canopy Labs",
    category: "Text to Speech",
    description: "Elite English vocal generation designed for clear, expressive audios, presentations, documentation recordings, and narrations.",
    maxTokens: 512,
    latency: "500ms",
    costPer1k: "$0.0030"
  }
];

interface ApiConsolePageProps {
  onBack: () => void;
  user: any;
}

export default function ApiConsolePage({ onBack, user }: ApiConsolePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Speech to Text' | 'Text Generation' | 'Text to Speech'>('all');
  const [selectedModel, setSelectedModel] = useState<ModelInfo>(MODELS_LIST[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'js' | 'python'>('curl');

  // Parameters
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [topP, setTopP] = useState(0.9);
  const [responseFormat, setResponseFormat] = useState<'json' | 'text' | 'markdown'>('markdown');

  // Input states
  const [textPrompt, setTextPrompt] = useState("Explain how to use voice dictation to speed up software development productivity.");
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioSimulationText, setAudioSimulationText] = useState("Hello everyone, this is a real-time speech test running directly through our customized AssemblyAI Universal 3 Pro transcription pipeline, which we have integrated right into the Silencly API developer console. It's working incredibly fast and accurate!");

  // Execution states
  const [isLoading, setIsLoading] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [rawResponse, setRawResponse] = useState<string>("");
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);

  // Audio Playback states for TTS
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // General utilities
  const [copiedCode, setCopiedCode] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const generatedApiKey = `sc_live_${user?.id ? user.id.slice(0, 10) : "user_guest"}_${Math.random().toString(36).substring(2, 12)}`;

  // Set default parameters based on category
  useEffect(() => {
    if (selectedModel.category === 'Speech to Text') {
      setMaxTokens(1024);
      setResponseFormat('json');
    } else if (selectedModel.category === 'Text to Speech') {
      setMaxTokens(512);
      setResponseFormat('text');
    } else {
      setMaxTokens(2048);
      setResponseFormat('markdown');
    }
    // Set custom prompts that fit nicely
    if (selectedModel.category === 'Speech to Text') {
      setTextPrompt("Spoken audio simulation: \"I want to write a letter to the team explaining why the Silencly API is much better than basic transcription services.\"");
    } else if (selectedModel.category === 'Text to Speech') {
      setTextPrompt("Welcome to the Silencly voice ecosystem. Our API delivers beautiful, highly phonetic synthetic voices that make reading aloud outdated.");
    } else {
      if (selectedModel.id === "codestral-2501") {
        setTextPrompt("Write a fast, type-safe React hook in TypeScript to record audio and stream it to a custom WebSocket endpoint.");
      } else {
        setTextPrompt("Explain how to use voice dictation to speed up software development productivity.");
      }
    }
  }, [selectedModel]);

  // Audio waveform animation for TTS
  useEffect(() => {
    if (isPlayingAudio) {
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
            return 0;
          }
          return prev + 2.5; // slow progress over 4 seconds
        });
      }, 100);
    } else {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlayingAudio]);

  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      // simulate speech synthesis using Web Speech API if possible, otherwise just a beautiful UI simulation
      try {
        if ('speechSynthesis' in window && selectedModel.category === 'Text to Speech') {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(textPrompt);
          utterance.lang = selectedModel.id === 'canopy-arabic-saudi' ? 'ar-SA' : 'en-US';
          utterance.onend = () => {
            setIsPlayingAudio(false);
            setAudioProgress(0);
          };
          window.speechSynthesis.speak(utterance);
        }
      } catch (e) {
        console.error("Speech Synthesis failed", e);
      }
      setIsPlayingAudio(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredModels = MODELS_LIST.filter(model => {
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          model.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Dynamic code snippet generator
  const getCodeSnippet = () => {
    const apiKeyPlaceholder = apiKeyVisible ? generatedApiKey : "sc_live_********************";
    if (codeLanguage === 'curl') {
      if (selectedModel.category === 'Speech to Text') {
        return `curl -X POST "https://api.silencly.com/v1/speech-to-text/transcribe" \\
  -H "Authorization: Bearer ${apiKeyPlaceholder}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${selectedModel.id}",
    "audio_url": "https://assets.silencly.com/sample.mp3",
    "punctuation": true,
    "diarization": false
  }'`;
      } else if (selectedModel.category === 'Text to Speech') {
        return `curl -X POST "https://api.silencly.com/v1/text-to-speech/synthesize" \\
  -H "Authorization: Bearer ${apiKeyPlaceholder}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${selectedModel.id}",
    "text": "${textPrompt.slice(0, 50)}...",
    "voice_speed": 1.0,
    "pitch": 0.0
  }'`;
      } else {
        return `curl -X POST "https://api.silencly.com/v1/chat/completions" \\
  -H "Authorization: Bearer ${apiKeyPlaceholder}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${selectedModel.id}",
    "messages": [
      {"role": "user", "content": "${textPrompt.slice(0, 50)}..."}
    ],
    "temperature": ${temperature},
    "max_tokens": ${maxTokens},
    "top_p": ${topP}
  }'`;
      }
    } else if (codeLanguage === 'js') {
      if (selectedModel.category === 'Speech to Text') {
        return `import { SilenclyAI } from '@silencly/sdk';

const silencly = new SilenclyAI({ apiKey: '${apiKeyPlaceholder}' });

const response = await silencly.speechToText.transcribe({
  model: '${selectedModel.id}',
  audioUrl: 'https://assets.silencly.com/sample.mp3',
  punctuation: true
});

console.log(response.transcript);`;
      } else if (selectedModel.category === 'Text to Speech') {
        return `import { SilenclyAI } from '@silencly/sdk';

const silencly = new SilenclyAI({ apiKey: '${apiKeyPlaceholder}' });

const response = await silencly.textToSpeech.synthesize({
  model: '${selectedModel.id}',
  text: '${textPrompt.slice(0, 55)}...',
  voiceSpeed: 1.0
});

// Returns binary buffer or play stream
const audioUrl = response.audioUrl;`;
      } else {
        return `import { SilenclyAI } from '@silencly/sdk';

const silencly = new SilenclyAI({ apiKey: '${apiKeyPlaceholder}' });

const response = await silencly.chat.completions.create({
  model: '${selectedModel.id}',
  messages: [
    { role: 'user', content: '${textPrompt.slice(0, 55)}...' }
  ],
  temperature: ${temperature},
  maxTokens: ${maxTokens},
  topP: ${topP}
});

console.log(response.choices[0].message.content);`;
      }
    } else { // Python
      if (selectedModel.category === 'Speech to Text') {
        return `from silencly import SilenclyAI

client = SilenclyAI(api_key="${apiKeyPlaceholder}")

response = client.speech_to_text.transcribe(
    model="${selectedModel.id}",
    audio_url="https://assets.silencly.com/sample.mp3",
    punctuation=True
)

print(response.transcript)`;
      } else if (selectedModel.category === 'Text to Speech') {
        return `from silencly import SilenclyAI

client = SilenclyAI(api_key="${apiKeyPlaceholder}")

response = client.text_to_speech.synthesize(
    model="${selectedModel.id}",
    text="${textPrompt.slice(0, 50)}...",
    voice_speed=1.0
)

# Save or play synthetic voice audio
response.save_to_file("output.mp3")`;
      } else {
        return `from silencly import SilenclyAI

client = SilenclyAI(api_key="${apiKeyPlaceholder}")

response = client.chat.completions.create(
    model="${selectedModel.id}",
    messages=[
        {"role": "user", "content": "${textPrompt.slice(0, 50)}..."}
    ],
    temperature=${temperature},
    max_tokens=${maxTokens},
    top_p=${topP}
)

print(response.choices[0].message.content)`;
      }
    }
  };

  // Run real API request through our server endpoint!
  const runApiRequest = async () => {
    setIsLoading(true);
    setRawResponse("");
    setTokensUsed(null);
    setApiLatency(null);

    const logList: string[] = [];
    const log = (msg: string) => {
      logList.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
      setTerminalLogs([...logList]);
    };

    const endpoint = selectedModel.category === 'Speech to Text' 
      ? '/api/v1/speech-to-text' 
      : selectedModel.category === 'Text to Speech' 
        ? '/api/v1/text-to-speech' 
        : '/api/v1/chat-completions';

    log(`POST ${endpoint} HTTP/1.1`);
    log(`Host: api.silencly.com`);
    log(`Authorization: Bearer sc_live_***`);
    log(`Content-Type: application/json`);
    log(`Initiating sandbox request for model: "${selectedModel.id}"...`);

    const startTime = Date.now();

    try {
      // We will perform a POST request to our custom console/run API on the server
      const response = await fetch("/api/console/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          modelId: selectedModel.id,
          prompt: selectedModel.category === 'Speech to Text' ? audioSimulationText : textPrompt,
          temperature,
          maxTokens,
          topP,
          responseFormat
        })
      });

      const duration = Date.now() - startTime;
      setApiLatency(duration);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setRawResponse(data.output || "");
      setTokensUsed(data.tokensUsed || Math.floor(data.output?.length / 4) || 85);

      log(`HTTP/1.1 200 OK (${duration}ms)`);
      log(`Server: Silencly Edge Router`);
      log(`X-Model-Provider: ${selectedModel.provider}`);
      log(`X-Tokens-Used: ${data.tokensUsed || Math.floor(data.output?.length / 4) || 85}`);
      log(`Response successfully parsed. Rendering results in output box...`);
    } catch (err: any) {
      console.error("API request failed:", err);
      const duration = Date.now() - startTime;
      setApiLatency(duration);

      log(`HTTP/1.1 500 Internal Server Error (${duration}ms)`);
      log(`Error: ${err.message}`);
      
      // Safe fallback response
      setRawResponse(`[API Sandbox Error]\n${err.message}\n\nPlease try running another model or verifying your server configuration.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Provider branding rendering helper
  const renderProviderLogo = (provider: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-5 h-5 text-xs',
      md: 'w-7 h-7 text-sm',
      lg: 'w-10 h-10 text-base'
    };

    const cls = `rounded-lg flex items-center justify-center font-bold tracking-tight select-none border shrink-0 ${sizeClasses[size]}`;

    switch (provider) {
      case 'AssemblyAI':
        return (
          <div className={`${cls} bg-purple-950/40 text-purple-400 border-purple-800/30`} title="AssemblyAI Logo">
            AAI
          </div>
        );
      case 'Mistral':
        return (
          <div className={`${cls} bg-orange-950/40 text-orange-400 border-orange-800/30`} title="Mistral AI Logo">
            M
          </div>
        );
      case 'Groq':
        return (
          <div className={`${cls} bg-cyan-950/40 text-cyan-400 border-cyan-800/30 font-mono`} title="Groq Logo">
            G
          </div>
        );
      case 'OpenAI':
        return (
          <div className={`${cls} bg-emerald-950/40 text-emerald-400 border-emerald-800/30`} title="OpenAI Logo">
            O
          </div>
        );
      case 'Alibaba':
        return (
          <div className={`${cls} bg-rose-950/40 text-rose-400 border-rose-800/30`} title="Alibaba Qwen Logo">
            Q
          </div>
        );
      case 'Meta':
        return (
          <div className={`${cls} bg-blue-950/40 text-blue-400 border-blue-800/30`} title="Meta Llama Logo">
            ∞
          </div>
        );
      case 'Canopy Labs':
        return (
          <div className={`${cls} bg-teal-950/40 text-teal-400 border-teal-800/30`} title="Canopy Labs Logo">
            C
          </div>
        );
      default:
        return (
          <div className={`${cls} bg-zinc-900 text-zinc-400 border-zinc-800`}>
            A
          </div>
        );
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#07070a] text-zinc-100 flex flex-col relative overflow-x-hidden select-none selection:bg-zinc-800/80">
      {/* Sleek developer grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e04_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e04_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* HEADER BAR */}
      <header className="border-b border-zinc-900 bg-[#0c0c10]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10 shrink-0 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-zinc-900 rounded-full border border-zinc-800/60 hover:border-zinc-800 transition-all text-zinc-400 hover:text-white cursor-pointer"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full font-mono">v1.2.0 API</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-mono">All Edge Nodes Operational</span>
            </div>
            <h1 className="text-lg font-bold font-display tracking-tight text-white mt-0.5 flex items-center gap-1.5">
              <Cpu className="w-4.5 h-4.5 text-purple-400" />
              Silencly API Console
            </h1>
          </div>
        </div>

        {/* API Secret Key simulator */}
        <div className="hidden lg:flex items-center gap-2.5 bg-zinc-950/60 border border-zinc-900 px-4 py-2 rounded-2xl max-w-sm">
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Secret API Key</span>
            <span className="text-xs font-mono text-zinc-300">
              {apiKeyVisible ? generatedApiKey : "sc_live_********************"}
            </span>
          </div>
          <div className="flex gap-1 border-l border-zinc-900 pl-2.5">
            <button 
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
              className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors rounded hover:bg-zinc-900 cursor-pointer text-xs font-mono"
            >
              {apiKeyVisible ? "Hide" : "Reveal"}
            </button>
            <button 
              onClick={() => copyToClipboard(generatedApiKey)}
              className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors rounded hover:bg-zinc-900 cursor-pointer"
              title="Copy API Key"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* THREE COLUMN PANELS LAYOUT */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
        
        {/* PANEL 1: MODELS SIDEBAR SELECTOR */}
        <div className="w-full md:w-80 shrink-0 border-r border-zinc-900 flex flex-col bg-[#08080c]/60 backdrop-blur-xl max-h-[400px] md:max-h-none md:h-full overflow-hidden">
          {/* Category Tabs */}
          <div className="p-4 border-b border-zinc-900 space-y-3 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-200 focus:outline-none focus:border-purple-800/40 focus:ring-1 focus:ring-purple-800/20"
              />
            </div>
            
            {/* Category Select Buttons */}
            <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-900">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`py-1.5 px-2.5 text-[10px] font-semibold rounded-lg transition-all cursor-pointer ${selectedCategory === 'all' ? 'bg-zinc-900 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                All Models
              </button>
              <button 
                onClick={() => setSelectedCategory('Speech to Text')}
                className={`py-1.5 px-2.5 text-[10px] font-semibold rounded-lg transition-all cursor-pointer truncate ${selectedCategory === 'Speech to Text' ? 'bg-zinc-900 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Speech-to-Text
              </button>
              <button 
                onClick={() => setSelectedCategory('Text Generation')}
                className={`py-1.5 px-2.5 text-[10px] font-semibold rounded-lg transition-all cursor-pointer truncate ${selectedCategory === 'Text Generation' ? 'bg-zinc-900 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Text Gen
              </button>
              <button 
                onClick={() => setSelectedCategory('Text to Speech')}
                className={`py-1.5 px-2.5 text-[10px] font-semibold rounded-lg transition-all cursor-pointer truncate ${selectedCategory === 'Text to Speech' ? 'bg-zinc-900 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Text-to-Speech
              </button>
            </div>
          </div>

          {/* Model selection list */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-900">
            {filteredModels.length === 0 ? (
              <div className="py-8 text-center text-zinc-600 text-xs">
                No models match your search.
              </div>
            ) : (
              filteredModels.map((model) => (
                <div 
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`w-full p-3 rounded-2xl text-left border cursor-pointer transition-all flex gap-3 ${selectedModel.id === model.id ? 'bg-[#0e0c15] border-purple-900/40 shadow-lg shadow-black/30' : 'bg-transparent border-transparent hover:bg-zinc-950/65'}`}
                >
                  {renderProviderLogo(model.provider, 'sm')}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <h3 className="text-xs font-bold text-white truncate">{model.name}</h3>
                      {selectedModel.id === model.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] text-zinc-500 font-mono">{model.provider}</span>
                      <span className="text-[9px] text-zinc-700 font-mono">•</span>
                      <span className="text-[9px] text-purple-400 font-mono truncate">{model.category}</span>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-900/20 text-[9px] text-zinc-500 font-mono">
                      <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5 text-zinc-600" /> {model.latency}</span>
                      <span className="flex items-center gap-0.5"><Coins className="w-2.5 h-2.5 text-zinc-600" /> {model.costPer1k}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANEL 2: INTERACTIVE PLAYGROUND (MIDDLE) */}
        <div className="flex-1 border-r border-zinc-900 flex flex-col bg-zinc-950/20 overflow-y-auto max-h-[800px] md:max-h-none h-full scrollbar-thin scrollbar-thumb-zinc-900">
          
          {/* Selected Model Description Banner */}
          <div className="p-6 border-b border-zinc-900 bg-gradient-to-b from-[#09090e]/40 to-transparent shrink-0">
            <div className="flex items-start gap-4">
              {renderProviderLogo(selectedModel.provider, 'lg')}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-white tracking-tight">{selectedModel.name}</h2>
                  <span className="text-[9px] bg-purple-950/60 border border-purple-900/30 text-purple-400 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">{selectedModel.category}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mt-1">{selectedModel.description}</p>
                
                <div className="flex items-center gap-4 mt-3 text-[10px] text-zinc-500 font-mono">
                  <span>Provider: <strong className="text-zinc-300">{selectedModel.provider}</strong></span>
                  <span>Latency: <strong className="text-zinc-300">{selectedModel.latency}</strong></span>
                  <span>Unit cost: <strong className="text-zinc-300">{selectedModel.costPer1k}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Parameters Controls */}
          <div className="p-6 border-b border-zinc-900 bg-zinc-950/40">
            <div className="flex items-center gap-2 text-xs font-bold text-white mb-4">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span>Model Hyperparameters & Settings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Temperature */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Temperature</span>
                  <span className="text-purple-400">{temperature}</span>
                </div>
                <input 
                  type="range" 
                  min="0.0" 
                  max="1.2" 
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  disabled={selectedModel.category !== 'Text Generation'}
                  className="w-full accent-purple-500 h-1 bg-zinc-900 rounded-lg cursor-pointer disabled:opacity-30"
                />
                <span className="text-[9px] text-zinc-600 block leading-tight">Controls creativity. Lower is more deterministic.</span>
              </div>

              {/* Max Tokens */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Max Output Length</span>
                  <span className="text-purple-400">{maxTokens} tokens</span>
                </div>
                <input 
                  type="range" 
                  min="64" 
                  max={selectedModel.maxTokens} 
                  step="64"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500 h-1 bg-zinc-900 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] text-zinc-600 block leading-tight">Limits size of response generation.</span>
              </div>

              {/* Response Format */}
              <div className="space-y-2 text-left">
                <span className="text-[11px] font-mono text-zinc-400 block">Response Format</span>
                <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-900">
                  <button 
                    onClick={() => setResponseFormat('json')}
                    className={`py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${responseFormat === 'json' ? 'bg-purple-950/60 border border-purple-900/30 text-purple-400' : 'text-zinc-600 hover:text-zinc-300'}`}
                  >
                    JSON
                  </button>
                  <button 
                    onClick={() => setResponseFormat('text')}
                    className={`py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${responseFormat === 'text' ? 'bg-purple-950/60 border border-purple-900/30 text-purple-400' : 'text-zinc-600 hover:text-zinc-300'}`}
                  >
                    Text
                  </button>
                  <button 
                    onClick={() => setResponseFormat('markdown')}
                    className={`py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${responseFormat === 'markdown' ? 'bg-purple-950/60 border border-purple-900/30 text-purple-400' : 'text-zinc-600 hover:text-zinc-300'}`}
                  >
                    Markdown
                  </button>
                </div>
                <span className="text-[9px] text-zinc-600 block leading-tight">Controls programmatic layout of outputs.</span>
              </div>
            </div>
          </div>

          {/* Interactive Playground Core Inputs */}
          <div className="p-6 flex-1 flex flex-col gap-6">
            <div className="flex-1 flex flex-col gap-4 text-left">
              <label className="text-xs font-bold text-zinc-300 font-display">Sandbox Playground Input Payload</label>
              
              {/* Conditional Input Fields */}
              {selectedModel.category === 'Speech to Text' ? (
                <div className="space-y-4">
                  {/* File Upload Simulator */}
                  <div className="border border-dashed border-zinc-800 rounded-3xl p-6 bg-zinc-950/30 hover:bg-zinc-950/60 transition-all text-center space-y-3 relative group">
                    <div className="w-12 h-12 bg-purple-950/20 border border-purple-900/30 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-all">
                      <FileAudio className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-200">Drag & drop raw audio file, or click to browse</p>
                      <p className="text-[10px] text-zinc-500">Supports MP3, WAV, M4A, FLAC up to 50MB</p>
                    </div>
                    <input 
                      type="file" 
                      accept="audio/*" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAudioFile(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {audioFile && (
                      <div className="bg-purple-950/40 border border-purple-900/30 px-3 py-1.5 rounded-full inline-flex items-center gap-2 text-[10px] text-purple-400 font-mono">
                        <Check className="w-3 h-3" />
                        <span>Loaded: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    )}
                  </div>

                  {/* Dictation text simulation */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-zinc-500 block">Dictation Audio Simulation Payload (used if no audio is uploaded)</span>
                    <textarea 
                      value={audioSimulationText}
                      onChange={(e) => setAudioSimulationText(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl py-3.5 px-4 text-xs text-zinc-300 focus:outline-none focus:border-purple-800/40 focus:ring-1 focus:ring-purple-800/20 min-h-[90px] font-sans resize-none"
                    />
                  </div>
                </div>
              ) : selectedModel.category === 'Text to Speech' ? (
                <div className="space-y-3">
                  <textarea 
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    placeholder="Enter text to synthesize into high-fidelity speech..."
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl py-3.5 px-4 text-xs text-zinc-300 focus:outline-none focus:border-purple-800/40 focus:ring-1 focus:ring-purple-800/20 min-h-[120px] font-sans resize-none"
                  />
                  
                  {/* Synthesis Audio Output Box */}
                  <div className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-4 flex items-center justify-between gap-4">
                    <button 
                      onClick={togglePlayAudio}
                      className="w-10 h-10 bg-purple-600 hover:bg-purple-500 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 focus:outline-none"
                      title={isPlayingAudio ? "Stop Playback" : "Play Synthesized Voice"}
                    >
                      {isPlayingAudio ? (
                        <div className="flex gap-0.5 items-center justify-center">
                          <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                          <span className="w-1 h-4 bg-white rounded-full animate-pulse" />
                          <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                        </div>
                      ) : (
                        <Volume2 className="w-5 h-5 fill-white text-white" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mb-1">
                        <span>{selectedModel.name} synthesizer</span>
                        <span>{isPlayingAudio ? "Synthesized playing" : "Playback ready"}</span>
                      </div>
                      
                      {/* Realistic moving soundwave simulator */}
                      <div className="h-6 flex items-end gap-1.5 px-1.5 overflow-hidden">
                        {Array.from({ length: 28 }).map((_, idx) => {
                          const heights = [20, 45, 15, 60, 30, 75, 40, 50, 25, 70, 35, 80, 55, 65, 30, 45, 15, 70, 40, 60, 25, 55, 35, 75, 50, 40, 20, 10];
                          const dynamicHeight = isPlayingAudio 
                            ? Math.sin(audioProgress * 0.4 + idx) * 15 + 16 
                            : 4;
                          return (
                            <span 
                              key={idx} 
                              className="flex-1 bg-purple-500/30 rounded-full transition-all duration-300"
                              style={{ 
                                height: `${isPlayingAudio ? heights[idx % heights.length] : 4}%`,
                                backgroundColor: isPlayingAudio ? '#a855f7' : '#3f3f46'
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <textarea 
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl py-3.5 px-4 text-xs text-zinc-300 focus:outline-none focus:border-purple-800/40 focus:ring-1 focus:ring-purple-800/20 min-h-[140px] font-sans resize-none"
                />
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={runApiRequest}
                  disabled={isLoading}
                  className="flex-1 bg-white hover:bg-zinc-200 text-black py-3 rounded-full font-bold text-xs font-sans transition-all cursor-pointer shadow-lg shadow-black/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Executing API Call...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Run Sandbox Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sandbox Output Box */}
            <div className="space-y-2.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 font-display">Playground Response Payload</span>
                {rawResponse && (
                  <button 
                    onClick={() => copyToClipboard(rawResponse)}
                    className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 font-mono transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Response</span>
                  </button>
                )}
              </div>

              <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 min-h-[140px] relative overflow-hidden flex flex-col">
                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-xs space-y-3">
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                    <p className="animate-pulse">Parsing response stream from edge node...</p>
                  </div>
                ) : rawResponse ? (
                  <div className="text-xs font-sans leading-relaxed text-zinc-200 whitespace-pre-wrap flex-1 select-text">
                    {rawResponse}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 text-xs text-center p-6 space-y-1.5 select-none pointer-events-none">
                    <Braces className="w-8 h-8 text-zinc-800" />
                    <p className="font-bold text-zinc-500">Playground response empty</p>
                    <p className="text-[10px] text-zinc-700 max-w-[240px]">Click 'Run Sandbox Request' to fetch an live response stream from this model node.</p>
                  </div>
                )}

                {/* Response speed metadata banner */}
                {apiLatency && (
                  <div className="absolute bottom-3 right-3 bg-zinc-900 border border-zinc-800/80 px-2.5 py-1 rounded-full text-[9px] font-mono text-zinc-500 flex items-center gap-3">
                    <span>Latency: <strong className="text-emerald-400">{apiLatency}ms</strong></span>
                    <span className="text-zinc-800">|</span>
                    <span>Tokens: <strong className="text-purple-400">{tokensUsed}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 3: CODE IMPLEMENTATION & REAL-TIME TERMINAL LOGS (RIGHT) */}
        <div className="w-full md:w-96 shrink-0 border-l border-zinc-900 flex flex-col bg-[#08080c]/80 backdrop-blur-md">
          {/* Section A: Code Implementation snippets */}
          <div className="p-5 border-b border-zinc-900 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Code className="w-4 h-4 text-purple-400" />
                <span>Quick Integration SDK</span>
              </div>
              <button 
                onClick={() => copyToClipboard(getCodeSnippet())}
                className="text-[10px] text-zinc-500 hover:text-zinc-200 flex items-center gap-1 transition-colors cursor-pointer"
                title="Copy code snippet"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-mono">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="font-mono">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Language Selection Tabs */}
            <div className="flex gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-900 mb-3">
              <button 
                onClick={() => setCodeLanguage('curl')}
                className={`flex-1 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${codeLanguage === 'curl' ? 'bg-zinc-900 text-white shadow-inner' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                cURL
              </button>
              <button 
                onClick={() => setCodeLanguage('js')}
                className={`flex-1 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${codeLanguage === 'js' ? 'bg-zinc-900 text-white shadow-inner' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                Node.js
              </button>
              <button 
                onClick={() => setCodeLanguage('python')}
                className={`flex-1 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${codeLanguage === 'python' ? 'bg-zinc-900 text-white shadow-inner' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                Python
              </button>
            </div>

            {/* Code container */}
            <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 max-h-[190px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-900 text-left select-text">
              <pre className="text-[10px] font-mono text-zinc-300 leading-normal whitespace-pre-wrap break-all">
                {getCodeSnippet()}
              </pre>
            </div>
          </div>

          {/* Section B: Glowing Real-time Terminal Log window */}
          <div className="flex-1 p-5 flex flex-col min-h-0 bg-black/40">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs">live_terminal_session</span>
              </div>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-zinc-500 font-mono">Listening...</span>
              </span>
            </div>

            {/* Terminal Window */}
            <div className="flex-1 bg-[#040406] border border-zinc-900 rounded-2xl p-4 overflow-y-auto font-mono text-[10px] text-zinc-400 space-y-2 text-left scrollbar-thin scrollbar-thumb-zinc-950 relative">
              {terminalLogs.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 text-center select-none pointer-events-none p-4">
                  <Terminal className="w-6 h-6 text-zinc-800 mb-1.5" />
                  <p className="font-bold">Terminal listening...</p>
                  <p className="text-[9px] text-zinc-700">Logs, requests, headers and edge routing records will stream live here as API calls trigger.</p>
                </div>
              ) : (
                terminalLogs.map((log, index) => {
                  let colorClass = "text-zinc-400";
                  if (log.includes("HTTP/1.1 200") || log.includes("successfully")) {
                    colorClass = "text-emerald-400";
                  } else if (log.includes("HTTP/1.1 500") || log.includes("Error:") || log.includes("failed")) {
                    colorClass = "text-rose-400";
                  } else if (log.includes("POST ") || log.includes("Initiating")) {
                    colorClass = "text-purple-400";
                  } else if (log.includes("Host:") || log.includes("Authorization:") || log.includes("X-")) {
                    colorClass = "text-zinc-500";
                  }
                  return (
                    <div key={index} className={`${colorClass} leading-tight whitespace-pre-wrap select-text`}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
