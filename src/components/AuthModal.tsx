import React, { useState } from 'react';
import type { UserProfile, Gender } from '../types';
import { BoyAvatar } from './avatars/BoyAvatar';
import { GirlAvatar } from './avatars/GirlAvatar';
import { GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onComplete, initialProfile }) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [gender, setGender] = useState<Gender>(initialProfile?.gender || 'Girl');
  const [gradeLevel, setGradeLevel] = useState(initialProfile?.gradeLevel || 'College / Undergraduate');
  const [targetExam, setTargetExam] = useState(initialProfile?.targetExam || 'General Academics & STEM');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name');
      return;
    }

    const newProfile: UserProfile = {
      id: initialProfile?.id || `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@student.edu`,
      gender,
      gradeLevel,
      targetExam,
      joinedAt: initialProfile?.joinedAt || new Date().toISOString(),
      avatarSeed: `avatar_${gender.toLowerCase()}_${Date.now()}`
    };

    onComplete(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-15">
            <GraduationCap size={140} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-xl mb-3 backdrop-blur-md border border-white/20">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome to Study Assistant</h2>
            <p className="text-blue-100 text-sm mt-1 max-w-sm mx-auto">
              Your personalized AI learning companion, strict test simulator, and self-evaluation portal.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Avatar & Gender Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              1. Choose Character Avatar & Identity
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setGender('Girl')}
                className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  gender === 'Girl'
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {gender === 'Girl' && (
                  <span className="absolute top-2 right-2 text-blue-600">
                    <CheckCircle2 size={18} />
                  </span>
                )}
                <GirlAvatar size="lg" animated={gender === 'Girl'} />
                <span className="mt-3 font-semibold text-slate-800 text-sm">Black Widow (Avatar)</span>
                <span className="text-[11px] text-slate-500">Tactical & Focused</span>
              </button>

              <button
                type="button"
                onClick={() => setGender('Boy')}
                className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  gender === 'Boy'
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {gender === 'Boy' && (
                  <span className="absolute top-2 right-2 text-blue-600">
                    <CheckCircle2 size={18} />
                  </span>
                )}
                <BoyAvatar size="lg" animated={gender === 'Boy'} />
                <span className="mt-3 font-semibold text-slate-800 text-sm">Iron Man (Avatar)</span>
                <span className="text-[11px] text-slate-500">Genius & High-Tech</span>
              </button>
            </div>
          </div>

          {/* Name & Contact */}
          <div className="space-y-4">
            <div>
              <label htmlFor="student-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Student Full Name *
              </label>
              <input
                id="student-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 text-sm transition"
              />
            </div>

            <div>
              <label htmlFor="student-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Student Email (Optional)
              </label>
              <input
                id="student-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@college.edu"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 text-sm transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="academic-level" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Academic Level
                </label>
                <select
                  id="academic-level"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 text-sm transition bg-white"
                >
                  <option value="Middle School (Grade 6-8)">Middle School (Grade 6-8)</option>
                  <option value="High School (Grade 9-10)">High School (Grade 9-10)</option>
                  <option value="Senior High (Grade 11-12)">Senior High (Grade 11-12)</option>
                  <option value="College / Undergraduate">College / Undergraduate</option>
                  <option value="Postgraduate & Research">Postgraduate & Research</option>
                </select>
              </div>

              <div>
                <label htmlFor="focus-area" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Primary Focus / Exam
                </label>
                <select
                  id="focus-area"
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 text-sm transition bg-white"
                >
                  <option value="STEM & Engineering">STEM & Engineering</option>
                  <option value="Medical & Life Sciences">Medical & Life Sciences</option>
                  <option value="Commerce & Economics">Commerce & Economics</option>
                  <option value="Computer Science & Coding">Computer Science & Coding</option>
                  <option value="General Academics & STEM">General Academics</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Study Portal</span>
              <Sparkles size={16} />
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              All credentials and test records persist locally in your browser LocalStorage.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

