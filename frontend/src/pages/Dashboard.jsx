import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, Upload, Play, LogOut, CheckCircle, AlertCircle, 
  History, Calendar, Award, ChevronRight, Loader2 
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000/api';

const CATEGORIES = [
  'Frontend Development',
  'Backend Development',
  'Fullstack Development',
  'DevOps & Cloud',
  'Data Science & AI',
  'C++ Programming',
  'Java Programming',
  'Python Development',
];

function Dashboard() {
  const { user, logout, updateResumeText } = useAuth();
  const navigate = useNavigate();

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });

  // Start Interview Configuration State
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [useResume, setUseResume] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // History State
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Auto-check useResume if user has a resume uploaded
  useEffect(() => {
    if (user?.resumeText) {
      setUseResume(true);
    } else {
      setUseResume(false);
    }
  }, [user]);

  // Fetch Interview History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/interview/history`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Handle Resume File Select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setUploadMessage({ type: 'error', text: 'Please select a PDF file.' });
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
      setUploadMessage({ type: '', text: '' });
    }
  };

  // Handle Resume Upload Submit
  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setIsUploading(true);
    setUploadMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const response = await fetch(`${BACKEND_URL}/resume/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload resume');
      }

      updateResumeText(data.resumeText);
      setUploadMessage({ type: 'success', text: 'Resume uploaded and parsed successfully!' });
      setResumeFile(null);
    } catch (err) {
      setUploadMessage({ type: 'error', text: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Start Interview Session
  const handleStartInterview = async (e) => {
    e.preventDefault();
    setIsStarting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/interview/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          difficulty,
          useResume: useResume && !!user?.resumeText,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start interview');
      }

      // Redirect to Interview Arena with active session ID
      navigate(`/arena/${data._id}`);
    } catch (err) {
      alert(err.message || 'Something went wrong while starting the interview.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            InterviewVerse AI
          </span>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-900 border border-slate-900 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto px-6 py-10 flex-grow w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Welcome User Banner */}
          <div className="p-8 bg-gradient-to-br from-indigo-950/30 to-purple-950/10 border border-indigo-900/40 rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Welcome back, {user?.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-sm text-indigo-200/80 leading-relaxed max-w-xl">
              Ready to challenge yourself? Prepare for technical roles by practicing dynamic interviews shaped by your resume and difficulty preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Resume Upload Card */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-bold text-white">Your Resume</h3>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Upload your CV in PDF format. We will parse the text dynamically so the AI can evaluate and ask questions tailoring to your background.
                </p>

                {/* Upload Status */}
                {user?.resumeText ? (
                  <div className="mb-6 p-4 bg-emerald-950/20 border border-emerald-900/50 rounded-xl flex items-start gap-2 text-emerald-300 text-xs">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Resume parsed successfully</p>
                      <p className="text-emerald-400/80 mt-0.5">Resume length: {user.resumeText.length} characters</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-amber-950/20 border border-amber-900/50 rounded-xl flex items-start gap-2 text-amber-300 text-xs">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>No resume uploaded yet. Interviews will rely on default category questions.</p>
                  </div>
                )}
              </div>

              {/* Upload Form */}
              <form onSubmit={handleUploadResume} className="space-y-4">
                <div className="relative border border-dashed border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col items-center justify-center text-center cursor-pointer group bg-slate-950/30">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-slate-400 mb-2 transition-colors" />
                  <span className="text-xs text-slate-400 font-medium">
                    {resumeFile ? resumeFile.name : 'Select Resume PDF (Max 5MB)'}
                  </span>
                </div>

                {uploadMessage.text && (
                  <p className={`text-xs ${uploadMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {uploadMessage.text}
                  </p>
                )}

                {resumeFile && (
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Uploading & Parsing...
                      </>
                    ) : (
                      'Save Resume'
                    )}
                  </button>
                )}
              </form>
            </div>

            {/* Start Interview Session Card */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Play className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Start Interview</h3>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Choose a technology category and difficulty. You will undergo a 6-question text interview.
                </p>
              </div>

              <form onSubmit={handleStartInterview} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          difficulty === diff
                            ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {user?.resumeText && (
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="useResumeCheck"
                      checked={useResume}
                      onChange={(e) => setUseResume(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label htmlFor="useResumeCheck" className="text-xs text-slate-300 cursor-pointer font-medium select-none">
                      Tailor questions with my resume
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isStarting}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-950/20"
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating Session...
                    </>
                  ) : (
                    'Launch Interview Arena'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side: History logs */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between max-h-[600px] overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <History className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Interview History</h3>
            </div>

            {loadingHistory ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <span className="text-xs">Loading sessions...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-10 border border-slate-900/60 rounded-xl bg-slate-950/10">
                <p className="text-sm text-slate-500 font-medium">No interviews yet</p>
                <p className="text-xs text-slate-600 mt-1">Start a session above to practice.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((session) => (
                  <div 
                    key={session._id}
                    onClick={() => {
                      if (session.status === 'completed') {
                        navigate(`/arena/${session._id}`);
                      } else {
                        navigate(`/arena/${session._id}`);
                      }
                    }}
                    className="p-4 bg-slate-900/30 border border-slate-900/50 hover:border-slate-800 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {session.category}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {new Date(session.createdAt).toLocaleDateString()}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                          {session.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      {session.status === 'completed' ? (
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            {session.overallScore}%
                          </span>
                          <span className="text-[9px] text-slate-500">Completed</span>
                        </div>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full animate-pulse font-semibold">
                          Resume
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/50 py-4 px-6 text-center text-xs text-slate-500 mt-10">
        InterviewVerse AI — Dynamic AI Mock Interviews.
      </footer>
    </div>
  );
}

export default Dashboard;
