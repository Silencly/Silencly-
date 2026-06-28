import { useState, FormEvent } from "react";
import { X, Trash2, Plus, Info, BookOpen } from "lucide-react";

export interface DictionaryItem {
  id: string;
  word: string;
  replaceWith?: string;
}

interface DictionaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: DictionaryItem[];
  onAddItem: (word: string, replaceWith?: string) => void;
  onDeleteItem: (id: string) => void;
}

export default function DictionaryDrawer({
  isOpen,
  onClose,
  items,
  onAddItem,
  onDeleteItem,
}: DictionaryDrawerProps) {
  const [word, setWord] = useState("");
  const [replaceWith, setReplaceWith] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedWord = word.trim();
    if (!trimmedWord) {
      setError("Custom word or phrase is required.");
      return;
    }

    // Check for duplicates
    const isDuplicate = items.some(
      (item) => item.word.toLowerCase() === trimmedWord.toLowerCase()
    );
    if (isDuplicate) {
      setError(`"${trimmedWord}" is already in your custom dictionary.`);
      return;
    }

    onAddItem(trimmedWord, replaceWith.trim() || undefined);
    setWord("");
    setReplaceWith("");
  };

  const handleSuggest = (suggestedWord: string, suggestedReplace?: string) => {
    setError(null);
    const isDuplicate = items.some(
      (item) => item.word.toLowerCase() === suggestedWord.toLowerCase()
    );
    if (isDuplicate) {
      setError(`"${suggestedWord}" is already in your custom dictionary.`);
      return;
    }
    onAddItem(suggestedWord, suggestedReplace);
  };

  return (
    <div id="dict-overlay" className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        id="dict-backdrop"
        className="absolute inset-0 bg-[#1a1a18]/20 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div
        id="dict-drawer"
        className="relative w-full max-w-md bg-zinc-950 h-full shadow-2xl flex flex-col z-10 border-l border-zinc-800 animate-slide-in-right"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-zinc-400" />
            <div>
              <h2 className="text-sm font-bold font-mono text-white tracking-tight uppercase">
                Custom Dictionary
              </h2>
              <p className="text-[10px] text-zinc-500 font-mono">
                BOOST DETECTION & CORRECT SPELLINGS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-4">
            <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase">Add New Vocabulary</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold font-mono text-zinc-500 uppercase">
                What you say (e.g. phonetics or brand)
              </label>
              <input
                type="text"
                placeholder="e.g. ai studio, saas"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold font-mono text-zinc-500 uppercase">
                Correct Output (e.g. exact spelling/casing) <span className="text-zinc-600 lowercase">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. AI Studio, SaaS"
                value={replaceWith}
                onChange={(e) => setReplaceWith(e.target.value)}
                className="bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600"
              />
            </div>

            {error && <p className="text-[11px] font-medium text-red-400 font-mono">{error}</p>}

            <button
              type="submit"
              className="w-full bg-zinc-850 hover:bg-zinc-750 border border-zinc-800 text-white rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Dictionary</span>
            </button>
          </form>

          {/* Guidelines info */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 text-xs flex gap-3">
            <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <div className="text-zinc-400 leading-relaxed text-[11px]">
              <p className="font-semibold text-zinc-300 mb-1">How it works</p>
              These words are sent to AssemblyAI as speech vocabulary hints and passed to Llama 3.1 8B so it automatically fixes raw transcription errors into your preferred format.
            </div>
          </div>

          {/* Dictionary Entries List */}
          <div className="flex-1 flex flex-col gap-3 min-h-[200px]">
            <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase flex items-center justify-between">
              <span>Your Dictionary ({items.length})</span>
              {items.length > 0 && (
                <span className="text-[10px] font-normal text-zinc-500 font-sans lowercase">
                  active during next dictation
                </span>
              )}
            </h3>

            {items.length === 0 ? (
              <div className="flex-1 border border-dashed border-zinc-850 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-zinc-900/10">
                <BookOpen className="w-8 h-8 text-zinc-700 mb-2" />
                <p className="text-xs font-medium text-zinc-400">No custom words added yet</p>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-[220px]">
                  Add custom words or click below to add some common suggestions.
                </p>
                
                {/* Popular suggestions */}
                <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                  <button
                    onClick={() => handleSuggest("ai studio", "AI Studio")}
                    className="text-[10px] bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg px-2.5 py-1 text-zinc-300 transition-colors cursor-pointer"
                  >
                    + AI Studio
                  </button>
                  <button
                    onClick={() => handleSuggest("saas", "SaaS")}
                    className="text-[10px] bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg px-2.5 py-1 text-zinc-300 transition-colors cursor-pointer"
                  >
                    + SaaS
                  </button>
                  <button
                    onClick={() => handleSuggest("llama", "Llama")}
                    className="text-[10px] bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg px-2.5 py-1 text-zinc-300 transition-colors cursor-pointer"
                  >
                    + Llama
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-850 rounded-xl text-xs hover:border-zinc-700 transition-colors shadow-xs"
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-tight">word / phrase</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-zinc-200">{item.word}</span>
                        {item.replaceWith && (
                          <>
                            <span className="text-zinc-600 text-[10px]">➔</span>
                            <span className="font-mono bg-zinc-800/60 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded font-bold border border-zinc-700/50">
                              {item.replaceWith}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 hover:bg-red-950 hover:text-red-400 text-zinc-500 rounded-lg transition-colors"
                      title="Remove word"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
