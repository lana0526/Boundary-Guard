import React from 'react';
import { EvidenceSpan } from '../types';
import { AlertTriangle } from 'lucide-react';

interface EvidenceHighlightProps {
  evidence: EvidenceSpan;
}

const EvidenceHighlight: React.FC<EvidenceHighlightProps> = ({ evidence }) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-md mb-3">
      <div className="flex items-start">
        <AlertTriangle className="text-amber-500 w-5 h-5 mt-0.5 flex-shrink-0 mr-3" />
        <div>
          <blockquote className="font-medium text-slate-800 mb-2 border-b border-amber-200/50 pb-2 inline-block">
            "{evidence.text}"
          </blockquote>
          <div className="flex flex-wrap gap-2 mb-2">
            {evidence.manipulation_types.map((type, i) => (
              <span key={i} className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                {type.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-600">
            {evidence.reason}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EvidenceHighlight;
