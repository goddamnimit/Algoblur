import { Timestamp } from 'firebase/firestore';

export interface Ad {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  targetUrl: string;
  price: number;
  createdAt: Timestamp;
}

export interface UserInteraction {
  id?: string;
  userId: string;
  adId: string;
  type: 'view' | 'skip' | 'click';
  category: string;
  timestamp: Timestamp;
}

export interface UserProfile {
  userId: string;
  noiseLevel: number;
  interactionsCount: number;
  categoriesObfuscated: string[];
  ghostModeActive?: boolean;
  activeModeActive?: boolean;
  activePersona?: string;
  role?: 'admin' | 'user';
}

export interface AdCampaign {
  id?: string;
  businessId: string;
  businessName: string;
  adId: string;
  budget: number;
  impressionsRemaining: number;
  status: 'active' | 'paused' | 'completed';
}

export interface GhostJourney {
  id?: string;
  userId: string;
  targetUrl: string;
  persona: string;
  timestamp: Timestamp;
}
