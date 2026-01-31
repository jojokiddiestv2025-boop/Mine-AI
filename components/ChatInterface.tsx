
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { auth } from '../services/firebase';
import { getPersistentChat, generateSpeech, playRawPCM, handleGeminiError } from '../services/gemini';
import { Message } from '../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'MINE AI status: ONLINE. All neural pathways synchronized. I am ready for advanced logic, vision tasks, or high-stakes competition support. What is our objective?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{ data: string, mimeType: string, url: string, name: string } | null>(null);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = auth.currentUser;
  const sessionId = useRef(`session-${Date.now()}`);

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setAttachment({ 
          data: base64, 
          mimeType: file.type || 'image/jpeg', 
          url: reader.result as string,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;

    const isImage = attachment?.mimeType.startsWith('image/');
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || (attachment ? `Analyze visual data: ${attachment.name}` : ""),
      timestamp: Date.now(),
      imageUrl: isImage ? attachment?.url : undefined,
    };

    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input;
    const currentAttachment = attachment;
    
    setInput('');
    setAttachment(null);
    setGroundingSources([]);
    setIsLoading(true);

    try {
      let responseText = "";
      let sources: any[] = [];

      if (currentAttachment) {
        // Multi-modal analysis. Create AI instance right before call for key freshness.
        // Always use new GoogleGenAI({apiKey: process.env.API_KEY});
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { inlineData: { data: currentAttachment.data, mimeType: currentAttachment.mimeType } },
              { text: currentInput || "Analyze this image in detail." }
            ]
          }
        });
        // result.text is a property
        responseText = result.text || "";
      } else {
        // Standard chat with search tools
        const chat = getPersistentChat(sessionId.current);
        const result = await chat.sendMessage({ message: currentInput });
        // result.text is a property
        responseText = result.text || "";
        sources = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      setGroundingSources(sources);
    } catch (error) {
      handleGeminiError(error).catch(() => {});
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = async (text: string, id: string) => {
    setIsSpeaking(id);
    try {
      const audioData = await generateSpeech(text);
      if (audioData) await playRawPCM(audioData);
    } catch (err) {
      console.error("Speech Synthesis Failed", err);
    } finally {
      setIsSpeaking(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950/20">
      <header className="sticky top-0 p-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></div>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Cognitive Terminal</h2>
        </div>
      </header>

      <div className="flex-1 p-6 md:p-12 space-y-10 max-w-5xl mx-auto w-full pb-44">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[90%] rounded-[2.5rem] px-8 py-7 shadow-2xl border ${
              m.role === 'user' 
                ? 'bg-indigo-600 border-indigo-400/30 text-white rounded-tr-none' 
                : 'bg-slate-900 border-white/5 text-slate-200 rounded-tl-none'
            }`}>
              {m.imageUrl && (
                <img src={m.imageUrl} className="rounded-2xl mb-6 border border-white/10 max-h-80 w-auto" alt="Uploaded" />
              )}
              <div className="prose prose-invert max-w-none text-base md:text-lg leading-relaxed">{m.content}</div>
              
              {m.role === 'assistant' && (
                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <button onClick={() => handleSpeech(m.content, m.id)} disabled={!!isSpeaking} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" /></svg>
                    {isSpeaking === m.id ? 'SYNTHESIZING...' : 'PLAY AUDIO'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Render Grounding Sources for Google Search transparency as required */}
        {groundingSources.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Referenced Sources:</p>
              <div className="flex flex-wrap gap-3">
                {groundingSources.map((chunk, idx) => (
                  chunk.web?.uri && (
                    <a 
                      key={idx} 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-4 py-2 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 rounded-xl transition-all"
                    >
                      <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-indigo-400 truncate max-w-[200px]">
                        {chunk.web.title || 'Knowledge Base'}
                      </span>
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 rounded-[2rem] px-8 py-5 border border-white/5">
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 lg:left-72 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          {attachment && (
            <div className="absolute -top-16 left-4 bg-slate-900 border border-indigo-500/30 px-4 py-2 rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom-2">
              <span className="text-[10px] font-bold text-slate-300 truncate max-w-[150px]">{attachment.name}</span>
              <button onClick={() => setAttachment(null)} className="text-red-400 hover:text-red-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              </button>
            </div>
          )}
          <div className="flex items-center gap-3 bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 shadow-2xl focus-within:border-indigo-500/50 transition-all">
            <button onClick={() => fileInputRef.current?.click()} className="p-4 text-slate-500 hover:text-indigo-400 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Initialize neural link..."
              className="flex-1 bg-transparent px-4 py-4 focus:outline-none text-white placeholder-slate-600"
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-50">
              Transmit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
