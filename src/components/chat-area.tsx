"use client";

import { useEffect, useRef, useMemo } from "react";
import { Chat, Message } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { EmptyState } from "./empty-state";
import { Button } from "@/components/ui/button";
import { Menu, RotateCcw, Pencil } from "lucide-react";

interface ChatAreaProps {
  chat: Chat | null;
  isStreaming: boolean;
  streamingText: string;
  error: string | null;
  onSend: (message: string) => void;
  onStop: () => void;
  onRegenerate: () => void;
  onEditLast: (content: string) => void;
  onOpenSidebar: () => void;
  hasApiKey: boolean;
}

export function ChatArea({
  chat,
  isStreaming,
  streamingText,
  error,
  onSend,
  onStop,
  onRegenerate,
  onEditLast,
  onOpenSidebar,
  hasApiKey,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages, streamingText]);

  const messages = chat?.messages || [];
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const hasAssistantMessages = messages.some((m) => m.role === "assistant");

  const streamingMessage = useMemo<Message>(
    () => ({
      id: "streaming",
      role: "assistant",
      content: streamingText,
      timestamp: 0,
    }),
    [streamingText]
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d14]">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={onOpenSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-medium text-white truncate">
            {chat?.title || "New Chat"}
          </h2>
          <p className="text-[10px] text-zinc-500">claude-opus-4-7 via LinkModel.ai</p>
        </div>
        {hasAssistantMessages && !isStreaming && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-zinc-500 hover:text-white hover:bg-white/5"
              onClick={onRegenerate}
              title="Regenerate last response"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            {lastUserMessage && (
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-zinc-500 hover:text-white hover:bg-white/5"
                onClick={() => {
                  const newContent = prompt(
                    "Edit your message:",
                    lastUserMessage.content
                  );
                  if (newContent !== null && newContent.trim()) {
                    onEditLast(newContent.trim());
                  }
                }}
                title="Edit last message"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isStreaming ? (
          <EmptyState onSend={onSend} />
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isStreaming && streamingText && (
              <ChatMessage
                message={streamingMessage}
                isStreaming
              />
            )}

            {isStreaming && !streamingText && (
              <div className="flex gap-4 px-4 py-6 md:px-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:0ms]" />
                    <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:150ms]" />
                    <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-zinc-500">
                    Claude is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20">
          <p className="text-xs text-red-400 text-center max-w-3xl mx-auto">
            {error}
          </p>
        </div>
      )}

      <ChatInput
        onSend={onSend}
        onStop={onStop}
        isStreaming={isStreaming}
        disabled={!hasApiKey}
      />
    </div>
  );
}
