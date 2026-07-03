import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Terminal,
  Plus,
  Search,
  Sparkles,
  User,
  Clock,
  RotateCw,
  Filter,
  CheckCircle2,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: string;
  details?: string;
}

interface AuditLogFooterProps {
  user: {
    email: string;
    name?: string;
  } | null;
}

const AUDIT_ALLOWED_EMAILS = [
  "sapkotaanubhav91@gmail.com",
  "gmanubhavsapkota@gmail.com",
  "dakshshetty506@gmail.com",
  "neurox919@gmail.com",
  "s.impersio@gmail.com"
];

export default function AuditLogFooter({ user }: AuditLogFooterProps) {
  // Security gate
  if (!user || !user.email) return null;
  const cleanEmail = user.email.trim().toLowerCase();
  if (!AUDIT_ALLOWED_EMAILS.includes(cleanEmail)) return null;

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [actorFilter, setActorFilter] = useState<string>("All");

  // Form states
  const [formActor, setFormActor] = useState<string>("Anubhav");
  const [formAction, setFormAction] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("Manual Entry");
  const [formDetails, setFormDetails] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/audit-logs?email=${encodeURIComponent(user.email)}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to load audit logs.");
      }
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      console.error("Error loading audit logs:", err);
      setError(err.message || "Could not retrieve audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      fetchLogs();
    }
  }, [isExpanded]);

  // Auto-refresh every 15 seconds if expanded
  useEffect(() => {
    if (!isExpanded) return;
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, [isExpanded]);

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAction.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("/api/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          actor: formActor,
          action: formAction.trim(),
          category: formCategory,
          details: formDetails.trim()
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to submit log entry.");
      }

      setFormAction("");
      setFormDetails("");
      setSuccessMsg("Audit log recorded successfully!");
      fetchLogs();
      
      // Auto-hide success message
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to record audit log.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter logs locally
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "All" || log.category === categoryFilter;
    const matchesActor = actorFilter === "All" || log.actor === actorFilter;

    return matchesSearch && matchesCategory && matchesActor;
  });

  const getActorBadgeStyles = (actor: string) => {
    const name = actor.toLowerCase();
    if (name === "gemini") {
      return "bg-purple-950/40 text-purple-300 border-purple-800/40";
    }
    if (name === "anubhav") {
      return "bg-amber-950/40 text-amber-300 border-amber-800/40";
    }
    if (name === "daksh") {
      return "bg-blue-950/40 text-blue-300 border-blue-800/40";
    }
    return "bg-zinc-800/60 text-zinc-300 border-zinc-700/50";
  };

  const getCategoryBadgeStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === "transcription") return "bg-emerald-950/40 text-emerald-300 border-emerald-900/50";
    if (cat === "polishing") return "bg-indigo-950/40 text-indigo-300 border-indigo-900/50";
    if (cat === "chatbot" || cat === "chat") return "bg-cyan-950/40 text-cyan-300 border-cyan-900/50";
    if (cat === "manual entry" || cat === "manual") return "bg-orange-950/40 text-orange-300 border-orange-900/50";
    return "bg-zinc-800 text-zinc-300 border-zinc-700";
  };

  return (
    <div className="w-full bg-zinc-950/90 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl mb-12">
      {/* Footer Log Header (Interactive toggle) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-zinc-900/40 transition-colors cursor-pointer text-left focus:outline-none"
        id="audit-logs-toggle-btn"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500 animate-pulse">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-100 tracking-wide uppercase">System Audit & Audio Logs</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                Admin Panel
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Secure work registry for Gemini, Anubhav, and Daksh. Log entries automatically and manually.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {logs.length > 0 && (
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 font-medium">
              {logs.length} entries
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </div>
      </button>

      {/* Expanded Log Section */}
      {isExpanded && (
        <div className="border-t border-zinc-900/80 p-6 bg-zinc-950">
          
          {/* Action Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-zinc-700 placeholder-zinc-500 font-mono"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer pr-1 font-mono"
                >
                  <option value="All">All Categories</option>
                  <option value="Transcription">Transcription</option>
                  <option value="Polishing">Polishing</option>
                  <option value="Chatbot">Chatbot</option>
                  <option value="Manual Entry">Manual Entry</option>
                </select>
              </div>

              {/* Actor Filter */}
              <div className="flex items-center gap-1.5 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Worker:</span>
                <select
                  value={actorFilter}
                  onChange={(e) => setActorFilter(e.target.value)}
                  className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer pr-1 font-mono"
                >
                  <option value="All">All Workers</option>
                  <option value="Gemini">Gemini</option>
                  <option value="Anubhav">Anubhav</option>
                  <option value="Daksh">Daksh</option>
                </select>
              </div>
            </div>

            {/* Manual Entry Toggle & Refresh buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={fetchLogs}
                disabled={loading}
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors disabled:opacity-50 cursor-pointer"
                title="Refresh Logs"
                aria-label="Refresh Logs"
              >
                <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-500" : ""}`} />
              </button>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800/80 text-zinc-200 hover:text-white rounded-lg text-xs border border-zinc-800 hover:border-zinc-700 transition-colors font-mono cursor-pointer"
                id="manual-log-entry-btn"
              >
                <Plus className="w-3.5 h-3.5 text-amber-500" />
                {showAddForm ? "Hide Form" : "Add Log Entry"}
              </button>
            </div>
          </div>

          {/* Manual Entry Form */}
          {showAddForm && (
            <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-5 mb-6 animate-fadeIn">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-850 pb-2">
                <Briefcase className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">Create Manual Audit Entry</h4>
              </div>
              
              <form onSubmit={handleSubmitLog} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Actor */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1.5">Worker Name</label>
                  <select
                    value={formActor}
                    onChange={(e) => setFormActor(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 font-mono"
                  >
                    <option value="Anubhav">Anubhav</option>
                    <option value="Daksh">Daksh</option>
                    <option value="Gemini">Gemini</option>
                  </select>
                </div>

                {/* Category */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1.5">Work Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 font-mono"
                  >
                    <option value="Manual Entry">Manual Entry</option>
                    <option value="Transcription">Transcription</option>
                    <option value="Polishing">Polishing</option>
                    <option value="Chatbot">Chatbot</option>
                    <option value="System">System</option>
                  </select>
                </div>

                {/* Action */}
                <div className="md:col-span-6">
                  <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1.5">Action / Work Done</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Conducted system maintenance and configured custom spelling dictionary items."
                    value={formAction}
                    onChange={(e) => setFormAction(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 placeholder-zinc-600 font-mono"
                  />
                </div>

                {/* Details */}
                <div className="md:col-span-12">
                  <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1.5">Additional Details / Output (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Added 15 specialized technical terminology items for speech polishing accuracy."
                    value={formDetails}
                    onChange={(e) => setFormDetails(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 placeholder-zinc-600 font-mono resize-none"
                  />
                </div>

                {/* Submit Row */}
                <div className="md:col-span-12 flex items-center justify-between mt-1">
                  <span className="text-[10px] text-zinc-500 italic">
                    Logged in as: <strong className="text-zinc-400 font-mono">{user.email}</strong>
                  </span>
                  
                  <button
                    type="submit"
                    disabled={submitting || !formAction.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-semibold rounded-lg text-xs transition-all font-mono cursor-pointer"
                  >
                    {submitting ? "Saving..." : "Record Entry"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Messages Alerts */}
          {error && (
            <div className="bg-red-950/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl text-xs mb-4 flex items-center gap-2">
              <span>✕</span> {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 px-4 py-3 rounded-xl text-xs mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {successMsg}
            </div>
          )}

          {/* Audit Logs Feed Container */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden max-h-[350px] overflow-y-auto">
            {loading && logs.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-2 font-mono">
                <RotateCw className="w-6 h-6 animate-spin text-amber-500" />
                <span className="text-xs">Loading audit activity registry...</span>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-2 font-mono">
                <Terminal className="w-6 h-6 text-zinc-700" />
                <span className="text-xs">
                  {searchQuery || categoryFilter !== "All" || actorFilter !== "All"
                    ? "No logs match current filters."
                    : "No system audit records found. Try performing transcription, polishing, or chats!"}
                </span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse font-mono text-[11px]">
                <thead className="bg-zinc-900/40 text-zinc-500 uppercase tracking-wider sticky top-0 border-b border-zinc-900">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Timestamp</th>
                    <th className="px-4 py-3 font-semibold">Worker</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Action / Description</th>
                    <th className="px-4 py-3 font-semibold">Details / Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/65">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-900/20 transition-colors group">
                      {/* Timestamp */}
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-500" />
                          <span>{new Date(log.timestamp).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false
                          })}</span>
                        </div>
                      </td>

                      {/* Worker */}
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] border ${getActorBadgeStyles(log.actor)}`}>
                          {log.actor}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] border ${getCategoryBadgeStyles(log.category)}`}>
                          {log.category}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-zinc-200 font-sans text-xs min-w-[200px]">
                        {log.action}
                      </td>

                      {/* Details / Payload */}
                      <td className="px-4 py-3 text-zinc-500 font-mono text-[10px] max-w-[220px] truncate" title={log.details}>
                        {log.details || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer of panel */}
          <div className="flex items-center justify-between text-[10px] text-zinc-600 mt-4 font-mono">
            <span>Security context active</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Powered by Gemini & Silencly Core Core-Node
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
