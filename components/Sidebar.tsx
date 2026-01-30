
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { AppMode, ChatSession } from '../types';

interface SidebarProps {
  activeMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  selectedChatId: string | null;
  onSelectChat: (chatId: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMode, onSelectMode, selectedChatId, onSelectChat }) => {
  const user = auth.currentUser;
  const [chats, setChats] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession));
      setChats(chatList);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try { await signOut(auth); } catch (e) { console.error(e); }
  };

  const menuItems = [
    { id: AppMode.CHAT, label: 'Mine Chat', subtitle: 'Grounding Active', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: AppMode.LITE, label: 'Fast Lite', subtitle: 'Zero Latency', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: AppMode.IMAGE, label: 'Vision Pro', subtitle: 'Neural Studio', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: AppMode.COMPETITION, label: 'Elite Arena', subtitle: 'Thinking v4.2', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  ];

  return (
    <aside className="w-72 bg-slate-950/60 backdrop-blur-2xl border-r border-white/5 flex flex-col h-full shadow-2xl relative z-30">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] rotate-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
             <h1 className="text-2xl font-black italic tracking-tighter text-white">Mine <span className="text-indigo-400">AI</span></h1>
             <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.4em]">Persistent v4.2</p>
          </div>
        </div>
      </div>

      <nav className="px-4 space-y-2 mb-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectMode(item.id)}
            className={`w-full group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all border ${
              activeMode === item.id && !selectedChatId
                ? 'bg-indigo-600/10 text-white border-indigo-500/30 shadow-[0_10px_30px_rgba(79,70,229,0.1)]' 
                : 'text-slate-500 border-transparent hover:bg-slate-900/50 hover:text-slate-300'
            }`}
          >
            <div className={`${activeMode === item.id && !selectedChatId ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
            </div>
            <div className="text-left">
              <p className="font-extrabold text-xs uppercase tracking-[0.15em]">{item.label}</p>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{item.subtitle}</p>
            </div>
          </button>
        ))}
      </nav>

      <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Neural Archives</h3>
          <button 
            onClick={() => onSelectChat(null)}
            className="p-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-lg transition-all animate-pulse"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </button>
        </div>
        
        <div className="space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all border group ${
                selectedChatId === chat.id 
                  ? 'bg-indigo-600/5 border-indigo-500/20 text-slate-100' 
                  : 'border-transparent text-slate-500 hover:bg-slate-900/40 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${selectedChatId === chat.id ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-slate-800'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate tracking-tight">{chat.title || 'Incomplete Link'}</p>
                  <p className="text-[9px] text-slate-600 font-medium truncate uppercase tracking-widest mt-0.5">{chat.lastMessage || 'Memory Void'}</p>
                </div>
              </div>
            </button>
          ))}
          {chats.length === 0 && (
            <div className="px-4 py-10 text-center opacity-20 grayscale">
              <svg className="w-10 h-10 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Archives Empty</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-white/5 bg-slate-900/10">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
            {user?.photoURL ? <img src={user.photoURL} alt="A" className="w-full h-full object-cover" /> : <span className="text-xs font-black text-slate-400">{user?.email?.[0].toUpperCase()}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate uppercase tracking-tighter">{user?.email?.split('@')[0]}</p>
            <p className="text-[9px] text-indigo-500/80 font-black uppercase tracking-widest flex items-center gap-1">
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></span>
              Operative Online
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="w-full py-3 px-4 rounded-xl text-[10px] font-black text-slate-500 hover:text-red-400 hover:bg-red-500/5 border border-slate-800/50 hover:border-red-500/20 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>

      <div className="p-6 pt-4 border-t border-white/5 text-center">
        <div className="bg-slate-950/80 rounded-3xl p-5 border border-white/5 mb-4 shadow-inner">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">Neural Bandwidth</p>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full w-[12%] shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse"></div>
          </div>
          <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-2 italic">Optimal System Health</p>
        </div>
        <p className="text-[8px] text-slate-800 font-black uppercase tracking-[0.6em]">Global Infrastructure: READY</p>
      </div>
    </aside>
  );
};

export default Sidebar;
