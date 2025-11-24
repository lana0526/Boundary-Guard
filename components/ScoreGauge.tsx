import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const getColor = (s: number) => {
    if (s <= 20) return '#22c55e'; // Green-500
    if (s <= 40) return '#eab308'; // Yellow-500
    if (s <= 70) return '#f97316'; // Orange-500
    return '#ef4444'; // Red-500
  };

  const color = getColor(score);

  const data = [{ name: 'Score', value: score, fill: color }];

  const getLabel = (s: number) => {
    if (s <= 20) return 'Healthy';
    if (s <= 40) return 'Mild Risk';
    if (s <= 70) return 'Moderate Risk';
    return 'High Risk';
  };

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="80%" 
          outerRadius="100%" 
          barSize={10} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={30} // Recharts expects just the prop presence or a boolean/number
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 mt-1">
          {getLabel(score)}
        </span>
      </div>
    </div>
  );
};

export default ScoreGauge;
