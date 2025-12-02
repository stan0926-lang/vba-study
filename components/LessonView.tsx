import React from 'react';
import { Lesson } from '../types';
import SimpleMarkdown from './SimpleMarkdown';
import { BarChartIcon, StarIcon } from './Icons';

interface LessonViewProps {
  lesson: Lesson;
}

const DifficultyBadge: React.FC<{ level: number }> = ({ level }) => {
  // Color scale: Green -> Yellow -> Red
  const getColor = (lvl: number) => {
    if (lvl <= 2) return 'bg-green-500';
    if (lvl === 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-1.5" title={`理解難易度: ${level}/5`}>
      <BarChartIcon className="w-4 h-4 text-gray-400" />
      <span className="text-xs font-semibold text-gray-500 mr-1">難易度</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-3 rounded-sm ${
              i <= level ? getColor(level) : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const FrequencyBadge: React.FC<{ level: number }> = ({ level }) => {
  return (
    <div className="flex items-center gap-1.5" title={`実務頻出度: ${level}/5`}>
      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
        実務頻出度
      </span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= level ? 'text-amber-400' : 'text-gray-200'
            }`}
            filled={i <= level}
          />
        ))}
      </div>
    </div>
  );
};

const LessonView: React.FC<LessonViewProps> = ({ lesson }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                {lesson.category}
            </span>
            <div className="flex items-center gap-4 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <DifficultyBadge level={lesson.difficulty} />
                <div className="w-px h-4 bg-gray-300"></div>
                <FrequencyBadge level={lesson.frequency} />
            </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">{lesson.title}</h1>
      </div>
      <SimpleMarkdown content={lesson.content} />
    </div>
  );
};

export default LessonView;