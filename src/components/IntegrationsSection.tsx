import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

export function IntegrationsSection() {
  const [openApps, setOpenApps] = useState<string[]>(['slack', 'notion']);

  const handleAppClick = (appId: string) => {
    setOpenApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  return (
    <section className="py-20 md:py-28 bg-black w-full px-5 md:px-10 flex flex-col items-center justify-center font-sans border-t border-zinc-900">
      <div className="w-full max-w-[1400px] mx-auto text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full p-10 md:p-16 rounded-[48px] bg-zinc-950 border border-zinc-800/80 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <h2 className="text-4xl md:text-6xl font-display font-medium text-white mb-6 relative z-10 tracking-tight max-w-2xl mx-auto">
            Flow in every application
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-16 relative z-10 text-base md:text-lg">
            Work at the speed you think in every app you use. Email, messages, docs or code—Flow works in any text box.
          </p>
          
          <div className="w-full flex justify-center items-center relative z-10 pt-8 pb-12">
            <MacOSDock
              apps={DOCK_APPS}
              onAppClick={handleAppClick}
              openApps={openApps}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
