import React, { useState } from 'react';
import { AnalysisResult, AnalysisState, Perspective, Language } from './types';
import { analyzeText } from './services/geminiService';
import AnalysisDashboard from './components/AnalysisDashboard';
import { Shield, MessageSquare, User, Send, Loader2, Globe } from 'lucide-react';
import clsx from 'clsx';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [perspective, setPerspective] = useState<Perspective>('received');
  const [language, setLanguage] = useState<Language>('en');
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const t = TRANSLATIONS[language];

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setAnalysisState({ isLoading: true, error: null, result: null });
    try {
      const result = await analyzeText(text, perspective, language);
      setAnalysisState({ isLoading: false, error: null, result });
    } catch (error) {
      setAnalysisState({
        isLoading: false,
        error: t.error_generic,
        result: null
      });
    }
  };

  const handleClear = () => {
    setText('');
    setAnalysisState({ isLoading: false, error: null, result: null });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
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
              {t.app_name}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4 text-sm text-slate-500 mr-2">
              <span className="hidden md:inline">{t.tagline}</span>
            </div>
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'English' : '中文'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Empty State */}
        {!analysisState.result && !analysisState.isLoading && (
          <div className="text-center mb-10 max-w-2xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-800 mb-3">{t.title}</h1>
            <p className="text-slate-600 text-lg">
              {t.subtitle}
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
              {t.tab_received}
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
              {t.tab_spoken}
            </button>
          </div>
          
          <div className="p-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={perspective === 'received' 
                ? t.placeholder_received
                : t.placeholder_spoken
              }
              className="w-full min-h-[150px] p-4 text-lg text-slate-800 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all resize-y outline-none"
            />
            
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={handleClear}
                className="text-sm text-slate-400 hover:text-slate-600 font-medium px-3 py-1"
                disabled={!text}
              >
                {t.clear}
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
                    {t.analyzing}
                  </>
                ) : (
                  <>
                    {t.analyze}
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
             <AnalysisDashboard 
                result={analysisState.result} 
                perspective={perspective} 
                language={language}
              />
          </div>
        )}
      </main>
      
      <footer className="text-center text-slate-400 py-8 text-sm">
        <p>© {new Date().getFullYear()} {t.footer}</p>
      </footer>
    </div>
  );
};

export default App;