
import React, { useState } from 'react';
import { quickResponse } from '../services/gemini';

const LiteInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSearch = async () => {
    if (!query.trim() || isLoading) return;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await quickResponse(query);
      setResult(response.text || 'Neural processing returned empty payload.');
    } catch (err) {
      setResult('System overload. Optimization in progress.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-slate-950/20 backdrop-blur-sm">
      <div className="w-full max-w-2xl space-y-12">
        <div className="text-center space-y-4">
           <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Instant <span className="text-indigo-500">Lite</span></h2>
           <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Optimized for Speed & Logic</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-indigo-500 opacity-20 blur-xl group-focus-within:opacity-40 transition-opacity rounded-[2rem]"></div>
          <div className="relative flex bg-slate-900/80 border border-white/5 rounded-[2rem] overflow-hidden p-2 shadow-2xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
              placeholder="Query the engine..."
              className="flex-1 bg-transparent px-8 py-5 text-lg text-white placeholder-slate-600 focus:outline-none"
            />
            <button
              onClick={handleQuickSearch}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
            >
              {isLoading ? '...' : 'Process'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">{result}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {['Solve Quadratic', 'Spelling Origin', 'Quick Logic'].map((tag) => (
            <button
              key={tag}
              onClick={() => { setQuery(tag); }}
              className="px-6 py-4 bg-slate-900/40 border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all uppercase tracking-widest"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiteInterface;
