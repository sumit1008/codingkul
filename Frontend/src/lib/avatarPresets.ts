import {
  Rocket, Sparkles, Flame, Trophy, Crown, Zap,
  Code2, Cpu, Brain, Star, Target, Swords,
  type LucideIcon,
} from "lucide-react";

export interface AvatarPreset {
  id: number;
  gradient: string;
  icon: LucideIcon;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 1,  gradient: "linear-gradient(135deg, #6366f1, #a855f7)", icon: Sparkles },
  { id: 2,  gradient: "linear-gradient(135deg, #22c55e, #15803d)", icon: Rocket },
  { id: 3,  gradient: "linear-gradient(135deg, #f97316, #ea580c)", icon: Flame },
  { id: 4,  gradient: "linear-gradient(135deg, #eab308, #b45309)", icon: Trophy },
  { id: 5,  gradient: "linear-gradient(135deg, #a855f7, #7c3aed)", icon: Crown },
  { id: 6,  gradient: "linear-gradient(135deg, #facc15, #ca8a04)", icon: Zap },
  { id: 7,  gradient: "linear-gradient(135deg, #06b6d4, #0e7490)", icon: Code2 },
  { id: 8,  gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)", icon: Cpu },
  { id: 9,  gradient: "linear-gradient(135deg, #ec4899, #be185d)", icon: Brain },
  { id: 10, gradient: "linear-gradient(135deg, #f43f5e, #be123c)", icon: Star },
  { id: 11, gradient: "linear-gradient(135deg, #14b8a6, #0f766e)", icon: Target },
  { id: 12, gradient: "linear-gradient(135deg, #84cc16, #4d7c0f)", icon: Swords },
];

export function getAvatarPreset(id: number | undefined | null): AvatarPreset {
  return AVATAR_PRESETS.find((p) => p.id === id) ?? AVATAR_PRESETS[0];
}
