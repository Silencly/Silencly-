import React, { useState, useEffect, useRef } from "react";
import { Search, FileText, ArrowRight, Shield, Info, HelpCircle, Sparkles, Mic, Briefcase, DollarSign, X, Command } from "lucide-react";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  setPage: (page: "home" | "about" | "workspace" | "bud" | "features" | "use-cases" | "pricing" | "careers" | "privacy" | "terms" | "demo" | "api-console") => void;
  handleWorkspaceClick: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: "Pages" | "Sections" | "FAQs" | "Actions";
  icon: React.ComponentType<any>;
  action: () => void;
}

export default function SpotlightSearch({ isOpen, onClose, setPage, handleWorkspaceClick }: SpotlightSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input when search modal is opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle outside click to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const searchItems: SearchItem[] = [
    {
      id: "home",
      title: "Home",
      description: "Go back to the homepage of Silencly.",
      category: "Pages",
      icon: Info,
      action: () => {
        setPage("home");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    {
      id: "about",
      title: "About Us",
      description: "Learn about the Silencly team, our vision, and the creators.",
      category: "Pages",
      icon: Info,
      action: () => {
        setPage("about");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      description: "Read our privacy-first local storage policy and data usage terms.",
      category: "Pages",
      icon: Shield,
      action: () => {
        setPage("privacy");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    {
      id: "terms",
      title: "Terms of Service",
      description: "Review our service agreements and intellectual property terms.",
      category: "Pages",
      icon: FileText,
      action: () => {
        setPage("terms");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    {
      id: "demo",
      title: "Interactive Demo",
      description: "Try out a simulated audio dictation demo of Silencly.",
      category: "Pages",
      icon: Sparkles,
      action: () => {
        setPage("demo");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    {
      id: "workspace",
      title: "Go to Workspace",
      description: "Launch the active web dictation and transcribing dashboard.",
      category: "Actions",
      icon: Mic,
      action: () => {
        handleWorkspaceClick();
      }
    },
    {
      id: "bud",
      title: "Bud AI Worker",
      description: "Access the Bud AI voice and workflow agent dashboard.",
      category: "Pages",
      icon: Sparkles,
      action: () => {
        setPage("bud");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    {
      id: "features",
      title: "Product Features",
      description: "Explore AI editing, custom dictionaries, and multi-format export.",
      category: "Sections",
      icon: Sparkles,
      action: () => {
        setPage("features");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    {
      id: "pricing",
      title: "Pricing Plans",
      description: "View our pricing plans including the free tier and premium options.",
      category: "Sections",
      icon: DollarSign,
      action: () => {
        setPage("pricing");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    {
      id: "careers",
      title: "Careers / Jobs",
      description: "Join the Silencly team as a full-stack engineer or designer.",
      category: "Sections",
      icon: Briefcase,
      action: () => {
        setPage("careers");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    {
      id: "api-console",
      title: "API Console",
      description: "Manage your Silencly developer API keys and usage.",
      category: "Pages",
      icon: Command,
      action: () => {
        setPage("api-console");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    {
      id: "faq-creators",
      title: "Who created Silencly?",
      description: "Silencly was co-founded by Anubhav Sapkota, Daksh shetty, and Johan Jovin Cheeran.",
      category: "FAQs",
      icon: HelpCircle,
      action: () => {
        setPage("about");
        setTimeout(() => {
          const el = document.getElementById("about");
          el?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    },
    {
      id: "faq-free",
      title: "Is Silencly free?",
      description: "Yes, Silencly is a completely free AI speech-to-text dictation application.",
      category: "FAQs",
      icon: HelpCircle,
      action: () => {
        setPage("about");
        setTimeout(() => {
          const el = document.getElementById("about");
          el?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    },
    {
      id: "faq-data",
      title: "Where is my data stored?",
      description: "Your recordings and transcripts stay locally inside your private browser cache.",
      category: "FAQs",
      icon: HelpCircle,
      action: () => {
        setPage("about");
        setTimeout(() => {
          const el = document.getElementById("about");
          el?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  ];

  // Filter items based on user search
  const filteredItems = searchItems.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  // Group filtered items by category
  const categories = ["Pages", "Actions", "Sections", "FAQs"] as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 md:px-0">
      {/* Backdrop blur */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />

      {/* Main Search Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-zinc-950/95 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[75vh] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Area */}
        <div className="flex items-center gap-3 px-5 py-4.5 border-b border-zinc-900">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search Silencly..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm md:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-0"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md text-zinc-400">
            <span>ESC</span>
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Structured Results list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-zinc-600" />
              <p className="text-zinc-400 text-sm font-medium">No results found for &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-zinc-500 text-xs">Try searching for &quot;privacy&quot;, &quot;terms&quot;, &quot;demo&quot;, or &quot;workspace&quot;</p>
            </div>
          ) : (
            categories.map(category => {
              const itemsInCategory = filteredItems.filter(item => item.category === category);
              if (itemsInCategory.length === 0) return null;

              return (
                <div key={category} className="space-y-1.5">
                  <h4 className="px-3 text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase">
                    {category}
                  </h4>
                  <div className="flex flex-col gap-1">
                    {itemsInCategory.map((item) => {
                      const absoluteIndex = filteredItems.findIndex(f => f.id === item.id);
                      const isSelected = absoluteIndex === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            item.action();
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          className={`flex items-start gap-3.5 px-4.5 py-3 rounded-2xl cursor-pointer transition-all ${
                            isSelected
                              ? "bg-white text-black"
                              : "bg-zinc-900/10 text-zinc-300 hover:bg-zinc-900/40"
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${
                            isSelected ? "bg-black/5 text-black" : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${isSelected ? "text-black" : "text-zinc-100"}`}>
                              {item.title}
                            </p>
                            <p className={`text-xs truncate ${isSelected ? "text-zinc-700" : "text-zinc-400"}`}>
                              {item.description}
                            </p>
                          </div>
                          {isSelected && (
                            <ArrowRight className="w-4 h-4 text-black self-center shrink-0 animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer controls */}
        <div className="px-5 py-3.5 bg-zinc-950 border-t border-zinc-900 text-[10px] sm:text-xs text-zinc-500 flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-zinc-900 px-1.5 py-0.5 border border-zinc-800 rounded">↑↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-zinc-900 px-1.5 py-0.5 border border-zinc-800 rounded">Enter</kbd>
              <span>to select</span>
            </span>
          </div>
          <span>Silencly Spotlight Search</span>
        </div>
      </div>
    </div>
  );
}
