import React from 'react';
import { Suggestion } from '../types';
import { MessageCircle, ArrowRight } from 'lucide-react';

interface GuidanceCardProps {
  suggestion: Suggestion;
  index: number;
}

const GuidanceCard: React.FC<GuidanceCardProps> = ({ suggestion, index }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center mb-2">
        <div className="bg-indigo-50 p-1.5 rounded-full mr-2 text-indigo-600">
          <MessageCircle size={16} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          Option {index + 1}: {suggestion.style.replace(/_/g, ' ')}
        </span>
      </div>
      <p className="text-slate-700 leading-relaxed italic">
        "{suggestion.text}"
      </p>
    </div>
  );
};

export default GuidanceCard;
