'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { useGame } from '../../context/GameContext';
import { api } from '../../services/api';

/**
 * Custom Duolingo Toggle Switch matching the exact cyan pill screenshot style:
 * Pill track with cyan background and dark round thumb when active.
 */
interface DuolingoToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

const DuolingoToggle: React.FC<DuolingoToggleProps> = ({ checked, onChange, id }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[28px] w-[50px] shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-200 ease-in-out border-2 focus:outline-hidden ${
        checked
          ? 'bg-[#49bef8] border-[#49bef8]'
          : 'bg-[#202f36] border-[#37464f]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full shadow-sm transition duration-200 ease-in-out ${
          checked
            ? 'translate-x-[22px] bg-[#131f24] border-2 border-[#49bef8]'
            : 'translate-x-0 bg-[#52656d]'
        }`}
      />
    </button>
  );
};

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSound();
  const { user, refreshUser } = useGame();

  // Active Navigation Tab (Defaults to 'preferences' matching screenshot)
  const [activeTab, setActiveTab] = useState<string>('preferences');

  // Lesson Experience Preferences state (synced with localStorage)
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [motivationalMessages, setMotivationalMessages] = useState(true);
  const [listeningExercises, setListeningExercises] = useState(true);

  // Appearance Dark Mode Dropdown
  const [darkModeSelection, setDarkModeSelection] = useState<'SYSTEM DEFAULT' | 'DARK' | 'LIGHT'>('SYSTEM DEFAULT');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Account tab editable fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Notification tab toggles
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifFreezes, setNotifFreezes] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSound = localStorage.getItem('duo_pref_sound_effects');
        if (savedSound !== null) setSoundEffects(savedSound === 'true');

        const savedAnim = localStorage.getItem('duo_pref_animations');
        if (savedAnim !== null) setAnimations(savedAnim === 'true');

        const savedMotiv = localStorage.getItem('duo_pref_motivational');
        if (savedMotiv !== null) setMotivationalMessages(savedMotiv === 'true');

        const savedListen = localStorage.getItem('duo_pref_listening');
        if (savedListen !== null) setListeningExercises(savedListen === 'true');

        const savedMode = localStorage.getItem('duo_pref_dark_mode');
        if (savedMode) setDarkModeSelection(savedMode as any);
      } catch (e) {
        console.warn('Failed to read preferences:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle handlers that persist
  const handleToggleSound = (val: boolean) => {
    setSoundEffects(val);
    if (typeof window !== 'undefined') localStorage.setItem('duo_pref_sound_effects', String(val));
    if ((val && !soundEnabled) || (!val && soundEnabled)) {
      toggleSound();
    }
  };

  const handleToggleAnimations = (val: boolean) => {
    setAnimations(val);
    if (typeof window !== 'undefined') localStorage.setItem('duo_pref_animations', String(val));
  };

  const handleToggleMotivational = (val: boolean) => {
    setMotivationalMessages(val);
    if (typeof window !== 'undefined') localStorage.setItem('duo_pref_motivational', String(val));
  };

  const handleToggleListening = (val: boolean) => {
    setListeningExercises(val);
    if (typeof window !== 'undefined') localStorage.setItem('duo_pref_listening', String(val));
  };

  const handleSelectDarkMode = (mode: 'SYSTEM DEFAULT' | 'DARK' | 'LIGHT') => {
    setDarkModeSelection(mode);
    setIsDropdownOpen(false);
    if (typeof window !== 'undefined') localStorage.setItem('duo_pref_dark_mode', mode);

    if (mode === 'LIGHT' && theme === 'dark') {
      toggleTheme();
    } else if (mode === 'DARK' && theme === 'light') {
      toggleTheme();
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn('Logout API error:', e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    await refreshUser();
    router.push('/welcome');
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === 'courses') {
      router.push('/courses');
    } else if (tabId === 'profile') {
      router.push('/profile');
    } else {
      setActiveTab(tabId);
    }
  };

  // Nav list items matching the reference screenshot
  const rightNavItems = [
    { id: 'account', label: 'Account' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'profile', label: 'Profile' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'courses', label: 'Courses' },
    { id: 'schools', label: 'Duolingo for Schools' },
    { id: 'social', label: 'Social accounts' },
    { id: 'privacy', label: 'Privacy settings' },
  ];

  return (
    <div className="w-full max-w-[940px] mx-auto py-6 px-4 select-none">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 md:gap-14">
        {/* ========================================================= */}
        {/* CENTER MAIN CONTENT: PREFERENCES (Matching Screenshot)     */}
        {/* ========================================================= */}
        <div className="flex-1 w-full max-w-[540px]">
          {activeTab === 'preferences' && (
            <div>
              {/* Header */}
              <h1 className="text-[26px] font-black text-white tracking-tight leading-tight">
                Preferences
              </h1>

              {/* Section 1: Lesson experience */}
              <div className="mt-8">
                <h2 className="text-[17px] font-bold text-white mb-3 tracking-wide">
                  Lesson experience
                </h2>

                <div className="flex flex-col divide-y divide-transparent">
                  {/* Sound effects */}
                  <div className="flex items-center justify-between py-3.5">
                    <span className="text-[15px] font-bold text-white">
                      Sound effects
                    </span>
                    <DuolingoToggle
                      checked={soundEffects}
                      onChange={handleToggleSound}
                      id="toggle-sound"
                    />
                  </div>

                  {/* Animations */}
                  <div className="flex items-center justify-between py-3.5">
                    <span className="text-[15px] font-bold text-white">
                      Animations
                    </span>
                    <DuolingoToggle
                      checked={animations}
                      onChange={handleToggleAnimations}
                      id="toggle-animations"
                    />
                  </div>

                  {/* Motivational messages */}
                  <div className="flex items-center justify-between py-3.5">
                    <span className="text-[15px] font-bold text-white">
                      Motivational messages
                    </span>
                    <DuolingoToggle
                      checked={motivationalMessages}
                      onChange={handleToggleMotivational}
                      id="toggle-motivational"
                    />
                  </div>

                  {/* Listening exercises */}
                  <div className="flex items-center justify-between py-3.5">
                    <span className="text-[15px] font-bold text-white">
                      Listening exercises
                    </span>
                    <DuolingoToggle
                      checked={listeningExercises}
                      onChange={handleToggleListening}
                      id="toggle-listening"
                    />
                  </div>
                </div>
              </div>

              {/* Horizontal Divider */}
              <div className="h-[1.5px] bg-[#24343d] my-6" />

              {/* Section 2: Appearance */}
              <div>
                <h2 className="text-[17px] font-bold text-white mb-3 tracking-wide">
                  Appearance
                </h2>

                <div className="flex flex-col gap-2">
                  <span className="text-[15px] font-bold text-white">
                    Dark mode
                  </span>

                  {/* Custom Dropdown Selector */}
                  <div ref={dropdownRef} className="relative w-full max-w-[420px]">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full h-12 px-4 rounded-2xl bg-[#131f24] border-2 border-[#2b3a42] hover:border-[#3c505b] flex items-center justify-between text-left transition-colors cursor-pointer select-none"
                    >
                      <span className="text-xs font-black uppercase tracking-widest text-white">
                        {darkModeSelection}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#8e9ca5"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-2xl bg-[#131f24] border-2 border-[#2b3a42] shadow-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-100">
                        {(['SYSTEM DEFAULT', 'DARK', 'LIGHT'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectDarkMode(opt)}
                            className="w-full px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-white hover:bg-[#1f2e35] transition-colors cursor-pointer flex items-center justify-between"
                          >
                            <span>{opt}</span>
                            {darkModeSelection === opt && (
                              <span className="text-[#1cb0f6] font-black text-sm">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ACCOUNT                                             */}
          {/* ========================================================= */}
          {activeTab === 'account' && (
            <div>
              <h1 className="text-[26px] font-black text-white tracking-tight leading-tight mb-8">
                Account
              </h1>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-[14px] font-bold text-white block mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full max-w-[420px] h-12 px-4 rounded-2xl bg-[#131f24] border-2 border-[#2b3a42] text-white font-bold text-sm focus:border-[#1cb0f6] outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[14px] font-bold text-white block mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full max-w-[420px] h-12 px-4 rounded-2xl bg-[#131f24] border-2 border-[#2b3a42] text-white font-bold text-sm focus:border-[#1cb0f6] outline-hidden"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSaveSuccessMsg(true);
                      setTimeout(() => setSaveSuccessMsg(false), 2500);
                    }}
                    className="h-11 px-6 rounded-2xl bg-[#58cc02] hover:bg-[#61e002] active:translate-y-0.5 border-b-4 border-[#46a302] text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    SAVE CHANGES
                  </button>
                  {saveSuccessMsg && (
                    <span className="ml-3 text-xs font-bold text-[#58cc02]">✓ Changes saved!</span>
                  )}
                </div>

                <div className="h-[1.5px] bg-[#24343d] my-4" />

                <div className="pt-2">
                  <h3 className="text-[15px] font-bold text-white mb-1">Danger Zone</h3>
                  <p className="text-xs text-[#8e9ca5] mb-4">Resetting course progress will erase your stars for this language.</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to reset progress for this course?')) {
                        localStorage.removeItem(`duo_progress_course_${user?.current_course_id || 1}`);
                        window.location.reload();
                      }
                    }}
                    className="h-10 px-4 rounded-xl border-2 border-[#ff4b4b] text-[#ff4b4b] hover:bg-[#ff4b4b]/10 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    RESET COURSE PROGRESS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: NOTIFICATIONS                                      */}
          {/* ========================================================= */}
          {activeTab === 'notifications' && (
            <div>
              <h1 className="text-[26px] font-black text-white tracking-tight leading-tight mb-8">
                Notifications
              </h1>

              <div className="flex flex-col divide-y divide-[#24343d]">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <span className="text-[15px] font-bold text-white block">Daily Study Reminders</span>
                    <span className="text-xs text-[#8e9ca5]">Receive daily notifications to protect your streak.</span>
                  </div>
                  <DuolingoToggle checked={notifReminders} onChange={setNotifReminders} />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <span className="text-[15px] font-bold text-white block">Streak Freeze Alerts</span>
                    <span className="text-xs text-[#8e9ca5]">Alert me whenever a Streak Freeze is equipped or used.</span>
                  </div>
                  <DuolingoToggle checked={notifFreezes} onChange={setNotifFreezes} />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <span className="text-[15px] font-bold text-white block">Weekly Progress Summary</span>
                    <span className="text-xs text-[#8e9ca5]">A Sunday recap of your XP, vocabulary, and league rank.</span>
                  </div>
                  <DuolingoToggle checked={notifWeekly} onChange={setNotifWeekly} />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: DUOLINGO FOR SCHOOLS / SOCIAL / PRIVACY            */}
          {/* ========================================================= */}
          {['schools', 'social', 'privacy'].includes(activeTab) && (
            <div>
              <h1 className="text-[26px] font-black text-white tracking-tight leading-tight mb-6 capitalize">
                {activeTab === 'schools' ? 'Duolingo for Schools' : activeTab === 'social' ? 'Social accounts' : 'Privacy settings'}
              </h1>
              <div className="p-6 rounded-2xl bg-[#131f24] border-2 border-[#2b3a42] text-sm font-semibold text-[#8e9ca5]">
                {activeTab === 'schools' && (
                  <div>
                    <p className="text-white font-bold mb-3">Join a Section or Classroom</p>
                    <p className="mb-4">Enter the 6-character classroom code provided by your teacher:</p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="ABC123"
                        className="h-11 px-4 rounded-xl bg-[#1f2e35] border-2 border-[#2b3a42] text-white font-bold text-sm tracking-widest uppercase outline-hidden"
                      />
                      <button type="button" className="btn-3d btn-primary text-xs px-4 h-11">
                        JOIN
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === 'social' && (
                  <div className="flex flex-col gap-3">
                    <p className="text-white font-bold mb-1">Connected Accounts</p>
                    <div className="flex items-center justify-between py-2 border-b border-[#24343d]">
                      <span>Google Account</span>
                      <span className="text-xs text-[#58cc02] font-black">CONNECTED</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span>Facebook</span>
                      <button type="button" className="text-xs text-[#1cb0f6] font-bold hover:underline">CONNECT</button>
                    </div>
                  </div>
                )}
                {activeTab === 'privacy' && (
                  <div className="flex flex-col gap-4">
                    <p className="text-white font-bold">Privacy Controls</p>
                    <div className="flex items-center justify-between">
                      <span>Public profile (visible on leaderboards)</span>
                      <DuolingoToggle checked={true} onChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Show friend activity in feed</span>
                      <DuolingoToggle checked={true} onChange={() => {}} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 3 ROUNDED CARDS + LOG OUT BUTTON            */}
        {/* ========================================================= */}
        <aside className="w-full md:w-[260px] shrink-0 flex flex-col gap-4">
          {/* Card 1: Navigation List */}
          <div className="w-full rounded-2xl border-2 border-[#2b3a42] bg-[#131f24] p-3 flex flex-col gap-0.5 shadow-none">
            {rightNavItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-[14px] transition-colors cursor-pointer ${
                    isSelected
                      ? 'text-white font-black bg-[#1f2e35]'
                      : 'text-white font-bold hover:bg-[#18252c]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Card 2: Subscription */}
          <div className="w-full rounded-2xl border-2 border-[#2b3a42] bg-[#131f24] p-5 shadow-none">
            <h3 className="font-black text-base text-white mb-2">
              Subscription
            </h3>
            <Link
              href="/shop"
              className="text-[14px] font-bold text-[#8e9ca5] hover:text-white transition-colors cursor-pointer no-underline block"
            >
              Choose a plan
            </Link>
          </div>

          {/* Card 3: Support */}
          <div className="w-full rounded-2xl border-2 border-[#2b3a42] bg-[#131f24] p-5 shadow-none">
            <h3 className="font-black text-base text-white mb-2">
              Support
            </h3>
            <Link
              href="/settings"
              onClick={(e) => {
                e.preventDefault();
                alert('Duolingo Clone Help Center: For support or bug reports, feel free to submit feedback.');
              }}
              className="text-[14px] font-bold text-[#8e9ca5] hover:text-white transition-colors cursor-pointer no-underline block"
            >
              Help Center
            </Link>
          </div>

          {/* Outlined Button: LOG OUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 rounded-2xl border-2 border-[#2b3a42] hover:bg-[#1f2e35] text-[#1cb0f6] hover:text-white font-black text-xs uppercase tracking-widest transition-colors cursor-pointer text-center"
          >
            LOG OUT
          </button>
        </aside>
      </div>
    </div>
  );
}
