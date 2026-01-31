
import React, { useState, useRef } from 'react';
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
      // Always create a new GoogleGenAI instance right before connecting for key freshness
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
              
              // CRITICAL: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput`
              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  media: {
                    data: encodeBase64(new Uint8Array(int16.buffer)),
                    // The supported audio MIME type is 'audio/pcm'.
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
              const frameCount = dataInt16.length;
              const buffer = outputCtx.createBuffer(1, frameCount, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;

              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              
              // The nextStartTime variable acts as a cursor to track the end of the audio playback queue.
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                try { source.stop(); } catch(e) {}
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => console.error('Live API Error:', e),
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'You are Mine, an elite conversational AI.',
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error('Failed to start session:', err);
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
    <div className="flex flex-col h-full bg-slate-900/40 items-center justify-center p-12">
      <div className={`w-64 h-64 rounded-full flex items-center justify-center transition-all duration-700 shadow-[0_0_100px_rgba(79,70,229,0.1)] ${isActive ? 'bg-indigo-600/20 scale-110' : 'bg-slate-800'}`}>
        <div className={`w-40 h-40 rounded-full flex items-center justify-center ${isActive ? 'bg-indigo-600 animate-pulse shadow-[0_0_50px_rgba(79,70,229,0.5)]' : 'bg-slate-700'}`}>
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>
      
      <div className="mt-12 text-center max-w-lg">
        <h2 className="text-4xl font-black italic tracking-tighter text-white mb-4 uppercase">{isActive ? 'Uplink Established' : 'Voice Terminal'}</h2>
        <p className="text-slate-500 font-bold text-sm tracking-wide mb-10">Real-time neural interaction with zero latency.</p>
        <button
          onClick={isActive ? stopSession : startSession}
          className={`px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
            isActive ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
          }`}
        >
          {isActive ? 'Disconnect Link' : 'Initialize Voice Link'}
        </button>
      </div>
    </div>
  );
};

export default VoiceInterface;
