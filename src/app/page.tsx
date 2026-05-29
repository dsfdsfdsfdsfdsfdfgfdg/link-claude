"use client";

import { useState } from "react";
import { useChatStore } from "@/hooks/use-chat-store";
import { Sidebar } from "@/components/sidebar";
import { ChatArea } from "@/components/chat-area";
import { SettingsModal } from "@/components/settings-modal";

export default function Home() {
  const store = useChatStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleNewChat = () => {
    store.createChat();
    setSidebarOpen(false);
  };

  const handleSelectChat = (id: string) => {
    store.setActiveChatId(id);
    store.setError(null);
    setSidebarOpen(false);
  };

  const handleSend = (content: string) => {
    if (!store.activeChatId) {
      store.createChat();
    }
    store.sendMessage(content);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d0d14]">
      <Sidebar
        chats={store.chats}
        activeChatId={store.activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={store.deleteChat}
        onOpenSettings={() => setSettingsOpen(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        model={store.settings.model}
      />

      <ChatArea
        chat={store.activeChat}
        isStreaming={store.isStreaming}
        streamingText={store.streamingText}
        error={store.error}
        onSend={handleSend}
        onStop={store.stopStreaming}
        onRegenerate={store.regenerateLastMessage}
        onEditLast={store.editLastUserMessage}
        onOpenSidebar={() => setSidebarOpen(true)}
        hasApiKey={!!store.settings.apiKey}
      />

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={store.settings}
        onSave={store.updateSettings}
      />
    </div>
  );
}
