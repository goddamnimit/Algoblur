import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Ad, UserInteraction, UserProfile, GhostJourney, AdCampaign } from '../types';

export const dbService = {
  // Ads
  async getAds(count: number = 20): Promise<Ad[]> {
    const path = 'ads';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(count));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async addAd(ad: Omit<Ad, 'id' | 'createdAt'>): Promise<string> {
    const path = 'ads';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...ad,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  // Interactions
  async recordInteraction(interaction: UserInteraction): Promise<void> {
    const path = 'interactions';
    try {
      await addDoc(collection(db, path), interaction);
      
      // Update user profile stats (noise level)
      await this.updateUserProfileStats(interaction.userId, interaction.category);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // User Profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const path = `users/${userId}`;
    try {
      const docSnap = await getDoc(doc(db, 'users', userId));
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async createUserProfile(userId: string): Promise<UserProfile> {
    const path = `users/${userId}`;
    const profile: UserProfile = {
      userId,
      noiseLevel: 0,
      interactionsCount: 0,
      categoriesObfuscated: [],
      role: 'user'
    };
    try {
      await setDoc(doc(db, 'users', userId), profile);
      return profile;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  },

  async updateUserProfileStats(userId: string, category: string): Promise<void> {
    const path = `users/${userId}`;
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) return;

      const newCategories = Array.from(new Set([...profile.categoriesObfuscated, category]));
      const newInteractionsCount = profile.interactionsCount + 1;
      
      // Simple noise level calculation: based on variety of categories and total interactions
      // Max noise at 50 unique categories and 500 interactions
      const categoryScore = Math.min((newCategories.length / 50) * 50, 50);
      const interactionScore = Math.min((newInteractionsCount / 500) * 50, 50);
      const newNoiseLevel = Math.round(categoryScore + interactionScore);

      await setDoc(doc(db, 'users', userId), {
        ...profile,
        noiseLevel: newNoiseLevel,
        interactionsCount: newInteractionsCount,
        categoriesObfuscated: newCategories
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  subscribeToProfile(userId: string, callback: (profile: UserProfile) => void) {
    const path = `users/${userId}`;
    return onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        callback(doc.data() as UserProfile);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  },

  // Ghost Journeys
  async logGhostJourney(journey: GhostJourney): Promise<void> {
    const path = 'ghost_journeys';
    try {
      await addDoc(collection(db, path), journey);
      await this.updateUserProfileStats(journey.userId, journey.persona);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async toggleGhostMode(userId: string, active: boolean, persona?: string): Promise<void> {
    const path = `users/${userId}`;
    try {
      await setDoc(doc(db, 'users', userId), {
        ghostModeActive: active,
        activePersona: persona || null
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async toggleActiveMode(userId: string, active: boolean): Promise<void> {
    const path = `users/${userId}`;
    try {
      await setDoc(doc(db, 'users', userId), {
        activeModeActive: active
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // Campaigns
  async getCampaigns(): Promise<AdCampaign[]> {
    const path = 'campaigns';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdCampaign));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async createCampaign(campaign: AdCampaign): Promise<string> {
    const path = 'campaigns';
    try {
      const docRef = await addDoc(collection(db, path), campaign);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  }
};
