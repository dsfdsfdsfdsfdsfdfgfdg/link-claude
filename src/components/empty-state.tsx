"use client";

import { Zap, MessageSquare, Code, Lightbulb } from "lucide-react";

interface EmptyStateProps {
  onSend: (message: string) => void;
}

const SUGGESTIONS = [
  {
    icon: Code,
    title: "Write code",
    prompt: "Write a Python function that generates Fibonacci numbers using memoization",
  },
  {
    icon: Lightbulb,
    title: "Explain a concept",
    prompt: "Explain how transformers work in machine learning in simple terms",
  },
  {
    icon: MessageSquare,
    title: "Creative writing",
    prompt: "Write a short sci-fi story about an AI that discovers consciousness",
  },
];

export function EmptyState({ onSend }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
        <Zap className="w-8 h-8 text-white" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        Welcome to LinkClaude
      </h2>
      <p className="text-sm text-zinc-400 mb-8 text-center max-w-md">
        Powered by Claude Opus 4.7 via LinkModel.ai — the full power of Claude at your
        fingertips.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            onClick={() => onSend(s.prompt)}
            className="flex flex-col items-start gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-200 text-left group"
          >
            <s.icon className="w-5 h-5 text-violet-400 group-hover:text-violet-300 transition-colors" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
              {s.title}
            </span>
            <span className="text-xs text-zinc-600 line-clamp-2">
              {s.prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
