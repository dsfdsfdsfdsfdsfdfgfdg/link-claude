import { Settings, Message } from "./types";

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: string) => void;
}

export async function streamChat(
  messages: Message[],
  settings: Settings,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const apiMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const body: Record<string, unknown> = {
    model: settings.model,
    max_tokens: settings.maxTokens,
    temperature: settings.temperature,
    system: settings.systemPrompt,
    messages: apiMessages,
    stream: true,
  };

  if (settings.topP < 1.0) {
    body.top_p = settings.topP;
  }
  if (settings.topK > 0) {
    body.top_k = settings.topK;
  }

  let response: Response;
  try {
    response = await fetch("https://api.linkmodel.ai/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey}`,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (signal?.aborted) return;
    callbacks.onError(
      err instanceof Error ? err.message : "Network error. Check your connection."
    );
    return;
  }

  if (!response.ok) {
    let errorMsg = `API Error (${response.status})`;
    try {
      const errBody = await response.json();
      if (errBody?.error?.message) {
        errorMsg = errBody.error.message;
      }
    } catch {
      // ignore parse errors
    }

    if (response.status === 401) {
      errorMsg = "Invalid API key. Please check your LinkModel.ai API key in Settings.";
    } else if (response.status === 429) {
      errorMsg = "Rate limit exceeded. Please wait a moment and try again.";
    } else if (response.status === 529) {
      errorMsg = "API is overloaded. Please try again later.";
    }

    callbacks.onError(errorMsg);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    callbacks.onError("Failed to get response stream.");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      let currentEvent = "";

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith("data: ") && currentEvent) {
          const dataStr = line.slice(6);
          try {
            const data = JSON.parse(dataStr);

            if (currentEvent === "content_block_delta") {
              const text = data?.delta?.text;
              if (text) {
                fullText += text;
                callbacks.onToken(text);
              }
            } else if (currentEvent === "message_stop") {
              // streaming complete
            } else if (currentEvent === "error") {
              callbacks.onError(data?.error?.message || "Stream error occurred.");
              return;
            }
          } catch {
            // ignore JSON parse errors for non-JSON data lines
          }
          currentEvent = "";
        } else if (line.trim() === "") {
          currentEvent = "";
        }
      }
    }
  } catch (err) {
    if (signal?.aborted) return;
    callbacks.onError(
      err instanceof Error ? err.message : "Stream interrupted."
    );
    return;
  }

  callbacks.onComplete(fullText);
}
