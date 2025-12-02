import React from 'react';
import { VBA_CODING_STANDARDS } from '../constants';
import SimpleMarkdown from './SimpleMarkdown';
import { ShieldCheckIcon } from './Icons';

const StandardsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">VBA コーディング規約</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          「動けばいい」から脱却しよう。<br/>
          可読性、保守性、堅牢性を高めるための開発ルールです。チーム開発や将来のメンテナンスに備え、このスタンダードを遵守しましょう。
        </p>
      </div>

      <div className="grid gap-8">
        {VBA_CODING_STANDARDS.map((std, index) => (
          <div key={std.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-slate-900 p-6 flex items-start gap-4">
                <div className="text-4xl font-black text-white leading-none select-none tracking-tighter">
                    {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">{std.title}</h2>
                    <p className="text-sm text-slate-300 leading-relaxed">{std.description}</p>
                </div>
            </div>
            
            <div className="p-8">
                <SimpleMarkdown content={std.content} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-6 rounded-xl text-center border border-gray-200 mt-12">
         <p className="text-sm text-gray-600 font-medium">
             この規約は絶対ではありませんが、迷った時の「道しるべ」として活用してください。
         </p>
      </div>
    </div>
  );
};

export default StandardsView;