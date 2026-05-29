"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Save, X } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export function SettingsModal({
  open,
  onOpenChange,
  settings,
  onSave,
}: SettingsModalProps) {
  const [local, setLocal] = useState<Settings>(settings);
  const [showKey, setShowKey] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open && !prevOpen) {
    setLocal(settings);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  const handleSave = () => {
    onSave(local);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-[#12121a] border border-white/10 rounded-xl text-white max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 pb-0">
          <h2 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Settings
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-zinc-500 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 p-4">
          <div className="space-y-2">
            <Label className="text-sm text-zinc-300">LinkModel.ai API Key</Label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={local.apiKey}
                onChange={(e) => setLocal({ ...local, apiKey: e.target.value })}
                placeholder="Enter your API key..."
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 pr-10 focus:border-violet-500/50"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-zinc-600">
              Get your API key from{" "}
              <a
                href="https://api.linkmodel.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:underline"
              >
                LinkModel.ai
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-zinc-300">Model</Label>
            <Input
              value={local.model}
              onChange={(e) => setLocal({ ...local, model: e.target.value })}
              className="bg-white/5 border-white/10 text-white focus:border-violet-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-zinc-300">System Prompt</Label>
            <Textarea
              value={local.systemPrompt}
              onChange={(e) => setLocal({ ...local, systemPrompt: e.target.value })}
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 resize-none focus:border-violet-500/50"
              placeholder="You are a helpful assistant."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-zinc-300">Temperature</Label>
              <span className="text-xs text-violet-400 font-mono">
                {local.temperature.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[local.temperature]}
              onValueChange={(v) => {
                  const val = Array.isArray(v) ? v[0] : v;
                  setLocal({ ...local, temperature: val });
                }}
              min={0}
              max={1}
              step={0.01}
              className="py-2"
            />
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-zinc-300">Max Tokens</Label>
            <Input
              type="number"
              value={local.maxTokens}
              onChange={(e) =>
                setLocal({ ...local, maxTokens: parseInt(e.target.value) || 4096 })
              }
              min={1}
              max={32768}
              className="bg-white/5 border-white/10 text-white focus:border-violet-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-zinc-300">Top P</Label>
                <span className="text-xs text-violet-400 font-mono">
                  {local.topP.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[local.topP]}
                onValueChange={(v) => {
                    const val = Array.isArray(v) ? v[0] : v;
                    setLocal({ ...local, topP: val });
                  }}
                min={0}
                max={1}
                step={0.01}
                className="py-2"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-zinc-300">Top K</Label>
              <Input
                type="number"
                value={local.topK}
                onChange={(e) =>
                  setLocal({ ...local, topK: parseInt(e.target.value) || 0 })
                }
                min={0}
                max={500}
                className="bg-white/5 border-white/10 text-white focus:border-violet-500/50"
              />
              <p className="text-[10px] text-zinc-600">0 = disabled</p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
