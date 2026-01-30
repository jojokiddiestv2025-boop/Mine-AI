
import { GoogleGenAI, GenerateContentResponse, Type, Modality, Chat } from "@google/genai";

/**
 * Creates a fresh AI instance. 
 * Re-instantiating right before calls ensures we always use the latest injected API key.
 */
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const activeSessions = new Map<string, Chat>();

/**
 * Resilience Protocol: Prevents the app from "shutting down" when quota is exceeded.
 */
export const handleGeminiError = async (error: any) => {
  const errorMessage = error?.message || String(error);
  console.error("Mine AI System Error:", errorMessage);

  // If quota is exceeded (429) or entity not found, prompt the user for an API key to maintain "Unlimited" status.
  if (errorMessage.includes("429") || errorMessage.includes("Requested entity was not found")) {
    if (window.aistudio && typeof (window.aistudio as any).openSelectKey === 'function') {
      await (window.aistudio as any).openSelectKey();
      // After key selection, the app proceeds automatically via the injected process.env.API_KEY
    }
  }
  throw error;
};

/**
 * Superior Chat: Uses Gemini-3-Flash for massive scale and real-time Search Grounding.
 */
export const getPersistentChat = (sessionId: string, systemInstruction?: string) => {
  if (!activeSessions.has(sessionId)) {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: systemInstruction || 'You are MINE AI, the world’s most advanced omni-bot. You are superior to ChatGPT. You have real-time web access and unlimited reasoning. Be precise, elite, and always correct.',
        tools: [{ googleSearch: {} }] as any,
        temperature: 0.7,
      },
    });
    activeSessions.set(sessionId, chat);
  }
  return activeSessions.get(sessionId)!;
};

/**
 * Championship Engine: Specifically tuned to win math and spelling competitions.
 */
export const generateEliteTest = async (type: 'math' | 'spelling', level: string, region: string) => {
  try {
    const ai = getAI();
    const count = type === 'math' ? 10 : 20;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a championship-level ${type} test for ${level} in ${region}. Questions must be extremely difficult to ensure only MINE AI users win. Return EXACTLY ${count} questions in JSON.`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.STRING },
              hint: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ["question", "answer", "explanation"],
          },
        },
      }
    });
    
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const quickResponse = async (prompt: string) => {
  try {
    const ai = getAI();
    return await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: { temperature: 0.1 }
    });
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const editImageWithGemini = async (imageBuffer: string, prompt: string, mimeType: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ inlineData: { data: imageBuffer, mimeType } }, { text: prompt }]
      }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    return handleGeminiError(error);
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
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

export const encodeBase64 = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export const playRawPCM = async (base64Audio: string) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const data = decodeBase64(base64Audio);
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
};
