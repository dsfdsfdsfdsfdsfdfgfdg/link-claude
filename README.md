# LinkClaude

A modern, production-ready browser chat application powered by **Claude Opus 4.7** via the [LinkModel.ai](https://api.linkmodel.ai) API.

Built with **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

![Dark modern UI](https://img.shields.io/badge/UI-Dark_Modern-8B5CF6?style=flat-square) ![Next.js 15](https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=nextdotjs) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

## Features

- **Real-time Streaming** — Token-by-token streaming via SSE with proper Anthropic event parsing (`message_start`, `content_block_delta`, `message_delta`, `message_stop`)
- **Beautiful Dark UI** — Gradient accents, smooth animations, and polished design
- **Chat History** — Conversations saved in localStorage with sidebar navigation
- **Markdown Rendering** — Full markdown support with syntax-highlighted code blocks (Prism.js)
- **Message Actions** — Copy, regenerate, edit last message, delete chats
- **Settings Modal** — API key, system prompt, temperature, max tokens, Top P, Top K
- **Responsive Design** — Works on desktop and mobile with collapsible sidebar
- **Error Handling** — Invalid API key, rate limits, network errors all handled gracefully
- **Loading States** — Typing indicators and smooth auto-scroll

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd link-claude

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

1. Click **Settings** in the sidebar (or the gear icon)
2. Enter your **LinkModel.ai API Key**
3. Optionally customize the system prompt, temperature, max tokens, etc.
4. Click **Save Settings**

## API Details

- **Base URL:** `https://api.linkmodel.ai/v1`
- **Endpoint:** `POST /v1/messages`
- **Model:** `claude-opus-4-7` (default)
- **Format:** Anthropic Messages API (not OpenAI format)

## Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) — Accessible component primitives
- [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) — Markdown rendering
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) — Code syntax highlighting
- [Lucide React](https://lucide.dev/) — Icons

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind + theme variables
│   ├── layout.tsx           # Root layout with dark mode
│   └── page.tsx             # Main chat page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── chat-area.tsx        # Main chat area with messages
│   ├── chat-input.tsx       # Message input with send/stop
│   ├── chat-message.tsx     # Individual message component
│   ├── empty-state.tsx      # Welcome screen with suggestions
│   ├── markdown-renderer.tsx # Markdown + code highlighting
│   ├── settings-modal.tsx   # Settings dialog
│   └── sidebar.tsx          # Chat history sidebar
├── hooks/
│   └── use-chat-store.ts    # Chat state management
└── lib/
    ├── storage.ts           # localStorage persistence
    ├── stream.ts            # SSE streaming implementation
    ├── types.ts             # TypeScript types
    └── utils.ts             # Utility functions
```

## License

MIT
