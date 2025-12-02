import React from 'react';
import { LEARNING_ROADMAP } from '../constants';

const RoadmapView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">VBA学習スケジュール</h1>
        <p className="text-gray-500">
          10週間でVBAを基礎から実務レベルまで習得するためのロードマップです。
          週ごとに目標を設定し、着実にステップアップしていきましょう。
        </p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 md:left-8 top-4 bottom-4 w-1 bg-gradient-to-b from-green-400 to-blue-400 rounded-full opacity-30"></div>

        <div className="space-y-8">
          {LEARNING_ROADMAP.map((weekData, index) => (
            <div key={index} className="relative flex gap-6 group">
              {/* Dot Indicator */}
              <div className="flex flex-col items-center shrink-0 w-12 md:w-16">
                 <div className="w-8 h-8 rounded-full bg-white border-4 border-green-500 z-10 shadow-sm flex items-center justify-center font-bold text-xs text-green-700 group-hover:scale-110 transition-transform">
                   {weekData.week}
                 </div>
                 <div className="text-[10px] text-gray-400 font-semibold mt-1 uppercase tracking-wider">Week</div>
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  {weekData.title}
                </h3>
                <ul className="space-y-2">
                  {weekData.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-gray-600">
                      <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-green-400 shrink-0"></span>
                      <span className="text-sm md:text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl text-center border border-blue-100 mt-12">
        <h3 className="font-bold text-gray-800 mb-2">一歩ずつ着実に</h3>
        <p className="text-sm text-gray-600">
            このロードマップを完了すれば、業務を大幅に効率化できるスキルが身につきます。<br/>
            分からないことがあれば、いつでも「AI講師」に質問してくださいね！
        </p>
      </div>
    </div>
  );
};

export default RoadmapView;