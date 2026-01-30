
import React, { useState, useRef, useEffect } from 'react';
import { getPersistentChat, generateSpeech, playRawPCM } from '../services/gemini';
import { Message } from '../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'MINE AI synchronized. Global web sensors optimized. Cognition engine primed for high-level operations. State your objective.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{ data: string, mimeType: string, url: string } | null>(null);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  
  const sessionIdRef = useRef(`session_${Date.now()}`);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync scroll progress with the global window scroll
  useEffect(() => {
    const handleGlobalScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (scrolled / height) * 100 : 0;
      setScrollPosition(progress);
      setShowScrollBottom(height - scrolled > 300);
    };

    window.addEventListener('scroll', handleGlobalScroll);
    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // If we just sent a message or received one, scroll to the bottom of the page
    if (messages.length > 1 || isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setAttachment({ data: base64, mimeType: file.type, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      imageUrl: attachment?.url,
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentAttachment = attachment;
    
    setInput('');
    setAttachment(null);
    setGroundingSources([]);
    setIsLoading(true);

    try {
      const chat = getPersistentChat(sessionIdRef.current);
      let responseText = "";
      
      if (currentAttachment) {
        const ai = new (await import('@google/genai')).GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { inlineData: { data: currentAttachment.data, mimeType: currentAttachment.mimeType } },
              { text: currentInput || "Detailed analysis required." }
            ]
          }
        });
        responseText = result.text || "";
      } else {
        const result = await chat.sendMessage({ message: currentInput });
        responseText = result.text || "";
        const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) setGroundingSources(chunks);
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText || "Analysis interrupted. Signal lost.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', content: 'Cognitive loop failure. Rebooting modules...', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = async (text: string, id: string) => {
    setIsSpeaking(id);
    try {
      const audioData = await generateSpeech(text);
      if (audioData) await playRawPCM(audioData);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Global Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[100] pointer-events-none">
        <div 
          className="h-full bg-indigo-500 shadow-[0_0_15px_#6366f1] transition-all duration-300 ease-out" 
          style={{ width: `${scrollPosition}%` }}
        ></div>
      </div>

      <header className="sticky top-0 px-8 py-5 flex justify-between items-center bg-slate-950/80 backdrop-blur-2xl z-40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_#6366f1]"></div>
          <div>
            <h2 className="text-xs font-black text-white uppercase tracking-[0.4em] italic">Cognitive Terminal</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Global Intelligence System Active</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={scrollToTop} className="p-2 text-slate-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg></button>
          <button onClick={scrollToBottom} className="p-2 text-slate-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" /></svg></button>
        </div>
      </header>

      {/* Main Conversation Flow */}
      <div className="flex-1 p-8 md:p-12 space-y-12 max-w-6xl mx-auto w-full pb-60">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-8 duration-700`}>
            <div className={`max-w-[85%] rounded-[3rem] px-8 py-8 shadow-2xl border transition-all hover:scale-[1.01] ${
              m.role === 'user' 
                ? 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none shadow-indigo-600/20' 
                : 'glass-panel border-white/5 text-slate-200 rounded-tl-none'
            }`}>
              {m.imageUrl && (
                <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                  <img src={m.imageUrl} alt="Staged Intelligence" className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-base md:text-lg font-medium tracking-tight selection:bg-white/20">{m.content}</div>
              
              {m.role === 'assistant' && groundingSources.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Neural Data Verification</p>
                  <div className="flex flex-wrap gap-2">
                    {groundingSources.map((s, idx) => s.web && (
                      <a key={idx} href={s.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-slate-950/60 px-4 py-2 rounded-xl text-indigo-300 border border-indigo-500/10 hover:border-indigo-500/40 transition-all">
                        {s.web.title || "External Intelligence"}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {m.role === 'assistant' && (
                <div className="mt-8">
                  <button onClick={() => handleSpeech(m.content, m.id)} disabled={!!isSpeaking} className="text-[10px] font-black flex items-center gap-3 text-indigo-400 hover:text-indigo-300 transition-all uppercase tracking-[0.2em]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" /></svg>
                    {isSpeaking === m.id ? 'Synthesizing Waveform...' : 'Project Audio'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-panel border-white/5 rounded-[2rem] px-8 py-6 rounded-tl-none">
              <div className="flex gap-4 items-center">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
                </div>
                <span className="text-[11px] text-indigo-400 font-black uppercase tracking-[0.4em]">Scaling Cognitive Web...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Tactical Input Dock */}
      <div className="fixed bottom-0 left-0 lg:left-72 right-0 p-8 z-40 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="relative glass-panel rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-2">
             <div className="flex items-center">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current?.click()} className="p-5 text-slate-500 hover:text-indigo-400 transition-all rounded-3xl hover:bg-white/5">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Transmit new target for Mine AI Analysis..."
                  className="flex-1 bg-transparent px-6 py-6 focus:outline-none text-slate-100 placeholder-slate-600 text-lg font-medium"
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/30 active:scale-95 disabled:opacity-50">
                  Transmit
                </button>
             </div>
          </div>
          {attachment && (
            <div className="mt-4 absolute -top-16 left-12 flex items-center gap-4 bg-indigo-600/20 border border-indigo-500/30 px-5 py-3 rounded-2xl backdrop-blur-xl animate-in slide-in-from-bottom-2">
               <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg"><img src={attachment.url} className="w-full h-full object-cover" /></div>
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Visual Data Staged</span>
               <button onClick={() => setAttachment(null)} className="text-indigo-400 hover:text-white font-black text-lg ml-2">×</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating Scroll Bottom Button */}
      {showScrollBottom && (
        <button 
          onClick={scrollToBottom}
          className="fixed bottom-36 right-12 z-50 p-5 bg-indigo-600 text-white rounded-full shadow-[0_0_30px_rgba(79,70,229,0.5)] animate-in fade-in slide-in-from-bottom-4 hover:scale-110 active:scale-90 transition-all"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 13l-7 7-7-7" /></svg>
        </button>
      )}
    </div>
  );
};

export default ChatInterface;
