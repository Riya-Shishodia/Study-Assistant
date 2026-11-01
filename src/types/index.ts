export type Gender = 'Boy' | 'Girl';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  gradeLevel: string;
  targetExam?: string;
  joinedAt: string;
  avatarSeed: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType = 'mcq' | 'short_answer';

export interface Question {
  id: string;
  topic: string; // Strictly mapped topic/category
  type: QuestionType;
  prompt: string;
  options?: string[]; // Defined if type === 'mcq'
  correctAnswer: string; // Correct option text or exact answer
  solutionSteps: string[]; // Step-by-step breakdown for self-evaluation
  marks: number;
}

export interface QuestionResponse {
  questionId: string;
  userAnswer: string;
  isCorrect?: boolean; // Evaluated
  selfChecked?: boolean; // Evaluated by student for short answers
  awardedMarks: number;
  selfNotes?: string;
}

export interface TestResult {
  id: string;
  topic: string;
  difficulty: Difficulty;
  timeLimitMinutes: number;
  timeSpentSeconds: number;
  completedAt: string;
  totalQuestions: number;
  mcqScore: number;
  shortAnswerScore: number;
  totalScore: number;
  maxScore: number;
  accuracyPercentage: number;
  status: 'completed' | 'terminated_anti_cheat';
  terminationReason?: string;
  responses: QuestionResponse[];
  questions: Question[];
}

export type TabType = 'chat' | 'tests' | 'performance';
