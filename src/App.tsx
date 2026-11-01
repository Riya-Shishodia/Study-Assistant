import React, { useState, useEffect } from 'react';
import type { UserProfile, TabType, TestResult } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ChatSection } from './components/ChatSection';
import { TestCenter } from './components/TestCenter';
import { PerformanceSection } from './components/PerformanceSection';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // Load User & Tests on mount
  useEffect(() => {
    const savedUser = storageService.getUserProfile();
    if (savedUser) {
      setUser(savedUser);
    } else {
      setShowAuthModal(true);
    }

    const savedTests = storageService.getTestResults();
    if (savedTests.length > 0) {
      setTestResults(savedTests);
    } else {
      // Seed a starter completed test to showcase the self-check interface
      const seedTest: TestResult = {
        id: 'test_seed_1',
        topic: 'Calculus & Differential Equations',
        difficulty: 'Medium',
        timeLimitMinutes: 5,
        timeSpentSeconds: 145,
        completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        totalQuestions: 2,
        mcqScore: 4,
        shortAnswerScore: 6,
        totalScore: 10,
        maxScore: 10,
        accuracyPercentage: 100,
        status: 'completed',
        responses: [
          {
            questionId: 'q_math_1_demo',
            userAnswer: '9x^2 - 5',
            isCorrect: true,
            awardedMarks: 4,
            selfChecked: true
          },
          {
            questionId: 'q_math_2_demo',
            userAnswer: '14',
            isCorrect: true,
            awardedMarks: 6,
            selfChecked: true
          }
        ],
        questions: [
          {
            id: 'q_math_1_demo',
            topic: 'Calculus & Differential Equations',
            type: 'mcq',
            prompt: 'What is the derivative of f(x) = 3x^3 - 5x + 7 with respect to x?',
            options: ['9x^2 - 5', '6x^2 - 5x', '9x^3 - 5', '3x^2 - 5'],
            correctAnswer: '9x^2 - 5',
            solutionSteps: [
              'Power rule: d/dx [x^n] = n * x^(n-1)',
              'd/dx [3x^3] = 9x^2',
              'd/dx [-5x] = -5',
              'Constant derivative = 0 -> 9x^2 - 5'
            ],
            marks: 4
          },
          {
            id: 'q_math_2_demo',
            topic: 'Calculus & Differential Equations',
            type: 'short_answer',
            prompt: 'Evaluate the definite integral: ∫ from 0 to 2 of (4x + 3) dx.',
            correctAnswer: '14',
            solutionSteps: [
              'Antiderivative F(x) = 2x^2 + 3x',
              'F(2) = 2(4) + 6 = 14',
              'F(0) = 0 -> 14 - 0 = 14'
            ],
            marks: 6
          }
        ]
      };
      setTestResults([seedTest]);
      storageService.saveTestResult(seedTest);
    }
  }, []);

  const handleProfileComplete = (profile: UserProfile) => {
    setUser(profile);
    storageService.saveUserProfile(profile);
    setShowAuthModal(false);
  };

  const handleTestFinished = (result: TestResult) => {
    storageService.saveTestResult(result);
    setTestResults(storageService.getTestResults());
    setIsTestActive(false);
    setActiveTab('performance');
  };

  const handleUpdateResults = () => {
    setTestResults(storageService.getTestResults());
  };

  if (!user && !showAuthModal) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top persistent navigation bar */}
      {user && (
        <Navbar
          user={user}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onEditProfile={() => setShowAuthModal(true)}
          isTestActive={isTestActive}
        />
      )}

      {/* Main Content Sections */}
      <div className="flex-1">
        {user && activeTab === 'chat' && <ChatSection user={user} />}
        {user && activeTab === 'tests' && (
          <TestCenter
            onTestCompleted={handleTestFinished}
            onTestActiveStateChange={setIsTestActive}
          />
        )}
        {user && activeTab === 'performance' && (
          <PerformanceSection
            testResults={testResults}
            onUpdateResults={handleUpdateResults}
            onRetakeTestClick={() => setActiveTab('tests')}
          />
        )}
      </div>

      {/* Onboarding & Profile Modal */}
      {showAuthModal && (
        <AuthModal
          initialProfile={user}
          onComplete={handleProfileComplete}
        />
      )}
    </div>
  );
};

export default App;
