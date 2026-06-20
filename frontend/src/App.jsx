import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

function App() {
  const [apiStatus, setApiStatus] = useState('connecting')
  const [apiMessage, setApiMessage] = useState('')

  useEffect(() => {
    // Backend connection check
    fetch('http://localhost:5000/')
      .then((res) => {
        if (!res.ok) throw new Error('API connection failed')
        return res.json()
      })
      .then((data) => {
        setApiStatus('connected')
        setApiMessage(data.message || 'API connected successfully!')
      })
      .catch((err) => {
        setApiStatus('error')
        console.error(err)
      })
  }, [])

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
          <div>
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-800">
              {apiStatus === 'connecting' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                  Checking API connection...
                </>
              )}
              {apiStatus === 'connected' && (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-medium">Backend Ready</span>
                </>
              )}
              {apiStatus === 'error' && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-400 font-medium">Backend Offline</span>
                </>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-20 flex-grow flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          Master Your Next Interview with{' '}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            InterviewVerse AI
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Upload your resume, select your category, and practice with real-time browser-based AI voice interviews. Get graded across 6 key dimensions instantly.
        </p>

        {apiStatus === 'connected' && (
          <div className="mb-8 p-4 bg-indigo-950/20 border border-indigo-900/50 rounded-xl max-w-md mx-auto">
            <p className="text-sm text-indigo-300">
              <strong className="text-indigo-200">API Status:</strong> {apiMessage}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-2 group cursor-pointer">
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold rounded-lg border border-slate-800 transition-all flex items-center justify-center cursor-pointer"
          >
            Learn More
          </a>
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
  )
}

export default App
