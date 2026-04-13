import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Shield, Globe, Search, ArrowRight, Lock, EyeOff, AlertTriangle } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export const PrivacyPortal: React.FC = () => {
  const { user, profile } = useAuth();
  const [url, setUrl] = useState('');
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleBrowse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !user) return;

    setIsBrowsing(true);
    setCurrentUrl(url);

    // Simulate RTB Interruption by logging a ghost journey for the actual URL
    // but with a randomized persona to "blur" the intent
    await dbService.logGhostJourney({
      userId: user.uid,
      targetUrl: url,
      persona: profile?.activePersona || 'Active Stealth',
      timestamp: Timestamp.now()
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-100 flex items-center gap-3">
          <Globe className="w-8 h-8 text-rose-500" /> Privacy Portal
        </h2>
        <p className="text-zinc-500 text-sm font-medium">
          Browse the web through our obfuscation layer. Every request is wrapped in noise.
        </p>
      </div>

      <Card className={`border-2 transition-all duration-500 ${profile?.activeModeActive ? 'border-rose-500 bg-rose-950/5' : 'border-zinc-800 bg-zinc-950'}`}>
        <CardContent className="p-6">
          {!profile?.activeModeActive && (
            <div className="mb-6 p-4 bg-rose-500/10 border-2 border-rose-500/20 rounded-xl flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
              <div>
                <p className="text-sm font-bold text-rose-500 uppercase tracking-tight">Active Mode Disabled</p>
                <p className="text-xs text-zinc-500">Enable "Active Stealth Mode" in your stats to maximize RTB interruption while browsing.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleBrowse} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <Input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to browse obscured (e.g., search.com)"
                className="pl-10 bg-zinc-900 border-2 border-zinc-800 focus:border-rose-500 transition-colors font-mono text-sm"
              />
            </div>
            <Button type="submit" className="bg-rose-500 hover:bg-rose-600 text-zinc-950 font-black uppercase tracking-widest text-xs px-6">
              Go <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {isBrowsing ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-rose-500 text-zinc-950 font-black uppercase text-[10px]">Stealth Active</Badge>
              <span className="text-xs font-mono text-zinc-500">{currentUrl}</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-zinc-600">
              <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> RTB Blocked</span>
              <span className="flex items-center gap-1 animate-pulse text-rose-500"><Shield className="w-3 h-3" /> Injecting Noise</span>
            </div>
          </div>
          
          <Card className="border-2 border-zinc-800 bg-zinc-900 h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent animate-pulse" />
              <div className="h-full w-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </div>
            
            <Shield className="w-20 h-20 text-rose-500/20 mb-6 animate-bounce" />
            <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-500 mb-2">Secure Sandbox Active</h3>
            <p className="text-xs text-zinc-600 max-w-xs text-center font-medium">
              In a production environment, this would be a proxied iframe or a custom browser engine. 
              Currently simulating RTB interruption for <span className="text-rose-500">{currentUrl}</span>.
            </p>
            
            <div className="mt-8 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsBrowsing(false)} className="border-zinc-800 text-zinc-500 hover:text-zinc-100">
                Exit Portal
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-zinc-800 bg-zinc-950 p-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-rose-500" /> How it works
            </h4>
            <ul className="space-y-3">
              {[
                'Intercepts outgoing requests to known ad networks.',
                'Wraps your browsing intent in randomized metadata.',
                'Injects background noise specifically tuned to your current destination.',
                'Rotates User-Agents and IP signatures (simulated).'
              ].map((item, i) => (
                <li key={i} className="text-xs text-zinc-500 flex gap-2">
                  <span className="text-rose-500 font-bold">0{i+1}</span> {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="border-2 border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-center items-center text-center">
            <Lock className="w-12 h-12 text-zinc-800 mb-4" />
            <p className="text-xs text-zinc-600 font-medium italic">
              "The best way to protect your data is to make it worthless."
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
