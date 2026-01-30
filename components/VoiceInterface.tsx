
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decodeBase64, encodeBase64 } from '../services/gemini';

const VoiceInterface: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{role: string, text: string}[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startSession = async () => {
    try {
      // Initialize GoogleGenAI with process.env.API_KEY right before making an API call to ensure it always uses the latest key.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  media: {
                    data: encodeBase64(new Uint8Array(int16.buffer)),
                    mimeType: 'audio/pcm;rate=16000',
                  }
                });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text || '';
              setTranscriptions(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'AI') {
                   return [...prev.slice(0, -1), { role: 'AI', text: last.text + text }];
                }
                return [...prev, { role: 'AI', text }];
              });
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text || '';
              setTranscriptions(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'You') {
                   return [...prev.slice(0, -1), { role: 'You', text: last.text + text }];
                }
                return [...prev, { role: 'You', text }];
              });
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const data = decodeBase64(base64Audio);
              const dataInt16 = new Int16Array(data.buffer);
              const buffer = outputCtx.createBuffer(1, dataInt16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => {
            console.error('Live API Error:', e);
            if (e?.message?.includes("Requested entity was not found")) {
              if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
                window.aistudio.openSelectKey();
              }
            }
          },
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'You are a friendly, natural voice assistant named Mine. Be concise and conversational.',
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error('Failed to start session:', err);
      if (err?.message?.includes("Requested entity was not found")) {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
          await window.aistudio.openSelectKey();
        }
      }
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsActive(false);
    sessionRef.current = null;
    nextStartTimeRef.current = 0;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
          isActive ? 'bg-indigo-600 animate-pulse animate-glow' : 'bg-slate-800'
        }`}>
          <svg className={`w-20 h-20 text-white ${isActive ? 'animate-bounce' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        
        <div className="mt-12 text-center max-w-lg">
          <h2 className="text-3xl font-bold mb-4">{isActive ? 'I am listening...' : 'Ready to talk?'}</h2>
          <p className="text-slate-400">
            Experience the future of conversational AI. Real-time, zero-latency, and natural voices.
          </p>
          <button
            onClick={isActive ? stopSession : startSession}
            className={`mt-8 px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl ${
              isActive ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
            }`}
          >
            {isActive ? 'End Conversation' : 'Start Talking'}
          </button>
        </div>

        {isActive && (
          <div className="absolute bottom-10 left-10 right-10 max-h-40 overflow-y-auto bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700 custom-scrollbar">
            {transcriptions.slice(-3).map((t, i) => (
              <p key={i} className="text-sm mb-1">
                <span className={`font-bold ${t.role === 'You' ? 'text-indigo-400' : 'text-emerald-400'}`}>{t.role}: </span>
                <span className="text-slate-200">{t.text}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInterface;
