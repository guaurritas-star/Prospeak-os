export interface OSWindow {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  defaultPositionClasses?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'maya' | 'user';
  text: string;
  timestamp?: string;
  tips?: string;
}

export interface EmailAttachment {
  name: string;
  size: string;
}

export interface EmailItem {
  id: string;
  fromName: string;
  fromRole: string;
  fromAvatar: string;
  subject: string;
  date: string;
  preview: string;
  body: string;
  unread: boolean;
  attachment?: EmailAttachment;
}

export interface SpeakingExercise {
  title: string;
  target: string;
  hint: string;
}

export interface CareerNode {
  id: number;
  title: string;
  status: 'completed' | 'current' | 'locked';
  desc: string;
}

export interface CareerTrack {
  title: string;
  description: string;
  progress: number;
  level: string;
  skills: string[];
  nodes: CareerNode[];
}

export interface VocabularyWord {
  w: string;
  m: string;
  ex: string;
}

export interface MissionStepStatus {
  1: boolean;
  2: boolean;
  3: boolean;
}

export interface ReplyAnalysis {
  score: number;
  toneMatch: string;
  strengths: string[];
  suggestion: string;
}
