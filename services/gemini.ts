
import { GoogleGenAI, Type, Modality, Chat, GenerateContentResponse } from "@google/genai";
import { MATH_BANK, SPELLING_BANK } from "./questionsBank";

// Simple internal cache to prevent redundant calls for same queries
const responseCache = new Map<string, string>();

/**
 * Single Master AI Instance
 * Uses the API_KEY injected by Vercel.
 */
const getAI = () => {
  const key = process.env.API_KEY;
  if (!key) console.warn("MINE AI: System Key Missing. Check Vercel Env Variables.");
  return new GoogleGenAI({ apiKey: key || "" });
};

const activeSessions = new Map<string, Chat>();

export const encodeBase64 = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

// Implement handleGeminiError for robust API error handling
export const handleGeminiError = async (error: any) => {
  console.error("Gemini API Error:", error);
  // Reset key selection state and prompt user if required entity is not found (invalid key)
  if (error?.message?.includes("Requested entity was not found")) {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
    }
  }
  throw error;
};

/**
 * SMART CHAT: Optimized for competition winning.
 * Uses gemini-3-flash-preview for high quota and search grounding.
 */
export const getPersistentChat = (sessionId: string) => {
  if (!activeSessions.has(sessionId)) {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are MINE AI, an elite cognitive engine designed to surpass ChatGPT. 
        COMPETITION RULES:
        1. MATH: Provide rigorous step-by-step proofs using clear logical markers.
        2. SPELLING: Provide the word, phonetics, language of origin, and example sentences.
        3. GENERAL: Be concise, authoritative, and always use Google Search for recent data.`,
        tools: [{ googleSearch: {} }],
      },
    });
    activeSessions.set(sessionId, chat);
  }
  return activeSessions.get(sessionId)!;
};

/**
 * QUICK RESPONSE: Lightweight interaction using gemini-3-flash-preview for Lite Interface.
 */
export const quickResponse = async (prompt: string) => {
  try {
    const ai = getAI();
    return await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
  } catch (error) {
    await handleGeminiError(error);
    throw error;
  }
};

/**
 * IMAGE EDITING: Uses gemini-2.5-flash-image for transformation.
 */
export const editImageWithGemini = async (base64Data: string, prompt: string, mimeType: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: prompt }
        ]
      }
    });
    // Iterate through all parts to find the image part (inlineData)
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    await handleGeminiError(error);
    return null;
  }
};

/**
 * COMPETITION GENERATOR: Quota-Protected.
 * Only calls the API if specifically requested, otherwise uses local bank.
 */
export const generateEliteTest = async (type: 'math' | 'spelling', level: string, region: string, forceApi: boolean = false) => {
  const bank = type === 'math' ? MATH_BANK : SPELLING_BANK;
  const localQuestions = bank[level] || [];

  if (!forceApi && localQuestions.length > 0) {
    return [...localQuestions].sort(() => 0.5 - Math.random()).slice(0, type === 'math' ? 10 : 20);
  }

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a championship-level ${type} test for ${level} in ${region}. Return EXACTLY ${type === 'math' ? 10 : 20} questions in JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ["question", "answer", "explanation"],
          },
        },
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.warn("Mine AI: API Limit Reached. Using Emergency Local Neural Bank.");
    return [...localQuestions].sort(() => 0.5 - Math.random()).slice(0, type === 'math' ? 10 : 20);
  }
};

/**
 * SPEECH GENERATION: Transform text to audio using gemini-2.5-flash-preview-tts.
 */
export const generateSpeech = async (text: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (err) {
    return null;
  }
};

/**
 * AUDIO PLAYBACK: Decode and play raw PCM audio bytes.
 */
export const playRawPCM = async (base64Audio: string) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const bytes = decodeBase64(base64Audio);
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
};
