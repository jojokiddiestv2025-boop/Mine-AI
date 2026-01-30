
export enum AppMode {
  CHAT = 'chat',
  IMAGE = 'image',
  LITE = 'lite',
  COMPETITION = 'competition'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  type?: 'text' | 'image' | 'audio';
  imageUrl?: string;
  attachment?: {
    data: string;
    mimeType: string;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  lastMessage: string;
  updatedAt: number;
  createdAt: number;
}

export interface CompetitionType {
  id: 'math' | 'spelling';
  name: string;
  description: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
