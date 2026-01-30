
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { doc, collection, addDoc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { getPersistentChat, generateSpeech, playRawPCM, handleGeminiError } from '../services/gemini';
import { Message } from '../types';

interface ChatInterfaceProps {
  chatId: string | null;
  onChatCreated: (id: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, onChatCreated }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'MINE AI synchronized. Global web sensors optimized. Cognition engine primed for high-level operations. State your objective.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{ data: string, mimeType: string, url: string, name: string } | null>(null);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!chatId || !user) {
      setMessages([{ id: '1', role: 'assistant', content: 'MINE AI synchronized. Global web sensors optimized. State your objective.', timestamp: Date.now() }]);
      return;
    }

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          // Handle Firestore Timestamps safely for the UI
          timestamp: data.timestamp?.toMillis ? data.timestamp.toMillis() : (data.timestamp || Date.now())
        } as Message;
      });
      if (history.length > 0) {
        setMessages(history);
      }
    });

    return () => unsubscribe();
  }, [chatId, user]);

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
        setAttachment({ 
          data: base64, 
          mimeType: file.type || 'application/octet-stream', 
          url: reader.result as string,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveMessageToFirestore = async (cid: string, msg: Message) => {
    if (!user) return;
    await addDoc(collection(db, 'chats', cid, 'messages'), {
      ...msg,
      timestamp: new Date(msg.timestamp) // Store as Date for Firestore
    });
    await updateDoc(doc(db, 'chats', cid), {
      lastMessage: msg.content.substring(0, 50),
      updatedAt: Date.now()
    });
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading || !user) return;

    let activeChatId = chatId;
    
    if (!activeChatId) {
      const newChatRef = await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        title: input.substring(0, 30) || 'Neural Data Pulse',
        lastMessage: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      activeChatId = newChatRef.id;
      onChatCreated(activeChatId);
    }

    const isImage = attachment?.mimeType.startsWith('image/');
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || (attachment ? `Analyze: ${attachment.name}` : ""),
      timestamp: Date.now(),
      imageUrl: isImage ? attachment?.url : undefined,
    };

    setMessages(prev => [...prev, userMsg]);
    await saveMessageToFirestore(activeChatId, userMsg);
    
    const currentInput = input;
    const currentAttachment = attachment;
    
    setInput('');
    setAttachment(null);
    setGroundingSources([]);
    setIsLoading(true);

    try {
      const chat = getPersistentChat(activeChatId);
      let responseText = "";
      
      if (currentAttachment) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { inlineData: { data: currentAttachment.data, mimeType: currentAttachment.mimeType } },
              { text: currentInput || `Analyze this data node.` }
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
        content: responseText || "Cognitive delay detected. Signal integrity nominal.",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      await saveMessageToFirestore(activeChatId, assistantMsg);
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
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(null);
    }
  };

  const renderAttachmentPreview = () => {
    if (!attachment) return null;
    const isImage = attachment.mimeType.startsWith('image/');

    return (
      <div className="mt-4 absolute -top-20 left-4 md:left-12 flex items-center gap-4 bg-slate-900 border border-indigo-500/30 px-5 py-4 rounded-[2rem] backdrop-blur-3xl animate-in slide-in-from-bottom-2 shadow-[0_10px_40px_rgba(79,70,229,0.2)]">
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
          {isImage ? (
            <img src={attachment.url} className="w-full h-full object-cover" alt="Staged" />
          ) : (
            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Staging Module</span>
          <span className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{attachment.name}</span>
        </div>
        <button onClick={() => setAttachment(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen relative">
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
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              {chatId ? `Active Neural Link: ${chatId.substring(0, 8)}` : 'Omni-File Processing Enabled'}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={scrollToTop} className="p-2 text-slate-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg></button>
          <button onClick={scrollToBottom} className="p-2 text-slate-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" /></svg></button>
        </div>
      </header>

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
                  <img src={m.imageUrl} alt="Visual Data" className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" />
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
                <span className="text-[11px] text-indigo-400 font-black uppercase tracking-[0.4em]">Decompressing Neural Layers...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 lg:left-72 right-0 p-8 z-40 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="relative glass-panel rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-2">
             <div className="flex items-center">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf,text/*,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                <button onClick={() => fileInputRef.current?.click()} className="p-5 text-slate-500 hover:text-indigo-400 transition-all rounded-3xl hover:bg-white/5">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={chatId ? "Continue this conversation..." : "Initialize new neural link..."}
                  className="flex-1 bg-transparent px-6 py-6 focus:outline-none text-slate-100 placeholder-slate-600 text-lg font-medium"
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/30 active:scale-95 disabled:opacity-50">
                  Transmit
                </button>
             </div>
          </div>
          {renderAttachmentPreview()}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
