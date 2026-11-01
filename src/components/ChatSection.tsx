import React, { useState, useEffect, useRef } from 'react';
import type { ChatThread, ChatMessage, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { generateDirectStudyResponseAsync } from '../services/chatResponseGenerator';
import { DynamicAvatar } from './avatars/DynamicAvatar';
import { 
  Plus, 
  Trash2, 
  Send, 
  Bot, 
  Sparkles, 
  BookOpen, 
  Calculator, 
  FileText, 
  Clock, 
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';

interface ChatSectionProps {
  user: UserProfile;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ user }) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default collapsed on mobile, opens on toggle
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically open sidebar on larger screens by default
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    const loadedThreads = storageService.getChatThreads();
    if (loadedThreads.length > 0) {
      setThreads(loadedThreads);
      const lastActive = storageService.getActiveThreadId();
      if (lastActive && loadedThreads.some(t => t.id === lastActive)) {
        setActiveThreadId(lastActive);
      } else {
        setActiveThreadId(loadedThreads[0].id);
      }
    } else {
      const welcomeThread: ChatThread = {
        id: `thread_${Date.now()}`,
        title: 'Study Introduction & Roadmap',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: `msg_${Date.now()}_1`,
            sender: 'assistant',
            content: `Hello ${user.name}! I am your study assistant. Ask me any question from math, physics, biology, chemistry, or general school and college subjects, and I will explain it directly and simply.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
      setThreads([welcomeThread]);
      setActiveThreadId(welcomeThread.id);
      storageService.saveChatThreads([welcomeThread]);
      storageService.setActiveThreadId(welcomeThread.id);
    }
  }, [user.name]);

  const updateThreadsAndSave = (updated: ChatThread[]) => {
    setThreads(updated);
    storageService.saveChatThreads(updated);
  };

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    storageService.setActiveThreadId(id);
    // On mobile devices, close drawer after selecting a thread
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleCreateNewChat = () => {
    const newThread: ChatThread = {
      id: `thread_${Date.now()}`,
      title: 'New Study Topic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}_init`,
          sender: 'assistant',
          content: `Hi ${user.name}! What study material or topic are we tackling in this new thread?`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    const nextThreads = [newThread, ...threads];
    updateThreadsAndSave(nextThreads);
    setActiveThreadId(newThread.id);
    storageService.setActiveThreadId(newThread.id);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteThread = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    if (threads.length <= 1) {
      handleCreateNewChat();
      const filtered = threads.filter(t => t.id !== threadId);
      updateThreadsAndSave(filtered);
      return;
    }

    const filtered = threads.filter(t => t.id !== threadId);
    updateThreadsAndSave(filtered);
    if (activeThreadId === threadId) {
      const nextId = filtered[0]?.id || null;
      setActiveThreadId(nextId);
      storageService.setActiveThreadId(nextId);
    }
  };

  const currentThread = threads.find(t => t.id === activeThreadId) || threads[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentThread?.messages, isTyping]);



  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentThread) return;

    const userText = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      sender: 'user',
      content: userText,
      timestamp: new Date().toISOString()
    };

    const isFirstCustomMessage = currentThread.messages.length <= 1;
    const autoTitle = isFirstCustomMessage 
      ? userText.slice(0, 32) + (userText.length > 32 ? '...' : '') 
      : currentThread.title;

    const threadWithUserMsg: ChatThread = {
      ...currentThread,
      title: autoTitle,
      updatedAt: new Date().toISOString(),
      messages: [...currentThread.messages, userMsg]
    };

    const nextThreads = threads.map(t => t.id === threadWithUserMsg.id ? threadWithUserMsg : t);
    updateThreadsAndSave(nextThreads);

    setIsTyping(true);
    generateDirectStudyResponseAsync(userText).then((aiText) => {
      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now()}_a`,
        sender: 'assistant',
        content: aiText,
        timestamp: new Date().toISOString()
      };

      const finalThread: ChatThread = {
        ...threadWithUserMsg,
        updatedAt: new Date().toISOString(),
        messages: [...threadWithUserMsg.messages, assistantMsg]
      };

      const finalThreads = threads.map(t => t.id === finalThread.id ? finalThread : t);
      updateThreadsAndSave(finalThreads);
      setIsTyping(false);
    }).catch(() => {
      setIsTyping(false);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    { label: 'Summarize Key Formulas', icon: Calculator, text: 'Summarize key formulas for calculus and physics.' },
    { label: 'What is a Derivative?', icon: BookOpen, text: 'What is a derivative in calculus?' },
    { label: 'Exam Strategy Tips', icon: FileText, text: 'What is the most effective exam strategy for college tests?' },
  ];

  return (
    <div className="flex h-[calc(100vh-4.1rem)] bg-white overflow-hidden relative">
      
      {/* Mobile Backdrop Overlay when Sidebar is Open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-25 md:hidden transition-opacity"
        />
      )}

      {/* Responsive Sidebar (Slide-over drawer on mobile, collapsible column on desktop) */}
      <aside
        className={`fixed md:relative top-16 md:top-0 bottom-0 left-0 z-30 transition-all duration-300 ease-in-out bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 overflow-hidden ${
          sidebarOpen ? 'w-72 sm:w-80 translate-x-0 shadow-xl md:shadow-none' : '-translate-x-full md:translate-x-0 md:w-0'
        }`}
      >
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={handleCreateNewChat}
            className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus size={16} />
            <span>New Chat Thread</span>
          </button>
          
          {/* Close Button: Visible on ALL screen sizes */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
            title="Close Sidebar"
          >
            <span className="hidden md:inline"><PanelLeftClose size={18} /></span>
            <span className="md:hidden"><X size={18} /></span>
          </button>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Past Conversations ({threads.length})
          </div>

          {threads.map(thread => {
            const isActive = thread.id === activeThreadId;
            return (
              <div
                key={thread.id}
                onClick={() => handleSelectThread(thread.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition ${
                  isActive
                    ? 'bg-blue-100/70 text-blue-900 border border-blue-200/80 font-semibold shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <BookOpen size={15} className={isActive ? 'text-blue-600 shrink-0' : 'text-slate-400 shrink-0'} />
                  <span className="truncate">{thread.title || 'Untitled Thread'}</span>
                </div>

                <button
                  onClick={(e) => handleDeleteThread(e, thread.id)}
                  title="Delete Thread"
                  className="opacity-70 md:opacity-0 md:group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded transition hover:bg-rose-50"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>

        {/* User Card in Sidebar Bottom */}
        <div className="p-3 border-t border-slate-200 bg-slate-100/60 flex items-center gap-2.5">
          <DynamicAvatar gender={user.gender} size="sm" animated={false} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user.gradeLevel}</p>
          </div>
        </div>
      </aside>

      {/* Main Conversational Viewport */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        <div className="h-12 border-b border-slate-100 px-3 sm:px-4 flex items-center justify-between shrink-0 bg-white/70 backdrop-blur-xs">
          <div className="flex items-center gap-2 min-w-0">
            {/* Sidebar Toggle Button: Visible on ALL screen sizes whenever sidebar is closed */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-1.5 p-1.5 px-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition cursor-pointer shrink-0 text-xs font-medium"
                title="Open Chats"
              >
                <PanelLeftOpen size={17} className="text-blue-600" />
                <span className="text-[11px] font-semibold">Chats</span>
              </button>
            )}
            <span className="text-xs font-semibold text-slate-800 truncate">
              {currentThread?.title || 'Study Workspace'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
            <Clock size={12} />
            <span>{new Date(currentThread?.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {currentThread?.messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl mx-auto ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className="shrink-0 pt-0.5">
                  {isUser ? (
                    <DynamicAvatar gender={user.gender} size="sm" animated={false} />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Bot size={17} />
                    </div>
                  )}
                </div>

                <div
                  className={`relative rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      isUser ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 max-w-3xl mx-auto">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot size={17} />
              </div>
              <div className="bg-slate-100 rounded-2xl px-4 py-3 text-xs flex items-center gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 text-[11px] font-medium text-slate-400">Synthesizing study response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {currentThread?.messages.length <= 2 && (
          <div className="max-w-3xl mx-auto w-full px-4 mb-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles size={13} className="text-blue-500" />
              Suggested Starters
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {quickPrompts.map((p, idx) => {
                const IconComponent = p.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(p.text);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100/70 text-slate-700 hover:text-blue-900 text-xs font-medium text-left transition cursor-pointer"
                  >
                    <IconComponent size={14} className="text-blue-600 shrink-0" />
                    <span className="truncate">{p.label}</span>
                    <ChevronRight size={13} className="ml-auto text-blue-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={handleSendMessage}
            className="max-w-3xl mx-auto flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition"
          >
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${user.name}'s study assistant anything... (Shift+Enter for new line)`}
              className="flex-1 max-h-32 min-h-[40px] bg-transparent resize-none px-2 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className={`p-2.5 rounded-xl transition flex items-center justify-center shrink-0 ${
                inputText.trim() && !isTyping
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={15} />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Study Assistant provides real-time conceptual guidance • LocalStorage synced
          </p>
        </div>
      </main>
    </div>
  );
};


