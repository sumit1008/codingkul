export interface SheetMeta {
  _id: string;
  title: string;
  slug: string;
  description: string;
  isPremium: boolean;
  totalProblems: number;
  accentColor: string;
  accentFrom: string;
  accentTo: string;
}

export interface TopicMeta {
  _id: string;
  title: string;
  slug: string;
  sheetSlug: string;
  order: number;
  totalProblems: number;
}

export interface SheetDetail extends SheetMeta {
  topics: TopicMeta[];
}

export interface APIProblem {
  _id: string;
  title: string;
  slug: string;
  problemLink: string;
  platform: string;
  difficulty: string;
  tags: string[];
  topicSlug: string;
  order: number;
  xp: number;
  resourceType: "Problem" | "Article" | "";
  pattern: string;
  subpattern: string;
  priority: string;
  subtopic: string;
}
