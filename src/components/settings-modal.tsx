"use client";

import { useState } from "react";
import { Settings } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Save } from "lucide-react";

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

  const handleSave = () => {
    onSave(local);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#12121a] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
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
      </DialogContent>
    </Dialog>
  );
}
