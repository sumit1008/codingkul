"use client";

import { Check } from "lucide-react";
import { AVATAR_PRESETS } from "@/lib/avatarPresets";

interface Props {
  selectedId: number;
  onSelect: (id: number) => void;
}

export default function AvatarPicker({ selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {AVATAR_PRESETS.map((preset) => {
        const Icon = preset.icon;
        const isSelected = preset.id === selectedId;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.id)}
            className="relative aspect-square rounded-2xl flex items-center justify-center transition-transform hover:scale-105"
            style={{
              background: preset.gradient,
              boxShadow: isSelected ? "0 0 0 3px #0d0d22, 0 0 0 5px #6366f1" : "none",
            }}
          >
            <Icon className="w-1/2 h-1/2 text-white" strokeWidth={2} />
            {isSelected && (
              <div
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "#22c55e", border: "2px solid #0d0d22" }}
              >
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
