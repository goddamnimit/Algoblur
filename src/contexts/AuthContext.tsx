import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { dbService } from '../services/dbService';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Check if profile exists, if not create it
        let userProfile = await dbService.getUserProfile(firebaseUser.uid);
        if (!userProfile) {
          userProfile = await dbService.createUserProfile(firebaseUser.uid);
        }
        setProfile(userProfile);

        // Subscribe to profile changes
        if (unsubscribeProfile) unsubscribeProfile();
        unsubscribeProfile = dbService.subscribeToProfile(firebaseUser.uid, (updatedProfile) => {
          setProfile(updatedProfile);
        });

        setLoading(false);
      } else {
        if (unsubscribeProfile) unsubscribeProfile();
        unsubscribeProfile = null;
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
