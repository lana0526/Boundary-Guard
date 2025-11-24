import React, { useState } from 'react';
import { AnalysisResult, AnalysisState, Perspective } from './types';
import { analyzeText } from './services/geminiService';
import AnalysisDashboard from './components/AnalysisDashboard';
import { Shield, MessageSquare, User, Send, Loader2, Info } from 'lucide-react';
import clsx from 'clsx';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [perspective, setPerspective] = useState<Perspective>('received');
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setAnalysisState({ isLoading: true, error: null, result: null });
    try {
      const result = await analyzeText(text, perspective);
      setAnalysisState({ isLoading: false, error: null, result });
    } catch (error) {
      setAnalysisState({
        isLoading: false,
        error: "An error occurred while analyzing the text. Please try again.",
        result: null
      });
    }
  };

  const handleClear = () => {
    setText('');
    setAnalysisState({ isLoading: false, error: null, result: null });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/30">
              <Shield size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              Boundary Guard
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-sm text-slate-500">
            <span className="flex items-center"><Shield size={14} className="mr-1" /> Safe</span>
            <span className="flex items-center"><User size={14} className="mr-1" /> Private</span>
            <span className="flex items-center"><Info size={14} className="mr-1" /> AI-Powered</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Empty State */}
        {!analysisState.result && !analysisState.isLoading && (
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-3">Check Your Conversations</h1>
            <p className="text-slate-600 text-lg">
              Detect manipulative patterns, guilt-tripping, or gaslighting in messages you receive or send. Get objective, psychological insights instantly.
            </p>
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 transition-all duration-300">
          <div className="p-1 bg-slate-100 flex border-b border-slate-200">
            <button
              onClick={() => setPerspective('received')}
              className={clsx(
                "flex-1 flex items-center justify-center py-3 text-sm font-medium rounded-tl-xl rounded-tr-sm transition-colors",
                perspective === 'received' 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              I Received This
            </button>
            <button
              onClick={() => setPerspective('spoken_by_user')}
              className={clsx(
                "flex-1 flex items-center justify-center py-3 text-sm font-medium rounded-tl-sm rounded-tr-xl transition-colors",
                perspective === 'spoken_by_user' 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              <User className="w-4 h-4 mr-2" />
              I Said This
            </button>
          </div>
          
          <div className="p-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={perspective === 'received' 
                ? "Paste the message you received here... (e.g., 'If you really loved me, you wouldn't go out with your friends.')" 
                : "Type what you want to say here... (e.g., 'You always make me angry, it's your fault.')"
              }
              className="w-full min-h-[150px] p-4 text-lg text-slate-800 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all resize-y outline-none"
            />
            
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={handleClear}
                className="text-sm text-slate-400 hover:text-slate-600 font-medium px-3 py-1"
                disabled={!text}
              >
                Clear
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!text.trim() || analysisState.isLoading}
                className={clsx(
                  "flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-md hover:shadow-lg",
                  !text.trim() || analysisState.isLoading
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5"
                )}
              >
                {analysisState.isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Message
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {analysisState.error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center mb-8 animate-in fade-in slide-in-from-top-2">
            <Shield className="w-5 h-5 mr-3" />
            {analysisState.error}
          </div>
        )}

        {/* Results Section */}
        {analysisState.result && (
          <div className="scroll-mt-20" id="results">
             <AnalysisDashboard result={analysisState.result} perspective={perspective} />
          </div>
        )}
      </main>
      
      <footer className="text-center text-slate-400 py-8 text-sm">
        <p>© {new Date().getFullYear()} Boundary Guard. Not a substitute for professional therapy or legal advice.</p>
      </footer>
    </div>
  );
};

export default App;
