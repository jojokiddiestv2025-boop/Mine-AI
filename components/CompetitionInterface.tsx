
import React, { useState, useEffect, useRef } from 'react';
import { generateEliteTest } from '../services/gemini';

interface Question {
  question: string;
  options?: string[];
  answer: string;
  hint?: string;
  explanation: string;
}

const CompetitionInterface: React.FC = () => {
  const [activeType, setActiveType] = useState<'math' | 'spelling'>('math');
  const [difficulty, setDifficulty] = useState('Senior Secondary / High School');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [spellingInput, setSpellingInput] = useState('');
  const [isCloud, setIsCloud] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      finishTest();
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timeLeft]);

  const startTest = async (forceApi: boolean = false) => {
    setIsGenerating(true);
    setIsFinished(false);
    setIsCloud(forceApi);
    
    try {
      const data = await generateEliteTest(activeType, difficulty, "Global", forceApi);
      if (data && data.length > 0) {
        setQuestions(data);
        setUserAnswers(new Array(data.length).fill(''));
        setCurrentIdx(0);
        setTimeLeft(activeType === 'math' ? 900 : 600);
        setTimerActive(true);
      }
    } catch (err) {
      alert("Neural sync delayed. Reverting to local cache.");
      const backup = await generateEliteTest(activeType, difficulty, "Global", false);
      setQuestions(backup);
    } finally {
      setIsGenerating(false);
    }
  };

  const finishTest = () => {
    setTimerActive(false);
    setIsFinished(true);
  };

  const nextQuestion = () => {
    const finalAnswer = activeType === 'spelling' ? spellingInput : userAnswers[currentIdx];
    const newAnswers = [...userAnswers];
    newAnswers[currentIdx] = finalAnswer;
    setUserAnswers(newAnswers);
    setSpellingInput('');

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8 bg-slate-950">
        <div className="w-24 h-24 border-4 border-t-indigo-500 border-indigo-500/10 rounded-full animate-spin"></div>
        <div className="text-center">
          <h2 className="text-xl font-black text-white italic uppercase tracking-[0.2em]">Neural Synthesis</h2>
          <p className="text-slate-500 text-[10px] font-bold mt-2 uppercase tracking-widest animate-pulse">
            {isCloud ? 'ESTABLISHING CLOUD UPLINK...' : 'ACCESSING LOCAL DATA BANK...'}
          </p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = questions.reduce((acc, q, i) => (userAnswers[i].toLowerCase().trim() === q.answer.toLowerCase().trim() ? acc + 1 : acc), 0);
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 items-center justify-center">
        <div className="max-w-xl w-full bg-slate-900/50 border border-white/5 rounded-[3rem] p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-black text-white italic mb-8 uppercase tracking-tighter">Performance Analysis</h2>
          <div className="text-7xl font-black text-indigo-400 mb-4">{percent}%</div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-10">Accuracy: {score} / {questions.length}</p>
          <button onClick={() => setIsFinished(false)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs">Return to Lobby</button>
        </div>
      </div>
    );
  }

  if (timerActive && questions.length > 0) {
    const q = questions[currentIdx];
    return (
      <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12">
        <header className="flex justify-between items-center mb-12 max-w-5xl mx-auto w-full">
           <div className="flex-1">
             <div className="flex justify-between text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
               <span>Gate {currentIdx + 1} of {questions.length}</span>
               <span>{isCloud ? 'Cloud Link Active' : 'Neural Bank Active'}</span>
             </div>
             <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full transition-all duration-700" style={{width: `${((currentIdx + 1) / questions.length) * 100}%`}}></div>
             </div>
           </div>
           <div className="ml-8 text-3xl font-black font-mono text-indigo-400 bg-slate-900/50 px-6 py-2 rounded-xl border border-white/5">
             {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
           </div>
        </header>

        <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
           <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 md:p-16 shadow-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-12">{q.question}</h3>
              {activeType === 'math' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { const n = [...userAnswers]; n[currentIdx] = opt; setUserAnswers(n); }}
                      className={`text-left p-6 rounded-2xl border-2 transition-all font-bold ${
                        userAnswers[currentIdx] === opt ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-950/50 border-white/5 text-slate-500 hover:border-white/10'
                      }`}
                    >
                      <span className="mr-4 text-indigo-500/30">{String.fromCharCode(65 + i)}</span> {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  autoFocus
                  type="text"
                  value={spellingInput}
                  onChange={(e) => setSpellingInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && nextQuestion()}
                  className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl px-8 py-6 text-3xl text-indigo-400 font-bold focus:outline-none focus:border-indigo-500 tracking-widest uppercase"
                  placeholder="TRANSMIT WORD..."
                />
              )}
              <div className="mt-12 flex justify-end">
                 <button onClick={nextQuestion} className="bg-white text-slate-950 font-black px-12 py-5 rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest text-[10px]">
                   {currentIdx === questions.length - 1 ? 'Terminate' : 'Next Transmission'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-16 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-7xl font-black text-white italic tracking-tighter uppercase leading-none">Elite Arena</h2>
          <p className="text-indigo-500 font-black uppercase tracking-[0.5em] text-[10px]">Neural Protocol: Active</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Discipline</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl">
                <button onClick={() => setActiveType('math')} className={`py-3 rounded-xl text-xs font-black transition-all ${activeType === 'math' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600'}`}>MATH</button>
                <button onClick={() => setActiveType('spelling')} className={`py-3 rounded-xl text-xs font-black transition-all ${activeType === 'spelling' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600'}`}>SPELLING</button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Complexity</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-slate-950 text-slate-300 border border-white/5 rounded-xl px-4 py-4 text-xs font-bold focus:outline-none appearance-none cursor-pointer">
                {['Primary / Junior School', 'Junior Secondary / Middle School', 'Senior Secondary / High School', 'University / Elite Professional'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-10 flex flex-col justify-between shadow-2xl shadow-indigo-600/20">
             <div>
               <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Initialize Hub</h3>
               <p className="text-indigo-100 text-sm leading-relaxed opacity-80">Local bank provides instant, zero-latency competition data. Optimized for high-speed training.</p>
             </div>
             <button onClick={() => startTest(false)} className="bg-white text-indigo-600 font-black py-5 rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest text-xs mt-8">Start Local Test</button>
          </div>
        </div>

        <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-10 text-center">
          <p className="text-slate-500 text-xs font-bold mb-6">Want fresh AI-generated questions? Use the cloud link.</p>
          <button onClick={() => startTest(true)} className="text-indigo-400 hover:text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b border-indigo-400/20 pb-1">Request Cloud Neural Synthesis</button>
        </div>
      </div>
    </div>
  );
};

export default CompetitionInterface;
