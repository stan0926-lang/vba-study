import React, { useState, useRef, useEffect } from 'react';
import { QuizState, ChatMessage, Lesson } from '../types';
import { generateQuizQuestion, getTutorResponse } from '../services/geminiService';
import { VBA_CURRICULUM } from '../constants';
import { CheckCircleIcon, XCircleIcon, BotIcon, LightbulbIcon, SendIcon } from './Icons';
import SimpleMarkdown from './SimpleMarkdown';

const QuizMode: React.FC = () => {
  // Group lessons by category for the granular dropdown
  const lessonsByCategory = VBA_CURRICULUM.reduce((acc, lesson) => {
    if (!acc[lesson.category]) acc[lesson.category] = [];
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  // Helper to format the topic string for AI context
  const getTopicString = (lesson: Lesson) => `${lesson.category}: ${lesson.title}`;

  const [state, setState] = useState<QuizState>({
    // Initialize with the first lesson of the curriculum
    topic: getTopicString(VBA_CURRICULUM[0]),
    loading: false,
    currentQuestion: null,
    selectedOption: null,
    score: 0,
    showResult: false
  });

  // Chat specific state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.showResult && chatMessages.length === 0) {
       // Construct the initial message
       const initialText = 'この問題について詳しく知りたいことはありますか？解説で分からない点があれば聞いてくださいね！';
       
       setChatMessages([{
         id: 'init',
         role: 'model',
         text: initialText,
         timestamp: new Date()
       }]);
    }
  }, [state.showResult, state.currentQuestion]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, state.showResult]);

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, loading: true, showResult: false, selectedOption: null, currentQuestion: null }));
    setChatMessages([]); // Reset chat for new question
    try {
      const question = await generateQuizQuestion(state.topic);
      setState(prev => ({ ...prev, loading: false, currentQuestion: question }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, loading: false }));
      alert("クイズの生成に失敗しました。APIキーまたは接続を確認してください。");
    }
  };

  const handleOptionSelect = (index: number) => {
    if (state.showResult) return;
    setState(prev => ({ ...prev, selectedOption: index, showResult: true }));
  };

  const handleChatSend = async (textInput?: string) => {
    const textToSend = textInput || chatInput;
    if (!textToSend.trim() || isChatLoading || !state.currentQuestion) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: textToSend,
        timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
        // Construct history with context for the first user message
        let historyForApi = chatMessages.map(m => ({
            role: m.role,
            text: m.text
        }));

        let messageToSend = userMsg.text;
        
        // If this is the first interaction, give AI context about the quiz
        if (chatMessages.length === 1) { // 1 because 'init' message is there
             messageToSend = `【文脈: ユーザーは今、以下のクイズに答え、解説を見ました】
問題: ${state.currentQuestion.question}
正解: ${state.currentQuestion.options[state.currentQuestion.correctAnswerIndex]}
解説: ${state.currentQuestion.explanation}

【ユーザーの質問】
${userMsg.text}`;
        }

        const responseText = await getTutorResponse(historyForApi, messageToSend);

        setChatMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: new Date()
        }]);

    } catch (error) {
        setChatMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: "エラーが発生しました。",
            timestamp: new Date(),
            isError: true
        }]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const isCorrect = state.currentQuestion && state.selectedOption === state.currentQuestion.correctAnswerIndex;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24">
      {/* Quiz Generator Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <LightbulbIcon className="text-green-600"/> 
            AI クイズ生成
        </h2>
        
        <div className="flex gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex-1 min-w-[200px] relative">
            <select 
                value={state.topic}
                onChange={(e) => setState(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full appearance-none border border-gray-200 bg-gray-50 rounded-lg pl-4 pr-10 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-700 font-medium cursor-pointer"
            >
                {Object.entries(lessonsByCategory).map(([category, lessons]) => (
                <optgroup key={category} label={category} className="font-bold text-gray-900 not-italic">
                    {lessons.map(lesson => (
                        <option 
                            key={lesson.id} 
                            value={getTopicString(lesson)}
                            className="text-gray-700 font-normal"
                        >
                            {lesson.title}
                        </option>
                    ))}
                </optgroup>
                ))}
            </select>
            {/* Custom Arrow Icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={state.loading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 min-w-[140px] shadow-sm whitespace-nowrap"
          >
            {state.loading ? '作成中...' : '出題する'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 ml-1">
            ※ 選択したレッスンの内容に特化した問題が生成されます。
        </p>
      </div>

      {/* Question Card */}
      {state.currentQuestion && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-lg text-gray-900 mb-8 leading-relaxed">
             <SimpleMarkdown content={state.currentQuestion.question} />
          </div>

          <div className="space-y-3">
            {state.currentQuestion.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 ";
              
              if (state.showResult) {
                if (idx === state.currentQuestion?.correctAnswerIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-900 font-medium ring-1 ring-green-500";
                } else if (idx === state.selectedOption) {
                  btnClass += "border-red-400 bg-red-50 text-red-900";
                } else {
                  btnClass += "border-gray-100 text-gray-400 opacity-60";
                }
              } else {
                btnClass += "border-gray-200 hover:border-green-400 hover:bg-green-50/50 text-gray-700 hover:shadow-sm";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={btnClass}
                  disabled={state.showResult}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                        state.showResult && idx === state.currentQuestion?.correctAnswerIndex ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                        {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-base">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result & Explanation */}
          {state.showResult && (
            <div className={`mt-8 p-6 rounded-2xl ${isCorrect ? 'bg-green-50 border border-green-100' : 'bg-blue-50 border border-blue-100'}`}>
              <div className="flex items-start gap-4">
                {isCorrect ? <CheckCircleIcon className="text-green-600 w-8 h-8 shrink-0"/> : <XCircleIcon className="text-red-500 w-8 h-8 shrink-0"/>}
                <div className="w-full">
                    <h4 className={`text-lg font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-blue-900'}`}>
                        {isCorrect ? '正解です！' : '残念、不正解です...'}
                    </h4>
                    <div className="text-gray-800 text-base leading-relaxed space-y-2">
                        <SimpleMarkdown content={state.currentQuestion.explanation} />
                    </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                    onClick={handleGenerate}
                    className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all"
                >
                    次の問題へ
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post-Quiz Chat Interface */}
      {state.showResult && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-700">
             <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                 <h3 className="font-semibold text-gray-700 flex items-center gap-2 text-sm">
                     <BotIcon className="w-4 h-4" /> AI解説チャット
                 </h3>
             </div>
             
             <div className="p-6 space-y-6 bg-white max-h-[400px] overflow-y-auto custom-scrollbar">
                {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                                <BotIcon className="w-4 h-4 text-green-600" />
                            </div>
                        )}
                        <div className={`max-w-[85%] rounded-2xl p-3 px-4 ${
                            msg.role === 'user' 
                            ? 'bg-gray-100 text-gray-800 rounded-br-none' 
                            : 'bg-white text-gray-800 pl-0 pt-1'
                        }`}>
                             {msg.role === 'model' ? (
                                <SimpleMarkdown content={msg.text} />
                            ) : (
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            )}
                        </div>
                    </div>
                ))}

                {/* Suggested Questions Buttons (Only visible when chat has just started) */}
                {chatMessages.length === 1 && state.currentQuestion?.suggestedQuestions && state.currentQuestion.suggestedQuestions.length > 0 && (
                     <div className="pl-11 pr-4 animate-in fade-in duration-500">
                         <p className="text-xs text-gray-400 font-medium mb-2 ml-1">👇 気になることをタップして質問</p>
                         <div className="flex flex-wrap gap-2">
                             {state.currentQuestion.suggestedQuestions.map((q, idx) => (
                                 <button
                                     key={idx}
                                     onClick={() => handleChatSend(q)}
                                     className="text-sm bg-white hover:bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-xl transition-all shadow-sm hover:shadow text-left"
                                 >
                                     {q}
                                 </button>
                             ))}
                         </div>
                     </div>
                )}

                {isChatLoading && (
                    <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                            <BotIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex items-center gap-1.5 pt-3">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef}></div>
             </div>

             <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                        placeholder="解説について質問する..."
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
                        disabled={isChatLoading}
                    />
                    <button
                        onClick={() => handleChatSend()}
                        disabled={isChatLoading || !chatInput.trim()}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors shadow-sm"
                    >
                        <SendIcon className="w-5 h-5"/>
                    </button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default QuizMode;