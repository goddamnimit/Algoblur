import React from 'react';
import { Card, CardContent } from './ui/card';
import { Shield, EyeOff, Lock, UserCheck, Zap, Target } from 'lucide-react';

export const Manifesto: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-zinc-100">
          The <span className="text-emerald-500">Manifesto</span>
        </h2>
        <p className="text-zinc-500 max-w-2xl mx-auto font-medium">
          Why we built AlgoBlur, and why your digital shadow matters more than you think.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-zinc-800 bg-zinc-950 p-6 hover:border-emerald-500/50 transition-all duration-500 group">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <EyeOff className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold uppercase tracking-tight text-zinc-100">Against Quantification</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Every click, every like, and every second you spend hovering over a post is being compiled into a digital twin. You aren't a person to them; you're a data point to be sold to the highest bidder. We reject this quantification of the human experience.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-2 border-zinc-800 bg-zinc-950 p-6 hover:border-emerald-500/50 transition-all duration-500 group">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <Lock className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold uppercase tracking-tight text-zinc-100">Data Sovereignty</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Your data should belong to you. Since it's already been scraped, the only way to reclaim your privacy is to make that data worthless. By injecting high-entropy noise into your profile, you reclaim your sovereignty.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-2 border-zinc-800 bg-zinc-950 p-6 hover:border-emerald-500/50 transition-all duration-500 group">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <Zap className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold uppercase tracking-tight text-zinc-100">Algorithmic Resistance</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Algorithms are designed to keep you in a bubble. They show you what they think you want to see. AlgoBlur breaks that bubble by forcing the algorithm to deal with "impossible" user behavior.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-2 border-zinc-800 bg-zinc-950 p-6 hover:border-emerald-500/50 transition-all duration-500 group">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <UserCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold uppercase tracking-tight text-zinc-100">Human-Centric Design</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                We believe in a web where you can browse without being hunted. Our goal is to provide tools that empower users to navigate the digital world on their own terms, without the constant pressure of surveillance capitalism.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-2 border-zinc-800 bg-zinc-950 p-8 text-center space-y-6">
        <Shield className="w-16 h-16 text-emerald-500 mx-auto animate-pulse" />
        <div className="space-y-2">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-100">The End Goal</h3>
          <p className="text-zinc-400 max-w-xl mx-auto leading-relaxed">
            A web where privacy isn't a luxury for the tech-savvy, but a default for everyone. By making tracking unprofitable, we force the industry to move towards more ethical, less intrusive models of monetization.
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-emerald-500">0%</span>
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Tracking</span>
          </div>
          <div className="w-px h-10 bg-zinc-800" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-emerald-500">100%</span>
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Noise</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
