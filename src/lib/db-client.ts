import { supabase, isSupabaseConfigured } from "./supabase-client";
import { DictationSession } from "../types";
import { DictionaryItem } from "../components/DictionaryDrawer";
import { safeStorage } from "./safe-storage";

// Fetch history
export async function dbFetchHistory(userId: string): Promise<DictationSession[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("history")
      .select("*")
      .eq("userId", userId);
      
    if (error) {
      console.error("Supabase fetchHistory error, fallback to local storage:", error);
      throw error;
    }
    // Sort descending by createdAt
    const sorted = (data || []) as DictationSession[];
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted;
  } else {
    try {
      const res = await fetch(`/api/history?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        // Sort descending by createdAt
        const sorted = (data || []) as DictationSession[];
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // Synchronize local cache
        safeStorage.setItem("ai_dictation_history", JSON.stringify(sorted));
        return sorted;
      }
    } catch (err) {
      console.error("Server fetchHistory error, fallback to local storage:", err);
    }
    const cached = safeStorage.getItem("ai_dictation_history");
    return cached ? JSON.parse(cached) : [];
  }
}

// Fetch dictionary
export async function dbFetchDictionary(userId: string): Promise<DictionaryItem[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("dictionary")
      .select("*")
      .eq("userId", userId);
      
    if (error) {
      console.error("Supabase fetchDictionary error, fallback to local storage:", error);
      throw error;
    }
    return (data || []) as DictionaryItem[];
  } else {
    try {
      const res = await fetch(`/api/dictionary?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        safeStorage.setItem("ai_dictation_dictionary", JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.error("Server fetchDictionary error, fallback to local storage:", err);
    }
    const cached = safeStorage.getItem("ai_dictation_dictionary");
    return cached ? JSON.parse(cached) : [];
  }
}

// Save dictionary item
export async function dbSaveDictionaryItem(userId: string, item: DictionaryItem): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from("dictionary")
      .upsert({ ...item, userId });
      
    if (error) {
      console.error("Supabase saveDictionaryItem error:", error);
      throw error;
    }
  } else {
    try {
      const res = await fetch("/api/dictionary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...item, userId })
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
    } catch (err) {
      console.error("Server saveDictionaryItem error:", err);
    }
  }
}

// Delete dictionary item
export async function dbDeleteDictionaryItem(userId: string, itemId: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from("dictionary")
      .delete()
      .eq("id", itemId)
      .eq("userId", userId);
      
    if (error) {
      console.error("Supabase deleteDictionaryItem error:", error);
      throw error;
    }
  } else {
    try {
      const res = await fetch(`/api/dictionary/${itemId}?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
    } catch (err) {
      console.error("Server deleteDictionaryItem error:", err);
    }
  }
}

// Save history item
export async function dbSaveHistoryItem(userId: string, item: DictationSession): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from("history")
      .upsert({ ...item, userId });
      
    if (error) {
      console.error("Supabase saveHistoryItem error:", error);
      throw error;
    }
  } else {
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...item, userId })
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
    } catch (err) {
      console.error("Server saveHistoryItem error:", err);
    }
  }
}

// Delete history item
export async function dbDeleteHistoryItem(userId: string, itemId: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from("history")
      .delete()
      .eq("id", itemId)
      .eq("userId", userId);
      
    if (error) {
      console.error("Supabase deleteHistoryItem error:", error);
      throw error;
    }
  } else {
    try {
      const res = await fetch(`/api/history/${itemId}?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
    } catch (err) {
      console.error("Server deleteHistoryItem error:", err);
    }
  }
}

// Clear all history for user
export async function dbClearHistory(userId: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from("history")
      .delete()
      .eq("userId", userId);
      
    if (error) {
      console.error("Supabase clearHistory error:", error);
      throw error;
    }
  } else {
    try {
      const res = await fetch(`/api/history?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
    } catch (err) {
      console.error("Server clearHistory error:", err);
    }
  }
}
