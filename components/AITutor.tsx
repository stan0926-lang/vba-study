import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getTutorResponse } from '../services/geminiService';
import { SendIcon, BotIcon } from './Icons';
import SimpleMarkdown from './SimpleMarkdown';

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "こんにちは！VBA講師AIです。\nマクロの書き方、デバッグの方法、特定の概念について何でも聞いてください！",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const responseText = await getTutorResponse(history, userMsg.text);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "申し訳ありません。サーバーとの通信でエラーが発生しました。",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar scroll-smooth">
            <div className="max-w-3xl mx-auto space-y-6 pb-24">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {/* Avatar for AI */}
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                                <BotIcon className="w-5 h-5 text-green-600" />
                            </div>
                        )}
                        
                        {/* Message Bubble */}
                        <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${
                            msg.role === 'user' 
                            ? 'bg-gray-100 text-gray-800 rounded-br-none' 
                            : 'bg-transparent text-gray-800 pl-0 pt-1'
                        }`}>
                            {msg.role === 'model' ? (
                                <div className="text-base leading-relaxed">
                                    <SimpleMarkdown content={msg.text} />
                                </div>
                            ) : (
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                            <BotIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
            <div className="max-w-3xl mx-auto">
                <div className="relative shadow-lg border border-gray-200 rounded-2xl bg-white flex items-end overflow-hidden focus-within:ring-2 focus-within:ring-green-100 focus-within:border-green-400 transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="VBAについて質問する..."
                        className="flex-1 max-h-48 min-h-[56px] py-4 pl-4 pr-12 focus:outline-none resize-none bg-transparent"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 bottom-2 p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 text-white rounded-lg transition-colors"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-center text-xs text-gray-400 mt-2">
                    AIは間違いを犯す可能性があります。コードを実行する前に必ず確認してください。
                </div>
            </div>
        </div>
    </div>
  );
};

export default AITutor;