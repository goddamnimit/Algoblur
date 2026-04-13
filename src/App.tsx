import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { loginWithGoogle, logout } from './lib/firebase';
import { dbService } from './services/dbService';
import { generateRandomAds } from './services/adService';
import { Ad, UserInteraction } from './types';
import { AdSwiper } from './components/AdSwiper';
import { Stats } from './components/Stats';
import { Marketplace } from './components/Marketplace';
import { PrivacyPortal } from './components/PrivacyPortal';
import { Manifesto } from './components/Manifesto';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';
import { Card, CardContent } from './components/ui/card';
import { TooltipProvider } from './components/ui/tooltip';
import { LogIn, LogOut, Shield, Info, Zap, Target, Database, RefreshCw, ShoppingBag, Globe, ScrollText } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export default function App() {
  const { user, profile, loading } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [adsLoading, setAdsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      setAdsLoading(true);
      let fetchedAds = await dbService.getAds(20);
      
      // Only attempt to seed if ads are empty AND user is the admin
      if (fetchedAds.length === 0 && user?.email === 'nimitdesa@gmail.com') {
        const newAdsData = await generateRandomAds(10);
        const savedAds: Ad[] = [];
        for (const adData of newAdsData) {
          const { createdAt, ...adWithoutDate } = adData as any;
          const id = await dbService.addAd(adWithoutDate);
          savedAds.push({ id, ...adData } as Ad);
        }
        fetchedAds = savedAds;
      }
      
      setAds(fetchedAds);
      setAdsLoading(false);
    };

    if (!loading) {
      fetchAds();
    }
  }, [user, loading]);

  const handleSwipe = async (ad: Ad, type: 'skip' | 'click') => {
    if (!user) return;

    const interaction: UserInteraction = {
      userId: user.uid,
      adId: ad.id,
      type,
      category: ad.category,
      timestamp: Timestamp.now()
    };

    await dbService.recordInteraction(interaction);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Initializing AlgoBlur...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
          <header className="p-6 border-b border-zinc-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-emerald-500" />
              <span className="text-2xl font-black tracking-tighter uppercase">AlgoBlur</span>
            </div>
            <Button onClick={loginWithGoogle} className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold">
              <LogIn className="w-4 h-4 mr-2" /> Login
            </Button>
          </header>

          <main className="max-w-4xl mx-auto px-6 py-20 text-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-none">
              Mess up your <span className="text-emerald-500">Algorithm</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-medium">
              Obscure your digital footprint by introducing noise into the data sold to ad companies. 
              Swipe through diverse ads to blur your profile and reclaim your privacy.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="p-8 border-2 border-zinc-900 bg-zinc-950 rounded-2xl hover:border-emerald-500/50 transition-colors">
                <Zap className="w-10 h-10 text-emerald-500 mb-4 mx-auto" />
                <h3 className="text-xl font-bold uppercase mb-2">Generate Noise</h3>
                <p className="text-zinc-500 text-sm">Interacting with diverse ads creates a chaotic profile that data brokers can't monetize.</p>
              </div>
              <div className="p-8 border-2 border-zinc-900 bg-zinc-950 rounded-2xl hover:border-emerald-500/50 transition-colors">
                <Target className="w-10 h-10 text-emerald-500 mb-4 mx-auto" />
                <h3 className="text-xl font-bold uppercase mb-2">Cheap Ads</h3>
                <p className="text-zinc-500 text-sm">We provide a marketplace for small businesses to reach users without predatory tracking.</p>
              </div>
              <div className="p-8 border-2 border-zinc-900 bg-zinc-950 rounded-2xl hover:border-emerald-500/50 transition-colors">
                <Database className="w-10 h-10 text-emerald-500 mb-4 mx-auto" />
                <h3 className="text-xl font-bold uppercase mb-2">Zero Tracking</h3>
                <p className="text-zinc-500 text-sm">We don't sell your data. We help you destroy the value of the data others have already stolen.</p>
              </div>
            </div>

            <Button onClick={loginWithGoogle} size="lg" className="h-16 px-12 text-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-tight">
              Start Obfuscating Now
            </Button>
          </main>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
        <header className="p-4 border-b border-zinc-900 flex justify-between items-center sticky top-0 bg-zinc-950/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-black tracking-tighter uppercase">AlgoBlur</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{user.displayName}</span>
              <span className={`text-[10px] font-mono ${profile?.activeModeActive ? 'text-rose-500' : 'text-emerald-500'}`}>
                Noise: {profile?.noiseLevel}%
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-zinc-500 hover:text-rose-500">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-4 md:p-8">
          <Stats />

          <Tabs defaultValue="swipe" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-zinc-900 border-2 border-zinc-800 p-1 mb-8 h-auto">
              <TabsTrigger value="swipe" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950 font-bold uppercase tracking-widest text-[10px] md:text-xs py-2">
                Blur Profile
              </TabsTrigger>
              <TabsTrigger value="portal" className="data-[state=active]:bg-rose-500 data-[state=active]:text-zinc-950 font-bold uppercase tracking-widest text-[10px] md:text-xs py-2">
                Privacy Portal
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950 font-bold uppercase tracking-widest text-[10px] md:text-xs py-2">
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="manifesto" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950 font-bold uppercase tracking-widest text-[10px] md:text-xs py-2">
                Manifesto
              </TabsTrigger>
              <TabsTrigger value="info" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950 font-bold uppercase tracking-widest text-[10px] md:text-xs py-2">
                How it works
              </TabsTrigger>
            </TabsList>

            <TabsContent value="swipe" className="mt-0">
              <div className="flex flex-col items-center">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Ad Stream</h2>
                  <p className="text-zinc-500 text-sm font-medium">Swipe right to "Blur" (interact) or left to "Skip".</p>
                </div>
                
                {adsLoading ? (
                  <div className="h-[600px] w-full max-w-md flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl">
                    <RefreshCw className="w-8 h-8 text-zinc-700 animate-spin" />
                  </div>
                ) : (
                  <AdSwiper ads={ads} onSwipe={handleSwipe} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="portal">
              <PrivacyPortal />
            </TabsContent>

            <TabsContent value="marketplace">
              <Marketplace />
            </TabsContent>

            <TabsContent value="manifesto">
              <Manifesto />
            </TabsContent>

            <TabsContent value="info">
              <Card className="border-2 border-zinc-800 bg-zinc-950">
                <CardContent className="p-8">
                  <div className="prose prose-invert max-w-none">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-100 mb-6">The Obfuscation Strategy</h2>
                    
                    <div className="space-y-8">
                      <section>
                        <h3 className="text-xl font-bold text-emerald-500 uppercase mb-2 flex items-center gap-2">
                          <Zap className="w-5 h-5" /> 1. Algorithmic Noise
                        </h3>
                        <p className="text-zinc-400 leading-relaxed">
                          Ad algorithms build a profile based on what you view and click. By intentionally interacting with a wide, random variety of ads—from "Mechanical Keyboards" to "Bird Watching"—you inject high-entropy noise into your profile. This makes your data statistically useless for precise targeting.
                        </p>
                      </section>

                      <Separator className="bg-zinc-900" />

                      <section>
                        <h3 className="text-xl font-bold text-emerald-500 uppercase mb-2 flex items-center gap-2">
                          <Target className="w-5 h-5" /> 2. Ethical Monetization
                        </h3>
                        <p className="text-zinc-400 leading-relaxed">
                          Traditional platforms charge high prices and demand deep tracking. We offer "Cheap Ads" to small businesses. They get exposure, and you get a tool to protect your privacy. It's a win-win that bypasses the data-industrial complex.
                        </p>
                      </section>

                      <Separator className="bg-zinc-900" />

                      <section>
                        <h3 className="text-xl font-bold text-emerald-500 uppercase mb-2 flex items-center gap-2">
                          <Shield className="w-5 h-5" /> 3. Data Sovereignty
                        </h3>
                        <p className="text-zinc-400 leading-relaxed">
                          AlgoBlur doesn't sell your data. In fact, we don't even want it. Our goal is to help you "poison the well" for the companies that have already scraped your digital life without your consent.
                        </p>
                      </section>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="p-8 border-t border-zinc-900 text-center">
          <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest">
            AlgoBlur v1.0.0 // Built for Privacy // No Tracking // No BS
          </p>
        </footer>
      </div>
    </TooltipProvider>
  );
}
