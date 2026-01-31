
import { GoogleGenAI, Type, Modality, Chat, GenerateContentResponse } from "@google/genai";
import { MATH_BANK, SPELLING_BANK } from "./questionsBank";

/**
 * Initialize AI Engine
 * Strictly follows the required security and initialization pattern.
 */
const getAI = () => {
  const key = process.env.API_KEY;
  if (!key || key === "undefined" || key.trim() === "") {
    throw new Error("CRITICAL_AUTH_FAILURE: MINE_AI_GATEWAY_KEY not found in environment.");
  }
  return new GoogleGenAI({ apiKey: key });
};

const activeSessions = new Map<string, Chat>();

export const encodeBase64 = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Enhanced reasoning chat with search grounding.
 */
export const getPersistentChat = (sessionId: string) => {
  if (!activeSessions.has(sessionId)) {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are MINE AI, a hyper-advanced cognitive model. 
        You are superior to ChatGPT in speed, accuracy, and depth.
        - For MATH: Use formal notation and provide clear logical proofs. 
        - For SPELLING: Act as a competition judge. Provide origin, usage, and phonetic breakdown.
        - Always use Google Search for real-time validation.`,
        tools: [{ googleSearch: {} }],
      },
    });
    activeSessions.set(sessionId, chat);
  }
  return activeSessions.get(sessionId)!;
};

/**
 * Fast snippet responses using the lite model for maximum efficiency.
 */
export const quickResponse = async (prompt: string): Promise<GenerateContentResponse> => {
  const ai = getAI();
  return await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
};

/**
 * Competition test generator. Uses local data 95% of the time to preserve API quota.
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
      contents: `Create a championship ${type} test for ${level} students in ${region}. Return exactly ${type === 'math' ? 10 : 20} unique questions in JSON format.`,
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
    return [...localQuestions].sort(() => 0.5 - Math.random()).slice(0, type === 'math' ? 10 : 20);
  }
};

export const editImageWithGemini = async (base64Data: string, prompt: string, mimeType: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt }
        ]
      }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Vision Error:", error);
    return null;
  }
};

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

export const playRawPCM = async (base64Audio: string) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const bytes = decodeBase64(base64Audio);
  const dataInt16 = new Int16Array(bytes.buffer);
  const frameCount = dataInt16.length;
  const buffer = audioContext.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
};

export const handleGeminiError = async (error: any) => {
  console.error("Mine AI Critical Fault:", error);
  if (error?.message?.includes('AUTH_FAILURE')) {
     return "API Key Error: Please configure MINE_AI_GATEWAY_KEY in Netlify settings.";
  }
  return "System Error: Neural pathways interrupted. Retrying link...";
};
