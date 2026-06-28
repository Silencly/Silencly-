export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider?: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface DictationSession {
  id: string;
  createdAt: string;
  title: string;
  rawText: string;
  polishedText: string;
  durationSeconds: number;
}

export type ToneOption = 'polished' | 'academic' | 'bulletpoints' | 'email';

export interface ToneDefinition {
  id: ToneOption;
  label: string;
  description: string;
  emoji: string;
}

export const TONE_OPTIONS: ToneDefinition[] = [
  {
    id: 'polished',
    label: 'Polished Draft',
    description: 'Polishes speech into clean, readable text, balancing professional grammar with your natural voice.',
    emoji: '✨'
  },
  {
    id: 'academic',
    label: 'Academic Notes',
    description: 'Scholarly precision, sophisticated language, and analytical tone.',
    emoji: '🎓'
  },
  {
    id: 'bulletpoints',
    label: 'Bullet Points',
    description: 'Extracts action items, key insights, and summaries into lists.',
    emoji: '📝'
  },
  {
    id: 'email',
    label: 'Email Draft',
    description: 'A polite, structured email with subject line and spacing.',
    emoji: '✉️'
  }
];
