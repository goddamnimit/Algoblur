import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Ad, UserInteraction } from '../types';
import { dbService } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X, Heart, ExternalLink, Info } from 'lucide-react';

interface AdSwiperProps {
  ads: Ad[];
  onSwipe: (ad: Ad, type: 'skip' | 'click') => void;
}

export const AdSwiper: React.FC<AdSwiperProps> = ({ ads, onSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const heartOpacity = useTransform(x, [50, 150], [0, 1]);
  const xOpacity = useTransform(x, [-150, -50], [1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      handleSwipe('click');
    } else if (info.offset.x < -100) {
      handleSwipe('skip');
    }
  };

  const handleSwipe = (type: 'skip' | 'click') => {
    const ad = ads[currentIndex];
    if (ad) {
      onSwipe(ad, type);
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (currentIndex >= ads.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-zinc-900 border-2 border-zinc-800 rounded-xl">
        <h3 className="text-2xl font-bold text-zinc-100 mb-2">Queue Empty</h3>
        <p className="text-zinc-400 mb-6">You've successfully introduced noise for all current ads. Check back soon for more!</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          Refresh Ads
        </Button>
      </div>
    );
  }

  const currentAd = ads[currentIndex];

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] flex items-center justify-center perspective-1000">
      <AnimatePresence>
        <motion.div
          key={currentAd.id}
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="absolute w-full h-full cursor-grab active:cursor-grabbing"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ x: x.get() > 0 ? 500 : -500, opacity: 0, transition: { duration: 0.3 } }}
        >
          <Card className="w-full h-full overflow-hidden border-2 border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col">
            <div className="relative h-2/3 overflow-hidden">
              <img 
                src={currentAd.imageUrl} 
                alt={currentAd.title} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-zinc-900/80 text-zinc-100 border-zinc-700 backdrop-blur-sm">
                  {currentAd.category}
                </Badge>
              </div>
              
              {/* Swipe Indicators */}
              <motion.div style={{ opacity: heartOpacity }} className="absolute top-10 right-10 border-4 border-emerald-500 rounded-lg p-2 rotate-12">
                <span className="text-emerald-500 font-black text-4xl uppercase">BLUR</span>
              </motion.div>
              <motion.div style={{ opacity: xOpacity }} className="absolute top-10 left-10 border-4 border-rose-500 rounded-lg p-2 -rotate-12">
                <span className="text-rose-500 font-black text-4xl uppercase">SKIP</span>
              </motion.div>
            </div>

            <CardContent className="p-6 flex-1 flex flex-col justify-between bg-zinc-950">
              <div>
                <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tighter mb-2">{currentAd.title}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{currentAd.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Ad Cost</span>
                  <span className="text-zinc-100 font-mono font-bold">${(currentAd.price / 100).toFixed(2)}</span>
                </div>
                <div className="flex gap-3">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-full border-zinc-800 bg-zinc-900 hover:bg-rose-900/20 hover:border-rose-900 text-rose-500"
                    onClick={() => handleSwipe('skip')}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-full border-zinc-800 bg-zinc-900 hover:bg-emerald-900/20 hover:border-emerald-900 text-emerald-500"
                    onClick={() => handleSwipe('click')}
                  >
                    <Heart className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      
      {/* Background Card for depth */}
      {currentIndex + 1 < ads.length && (
        <div className="absolute w-full h-full -z-10 scale-95 translate-y-4 opacity-50">
          <Card className="w-full h-full border-2 border-zinc-800 bg-zinc-950" />
        </div>
      )}
    </div>
  );
};
