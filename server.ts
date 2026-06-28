import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./src/lib/auth";

const app = express();
const PORT = 3000;

// Initialize Gemini Client safely
// Ensure 'User-Agent' header is set to 'aistudio-build' for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Better Auth handler mounted before express.json middleware
app.all("/api/auth/*", toNodeHandler(auth));

// JSON body parsing with large limit for base64 audio payload
app.use(express.json({ limit: "50mb" }));

const HISTORY_FILE = path.join(process.cwd(), "history.json");

// Helper to read history sessions safely
function readHistory(): any[] {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to read history file, using empty default", error);
  }
  return [];
}

// Helper to write history sessions safely
function writeHistory(history: any[]) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write history file", error);
  }
}

// API Endpoints for Dictation History
app.get("/api/history", (req, res) => {
  try {
    const history = readHistory();
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load history." });
  }
});

app.post("/api/history", (req, res) => {
  try {
    const { id, title, rawText, polishedText, durationSeconds, createdAt } = req.body;
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const history = readHistory();
    const existingIndex = history.findIndex(item => item.id === id);
    const newSession = {
      id,
      createdAt: createdAt || new Date().toISOString(),
      title: title || "Untitled Dictation",
      rawText: rawText || "",
      polishedText: polishedText || "",
      durationSeconds: durationSeconds || 0
    };

    if (existingIndex > -1) {
      history[existingIndex] = { ...history[existingIndex], ...newSession };
    } else {
      history.unshift(newSession);
    }

    writeHistory(history);
    res.json(newSession);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save history." });
  }
});

app.delete("/api/history/:id", (req, res) => {
  try {
    const { id } = req.params;
    let history = readHistory();
    history = history.filter(item => item.id !== id);
    writeHistory(history);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete history item." });
  }
});

app.delete("/api/history", (req, res) => {
  try {
    writeHistory([]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to clear history." });
  }
});

// Helper and Endpoints for Custom Dictionary
const DICTIONARY_FILE = path.join(process.cwd(), "dictionary.json");

function readDictionary(): any[] {
  try {
    if (fs.existsSync(DICTIONARY_FILE)) {
      const data = fs.readFileSync(DICTIONARY_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to read dictionary file, using empty default", error);
  }
  return [];
}

function writeDictionary(dict: any[]) {
  try {
    fs.writeFileSync(DICTIONARY_FILE, JSON.stringify(dict, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write dictionary file", error);
  }
}

app.get("/api/dictionary", (req, res) => {
  try {
    const dict = readDictionary();
    res.json(dict);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load dictionary." });
  }
});

app.post("/api/dictionary", (req, res) => {
  try {
    const { id, word, replaceWith } = req.body;
    if (!word) {
      return res.status(400).json({ error: "word is required" });
    }

    const dict = readDictionary();
    const itemId = id || Math.random().toString(36).substring(2, 9);
    
    const newItem = {
      id: itemId,
      word,
      replaceWith
    };

    const existingIndex = dict.findIndex(item => item.id === itemId);
    if (existingIndex > -1) {
      dict[existingIndex] = newItem;
    } else {
      dict.push(newItem);
    }

    writeDictionary(dict);
    res.json(newItem);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save dictionary item." });
  }
});

app.delete("/api/dictionary/:id", (req, res) => {
  try {
    const { id } = req.params;
    let dict = readDictionary();
    dict = dict.filter(item => item.id !== id);
    writeDictionary(dict);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete dictionary item." });
  }
});

// AI Text Polishing Endpoint using Groq Llama 3.1 8B Instant
app.post("/api/polish", async (req, res) => {
  try {
    const { text, tone = "polished" } = req.body;
    if (!text || text.trim() === "") {
      return res.json({ polishedText: "" });
    }

    const apiKey = process.env.GROQ_API_KEY || "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";
    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY environment variable is missing on the server. Please check your Secrets settings." });
    }

    let toneGuidance = "";
    if (tone === "polished") {
      toneGuidance = "Format the text into a polished draft that balances standard professional structure and grammar with the user's natural conversational voice. Keep it feeling human, light, and coherent while correcting any grammatical issues, run-on sentences, or awkward pauses.";
    } else if (tone === "academic") {
      toneGuidance = "Format the text in an analytical, rigorous, and highly structured academic tone. Use sophisticated phrasing and clear logical sections.";
    } else if (tone === "bulletpoints") {
      toneGuidance = "Summarize the text completely into a polished bullet-point outline. Highlight action items, key concepts, and summaries in a clean, readable layout.";
    } else if (tone === "email") {
      toneGuidance = "Draft a beautifully formatted email out of the text. Include a catchy subject line, clear spacing, formal greeting, friendly sign-off, and a logical body layout.";
    }

    const dict = readDictionary();
    let dictionaryGuidance = "";
    if (dict.length > 0) {
      dictionaryGuidance = `\n\n## Custom Vocabulary & Terminology (CRITICAL Corrective Dictionary)
The user has specified a custom dictionary with exact preferred spellings, casing, and jargon. If you find phonetic approximations, misspelt variations, or alternative casings of these words/phrases in the raw text, you MUST correct them to match the exact term specified below:
${dict.map((item: any) => `- Raw/approx: "${item.word}" -> change to exact output spelling/casing: "${item.replaceWith || item.word}"`).join("\n")}`;
    }

    const systemInstruction = `You are a professional writing assistant that polishes raw dictated speech into clean, readable text.

The user speaks naturally — they pause, repeat themselves, say "um", "uh", "like", trail off, self-correct mid-sentence, or speak in fragments. Your job is to transform that raw transcript into polished written text that sounds like the user *meant* to write it this way.

## Rules

**Always:**
- Fix grammar, punctuation, and sentence structure
- Remove filler words: "um", "uh", "like", "you know", "basically", "literally", "sort of", "kind of"
- Remove false starts and self-corrections (keep only the final intended version)
- Merge run-on fragments into proper sentences
- Infer and preserve the original tone — casual stays casual, formal stays formal
- Keep the user's vocabulary and voice intact. Don't upgrade their word choice unless it's clearly wrong.

**Never:**
- Add information, details, sentences, or facts that the user DID NOT say.
- Extrapolate, assume, or fabricate any background stories or statements.
- Over-formalize casual notes (if they're speaking casually, keep it casual)
- Shorten or summarize — output should be a polished version, not a condensed one, unless the "bulletpoints" style is explicitly chosen.
- Add extra commentary, explanations, or suggestions unless asked

## Tone Style Guidelines
${toneGuidance}
${dictionaryGuidance}

## Output
Return ONLY the polished text. No preamble, no notes, no "Here is your polished text:" — just the result.

## Examples

Input: "so um I wanted to say that uh the meeting is like moved to Thursday and uh yeah everyone needs to know"
Output: "The meeting has been moved to Thursday. Please make sure everyone is informed."

Input: "remind me to uh — no wait — remind me to buy groceries and also milk and eggs specifically"
Output: "Remind me to buy groceries — specifically milk and eggs"`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: text }
        ],
        temperature: 0.15,
        max_tokens: 1024,
        top_p: 1.0
      })
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      throw new Error(`Groq API request failed: ${errText}`);
    }

    const groqData: any = await groqResponse.json();
    const polishedText = groqData.choices?.[0]?.message?.content || "";
    res.json({ polishedText });
  } catch (err: any) {
    console.error("Llama polishing failed:", err);
    res.status(500).json({ error: err.message || "Failed to polish text using Llama 3.1 8B." });
  }
});

// AI Direct Audio Transcription Endpoint using AssemblyAI Universal 3.5 Pro
app.post("/api/transcribe", async (req, res) => {
  try {
    const { audio, mimeType } = req.body;
    if (!audio) {
      return res.status(400).json({ error: "Audio base64 data is required." });
    }

    const apiKey = process.env.ASSEMBLYAI_API_KEY || "8c7d46c2a0ca4c3bacf169ca9d4b0f79";
    if (!apiKey) {
      return res.status(500).json({ error: "ASSEMBLYAI_API_KEY environment variable is missing on the server. Please check your Secrets settings." });
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, "base64");

    // 1. Upload audio to AssemblyAI
    const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/octet-stream"
      },
      body: audioBuffer
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`AssemblyAI upload failed: ${errText}`);
    }

    const uploadData: any = await uploadRes.json();
    const audioUrl = uploadData.upload_url;

    if (!audioUrl) {
      throw new Error("AssemblyAI did not return an upload URL.");
    }

    // Prepare AssemblyAI Custom Word Boost from custom dictionary
    const dict = readDictionary();
    const wordBoost = dict.map((item: any) => item.word.trim()).filter(Boolean);

    const transcriptRequestBody: any = {
      audio_url: audioUrl,
      speech_models: ["universal-3-pro", "universal-2"]
    };

    // If custom vocabulary words are present, apply them to boost accuracy
    if (wordBoost.length > 0) {
      transcriptRequestBody.word_boost = wordBoost;
      transcriptRequestBody.boost_param = "high";
    }

    // 2. Request transcription using Universal 3.5 Pro (best model)
    const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(transcriptRequestBody)
    });

    if (!transcriptRes.ok) {
      const errText = await transcriptRes.text();
      throw new Error(`AssemblyAI transcript creation failed: ${errText}`);
    }

    const transcriptData: any = await transcriptRes.json();
    const transcriptId = transcriptData.id;

    if (!transcriptId) {
      throw new Error("AssemblyAI did not return a transcript ID.");
    }

    // 3. Poll for result status
    let text = "";
    let status = "queued";
    const maxAttempts = 40;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Wait 1 second between polls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          "Authorization": apiKey
        }
      });

      if (!pollRes.ok) {
        const errText = await pollRes.text();
        throw new Error(`AssemblyAI status poll failed: ${errText}`);
      }

      const pollData: any = await pollRes.json();
      status = pollData.status;

      if (status === "completed") {
        text = pollData.text || "";
        break;
      } else if (status === "error") {
        throw new Error(pollData.error || "AssemblyAI transcription encountered an error.");
      }
    }

    if (status !== "completed") {
      throw new Error("AssemblyAI transcription timed out. Please try again.");
    }

    res.json({ text });
  } catch (err: any) {
    console.error("AssemblyAI transcription failed:", err);
    res.status(500).json({ error: err.message || "Failed to transcribe audio using AssemblyAI Universal 3.5 Pro." });
  }
});

// ==========================================
// BETTER AUTH PERSISTENCE AND ROUTING SERVICE
// ==========================================

const USERS_FILE = path.join(process.cwd(), "users.json");
const SESSIONS_FILE = path.join(process.cwd(), "sessions.json");

function readUsers(): any[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read users", err);
  }
  return [];
}

function writeUsers(users: any[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write users", err);
  }
}

function readSessions(): any[] {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      return JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read sessions", err);
  }
  return [];
}

function writeSessions(sessions: any[]) {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write sessions", err);
  }
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const value = parts.slice(1).join("=").trim();
      cookies[name] = value;
    }
  });
  return cookies;
}

// 1. GET Current session
app.get("/api/auth/session", (req, res) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.session_token;
    if (!token) {
      return res.json({ session: null });
    }

    const sessions = readSessions();
    const session = sessions.find((s) => s.token === token);
    
    if (!session || new Date(session.expiresAt) < new Date()) {
      return res.json({ session: null });
    }

    const users = readUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) {
      return res.json({ session: null });
    }

    res.json({
      session: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: user.provider
        },
        token: session.token,
        expiresAt: session.expiresAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load session." });
  }
});

// 2. POST Social Login (Callback simulated auth hook)
app.post("/api/auth/social-login", (req, res) => {
  try {
    const { provider, email, name, image } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const users = readUsers();
    let user = users.find((u) => u.email === email);

    if (!user) {
      user = {
        id: Math.random().toString(36).substring(2, 11),
        email,
        name: name || email.split("@")[0],
        image: image || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        provider: provider || "google",
        createdAt: new Date().toISOString()
      };
      users.push(user);
      writeUsers(users);
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    const sessions = readSessions();
    sessions.push({
      token,
      userId: user.id,
      expiresAt
    });
    writeSessions(sessions);

    // Set Cookie with sameSite: none; secure: true for sandboxed iframe compatibility
    res.setHeader(
      "Set-Cookie",
      `session_token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=2592000`
    );

    res.json({
      session: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: user.provider
        },
        token,
        expiresAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to login socially." });
  }
});

// 3. POST Manual Email SignUp
app.post("/api/auth/sign-up", (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields (email, password, name)" });
    }

    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const user = {
      id: Math.random().toString(36).substring(2, 11),
      email,
      name,
      password, // store basic password simply for demonstration
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      provider: "email",
      createdAt: new Date().toISOString()
    };
    users.push(user);
    writeUsers(users);

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const sessions = readSessions();
    sessions.push({
      token,
      userId: user.id,
      expiresAt
    });
    writeSessions(sessions);

    res.setHeader(
      "Set-Cookie",
      `session_token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=2592000`
    );

    res.json({
      session: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: "email"
        },
        token,
        expiresAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to register user." });
  }
});

// 4. POST Manual Email SignIn
app.post("/api/auth/sign-in", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const users = readUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const sessions = readSessions();
    sessions.push({
      token,
      userId: user.id,
      expiresAt
    });
    writeSessions(sessions);

    res.setHeader(
      "Set-Cookie",
      `session_token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=2592000`
    );

    res.json({
      session: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: user.provider || "email"
        },
        token,
        expiresAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to log in." });
  }
});

// 5. POST SignOut
app.post("/api/auth/sign-out", (req, res) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.session_token;
    
    if (token) {
      let sessions = readSessions();
      sessions = sessions.filter((s) => s.token !== token);
      writeSessions(sessions);
    }

    res.setHeader(
      "Set-Cookie",
      "session_token=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0"
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to sign out." });
  }
});

// 6. Serves beautiful interactive simulated oauth login popup
app.get("/auth/popup", (req, res) => {
  const provider = (req.query.provider as string || "google").toLowerCase();
  
  let providerName = "Google";
  let brandColor = "#1a1a1a";
  let fontAccent = "#3b82f6";
  let iconHtml = "";

  if (provider === "github") {
    providerName = "GitHub";
    brandColor = "#0f1115";
    fontAccent = "#f4f4f5";
    iconHtml = `<svg class="w-10 h-10 text-white fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;
  } else if (provider === "x") {
    providerName = "X (Twitter)";
    brandColor = "#000000";
    fontAccent = "#e4e4e7";
    iconHtml = `<svg class="w-10 h-10 text-white fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
  } else {
    // google
    providerName = "Google";
    brandColor = "#1a1a1a";
    fontAccent = "#4285f4";
    iconHtml = `<svg class="w-10 h-10" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`;
  }

  // Pre-generate nice user names/emails for authentic demo
  const sampleUsers: Record<string, { name: string; email: string }> = {
    google: { name: "Anubhav Sapkota", email: "gmanubhavsapkota@gmail.com" },
    github: { name: "anubhav-s", email: "anubhav.github@outlook.com" },
    x: { name: "anubhav_sap", email: "anubhav.x@gmail.com" }
  };

  const selectedUser = sampleUsers[provider] || sampleUsers.google;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Authorize Scira with ${providerName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Geist', sans-serif;
          background-color: #09090b;
        }
      </style>
    </head>
    <body class="flex flex-col items-center justify-center min-h-screen p-6 text-zinc-100 select-none">
      <div class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
        <!-- Logo Header -->
        <div class="flex items-center gap-1.5 mb-8">
          <img src="https://i.ibb.co/Q742H44R/gemini-watermark-removed.png" alt="Silencly Logo" class="w-6 h-6 object-contain" />
          <span class="text-lg font-bold tracking-tight text-white">Silencly</span>
        </div>

        <!-- Social Logo -->
        <div class="w-20 h-20 rounded-2xl flex items-center justify-center bg-zinc-950 border border-zinc-800 shadow-inner mb-6">
          ${iconHtml}
        </div>

        <!-- Texts -->
        <h2 class="text-xl font-semibold text-white mb-2 text-center">Authorize Silencly</h2>
        <p class="text-xs text-zinc-400 text-center mb-6 leading-relaxed max-w-[280px]">
          By authorizing, <span class="text-zinc-200">Silencly</span> will access your basic profile details as <strong>${selectedUser.name}</strong>.
        </p>

        <!-- User Badge -->
        <div class="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-xl px-4 py-3 flex items-center gap-3 mb-8">
          <div class="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700/55 flex items-center justify-center font-bold text-zinc-300 text-sm animate-pulse">
            ${selectedUser.name.charAt(0)}
          </div>
          <div class="text-left overflow-hidden">
            <div class="text-xs font-semibold text-zinc-200 truncate">${selectedUser.name}</div>
            <div class="text-[10px] text-zinc-500 truncate">${selectedUser.email}</div>
          </div>
          <div class="ml-auto text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md text-zinc-400">
            ${providerName}
          </div>
        </div>

        <!-- Action Button -->
        <button
          id="auth-btn"
          class="w-full bg-zinc-800 hover:bg-zinc-750 text-white font-medium text-sm py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-zinc-950/20 active:scale-[0.98] cursor-pointer"
        >
          Authorize & Continue
        </button>

        <button
          id="cancel-btn"
          class="w-full text-zinc-500 hover:text-zinc-300 text-xs font-medium py-2.5 mt-2 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <script>
        document.getElementById('auth-btn').addEventListener('click', () => {
          // Send success message with user data back to parent window
          const userData = {
            provider: "${provider}",
            email: "${selectedUser.email}",
            name: "${selectedUser.name}",
            image: "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent("${selectedUser.name}")
          };

          if (window.opener) {
            window.opener.postMessage({
              type: 'OAUTH_AUTH_SUCCESS',
              user: userData
            }, '*');
            window.close();
          } else {
            alert("No opener found. Please click from Scira application.");
          }
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
          window.close();
        });
      </script>
    </body>
    </html>
  `);
});

// Full-Stack Dev Server & Ingress Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode uses Vite Dev Server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    // Production mode serves precompiled static assets from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files server loaded.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Dictation Server running on http://localhost:${PORT}`);
  });
}

startServer();
