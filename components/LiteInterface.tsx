
import React, { useState } from 'react';
import { quickResponse } from '../services/gemini';

const LiteInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSearch = async () => {
    if (!query.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const response = await quickResponse(query);
      setResult(response.text || 'No response');
    } catch (err) {
      console.error(err);
      setResult('Error processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-slate-950">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20 mb-4">
             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
               <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM6.464 14.95l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414z" />
             </svg>
             GEMINI 2.5 FLASH LITE
           </div>
           <h2 className="text-4xl font-extrabold text-white tracking-tight">Instant Answers</h2>
           <p className="text-slate-400">Zero wait. Pure speed. Best for facts, snippets, and quick logic.</p>
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
            placeholder="What's on your mind? Get a lightning fast answer..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-5 text-lg text-slate-100 shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-600"
          />
          <button
            onClick={handleQuickSearch}
            className="absolute right-3 top-3 bottom-3 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 rounded-xl font-bold transition-all shadow-lg"
          >
            {isLoading ? '...' : 'Go'}
          </button>
        </div>

        {result && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-wrap">{result}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          {['Check spelling', 'Explain E=mc²', 'Summarize news'].map((tag) => (
            <button
              key={tag}
              onClick={() => { setQuery(tag); handleQuickSearch(); }}
              className="px-4 py-2 bg-slate-900 rounded-lg text-xs font-medium text-slate-500 hover:text-amber-500 hover:bg-slate-800 border border-slate-800 transition-all"
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
