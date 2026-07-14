"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Calendar,
  Check,
  Download,
  Envelope,
  EyeSlash,
  GitBranch,
  GithubLogo,
  Globe,
  GridFour,
  Heart,
  Info,
  LinkedinLogo,
  List,
  Lock,
  MagnifyingGlass,
  MapPin,
  Minus,
  Moon,
  Plus,
  Shield,
  ShieldCheck,
  Star,
  Sun,
  Terminal,
  Trash,
  Users,
  UsersThree,
  Waveform,
  X,
} from "@phosphor-icons/react";
import type { CSSProperties, ComponentType } from "react";

type PhosphorIconComponent = ComponentType<{
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  color?: string;
}>;

const ICON_MAP: Record<string, PhosphorIconComponent> = {
  activity: Waveform,
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-up-right": ArrowUpRight,
  "caret-down": CaretDown,
  "caret-left": CaretLeft,
  "caret-right": CaretRight,
  "caret-up": CaretUp,
  calendar: Calendar,
  check: Check,
  download: Download,
  envelope: Envelope,
  "eye-slash": EyeSlash,
  "git-branch": GitBranch,
  "github-logo": GithubLogo,
  globe: Globe,
  "grid-four": GridFour,
  heart: Heart,
  info: Info,
  "linkedin-logo": LinkedinLogo,
  list: List,
  lock: Lock,
  "magnifying-glass": MagnifyingGlass,
  "map-pin": MapPin,
  minus: Minus,
  moon: Moon,
  plus: Plus,
  shield: Shield,
  "shield-check": ShieldCheck,
  star: Star,
  sun: Sun,
  terminal: Terminal,
  trash: Trash,
  users: Users,
  "users-three": UsersThree,
  waveform: Waveform,
  x: X,
} satisfies Record<string, PhosphorIconComponent>;

export type IconName = keyof typeof ICON_MAP;

interface IconProps {
  name: IconName;
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  color?: string;
  style?: CSSProperties;
  className?: string;
}

export function Icon({ name, size = 18, weight = "regular", color, style, className }: IconProps) {
  const Cmp = ICON_MAP[name];
  if (!Cmp) return null;
  return (
    <span className={className} style={{ display: "inline-flex", ...style }} aria-hidden>
      <Cmp size={size} weight={weight} color={color} />
    </span>
  );
}
