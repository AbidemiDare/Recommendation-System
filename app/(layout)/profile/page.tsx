'use client';

import { useEffect, useState } from 'react';
import { readStudentProfile, saveStudentProfile } from '@/app/lib/auth';
import {
  Check,
  ChevronLeft,
  GraduationCap,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Settings,
  User,
  X,
} from 'lucide-react';
import { INTEREST_PRESETS } from "@/app/lib/interests";

interface ProfileForm {
  fullName: string;
  email: string;
  matricNumber: string;
  department: string;
  level: string;
}

interface StoredStudent {
  id?: number;
  name: string;
  email?: string;
  matricNumber?: string;
  department: string;
  level: string;
  interests?: string[];
  skills?: string[];
}

const INITIAL_PROFILE: ProfileForm = {
  fullName: 'Damilare Adebayo',
  email: 'damilare.adebayo@student.unilag.edu.ng',
  matricNumber: '190805021',
  department: 'Computer Science',
  level: '400 Level',
};


// Same taxonomy used by the recommendation engine's project tags — sourced
// from app/lib/interests so it can never drift from onboarding's list.
const AVAILABLE_TAGS = INTEREST_PRESETS;

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function readStoredStudent(): StoredStudent | null {
  const profile = readStudentProfile();
  if (!profile) return null;

  return {
    id: profile.id ? Number(profile.id) || undefined : undefined,
    name: profile.name,
    email: profile.email,
    matricNumber: profile.matricNumber,
    department: profile.department,
    level: profile.level,
    interests: profile.interests,
    skills: profile.skills,
  };
}

function writeStoredStudent(update: Partial<StoredStudent>) {
  const current = readStudentProfile();

  saveStudentProfile({
    id: String(update.id ?? current?.id ?? 'student-1'),
    name: update.name ?? current?.name ?? '',
    email: update.email ?? current?.email ?? '',
    matricNumber: update.matricNumber ?? current?.matricNumber ?? '',
    department: update.department ?? current?.department ?? '',
    level: update.level ?? current?.level ?? '',
    interests: update.interests ?? current?.interests ?? [],
    skills: update.skills ?? current?.skills ?? [],
  });
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>(INITIAL_PROFILE);
  const [draft, setDraft] = useState<ProfileForm>(INITIAL_PROFILE);
  const [interests, setInterests] = useState<string[]>([
    'Artificial Intelligence',
    'Web Development',
    'Data Science',
  ]);
  const [skills, setSkills] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Load whatever the onboarding flow (or a previous edit) saved.
  useEffect(() => {
    const student = readStoredStudent();
    if (student) {
      const loaded: ProfileForm = {
        fullName: student.name || INITIAL_PROFILE.fullName,
        email: student.email || INITIAL_PROFILE.email,
        matricNumber: student.matricNumber || INITIAL_PROFILE.matricNumber,
        department: student.department || INITIAL_PROFILE.department,
        level: student.level || INITIAL_PROFILE.level,
      };
      // Local-storage hydration must happen after mount to avoid SSR mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(loaded);
      setDraft(loaded);
      if (Array.isArray(student.interests) && student.interests.length > 0) {
        setInterests(student.interests);
      }
      if (Array.isArray(student.skills)) {
        setSkills(student.skills);
      }
    }
    setHasLoaded(true);
  }, []);

  // Keep localStorage in sync whenever interests change (tag toggle or
  // custom add happens outside the edit/save flow).
  useEffect(() => {
    if (!hasLoaded) return; // don't stomp stored data before the initial load
    writeStoredStudent({ interests });
  }, [interests, hasLoaded]);

  const startEditing = () => {
    setDraft(form);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(form);
    setIsEditing(false);
  };

  const saveEditing = () => {
    setForm(draft);
    setIsEditing(false);
    writeStoredStudent({
      name: draft.fullName,
      email: draft.email,
      matricNumber: draft.matricNumber,
      department: draft.department,
      level: draft.level,
    });
  };

  const toggleInterest = (tag: string) => {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomInterest = () => {
    const value = tagInput.trim();
    if (value.length === 0) return;
    if (!interests.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setInterests((prev) => [...prev, value]);
    }
    setTagInput('');
  };

  return (
    <div className="min-h-screen bg-[#F8F8FB] lg:pl-72">
      <div className="mx-auto max-w-5xl p-2 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between lg:justify-start lg:gap-4">
          <button
            aria-label="Go back"
            className="text-slate-700 transition hover:text-[#2563EB] lg:hidden"
          >
            <ChevronLeft />
          </button>

          <div className="text-center lg:text-left">
            <h1 className="text-xl font-bold text-slate-900 lg:text-2xl">Profile</h1>
            <p className="text-xs text-slate-500 lg:text-sm">Your info and interests</p>
          </div>

          <Settings className="text-slate-700 lg:ml-auto" />
        </div>

        {/* Profile summary card */}
        <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-50 text-2xl font-semibold text-[#2563EB]">
              {getInitials(form.fullName)}
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">{form.fullName}</h2>
              <p className="text-sm text-slate-500">
                {form.department} &middot; {form.level}
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={startEditing}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#2563EB]/40 hover:text-[#2563EB] active:scale-95"
              >
                <Pencil size={16} />
                Edit profile
              </button>
            )}
          </div>
        </div>

        {/* <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-[#2563EB]">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div> */}

        {/* Personal information */}
        <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Personal information</h3>
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={cancelEditing}
                  aria-label="Cancel"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:text-slate-700"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={saveEditing}
                  aria-label="Save changes"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-white transition hover:bg-[#1d4fd1]"
                >
                  <Check size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              icon={User}
              value={isEditing ? draft.fullName : form.fullName}
              editing={isEditing}
              onChange={(v) => setDraft((d) => ({ ...d, fullName: v }))}
            />
            <Field
              label="Email"
              icon={Mail}
              value={isEditing ? draft.email : form.email}
              editing={isEditing}
              onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
            />
            <Field
              label="Matric number"
              icon={GraduationCap}
              value={isEditing ? draft.matricNumber : form.matricNumber}
              editing={isEditing}
              onChange={(v) => setDraft((d) => ({ ...d, matricNumber: v }))}
            />
            <Field
              label="Department"
              icon={GraduationCap}
              value={isEditing ? draft.department : form.department}
              editing={isEditing}
              onChange={(v) => setDraft((d) => ({ ...d, department: v }))}
            />
          </div>
        </div>

        {/* Interests feeding the recommendation engine */}
        <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Interests</h3>
          <p className="mt-1 text-sm text-slate-500">
            Used to match you with relevant project recommendations.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isActive = interests.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleInterest(tag)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-[#2563EB]/40'
                  }`}
                >
                  {tag}
                </button>
              );
            })}

            {interests
              .filter((tag) => !AVAILABLE_TAGS.includes(tag))
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleInterest(tag)}
                  className="flex items-center gap-1 rounded-full bg-[#2563EB] px-4 py-2 text-sm font-medium text-white"
                >
                  {tag}
                  <X size={14} />
                </button>
              ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()}
              placeholder="Add a custom interest..."
              className="h-14 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30"
            />
            <button
              onClick={addCustomInterest}
              aria-label="Add interest"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white transition hover:bg-[#1d4fd1] active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Skills, read-only, sourced from onboarding */}
        {skills.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Skills</h3>
            <p className="mt-1 text-sm text-slate-500">From your onboarding profile.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Account */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <button
  onClick={() => setShowLogoutConfirm(true)}
  className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
>
  <span className="flex items-center gap-2">
    <LogOut size={18} />
    Log out
  </span>
  </button>
        </div>

        {showLogoutConfirm && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
  >
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <LogOut size={22} className="text-red-600" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900">Log out?</h3>
      <p className="mt-1 text-sm text-slate-500">
        You&apos;ll need to sign back in to view your saved projects and recommendations.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setShowLogoutConfirm(false)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 active:scale-95"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('student');
            window.location.href = '/auth/login';
          }}
          className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 active:scale-95"
        >
          Log out
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  editing,
  onChange,
}: {
  label: string;
  icon: typeof User;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-500">{label}</label>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30"
        />
      ) : (
        <div className="flex h-14 items-center gap-2 rounded-xl bg-slate-50 px-4 text-sm text-slate-900">
          <Icon size={16} className="shrink-0 text-slate-400" />
          <span className="truncate">{value}</span>
        </div>
      )}
    </div>
  );
}

