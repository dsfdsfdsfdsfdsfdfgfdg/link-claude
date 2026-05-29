"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Chat, Message, Settings } from "@/lib/types";
import { loadChats, saveChats, loadSettings, saveSettings } from "@/lib/storage";
import { streamChat } from "@/lib/stream";

export function useChatStore() {
  const [chats, setChats] = useState<Chat[]>(() => loadChats());
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const saved = loadChats();
    return saved.length > 0 ? saved[0].id : null;
  });
  const [settings, setSettingsState] = useState<Settings>(() => loadSettings());
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const chatsRef = useRef(chats);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  const setChatsAndSave = useCallback(
    (updater: Chat[] | ((prev: Chat[]) => Chat[])) => {
      setChats((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        if (next.length > 0) {
          saveChats(next);
        } else {
          localStorage.removeItem("linkClaude_chats");
        }
        return next;
      });
    },
    []
  );

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const createChat = useCallback(() => {
    const newChat: Chat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChatsAndSave((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setError(null);
    return newChat.id;
  }, [setChatsAndSave]);

  const deleteChat = useCallback(
    (chatId: string) => {
      setChatsAndSave((prev) => prev.filter((c) => c.id !== chatId));
      if (activeChatId === chatId) {
        const remaining = chats.filter((c) => c.id !== chatId);
        setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
      }
    },
    [activeChatId, chats, setChatsAndSave]
  );

  const updateSettings = useCallback((newSettings: Settings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  }, []);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback(
    async (content: string, chatId?: string) => {
      if (!settings.apiKey) {
        setError("Please set your API key in Settings first.");
        return;
      }

      let targetChatId = chatId || activeChatId;
      if (!targetChatId) {
        const id = uuidv4();
        const newChat: Chat = {
          id,
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setChatsAndSave((prev) => [newChat, ...prev]);
        setActiveChatId(id);
        targetChatId = id;
      }

      const userMessage: Message = {
        id: uuidv4(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      setChatsAndSave((prev) =>
        prev.map((c) => {
          if (c.id !== targetChatId) return c;
          const title =
            c.messages.length === 0
              ? content.slice(0, 50) + (content.length > 50 ? "..." : "")
              : c.title;
          return {
            ...c,
            title,
            messages: [...c.messages, userMessage],
            updatedAt: Date.now(),
          };
        })
      );

      setError(null);
      setIsStreaming(true);
      setStreamingText("");

      const abortController = new AbortController();
      abortRef.current = abortController;

      const currentChat = chatsRef.current.find((c) => c.id === targetChatId);
      const allMessages = [...(currentChat?.messages || []), userMessage];

      let accumulated = "";

      await streamChat(
        allMessages,
        settings,
        {
          onToken: (token) => {
            accumulated += token;
            setStreamingText(accumulated);
          },
          onComplete: (fullText) => {
            const assistantMessage: Message = {
              id: uuidv4(),
              role: "assistant",
              content: fullText,
              timestamp: Date.now(),
            };
            setChatsAndSave((prev) =>
              prev.map((c) => {
                if (c.id !== targetChatId) return c;
                return {
                  ...c,
                  messages: [...c.messages, assistantMessage],
                  updatedAt: Date.now(),
                };
              })
            );
            setIsStreaming(false);
            setStreamingText("");
            abortRef.current = null;
          },
          onError: (errorMsg) => {
            setError(errorMsg);
            setIsStreaming(false);
            setStreamingText("");
            abortRef.current = null;
          },
        },
        abortController.signal
      );
    },
    [activeChatId, settings, setChatsAndSave]
  );

  const regenerateLastMessage = useCallback(async () => {
    if (!activeChat || activeChat.messages.length < 2) return;

    const lastAssistantIdx = activeChat.messages
      .map((m, i) => ({ m, i }))
      .filter((x) => x.m.role === "assistant")
      .pop();

    if (!lastAssistantIdx) return;

    setChatsAndSave((prev) =>
      prev.map((c) => {
        if (c.id !== activeChatId) return c;
        return {
          ...c,
          messages: c.messages.slice(0, lastAssistantIdx.i),
          updatedAt: Date.now(),
        };
      })
    );

    const messagesUpToLastUser = activeChat.messages.slice(
      0,
      lastAssistantIdx.i
    );
    const lastUserMsg = messagesUpToLastUser[messagesUpToLastUser.length - 1];
    if (lastUserMsg?.role === "user") {
      setTimeout(() => {
        sendMessage(lastUserMsg.content, activeChatId!);
      }, 50);
    }
  }, [activeChat, activeChatId, sendMessage, setChatsAndSave]);

  const editLastUserMessage = useCallback(
    (newContent: string) => {
      if (!activeChat) return;

      const lastUserIdx = activeChat.messages
        .map((m, i) => ({ m, i }))
        .filter((x) => x.m.role === "user")
        .pop();

      if (!lastUserIdx) return;

      setChatsAndSave((prev) =>
        prev.map((c) => {
          if (c.id !== activeChatId) return c;
          return {
            ...c,
            messages: c.messages.slice(0, lastUserIdx.i),
            updatedAt: Date.now(),
          };
        })
      );

      setTimeout(() => {
        sendMessage(newContent, activeChatId!);
      }, 50);
    },
    [activeChat, activeChatId, sendMessage, setChatsAndSave]
  );

  return {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    settings,
    updateSettings,
    isStreaming,
    streamingText,
    error,
    setError,
    createChat,
    deleteChat,
    sendMessage,
    stopStreaming,
    regenerateLastMessage,
    editLastUserMessage,
  };
}
