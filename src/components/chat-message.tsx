"use client";

import { Message } from "@/lib/types";
import { MarkdownRenderer } from "./markdown-renderer";
import { Copy, Check, User, Zap } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  return (
    <div
      className={cn(
        "group flex gap-4 px-4 py-6 md:px-8 transition-colors",
        isUser ? "bg-transparent" : "bg-white/[0.02]"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          isUser
            ? "bg-gradient-to-br from-emerald-500 to-teal-600"
            : "bg-gradient-to-br from-violet-500 to-indigo-600"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Zap className="w-4 h-4 text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-zinc-400">
            {isUser ? "You" : "Claude Opus 4.7"}
          </span>
          {isStreaming && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[10px] text-violet-400">generating</span>
            </span>
          )}
        </div>

        <div className="text-sm text-zinc-200 leading-relaxed">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-violet-500 animate-pulse ml-0.5 align-middle rounded-sm" />
          )}
        </div>

        {!isStreaming && message.content && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
