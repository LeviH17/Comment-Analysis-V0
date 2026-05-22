import type { LucideIcon } from "lucide-react";
import {
  MessageCircleQuestion,
  Hexagon,
  Layers,
  Users,
  Bell,
  Sparkles,
  LayoutGrid,
  MessagesSquare,
  Settings,
  FolderClosed,
  HelpCircle,
} from "lucide-react";

export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: NavChild[];
  disabled?: boolean;
};

export const primaryNav: NavItem[] = [
  { label: "Ask Pendulum", icon: MessageCircleQuestion, disabled: true },
  { label: "Brands", icon: Hexagon, disabled: true },
  { label: "Topics", icon: Layers, disabled: true },
  {
    label: "Influencers",
    icon: Users,
    disabled: true,
    children: [
      { label: "Influencer Hub", href: "#" },
      { label: "Influencer Vetting", href: "#" },
      { label: "Influencer Monitoring", href: "#" },
    ],
  },
  { label: "Alerts", icon: Bell, disabled: true },
  { label: "Agents", icon: Sparkles, disabled: true },
  { label: "Featured Reports", icon: LayoutGrid, disabled: true },
  {
    label: "Comment Analysis",
    icon: MessagesSquare,
    children: [
      { label: "Post Comments", href: "/comment-analysis/post-comments" },
      { label: "Creator Comments", href: "/comment-analysis/creator-comments" },
      { label: "Search Comments", href: "/comment-analysis/search-comments" },
    ],
  },
];

export const utilityNav: NavItem[] = [
  { label: "Settings", icon: Settings, disabled: true },
  { label: "My Collection", icon: FolderClosed, disabled: true },
  { label: "Help", icon: HelpCircle, disabled: true },
];
