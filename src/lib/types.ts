export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  apiKey: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  model: string;
}

export const DEFAULT_SETTINGS: Settings = {
  apiKey: "",
  systemPrompt: "You are a helpful assistant.",
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1.0,
  topK: 0,
  model: "claude-opus-4-7",
};

export interface SSEEvent {
  event: string;
  data: string;
}
