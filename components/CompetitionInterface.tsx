
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
  // Config State
  const [activeType, setActiveType] = useState<'math' | 'spelling'>('math');
  const [difficulty, setDifficulty] = useState('Senior Secondary / High School');
  const [region, setRegion] = useState('Global (International Premier)');
  
  // Test State
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [spellingInput, setSpellingInput] = useState('');

  // Timer State
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<any>(null);

  const regions = [
    'Global (International)',
    'Africa (National Elite League)',
    'North America (Premier Logic Series)',
    'Europe (Continental Scholastic)',
    'Asia Pacific (Elite Mathematical Series)'
  ];

  const difficulties = [
    'Primary / Junior School',
    'Junior Secondary / Middle School',
    'Senior Secondary / High School',
    'University / Elite Professional'
  ];

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      finishTest();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  const startTest = async () => {
    setIsGenerating(true);
    setIsFinished(false);
    setQuestions([]);
    setCurrentIdx(0);
    setUserAnswers([]);
    setSpellingInput('');
    
    try {
      const data = await generateEliteTest(activeType, difficulty, region);
      if (data && data.length > 0) {
        setQuestions(data);
        setUserAnswers(new Array(data.length).fill(''));
        setTimeLeft(activeType === 'math' ? 900 : 600); // 15 mins for math, 10 for spelling
        setTimerActive(true);
      }
    } catch (err) {
      console.error(err);
      alert("System failed to generate test. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const finishTest = () => {
    setTimerActive(false);
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleAnswer = (val: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIdx] = val;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (activeType === 'spelling') {
      handleAnswer(spellingInput);
      setSpellingInput('');
    }
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i].toLowerCase().trim() === q.answer.toLowerCase().trim()) {
        score++;
      }
    });
    return score;
  };

  // Rendering Functions
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="w-24 h-24 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-indigo-400">Synchronizing Local Neural Bank...</h2>
          <p className="text-slate-500 text-sm mt-2">Zero-Latency Access Enabled</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = calculateScore();
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col h-full bg-slate-950 p-6 md:p-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl ring-1 ring-indigo-500/20">
            <h2 className="text-4xl font-black text-white italic tracking-tighter mb-4 uppercase">Test Concluded</h2>
            <div className="flex justify-center mb-6">
               <div className="w-32 h-32 rounded-full border-4 border-indigo-500 flex items-center justify-center bg-indigo-500/10">
                 <span className="text-4xl font-black text-white">{percent}%</span>
               </div>
            </div>
            <p className="text-xl text-slate-300">You scored <span className="text-indigo-400 font-bold">{score}</span> out of <span className="text-indigo-400 font-bold">{questions.length}</span></p>
            <button onClick={() => setIsFinished(false)} className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase">Try Another Competition</button>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest px-4">Detailed Mine Review</h3>
            {questions.map((q, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 transition-all hover:bg-slate-900">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs ${userAnswers[i].toLowerCase().trim() === q.answer.toLowerCase().trim() ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {i + 1}
                  </div>
                  <div className="space-y-3">
                    <p className="text-slate-200 font-medium">{q.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                       <p className="text-xs text-slate-500">Your Answer: <span className={userAnswers[i].toLowerCase().trim() === q.answer.toLowerCase().trim() ? 'text-green-500' : 'text-red-500'}>{userAnswers[i] || 'No Answer'}</span></p>
                       <p className="text-xs text-slate-500">Correct Answer: <span className="text-green-500 font-bold">{q.answer}</span></p>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                      <p className="text-[10px] uppercase font-black text-indigo-400 mb-1">Expert Explanation</p>
                      <p className="text-sm text-slate-400 leading-relaxed italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (timerActive && questions.length > 0) {
    const q = questions[currentIdx];
    return (
      <div className="flex flex-col h-full bg-slate-950 p-6 md:p-10 relative">
        <header className="flex justify-between items-center mb-10 max-w-4xl mx-auto w-full">
           <div className="space-y-1">
             <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">{activeType === 'math' ? 'Elite Championship Math' : 'Global Premier Spelling'}</h2>
             <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-500" style={{width: `${((currentIdx + 1) / questions.length) * 100}%`}}></div>
             </div>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
               Progress: {currentIdx + 1} / {questions.length}
               <span className="text-indigo-400 ml-2">• Neural Cache Active</span>
             </p>
           </div>
           <div className={`text-3xl font-black font-mono transition-colors ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`}>
             {formatTime(timeLeft)}
           </div>
        </header>

        <div className="flex-1 max-w-4xl mx-auto w-full">
           <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col justify-between">
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                   <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-lg">QUESTION {currentIdx + 1}</span>
                   {activeType === 'spelling' && q.hint && (
                     <div className="bg-slate-800 rounded-lg px-3 py-1 text-[10px] text-slate-400 uppercase font-bold border border-slate-700">
                       HINT: {q.hint}
                     </div>
                   )}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-100 leading-tight">
                  {q.question}
                </h3>

                {activeType === 'math' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {q.options?.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className={`text-left p-5 rounded-2xl border-2 transition-all font-bold ${
                          userAnswers[currentIdx] === opt 
                            ? 'bg-indigo-600/20 border-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <span className="text-indigo-500 mr-3">{String.fromCharCode(65 + i)}.</span> {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Input Your Spelling</label>
                    <input
                      autoFocus
                      type="text"
                      value={spellingInput}
                      onChange={(e) => setSpellingInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && nextQuestion()}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-5 text-2xl text-indigo-400 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 tracking-widest uppercase"
                      placeholder="TYPE WORD HERE..."
                    />
                  </div>
                )}
              </div>

              <div className="mt-12 flex justify-between items-center">
                 <button 
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className="text-slate-500 font-bold text-sm uppercase hover:text-slate-300 disabled:opacity-30"
                 >
                   Previous
                 </button>
                 <button 
                  onClick={nextQuestion}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest"
                 >
                   {currentIdx === questions.length - 1 ? 'Finish Test' : 'Next Question'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-10 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center">
          <h2 className="text-5xl font-black text-white italic tracking-tighter drop-shadow-2xl uppercase">Elite Arena</h2>
          <p className="text-indigo-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-2 animate-pulse">Championship Engine 4.0</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Test Type</label>
            <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => setActiveType('math')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeType === 'math' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                Math Challenge
              </button>
              <button 
                onClick={() => setActiveType('spelling')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeType === 'spelling' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                Spelling Bee
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Difficulty Class</label>
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Regional Focus</label>
            <select 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden text-center group">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 to-transparent opacity-50"></div>
          <div className="relative z-10 space-y-6">
             <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
               <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <div>
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Enter the Arena</h3>
               <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                 {activeType === 'math' 
                  ? '10 Championship-level questions. Zero Latency. Pure logic.' 
                  : '20 Elite-level words. Instant loading. Perfection required.'}
               </p>
               <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                 Neural Cache Offline Support Ready
               </div>
             </div>
             <button
               onClick={startTest}
               className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-5 rounded-2xl text-xl shadow-2xl shadow-indigo-600/30 transition-all uppercase tracking-widest transform hover:scale-105"
             >
               Start Championship Round
             </button>
          </div>
        </div>

        <footer className="text-center pb-10 text-[9px] font-bold text-slate-700 uppercase tracking-[0.5em]">
          Mine Elite Arena System Ver 4.2.0 • Secured Logic Gate Active
        </footer>
      </div>
    </div>
  );
};

export default CompetitionInterface;
