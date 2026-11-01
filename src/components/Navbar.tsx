import React from 'react';
import type { UserProfile, TabType } from '../types';
import { DynamicAvatar } from './avatars/DynamicAvatar';
import { MessageSquare, FileCheck2, BarChart3, GraduationCap, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onEditProfile: () => void;
  isTestActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onSelectTab,
  onEditProfile,
  isTestActive = false
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-lg flex items-center gap-1.5">
                Study<span className="text-blue-600">Hub</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold bg-blue-50 text-blue-700 px-1 sm:px-1.5 py-0.5 rounded border border-blue-200">
                  AI Pro
                </span>
              </span>
              <p className="text-[10px] text-slate-500 hidden sm:block">Intelligent Learning & Anti-Cheat Testing</p>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="flex items-center gap-0.5 sm:gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onSelectTab('chat')}
              disabled={isTestActive}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              } ${isTestActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <MessageSquare size={15} />
              <span className="inline">Chat</span>
            </button>

            <button
              onClick={() => onSelectTab('tests')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'tests'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              } cursor-pointer relative`}
            >
              <FileCheck2 size={15} />
              <span className="inline">Tests</span>
              {isTestActive && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('performance')}
              disabled={isTestActive}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'performance'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              } ${isTestActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <BarChart3 size={15} />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden inline">Stats</span>
            </button>
          </nav>

          {/* Right User Profile Banner with Persistent Dynamic Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isTestActive && (
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <ShieldAlert size={14} className="animate-pulse text-amber-600" />
                <span>Anti-Cheat Active</span>
              </div>
            )}

            <button
              onClick={onEditProfile}
              title="Click to edit profile or change avatar"
              className="group flex items-center gap-2 p-1 pl-1.5 sm:pl-2.5 rounded-full hover:bg-slate-100 transition border border-transparent hover:border-slate-200 cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {user.gradeLevel.split(' ')[0]} • {user.gender}
                </div>
              </div>
              
              <DynamicAvatar gender={user.gender} size="sm" animated={true} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
