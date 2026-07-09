import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, Shield, Cpu, Volume2 } from 'lucide-react';

function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              InterviewVerse AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="text-sm font-medium px-4 py-2 bg-indigo-950/40 border border-indigo-900/60 rounded-lg hover:bg-indigo-950/80 transition-all text-indigo-300"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main hero section */}
      <main className="max-w-6xl mx-auto px-6 py-20 flex-grow flex flex-col justify-center items-center text-center">
        {/* Dynamic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/30 border border-violet-900/40 text-violet-300 text-xs font-semibold mb-8 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Zero-Cost MERN Portfolio Project
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl">
          Master Your Next Tech Interview with{' '}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            InterviewVerse AI
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Upload your resume, select your technology field, and practice with real-time browser-based AI voice or text interviews. Get professional scoring and deep feedback instantly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link
            to={user ? '/dashboard' : '/login'}
            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com/kuldeepvashisth/AI_interview_Project"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold rounded-lg border border-slate-800 transition-all flex items-center justify-center cursor-pointer"
          >
            GitHub Repository
          </a>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left border-t border-slate-900/60 pt-16">
          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-violet-950/50 flex items-center justify-center mb-4 border border-violet-900/30 text-violet-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Resume-Tailored Questions</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our Gemini-powered engine reads your parsed resume text to construct dynamic, custom questions based directly on your real experience.
            </p>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/50 flex items-center justify-center mb-4 border border-indigo-900/30 text-indigo-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Voice & Text Interfaces</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Use native browser Speech Recognition and Speech Synthesis APIs to carry out dynamic mock verbal interviews with zero external costs.
            </p>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-purple-950/50 flex items-center justify-center mb-4 border border-purple-900/30 text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Detailed Score Analytics</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Receive a comprehensive grading report assessing your structural performance, strengths, weaknesses, and a technical feedback roadmap.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/50 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} InterviewVerse AI. All rights reserved.</p>
          <p>Built as a zero-cost MERN portfolio project.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
