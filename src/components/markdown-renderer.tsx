"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useState, useCallback, type ComponentProps } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-zinc-400 hover:text-white"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

type CodeComponentProps = ComponentProps<"code"> & {
  inline?: boolean;
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }: CodeComponentProps) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");
          const isMultiline = codeString.includes("\n");

          if (match || isMultiline) {
            return (
              <div className="relative group my-3">
                {match && (
                  <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-800 rounded-t-lg border-b border-white/5">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      {match[1]}
                    </span>
                  </div>
                )}
                <CopyButton text={codeString} />
                <SyntaxHighlighter
                  style={oneDark}
                  language={match?.[1] || "text"}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: match ? "0 0 0.5rem 0.5rem" : "0.5rem",
                    padding: "1rem",
                    fontSize: "0.8125rem",
                    background: "#1a1a2e",
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <code
              className="px-1.5 py-0.5 rounded-md bg-white/10 text-violet-300 text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
        },
        ul({ children }) {
          return <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>;
        },
        li({ children }) {
          return <li className="leading-relaxed">{children}</li>;
        },
        h1({ children }) {
          return <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-base font-bold mb-2 mt-3">{children}</h3>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-2 border-violet-500 pl-4 my-3 text-zinc-300 italic">
              {children}
            </blockquote>
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border-collapse border border-white/10 rounded-lg">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="border border-white/10 px-3 py-2 bg-white/5 text-left text-sm font-semibold">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-white/10 px-3 py-2 text-sm">{children}</td>
          );
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
            >
              {children}
            </a>
          );
        },
        hr() {
          return <hr className="border-white/10 my-4" />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
