import type { LucideIcon } from "lucide-react";
import { BookOpen, BrainCircuit, Droplets, Earth, Leaf, Users } from "lucide-react";

export type ContentType =
  | "project"
  | "program"
  | "opportunity"
  | "article"
  | "resource"
  | "team"
  | "partner"
  | "voice"
  | "report";
export type ContentItem = {
  id: string;
  content_type: ContentType;
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: string;
  location: string | null;
  organization: string | null;
  image_url: string | null;
  external_url: string | null;
  published_at: string | null;
  deadline: string | null;
  featured: boolean;
  status: string;
  details: Record<string, unknown>;
  updated_at?: string;
};
export type ImpactStat = {
  id: string;
  label: string;
  value: number;
  unit: string;
  display_order: number;
};

export const focusAreas: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Climate Action & Environmental Education",
    description:
      "Making science, policy and opportunities clear and accessible.Youth-led campaigns, advocacy and practical responses to the climate crisis",
    icon: BookOpen,
  },
  {
    title: "Water Security & Conservation",
    description: "Community solutions that protect water sources and improve resilience.",
    icon: Droplets,
  },
  {
    title: "Innovation & Technology",
    description: "Supporting young people to prototype tools for people and planet.",
    icon: BrainCircuit,
  },
];

export const programs = [
  [
    "Youth Climate Leadership",
    "Leadership",
    "Training young people in advocacy, organizing and policy engagement.",
  ],
  [
    "Water & Environmental Action",
    "Water",
    "Practical community conservation shaped and led by young people.",
  ],
  ["Green Schools", "Education", "Tree growing, waste action and water stewardship in schools."],
  [
    "Youth Innovation Lab",
    "Technology",
    "Mentorship and prototyping for climate and water solutions.",
  ],
  ["Climate Education", "Learning", "Accessible climate science, policy and opportunity literacy."],
] as const;

export const demoStats = [
  { id: "1", label: "Young People Engaged", value: 12480, unit: "+", display_order: 1 },
  { id: "2", label: "Communities Reached", value: 42, unit: "", display_order: 2 },
  { id: "3", label: "Projects Implemented", value: 28, unit: "", display_order: 3 },
  { id: "4", label: "Partnerships Built", value: 19, unit: "", display_order: 4 },
  { id: "5", label: "Trees Planted", value: 18500, unit: "+", display_order: 5 },
  { id: "6", label: "Litres of Water Saved", value: 3200000, unit: "+", display_order: 6 },
];
