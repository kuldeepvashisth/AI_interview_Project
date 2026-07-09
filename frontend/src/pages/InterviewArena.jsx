import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, HelpCircle, FileText, Send, 
  Award, AlertTriangle, ArrowUpRight, CheckCircle, RefreshCcw, Loader2
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000/api';

// Simple lightweight markdown parser helper to render AI feedback safely
const renderMarkdown = (text) => {
  if (!text) return '';
  
  return text
    .split('\n')
    .map((line, index) => {
      let trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('### ')) {
        return `<h3 key=${index} class="text-base font-bold text-indigo-300 mt-4 mb-2">${trimmed.replace('### ', '')}</h3>`;
      }
      if (trimmed.startsWith('## ')) {
        return `<h2 key=${index} class="text-lg font-bold text-white mt-6 mb-3">${trimmed.replace('## ', '')}</h2>`;
      }
      
      // Bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const cleanContent = trimmed.replace(/^[\*\-]\s+/, '');
        // Bold parsing in bullets
        const boldParsed = cleanContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return `<li key=${index} class="text-sm text-slate-300 ml-4 list-disc mb-1.5">${boldParsed}</li>`;
      }

      // Normal bold formatting
      const boldParsed = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (boldParsed === '') {
        return '<br key=' + index + ' />';
      }
      return `<p key=${index} class="text-sm text-slate-300 leading-relaxed mb-3">${boldParsed}</p>`;
    })
    .join('');
};

function InterviewArena() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active user submission states
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bottomRef = useRef(null);

  // Fetch session details on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/interview/${id}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch interview details');
        }

        setSession(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  // Scroll to bottom of chat list on updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/interview/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: id,
          answerText: answerText.trim()
        }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit response');
      }

      setSession(data);
      setAnswerText('');
    } catch (err) {
      alert(err.message || 'Error occurred while saving your answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Entering Interview Arena...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 px-6">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-white mb-2">Error Accessing Session</h3>
        <p className="text-sm text-slate-400 text-center max-w-sm mb-6">{error || 'Session could not be located.'}</p>
        <Link to="/dashboard" className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-sm text-slate-300">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isCompleted = session.status === 'completed';
  const currentQNum = session.currentQuestionIndex + 1;
  const totalQuestions = isCompleted ? session.questions.length : Math.max(session.questions.length, 6);
  const activeQuestion = session.questions[session.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="text-right">
            <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300 font-semibold uppercase tracking-wider">
              {session.category} • {session.difficulty}
            </span>
          </div>
        </div>
      </header>

      {/* Main Arena */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-10 flex flex-col">
        {!isCompleted ? (
          // ACTIVE INTERVIEW VIEW
          <div className="flex-grow flex flex-col justify-between">
            {/* Progress Meter */}
            <div className="space-y-2 mb-8">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Active Session Progression</span>
                <span className="text-indigo-400">Question {currentQNum} of {totalQuestions}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-900">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(currentQNum / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Q&A Console */}
            <div className="flex-grow flex flex-col justify-center space-y-6">
              {/* AI Question Box */}
              <div className="p-8 bg-gradient-to-br from-indigo-950/30 to-purple-950/10 border border-indigo-900/40 rounded-2xl relative shadow-xl shadow-indigo-950/10">
                <HelpCircle className="absolute -top-3 -left-3 w-8 h-8 text-indigo-400 bg-slate-950 border border-indigo-900/60 rounded-xl p-1.5 shadow-md" />
                <p className="text-base md:text-lg text-slate-100 font-medium leading-relaxed mt-2 select-text">
                  {activeQuestion?.questionText}
                </p>
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Your Response
                  </label>
                  <textarea
                    rows={6}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Type your structured technical response here... Please explain concepts, examples or architectures where relevant."
                    className="w-full p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-slate-600 leading-relaxed"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!answerText.trim() || isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI evaluating answer...
                      </>
                    ) : (
                      <>
                        Submit Response
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div ref={bottomRef}></div>
          </div>
        ) : (
          // COMPLETED INTERVIEW EVALUATION VIEW
          <div className="space-y-8 animate-fade-in select-text">
            {/* Header Result Card */}
            <div className="p-8 bg-gradient-to-br from-indigo-950/20 to-purple-950/5 border border-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Interview Completed
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Performance Evaluation</h2>
                <p className="text-sm text-slate-400">Review your final scores and grading checklist report.</p>
              </div>

              {/* Score Meter */}
              <div className="relative w-32 h-32 flex flex-col items-center justify-center bg-slate-950 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full shadow-lg shadow-indigo-950/40">
                <span className="text-3xl font-extrabold text-white">{session.overallScore}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Overall</span>
              </div>
            </div>

            {/* AI Review Report Markdown Container */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-4 mb-4">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">AI Evaluation Summary</h3>
              </div>
              <div 
                className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm select-text"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(session.overallFeedback) }}
              ></div>
            </div>

            {/* Q&A History Log */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-900 pb-3">Session Log ({session.questions.length} questions)</h3>
              
              {session.questions.map((item, idx) => (
                <div key={idx} className="p-6 bg-slate-900/10 border border-slate-900 rounded-xl space-y-4">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs bg-indigo-950/50 border border-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded font-bold shrink-0 mt-0.5">
                      Q{idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-slate-100 leading-relaxed">{item.questionText}</p>
                  </div>
                  
                  <div className="p-4 bg-slate-950/40 border border-slate-900/60 rounded-lg space-y-2">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Your Answer</p>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{item.answerText || '[No response provided]'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Back Button */}
            <div className="pt-6 flex justify-center">
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Return to Dashboard
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default InterviewArena;
