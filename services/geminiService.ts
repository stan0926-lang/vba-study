import { QuizQuestion, CodeReviewResult } from '../types';

// Google GenAI SDKは削除し、Flaskサーバー経由で呼び出します

/**
 * AI Tutor Chat
 */
export const getTutorResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  message: string
): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message }),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "申し訳ありません。サーバーとの通信でエラーが発生しました。";
  }
};

/**
 * Quiz Generation
 */
export const generateQuizQuestion = async (topic: string): Promise<QuizQuestion> => {
  try {
    const response = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data as QuizQuestion;
  } catch (error) {
    console.error("Quiz Error:", error);
    throw new Error("クイズの生成に失敗しました。");
  }
};

/**
 * Code Review
 */
export const analyzeCode = async (code: string): Promise<CodeReviewResult> => {
  try {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data as CodeReviewResult;
  } catch (error) {
    console.error("Review Error:", error);
    throw new Error("コードの分析に失敗しました。");
  }
};
