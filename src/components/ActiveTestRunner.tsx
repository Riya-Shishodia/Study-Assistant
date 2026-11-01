import React, { useState, useEffect } from 'react';
import type { Question, QuestionResponse, TestResult, Difficulty } from '../types';
import { useAntiCheat } from '../hooks/useAntiCheat';
import { 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  Send,
  HelpCircle,
  XCircle
} from 'lucide-react';

interface ActiveTestRunnerProps {
  topic: string;
  difficulty: Difficulty;
  timeLimitMinutes: number;
  questions: Question[];
  onFinishTest: (result: TestResult) => void;
  onCancelTest?: () => void;
}

export const ActiveTestRunner: React.FC<ActiveTestRunnerProps> = ({
  topic,
  difficulty,
  timeLimitMinutes,
  questions,
  onFinishTest
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(timeLimitMinutes * 60);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Anti-Cheat Engine Activation
  useAntiCheat({
    enabled: !isDisqualified,
    onViolation: (reason) => {
      setIsDisqualified(true);
      setDisqualificationReason(reason);
    }
  });

  // Countdown timer
  useEffect(() => {
    if (isDisqualified) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitFinal(false);
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isDisqualified]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentQ.id]: option
    }));
  };

  const handleShortAnswerChange = (val: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentQ.id]: val
    }));
  };

  const handleSubmitFinal = (isAntiCheatViolation: boolean = false, violationText?: string) => {
    let mcqScore = 0;
    let shortAnswerScore = 0;
    let totalScore = 0;
    let maxScore = 0;

    const formattedResponses: QuestionResponse[] = questions.map((q) => {
      const ans = responses[q.id]?.trim() || '';
      maxScore += q.marks;

      if (q.type === 'mcq') {
        const isCorrect = ans.toLowerCase() === q.correctAnswer.toLowerCase();
        const awarded = isCorrect ? q.marks : 0;
        mcqScore += awarded;
        totalScore += awarded;
        return {
          questionId: q.id,
          userAnswer: ans,
          isCorrect,
          awardedMarks: awarded,
          selfChecked: true
        };
      } else {
        const exactMatch = ans.toLowerCase() === q.correctAnswer.toLowerCase();
        const autoAward = exactMatch ? q.marks : 0;
        shortAnswerScore += autoAward;
        totalScore += autoAward;
        return {
          questionId: q.id,
          userAnswer: ans,
          isCorrect: exactMatch,
          awardedMarks: autoAward,
          selfChecked: false
        };
      }
    });

    const accuracy = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    const result: TestResult = {
      id: `test_${Date.now()}`,
      topic,
      difficulty,
      timeLimitMinutes,
      timeSpentSeconds: timeSpent,
      completedAt: new Date().toISOString(),
      totalQuestions: questions.length,
      mcqScore: isAntiCheatViolation ? 0 : mcqScore,
      shortAnswerScore: isAntiCheatViolation ? 0 : shortAnswerScore,
      totalScore: isAntiCheatViolation ? 0 : totalScore,
      maxScore,
      accuracyPercentage: isAntiCheatViolation ? 0 : accuracy,
      status: isAntiCheatViolation ? 'terminated_anti_cheat' : 'completed',
      terminationReason: violationText,
      responses: formattedResponses,
      questions
    };

    onFinishTest(result);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(responses).filter((k) => responses[k]?.trim().length > 0).length;

  return (
    <div className="min-h-[calc(100vh-4.1rem)] bg-slate-50 py-6 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Anti-Cheat Shield Status Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <ShieldAlert className="w-5 h-5 text-blue-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">{topic}</h3>
                <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Anti-Cheat Proctoring Enabled: Tab switching or focus loss will terminate exam.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm ${
              secondsRemaining < 120 
                ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              <Clock size={16} />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer"
            >
              Finish Test
            </button>
          </div>
        </div>

        {/* Progress Bar & Question Palette */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{answeredCount} of {questions.length} Answered ({Math.round((answeredCount/questions.length)*100)}%)</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {questions.map((q, idx) => {
              const isAnswered = !!responses[q.id]?.trim();
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : isAnswered
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Viewport */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {currentQ.type === 'mcq' ? 'Multiple Choice' : 'Short Answer / Calculative'}
              </span>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                {currentQ.prompt}
              </h2>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {currentQ.marks} Marks
              </span>
            </div>
          </div>

          <div className="pt-2">
            {currentQ.type === 'mcq' && currentQ.options ? (
              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = responses[currentQ.id] === option;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(option)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left text-sm transition cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-medium shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Your Solution / Numerical Answer
                </label>
                <input
                  type="text"
                  value={responses[currentQ.id] || ''}
                  onChange={(e) => handleShortAnswerChange(e.target.value)}
                  placeholder="Type your final calculated answer or concise answer..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 text-sm font-mono transition bg-slate-50/50"
                />
                <p className="text-[11px] text-slate-400">
                  You will be able to review step-by-step working and adjust your marks in the interactive Self-Check section.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                currentIndex === 0 
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
              }`}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <span>Next Question</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <span>Review & Submit</span>
                <Send size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <HelpCircle size={26} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Ready to Submit?</h3>
              <p className="text-xs text-slate-500 mt-1">
                You have answered {answeredCount} out of {questions.length} questions. You will proceed to the instant MCQ scorecard and interactive Self-Check section.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Back to Test
              </button>
              <button
                onClick={() => handleSubmitFinal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {isDisqualified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-rose-500 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <XCircle size={36} />
            </div>
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Security Protocol Triggered
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Test Terminated Immediately
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our strict proctoring engine detected a violation of academic integrity. The active test session has been cancelled and logged in your profile record with zero credit.
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle size={14} className="shrink-0" />
                <span>Violation Reason:</span>
              </div>
              <p className="font-mono text-[11px] break-all">{disqualificationReason}</p>
              <p className="text-[10px] text-rose-600">Timestamp: {new Date().toLocaleTimeString()}</p>
            </div>

            <button
              onClick={() => handleSubmitFinal(true, disqualificationReason)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-600/20 transition cursor-pointer"
            >
              Acknowledge & Record Disqualification
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
