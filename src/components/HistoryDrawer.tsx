import { MouseEvent } from "react";
import { Trash2, X, FileText, Calendar, Clock, Sparkles } from "lucide-react";
import { DictationSession } from "../types";

interface HistoryDrawerProps {
  sessions: DictationSession[];
  activeSessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (session: DictationSession) => void;
  onDeleteSession: (id: string, e: MouseEvent) => void;
  onClearHistory: () => void;
}

export default function HistoryDrawer({
  sessions,
  activeSessionId,
  isOpen,
  onClose,
  onSelectSession,
  onDeleteSession,
  onClearHistory,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div id="history-overlay" className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        id="history-backdrop"
        className="absolute inset-0 bg-[#1a1a18]/20 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div
        id="history-panel"
        className="relative w-full max-w-md h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out transform translate-x-0"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
          <div>
            <h2 className="text-xl font-display text-white font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-400" />
              Dictation History
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Your saved audio logs and polished drafts
            </p>
          </div>
          <button
            id="close-history-btn"
            onClick={onClose}
            className="p-2 hover:bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors"
            title="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sessions.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <FileText className="w-12 h-12 text-zinc-800 mb-3 stroke-[1.5]" />
              <p className="text-zinc-300 font-medium text-sm">No dictations yet</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-[240px]">
                Start dictating and click "Save to History" to log your transcripts.
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  id={`history-item-${session.id}`}
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left relative flex flex-col justify-between ${
                    isActive
                      ? "bg-zinc-900 border-zinc-500 shadow-md ring-1 ring-zinc-500/30"
                      : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80"
                  }`}
                >
                  <div className="pr-8">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-display font-semibold text-white text-sm line-clamp-1">
                        {session.title || "Untitled Session"}
                      </span>
                      {session.polishedText && (
                        <span
                          className="px-1.5 py-0.5 text-[9px] font-semibold uppercase bg-zinc-800/60 text-zinc-300 border border-zinc-700/50 rounded-md flex items-center gap-0.5"
                          title="Polished with AI"
                        >
                          <Sparkles className="w-2 h-2" />
                          AI
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 mb-3">
                      {session.polishedText || session.rawText || "(Empty Transcript)"}
                    </p>
                  </div>

                  {/* Metadata footer */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono border-t border-zinc-800/40 pt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      {formatDate(session.createdAt)}
                    </span>
                    <span className="bg-zinc-950 px-1.5 py-0.5 rounded text-zinc-400 font-medium border border-zinc-850">
                      {formatDuration(session.durationSeconds)}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    id={`delete-session-btn-${session.id}`}
                    onClick={(e) => onDeleteSession(session.id, e)}
                    className="absolute right-3 top-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-950/55 hover:text-red-400 text-zinc-500 transition-all"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer controls */}
        {sessions.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/40">
            <button
              id="clear-all-history-btn"
              onClick={onClearHistory}
              className="w-full py-2.5 px-4 border border-red-900/50 hover:bg-red-950/35 text-red-400 rounded-xl text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Sessions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
