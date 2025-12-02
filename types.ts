export enum ViewMode {
  LESSON = 'LESSON',
  TUTOR = 'TUTOR',
  QUIZ = 'QUIZ',
  REVIEW = 'REVIEW', // Added
  ROADMAP = 'ROADMAP',
  STANDARDS = 'STANDARDS'
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  content: string; // Markdown-like content
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=Easy, 5=Hard
  frequency: 1 | 2 | 3 | 4 | 5; // 1=Rare, 5=Essential
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  suggestedQuestions?: string[]; // Added: Suggestions for follow-up questions
}

export interface QuizState {
  topic: string;
  loading: boolean;
  currentQuestion: QuizQuestion | null;
  selectedOption: number | null;
  score: number;
  showResult: boolean;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  items: string[];
}

export interface CodingStandard {
  id: number;
  title: string;
  description: string;
  content: string; // Markdown
}

export interface ReviewMetrics {
  maintainability: number; // 保守性
  readability: number;     // 可読性
  efficiency: number;      // 効率性
  robustness: number;      // 安全性
  consistency: number;     // 一貫性
}

export interface CodeReviewResult {
  metrics: ReviewMetrics;
  strengths: string[];     // いい点の配列
  improvements: string[];  // 改善点の配列
  suggested_code: string;  // 改善されたコード案
  critique?: string;       // 後方互換性のための保留フィールド
}