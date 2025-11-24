import React from 'react';
import { AnalysisResult, Perspective, Language } from '../types';
import ScoreGauge from './ScoreGauge';
import EvidenceHighlight from './EvidenceHighlight';
import GuidanceCard from './GuidanceCard';
import { ShieldCheck, ShieldAlert, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS, MANIPULATION_LABELS } from '../constants';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  perspective: Perspective;
  language: Language;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, perspective, language }) => {
  const t = TRANSLATIONS[language];
  const manipulationLabels = MANIPULATION_LABELS[language];

  const suggestions = perspective === 'received' 
    ? result.response_suggestions 
    : result.rewrite_suggestions_if_self_spoken;

  const hasManipulation = result.manipulation_present;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Overview Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <ScoreGauge score={result.overall_risk_score} language={language} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              {hasManipulation ? (
                <div className="bg-red-100 text-red-700 p-2 rounded-full">
                  <ShieldAlert size={24} />
                </div>
              ) : (
                <div className="bg-green-100 text-green-700 p-2 rounded-full">
                  <ShieldCheck size={24} />
                </div>
              )}
              <h2 className="text-2xl font-bold text-slate-800">
                {hasManipulation ? t.risk_detected : t.healthy_pattern}
              </h2>
            </div>
            
            <p className="text-slate-600 leading-relaxed">
              {result.explanation.what_is_happening}
            </p>

            {result.manipulation_types.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {result.manipulation_types.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium border border-slate-200">
                    {manipulationLabels[tag] || tag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Analysis & Evidence */}
        <div className="space-y-6">
          {/* Deep Dive Explanation */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              {t.why_matters}
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">{t.psych_impact}</h4>
                <p className="text-slate-700">{result.explanation.why_harmful}</p>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  {t.healthier_contrast}
                </h4>
                <p className="text-emerald-800 italic">"{result.explanation.contrast_example}"</p>
              </div>
            </div>
          </div>

          {/* Evidence Section - Only if there is evidence */}
          {result.highlighted_text.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                {t.identified_triggers}
              </h3>
              <div className="space-y-2">
                {result.highlighted_text.map((evidence, idx) => (
                  <EvidenceHighlight key={idx} evidence={evidence} language={language} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Guidance */}
        <div className="bg-indigo-900/5 rounded-xl border border-indigo-100 p-6 h-fit">
          <h3 className="text-lg font-bold text-indigo-900 mb-4">
            {perspective === 'received' ? t.suggested_responses : t.recommended_rewrites}
          </h3>
          <p className="text-sm text-indigo-700 mb-6">
            {perspective === 'received' 
              ? t.guidance_received
              : t.guidance_spoken}
          </p>
          
          <div className="space-y-4">
            {suggestions?.map((s, i) => (
              <GuidanceCard key={i} suggestion={s} index={i} language={language} />
            ))}
            {(!suggestions || suggestions.length === 0) && (
              <div className="text-center py-8 text-slate-500">
                {t.no_suggestions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;