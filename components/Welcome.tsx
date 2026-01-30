
import React from 'react';

interface WelcomeProps {
  onEnter: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onEnter }) => {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center overflow-hidden selection:bg-indigo-100">
      {/* Attractive Light Mesh Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-200/40 blur-[140px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-200/30 blur-[140px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-pink-100/30 blur-[120px] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl px-6">
        <div className="mb-10 inline-block">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative px-6 py-3 bg-white/80 backdrop-blur-md border border-white rounded-2xl leading-none flex items-center divide-x divide-slate-200 shadow-sm">
              <span className="flex items-center space-x-4">
                <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="pr-5 text-slate-800 font-bold uppercase tracking-[0.2em] text-[9px]">Strategic Intelligence</span>
              </span>
              <span className="pl-5 text-indigo-600 font-bold uppercase tracking-[0.15em] text-[9px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                Terminal Active
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-8xl md:text-9xl font-black text-slate-900 italic tracking-tighter mb-6 uppercase leading-none drop-shadow-sm">
          Mine <span className="bg-gradient-to-br from-indigo-600 via-indigo-400 to-cyan-600 bg-clip-text text-transparent">AI</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto mb-12 leading-relaxed tracking-tight">
          Experience a new dimension of machine cognition. 
          The premier terminal for reasoning, vision, and elite championship logic.
        </p>

        <div className="flex flex-col items-center justify-center">
          <button
            onClick={onEnter}
            className="group relative px-16 py-7 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(79,70,229,0.3)] active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Initialize Terminal</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end opacity-40 pointer-events-none">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Cognitive Security</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">TLS 1.3 SECURED ENDPOINT</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Mine Terminal v4.2</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Global Intelligence Infrastructure</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
