import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Code, 
  FileText, 
  Briefcase, 
  Mic, 
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import MacOSDock from './ui/mac-os-dock';

const DOCK_APPS = [
  { 
    id: 'chrome', 
    name: 'Chrome', 
    icon: 'https://svgl.app/library/chrome.svg' 
  },
  { 
    id: 'slack', 
    name: 'Slack', 
    icon: 'https://svgl.app/library/slack.svg' 
  },
  { 
    id: 'notion', 
    name: 'Notion', 
    icon: 'https://svgl.app/library/notion.svg' 
  },
  { 
    id: 'discord', 
    name: 'Discord', 
    icon: 'https://svgl.app/library/discord.svg' 
  },
  { 
    id: 'perplexity', 
    name: 'Perplexity', 
    icon: 'https://svgl.app/library/perplexity.svg' 
  },
  { 
    id: 'chatgpt', 
    name: 'ChatGPT', 
    icon: 'https://svgl.app/library/openai_dark.svg' 
  },
  { 
    id: 'claude', 
    name: 'Claude', 
    icon: 'https://svgl.app/library/claude-ai-icon.svg' 
  },
];

const USE_CASES = [
  {
    icon: <MessageSquare className="w-6 h-6 text-purple-400" />,
    title: "Social Media & Comms",
    description: "Reply to emails, tweets, and LinkedIn comments faster by speaking. Keep your authentic voice and tone.",
    gradient: "from-purple-500/10 to-transparent",
    border: "group-hover:border-purple-500/30"
  },
  {
    icon: <Code className="w-6 h-6 text-blue-400" />,
    title: "Developers & Engineers",
    description: "Write PR descriptions, commit messages, and documentation without breaking your coding flow.",
    gradient: "from-blue-500/10 to-transparent",
    border: "group-hover:border-blue-500/30"
  },
  {
    icon: <FileText className="w-6 h-6 text-emerald-400" />,
    title: "Writing & Content",
    description: "Draft essays, blog posts, and long-form content at the speed of thought. Beat the blank page syndrome.",
    gradient: "from-emerald-500/10 to-transparent",
    border: "group-hover:border-emerald-500/30"
  },
  {
    icon: <Briefcase className="w-6 h-6 text-amber-400" />,
    title: "Founders & Managers",
    description: "Dictate product requirements, user stories, and investor updates effortlessly while on the go.",
    gradient: "from-amber-500/10 to-transparent",
    border: "group-hover:border-amber-500/30"
  },
  {
    icon: <Mic className="w-6 h-6 text-rose-400" />,
    title: "Meetings & Notes",
    description: "Capture fleeting ideas, meeting takeaways, and action items instantly before they slip away.",
    gradient: "from-rose-500/10 to-transparent",
    border: "group-hover:border-rose-500/30"
  },
  {
    icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
    title: "Creative Brainstorming",
    description: "Speak your thoughts out loud. Let Silencly capture, structure, and format your unstructured ideas.",
    gradient: "from-cyan-500/10 to-transparent",
    border: "group-hover:border-cyan-500/30"
  }
];

export function UseCasesPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-medium tracking-tight text-white mb-6"
          >
            Use cases
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to automate your workflow, capture ideas, and communicate faster using just your voice.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`group relative overflow-hidden rounded-[32px] bg-zinc-950 border border-zinc-800/80 p-8 transition-colors duration-300 ${useCase.border}`}
            >
              <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8">
                  {useCase.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-display font-medium text-zinc-100 mb-3 tracking-tight">
                  {useCase.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  {useCase.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration / Logos Area */}
        <IntegrationsArea />
      </div>
    </div>
  );
}

function IntegrationsArea() {
  const [openApps, setOpenApps] = useState<string[]>(['slack', 'notion']);

  const handleAppClick = (appId: string) => {
    setOpenApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-12 p-10 md:p-16 rounded-[40px] bg-zinc-950 border border-zinc-800/80 flex flex-col items-center text-center relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <h2 className="text-4xl md:text-6xl font-display font-medium text-white mb-6 relative z-10 tracking-tight max-w-2xl mx-auto">
        Flow in every application
      </h2>
      <p className="text-zinc-400 max-w-2xl mx-auto mb-16 relative z-10 text-base md:text-lg">
        Work at the speed you think in every app you use. Email, messages, docs or code—Flow works in any text box.
      </p>
      
      <div className="w-full flex justify-center items-center relative z-10 pt-4 pb-8">
        <MacOSDock
          apps={DOCK_APPS}
          onAppClick={handleAppClick}
          openApps={openApps}
        />
      </div>
    </motion.div>
  );
}
