import type { UserProfile, ChatThread, TestResult } from '../types';

const STORAGE_KEYS = {
  USER: 'study_assistant_user_v1',
  CHATS: 'study_assistant_chats_v1',
  TESTS: 'study_assistant_tests_v1',
  ACTIVE_THREAD_ID: 'study_assistant_active_thread_v1'
};

export const storageService = {
  // --- User Profile ---
  getUserProfile: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed reading user profile from localStorage', e);
      return null;
    }
  },

  saveUserProfile: (profile: UserProfile): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed saving user profile to localStorage', e);
    }
  },

  clearUserProfile: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error('Failed clearing user profile', e);
    }
  },

  // --- Chat Threads ---
  getChatThreads: (): ChatThread[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading chat threads', e);
      return [];
    }
  },

  saveChatThreads: (threads: ChatThread[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(threads));
    } catch (e) {
      console.error('Failed saving chat threads', e);
    }
  },

  getActiveThreadId: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_THREAD_ID);
    } catch {
      return null;
    }
  },

  setActiveThreadId: (id: string | null): void => {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_THREAD_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_THREAD_ID);
      }
    } catch (e) {
      console.error('Failed setting active thread id', e);
    }
  },

  // --- Test Results & Performance ---
  getTestResults: (): TestResult[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTS);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading test results', e);
      return [];
    }
  },

  saveTestResult: (result: TestResult): void => {
    try {
      const current = storageService.getTestResults();
      const updated = [result, ...current.filter(t => t.id !== result.id)];
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving test result', e);
    }
  },

  updateTestResult: (updatedResult: TestResult): void => {
    try {
      const current = storageService.getTestResults();
      const next = current.map(item => item.id === updatedResult.id ? updatedResult : item);
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(next));
    } catch (e) {
      console.error('Failed updating test result', e);
    }
  },

  clearAllData: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.error('Failed clearing data', e);
    }
  }
};
