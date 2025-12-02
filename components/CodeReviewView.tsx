import React, { useState, useRef, useEffect } from 'react';
import { SearchCodeIcon, BotIcon, SendIcon } from './Icons';
import { analyzeCode, getTutorResponse } from '../services/geminiService';
import { CodeReviewResult, ChatMessage } from '../types';
import SimpleMarkdown from './SimpleMarkdown';
import RadarChart from './RadarChart';

const DEMO_CODE = `Sub ExportData()
    ' 変数宣言なし（NG）
    r = 2
    Do While Cells(r, 1).Value <> ""
        If Cells(r, 3).Value > 10000 Then
            ' Selectの多用（NG）
            Cells(r, 1).Select
            Selection.Font.Color = vbRed
        End If
        r = r + 1
    Loop
    MsgBox "完了"
End Sub`;

const CodeReviewView: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeReviewResult | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, result]);

  // Simulate loading progress
  useEffect(() => {
    if (!loading) {
      setLoadingProgress(0);
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) progress = 90; // Cap at 90% until complete
      setLoadingProgress(progress);
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  const handleReview = async () => {
    if (!code.trim() || loading) return;

    setLoading(true);
    setLoadingProgress(0);
    setResult(null);
    setChatMessages([]); // Reset chat

    try {
      const data = await analyzeCode(code);
      setLoadingProgress(100);
      setResult(data);
      // Initialize chat with a welcome message
      setChatMessages([{
        id: 'init',
        role: 'model',
        text: '診断が完了しました。修正案について詳しく聞きたい点や、具体的な書き換え方について質問があればどうぞ！',
        timestamp: new Date()
      }]);
    } catch (error) {
      alert("レビューに失敗しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading || !result) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
        // Build history
        let historyForApi = chatMessages.map(m => ({
            role: m.role,
            text: m.text
        }));

        let messageToSend = userMsg.text;

        // If this is the first user message, inject context
        if (chatMessages.length === 1) { 
            messageToSend = `
【コンテキスト: 以下のVBAコードのレビューを行いました】
\`\`\`vba
${code}
\`\`\`

【診断結果の要約】
スコア: ${JSON.stringify(result.metrics)}
いい点: ${result.strengths?.join(', ') || 'なし'}
改善点: ${result.improvements?.join(', ') || 'なし'}

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

  const loadDemo = () => {
    setCode(DEMO_CODE);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
             <SearchCodeIcon className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI コードレビュー</h1>
        </div>
        <p className="text-gray-500 ml-1">
          あなたのVBAコードをAIが診断し、5つの観点（保守性・可読性・効率性・安全性・一貫性）で評価します。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-700">コード入力</h2>
              <button
                onClick={loadDemo}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 px-3 py-1 rounded-full transition-colors"
              >
                デモコードを入力
              </button>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="' ここにVBAコードを貼り付けてください..."
              className="flex-1 w-full h-[400px] p-4 font-mono text-sm bg-gray-900 text-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4 custom-scrollbar"
              spellCheck={false}
            />

            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 relative overflow-hidden"
            >
              {loading && (
                <div 
                  className="absolute inset-0 bg-indigo-400/20 transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              )}
              <div className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AI が分析中... {Math.round(loadingProgress)}%</span>
                  </>
                ) : (
                  <>
                    <SearchCodeIcon className="w-5 h-5" />
                    <span>診断を開始する</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Result & Chat */}
        <div className="space-y-4">
          {result ? (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Result Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-700 mb-6 text-center">診断レポート</h2>
                    
                    {/* Radar Chart */}
                    <div className="mb-8 flex justify-center">
                        <RadarChart metrics={result.metrics} />
                    </div>

                    {/* Strengths Section */}
                    {result.strengths && result.strengths.length > 0 && (
                        <div className="border-t border-gray-100 pt-6 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">✨</span>
                                <h3 className="font-bold text-gray-800">いい点</h3>
                            </div>
                            <ul className="space-y-2">
                                {result.strengths.map((strength, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex gap-2">
                                        <span className="text-green-600 font-bold">✓</span>
                                        <span>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Improvements Section */}
                    {result.improvements && result.improvements.length > 0 && (
                        <div className="border-t border-gray-100 pt-6 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">💡</span>
                                <h3 className="font-bold text-gray-800">改善点</h3>
                            </div>
                            <ul className="space-y-2">
                                {result.improvements.map((improvement, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex gap-2">
                                        <span className="text-orange-600 font-bold">→</span>
                                        <span>{improvement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Suggested Code Section */}
                    {result.suggested_code && (
                        <div className="border-t border-gray-100 pt-6 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">🔧</span>
                                <h3 className="font-bold text-gray-800">改善コード案</h3>
                            </div>
                            <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto custom-scrollbar">
                                <SimpleMarkdown content={result.suggested_code} />
                            </div>
                        </div>
                    )}

                    {/* Additional Critique */}
                    {result.critique && (
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <BotIcon className="text-indigo-600 w-5 h-5" />
                                <h3 className="font-bold text-gray-800">詳細なアドバイス</h3>
                            </div>
                            <div className="text-sm leading-relaxed">
                                <SimpleMarkdown content={result.critique} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Interface */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
                     <div className="p-4 border-b border-gray-100 bg-indigo-50/50 flex items-center gap-2">
                         <BotIcon className="w-5 h-5 text-indigo-600" />
                         <span className="font-bold text-gray-700">レビューについて質問</span>
                     </div>
                     
                     <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-gray-50/30">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                                        <BotIcon className="w-4 h-4 text-indigo-600" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] rounded-2xl p-3 px-4 ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 border border-gray-100 pl-0 pt-1'
                                }`}>
                                     {msg.role === 'model' ? (
                                        <SimpleMarkdown content={msg.text} />
                                    ) : (
                                        <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                             <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                                    <BotIcon className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div className="flex items-center gap-1.5 pt-3">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                     </div>

                     <div className="p-4 border-t border-gray-100 bg-white">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                                placeholder="修正コードの書き方などを質問..."
                                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                                disabled={isChatLoading}
                            />
                            <button
                                onClick={handleChatSend}
                                disabled={isChatLoading || !chatInput.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors shadow-sm"
                            >
                                <SendIcon className="w-5 h-5"/>
                            </button>
                        </div>
                     </div>
                </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              {loading ? (
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <SearchCodeIcon className="w-8 h-8 text-indigo-400" />
                    </div>
                    <p>コードを分析しています...<br/>これには数秒かかる場合があります。</p>
                </div>
              ) : (
                <>
                    <SearchCodeIcon className="w-16 h-16 mb-4 opacity-20" />
                    <p>左側のフォームにコードを入力して<br/>「診断を開始する」を押してください。</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReviewView;