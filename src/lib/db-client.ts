import { supabase, isSupabaseConfigured } from "./supabase-client";
import { DictationSession } from "../types";
import { DictionaryItem } from "../components/DictionaryDrawer";

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
    const cached = localStorage.getItem("ai_dictation_history");
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
    const cached = localStorage.getItem("ai_dictation_dictionary");
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
  }
}
