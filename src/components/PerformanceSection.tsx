import React, { useState } from 'react';
import type { TestResult, QuestionResponse } from '../types';
import { storageService } from '../services/storageService';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Award,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BarChart,
  Calendar
} from 'lucide-react';

interface PerformanceSectionProps {
  testResults: TestResult[];
  onUpdateResults: () => void;
  onRetakeTestClick: () => void;
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  testResults,
  onUpdateResults,
  onRetakeTestClick
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(
    testResults[0]?.id || null
  );
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  const currentTest = testResults.find((t) => t.id === selectedTestId) || testResults[0];

  const toggleExpand = (qId: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleGradeSelfCheck = (questionId: string, awardedMarks: number) => {
    if (!currentTest) return;

    const updatedResponses: QuestionResponse[] = currentTest.responses.map((resp) => {
      if (resp.questionId === questionId) {
        const question = currentTest.questions.find((q) => q.id === questionId);
        const maxMarks = question?.marks || 0;
        return {
          ...resp,
          awardedMarks,
          isCorrect: awardedMarks === maxMarks,
          selfChecked: true
        };
      }
      return resp;
    });

    let totalScore = 0;
    let shortAnswerScore = 0;
    let mcqScore = 0;

    updatedResponses.forEach((r) => {
      totalScore += r.awardedMarks;
      const q = currentTest.questions.find((item) => item.id === r.questionId);
      if (q?.type === 'mcq') {
        mcqScore += r.awardedMarks;
      } else {
        shortAnswerScore += r.awardedMarks;
      }
    });

    const accuracyPercentage = currentTest.maxScore > 0 
      ? Math.round((totalScore / currentTest.maxScore) * 100) 
      : 0;

    const updatedTest: TestResult = {
      ...currentTest,
      responses: updatedResponses,
      totalScore,
      shortAnswerScore,
      mcqScore,
      accuracyPercentage
    };

    storageService.updateTestResult(updatedTest);
    onUpdateResults();
  };

  const completedTests = testResults.filter((t) => t.status === 'completed');
  const avgAccuracy = completedTests.length > 0
    ? Math.round(completedTests.reduce((acc, t) => acc + t.accuracyPercentage, 0) / completedTests.length)
    : 0;

  const totalTimeMinutes = Math.round(
    testResults.reduce((acc, t) => acc + (t.timeSpentSeconds || 0), 0) / 60
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Tests Completed</p>
            <p className="text-2xl font-black text-slate-900">{completedTests.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Avg. Accuracy</p>
            <p className="text-2xl font-black text-slate-900">{avgAccuracy}%</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Study Time</p>
            <p className="text-2xl font-black text-slate-900">{totalTimeMinutes}m</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Security Flags</p>
            <p className="text-2xl font-black text-slate-900">
              {testResults.filter((t) => t.status === 'terminated_anti_cheat').length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Historical Timeline List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              Test Timeline
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {testResults.length} sessions
            </span>
          </div>

          {testResults.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400">
              <BarChart className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-medium">No tests completed yet.</p>
              <button
                onClick={onRetakeTestClick}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Take First Test
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {testResults.map((t) => {
                const isSelected = (currentTest?.id === t.id);
                const isTerminated = t.status === 'terminated_anti_cheat';

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTestId(t.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{t.topic}</h4>
                      {isTerminated ? (
                        <span className="shrink-0 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Terminated
                        </span>
                      ) : (
                        <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {t.accuracyPercentage}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                      <span>{t.difficulty}</span>
                      <span>•</span>
                      <span>{t.totalScore} / {t.maxScore} marks</span>
                      <span>•</span>
                      <span>{new Date(t.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Test Breakdown & Self-Check Interface */}
        <div className="lg:col-span-8 space-y-6">
          {currentTest ? (
            <>
              {/* Test Summary Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">{currentTest.topic}</h2>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                        {currentTest.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted on {new Date(currentTest.completedAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={onRetakeTestClick}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>New Test</span>
                  </button>
                </div>

                {currentTest.status === 'terminated_anti_cheat' && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-900">Anti-Cheating Policy Termination</h4>
                      <p className="text-xs text-rose-700 mt-0.5 font-mono">
                        {currentTest.terminationReason || 'Loss of focus / tab switch detected.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Overall Score</p>
                    <p className="text-lg font-bold text-blue-600 mt-0.5">
                      {currentTest.totalScore} <span className="text-xs text-slate-400 font-normal">/ {currentTest.maxScore}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Accuracy</p>
                    <p className="text-lg font-bold text-slate-800 mt-0.5">{currentTest.accuracyPercentage}%</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">MCQ Points</p>
                    <p className="text-lg font-bold text-slate-800 mt-0.5">{currentTest.mcqScore}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Short Answer</p>
                    <p className="text-lg font-bold text-slate-800 mt-0.5">{currentTest.shortAnswerScore}</p>
                  </div>
                </div>
              </div>

              {/* Questions List & Interactive Self-Check Overlays */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Sliders size={16} className="text-blue-600" />
                    Interactive Self-Check & Solutions
                  </h3>
                  <span className="text-xs text-slate-500">
                    Review and adjust marks for your calculative/short answers below.
                  </span>
                </div>

                {currentTest.questions.map((question, idx) => {
                  const resp = currentTest.responses.find((r) => r.questionId === question.id);
                  const isMCQ = question.type === 'mcq';
                  const isExpanded = expandedSolutions[question.id] ?? true;
                  const awarded = resp?.awardedMarks ?? 0;

                  return (
                    <div
                      key={question.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                    >
                      <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-600">Q{idx + 1}.</span>
                            <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {isMCQ ? 'Auto-Graded MCQ' : 'Short Answer (Self-Check)'}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">{question.prompt}</p>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                            awarded === question.marks
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : awarded > 0
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {awarded} / {question.marks} Marks
                          </span>
                        </div>
                      </div>

                      <div className="p-5 bg-slate-50/50 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Your Submitted Response
                            </span>
                            <p className="text-xs sm:text-sm font-mono font-medium text-slate-800 break-words">
                              {resp?.userAnswer || <span className="italic text-slate-400">No response entered</span>}
                            </p>
                          </div>

                          <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                              Expected Answer Key
                            </span>
                            <p className="text-xs sm:text-sm font-mono font-bold text-blue-900 break-words">
                              {question.correctAnswer}
                            </p>
                          </div>
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={() => toggleExpand(question.id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Hide Step-by-Step Solution' : 'View Step-by-Step Solution'}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>

                          {isExpanded && (
                            <div className="mt-2.5 p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 font-mono">
                              <p className="font-bold text-slate-900 font-sans">Official Solution Steps:</p>
                              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                                {question.solutionSteps.map((step, sIdx) => (
                                  <li key={sIdx} className="leading-relaxed">{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>

                        {!isMCQ && (
                          <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Sparkles size={14} className="text-blue-600" />
                                Student Self-Check Grading:
                              </span>
                              <span className="text-[11px] text-slate-400">
                                Award marks based on your step-by-step working:
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleGradeSelfCheck(question.id, 0)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  awarded === 0
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-rose-50 text-slate-700 border border-slate-200'
                                }`}
                              >
                                <XCircle size={13} />
                                <span>0 Marks (Incorrect)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleGradeSelfCheck(question.id, Math.floor(question.marks / 2))}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  awarded === Math.floor(question.marks / 2) && awarded > 0 && awarded < question.marks
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-amber-50 text-slate-700 border border-slate-200'
                                }`}
                              >
                                <Sliders size={13} />
                                <span>{Math.floor(question.marks / 2)} Marks (Partial Working)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleGradeSelfCheck(question.id, question.marks)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  awarded === question.marks
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200'
                                }`}
                              >
                                <CheckCircle2 size={13} />
                                <span>{question.marks} Marks (Full Working)</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              Select a test from the timeline on the left to inspect its self-check report.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
