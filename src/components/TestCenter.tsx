import React, { useState } from 'react';
import type { Difficulty, Question, TestResult } from '../types';
import { generateQuestionsForTestAsync } from '../services/testQuestionGenerator';
import { ActiveTestRunner } from './ActiveTestRunner';
import { 
  ShieldCheck, 
  Play, 
  BookMarked, 
  Sliders, 
  AlertCircle
} from 'lucide-react';

interface TestCenterProps {
  onTestCompleted: (result: TestResult) => void;
  onTestActiveStateChange: (isActive: boolean) => void;
}

export const TestCenter: React.FC<TestCenterProps> = ({
  onTestCompleted,
  onTestActiveStateChange
}) => {
  const [topic, setTopic] = useState('Calculus & Differential Equations');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [timeLimit, setTimeLimit] = useState<number>(5); // minutes
  
  const [activeSession, setActiveSession] = useState<{
    topic: string;
    difficulty: Difficulty;
    timeLimitMinutes: number;
    questions: Question[];
  } | null>(null);

  const predefinedTopics = [
    'History',
    'Data Structures & Algorithms',
    'Calculus & Differential Equations',
    'Classical Mechanics & Kinematics',
    'Organic Chemistry & Cell Bio',
    'Data Structures & Algorithms',
    'Microeconomics & Market Analysis',
    'Custom Topic...'
  ];

  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = topic === 'Custom Topic...' ? (customTopic.trim() || 'History') : topic;

    setIsGenerating(true);
    try {
      const generated = await generateQuestionsForTestAsync({
        topic: finalTopic,
        difficulty,
        count: questionCount
      });

      const strictFilteredQuestions = generated.filter((q) => q.topic === finalTopic);

      setActiveSession({
        topic: finalTopic,
        difficulty,
        timeLimitMinutes: timeLimit,
        questions: strictFilteredQuestions.length > 0 ? strictFilteredQuestions : generated
      });

      onTestActiveStateChange(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinish = (result: TestResult) => {
    setActiveSession(null);
    onTestActiveStateChange(false);
    onTestCompleted(result);
  };

  const handleCancel = () => {
    setActiveSession(null);
    onTestActiveStateChange(false);
  };

  if (activeSession) {
    return (
      <ActiveTestRunner
        topic={activeSession.topic}
        difficulty={activeSession.difficulty}
        timeLimitMinutes={activeSession.timeLimitMinutes}
        questions={activeSession.questions}
        onFinishTest={handleFinish}
        onCancelTest={handleCancel}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="space-y-6">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20 mb-3">
              <ShieldCheck size={14} className="text-emerald-300" />
              Proctored Test Environment
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Test Centre & Anti-Cheating Simulator
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
              Configure topic, difficulty, and duration. Tests blend auto-scored MCQs with short-answer calculative items paired with our interactive self-grading system.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
            <ShieldCheck size={240} />
          </div>
        </div>

        {/* Configuration Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">Exam Parameters & Syllabus</h2>
          </div>

          <form onSubmit={handleStartTest} className="space-y-6">
            
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Select Subject or Syllabus Topic
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {predefinedTopics.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTopic(item)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                      topic === item
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <BookMarked size={14} className={topic === item ? 'text-blue-600' : 'text-slate-400'} />
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>

              {topic === 'Custom Topic...' && (
                <div className="pt-2">
                  <input
                    type="text"
                    required
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Enter custom syllabus (e.g. Thermodynamics, Linear Algebra, World History)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-xs sm:text-sm bg-blue-50/30"
                  />
                </div>
              )}
            </div>

            {/* Difficulty, Count & Timer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  2. Difficulty Level
                </label>
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                        difficulty === lvl
                          ? 'bg-white text-blue-600 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  3. Question Count
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-xs font-semibold bg-white"
                >
                  <option value={4}>4 Questions (Quick Sprint)</option>
                  <option value={5}>5 Questions (Balanced)</option>
                  <option value={8}>8 Questions (In-depth Test)</option>
                </select>
              </div>

              {/* Time Limit */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  4. Time Limit
                </label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-xs font-semibold bg-white"
                >
                  <option value={3}>3 Minutes (Rapid Blitz)</option>
                  <option value={5}>5 Minutes (Standard)</option>
                  <option value={10}>10 Minutes (Thorough)</option>
                </select>
              </div>
            </div>

            {/* Anti-Cheating Advisory Note */}
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Strict Proctoring Rule:</span> Once the test initiates, you must remain on this browser tab. Switching tabs, alt-tabbing, minimizing the window, or clicking another application will instantly trigger our Anti-Cheat Disqualification Protocol and terminate the test with 0 marks.
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play size={16} fill="currentColor" />
                <span>{isGenerating ? "Preparing Test..." : "Begin Proctored Test"}</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

