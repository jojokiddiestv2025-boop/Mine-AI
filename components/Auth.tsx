
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../services/firebase';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setNeedsVerification(true);
          await signOut(auth);
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setNeedsVerification(true);
        await signOut(auth); 
      }
    } catch (err: any) {
      setError(isLogin ? 'AUTH_DENIED: Check Credentials' : 'REGISTRY_FAILURE: Protocol Aborted');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Success is handled by onAuthStateChanged in App.tsx
    } catch (err: any) {
      setError('GOOGLE_AUTH_FAILED: Connection Terminated');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (needsVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md glass-panel rounded-[3rem] p-12 text-center shadow-2xl border border-indigo-500/20">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full mx-auto flex items-center justify-center mb-8 border border-amber-500/30">
            <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase italic">Identity Verification</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">Verification link transmitted. Activate your profile to bypass the terminal firewall.</p>
          <button onClick={() => setNeedsVerification(false)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-indigo-600/20">Return to Terminal</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 relative">
      <div className="w-full max-w-md glass-panel rounded-[3.5rem] p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 relative z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Mine <span className="text-indigo-500">AI</span></h1>
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.8em] mt-4">Security Layer Alpha-7</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-700 font-medium transition-all"
              placeholder="Operator Email"
            />
          </div>
          
          <div className="space-y-2">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-700 transition-all"
              placeholder="Access Password"
            />
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"><p className="text-[10px] text-red-400 font-black text-center uppercase tracking-widest">{error}</p></div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.3em] text-xs shadow-xl shadow-indigo-600/30 active:scale-95 mb-4"
          >
            {loading ? 'SYNCHRONIZING...' : isLogin ? 'ESTABLISH LINK' : 'CREATE OPERATOR'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
            <span className="px-4 bg-slate-950 text-slate-600 font-black">OR</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-4 bg-white hover:bg-slate-100 text-slate-900 font-black py-5 rounded-2xl transition-all uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-10 text-[9px] text-slate-600 hover:text-indigo-400 font-black uppercase tracking-[0.5em] transition-colors">
          {isLogin ? "INITIALIZE NEW PROFILE" : "EXISTING OPERATOR LOGIN"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
