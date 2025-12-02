import React, { useState } from 'react';
import { ViewMode, Lesson } from './types';
import { VBA_CURRICULUM } from './constants';
import LessonView from './components/LessonView';
import AITutor from './components/AITutor';
import QuizMode from './components/QuizMode';
import CodeReviewView from './components/CodeReviewView';
import RoadmapView from './components/RoadmapView';
import StandardsView from './components/StandardsView';
import { MessageSquareIcon, LightbulbIcon, MenuIcon, CalendarIcon, ShieldCheckIcon, SearchCodeIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.LESSON);
  const [activeLesson, setActiveLesson] = useState<Lesson>(VBA_CURRICULUM[0]);
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop

  // Group lessons by category
  const lessonsByCategory = VBA_CURRICULUM.reduce((acc, lesson) => {
    if (!acc[lesson.category]) acc[lesson.category] = [];
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const renderContent = () => {
    switch (currentView) {
      case ViewMode.TUTOR:
        return <AITutor />;
      case ViewMode.QUIZ:
        return <QuizMode />;
      case ViewMode.REVIEW:
        return <CodeReviewView />;
      case ViewMode.ROADMAP:
        return <RoadmapView />;
      case ViewMode.STANDARDS:
        return <StandardsView />;
      case ViewMode.LESSON:
      default:
        return <LessonView lesson={activeLesson} />;
    }
  };

  const getHeaderTitle = () => {
    switch (currentView) {
        case ViewMode.LESSON: return activeLesson.title;
        case ViewMode.TUTOR: return 'AI 講師アシスタント';
        case ViewMode.QUIZ: return '理解度チェック';
        case ViewMode.REVIEW: return 'AI コードレビュー';
        case ViewMode.ROADMAP: return '学習ロードマップ';
        case ViewMode.STANDARDS: return 'コーディング規約';
        default: return '';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <button 
            className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
            onClick={() => setSidebarOpen(true)}
        >
            <MenuIcon />
        </button>
      )}

      {/* Sidebar */}
      <aside 
        className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative z-40 w-72 h-full bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
              <h1 className="text-xl font-bold text-green-400 tracking-wider">VBA MASTER</h1>
              <p className="text-xs text-slate-400">ようこそ、コードの世界へ！</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
            <MenuIcon />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {/* Main Navigation */}
          <div className="px-4 mb-6 space-y-1">
            <button
              onClick={() => setCurrentView(ViewMode.TUTOR)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === ViewMode.TUTOR 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' 
                : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MessageSquareIcon />
              <span className="font-medium">AI 講師</span>
            </button>
            <button
              onClick={() => setCurrentView(ViewMode.QUIZ)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === ViewMode.QUIZ 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' 
                : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LightbulbIcon />
              <span className="font-medium">クイズモード</span>
            </button>
            <button
              onClick={() => setCurrentView(ViewMode.REVIEW)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === ViewMode.REVIEW 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' 
                : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <SearchCodeIcon />
              <span className="font-medium">コードレビュー</span>
            </button>
            <button
              onClick={() => setCurrentView(ViewMode.ROADMAP)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === ViewMode.ROADMAP 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' 
                : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CalendarIcon />
              <span className="font-medium">学習ロードマップ</span>
            </button>
            <button
              onClick={() => setCurrentView(ViewMode.STANDARDS)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === ViewMode.STANDARDS 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' 
                : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShieldCheckIcon />
              <span className="font-medium">コーディング規約</span>
            </button>
          </div>

          <div className="px-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            カリキュラム
          </div>

          {Object.entries(lessonsByCategory).map(([category, lessons]) => (
            <div key={category} className="mb-4">
              <div className="px-6 py-2 text-sm font-semibold text-slate-300 flex items-center gap-2">
                 {category}
              </div>
              <div>
                {lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLesson(lesson);
                      setCurrentView(ViewMode.LESSON);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className={`w-full text-left pl-10 pr-4 py-2 text-sm transition-colors border-l-2 ${
                      currentView === ViewMode.LESSON && activeLesson.id === lesson.id
                        ? 'border-green-500 text-green-400 bg-slate-800/50'
                        : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    {lesson.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
            &copy; 2024 VBA Master AI
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full w-full relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
           <div className="flex items-center gap-4">
             {!isSidebarOpen && <div className="w-8"></div>} {/* Spacer for menu button */}
             <h2 className="text-xl font-bold text-gray-800">
               {getHeaderTitle()}
             </h2>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 custom-scrollbar">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;