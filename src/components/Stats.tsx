import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ghostService } from '../services/ghostService';
import { dbService } from '../services/dbService';
import { Shield, Zap, Target, Database, Ghost, Power, PowerOff } from 'lucide-react';

export const Stats: React.FC = () => {
  const { profile, user } = useAuth();

  if (!profile || !user) return null;

  const stats = [
    { label: 'Noise Level', value: `${profile.noiseLevel}%`, icon: Zap, color: 'text-yellow-500' },
    { label: 'Interactions', value: profile.interactionsCount, icon: Target, color: 'text-blue-500' },
    { label: 'Categories', value: profile.categoriesObfuscated.length, icon: Database, color: 'text-purple-500' },
  ];

  const toggleGhost = () => {
    if (profile.ghostModeActive) {
      ghostService.stopGhostMode(user.uid);
    } else {
      ghostService.startGhostMode(user.uid, profile.activeModeActive);
    }
  };

  const toggleActiveMode = () => {
    const newState = !profile.activeModeActive;
    dbService.toggleActiveMode(user.uid, newState);
    if (profile.ghostModeActive) {
      ghostService.updateFrequency(user.uid, newState);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className={`md:col-span-2 border-2 transition-all duration-500 ${profile.activeModeActive ? 'border-rose-500 bg-rose-950/10' : 'border-zinc-800 bg-zinc-950'}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${profile.activeModeActive ? 'text-rose-500' : 'text-zinc-500'}`}>
              <Shield className="w-4 h-4" /> {profile.activeModeActive ? 'Active Stealth Mode' : 'Standard Obfuscation'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`border-2 ${profile.noiseLevel > 70 ? 'border-emerald-500 text-emerald-500 bg-emerald-950/20' : 'border-zinc-800 text-zinc-500'}`}>
                {profile.noiseLevel > 70 ? 'Highly Blurred' : 'Partially Visible'}
              </Badge>
              <Button 
                onClick={toggleActiveMode}
                size="sm"
                variant="outline"
                className={`h-7 px-3 text-[10px] font-black uppercase tracking-tighter border-2 ${profile.activeModeActive ? 'border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-zinc-950' : 'border-zinc-800 text-zinc-500 hover:border-rose-500 hover:text-rose-500'}`}
              >
                {profile.activeModeActive ? 'Disable Active' : 'Enable Active'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-4xl font-black text-zinc-100 tracking-tighter uppercase">Profile Blur</span>
              <span className={`text-4xl font-black tracking-tighter ${profile.activeModeActive ? 'text-rose-500' : 'text-emerald-500'}`}>{profile.noiseLevel}%</span>
            </div>
            <Progress value={profile.noiseLevel} className={`h-4 bg-zinc-900 ${profile.activeModeActive && '[&>div]:bg-rose-500'}`} />
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-zinc-600">
              <span>Transparent</span>
              <span>Opaque</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`border-2 transition-all duration-500 ${profile.ghostModeActive ? 'border-emerald-500 bg-emerald-950/10' : 'border-zinc-800 bg-zinc-950'}`}>
        <CardContent className="p-6 flex flex-col h-full justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${profile.ghostModeActive ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500'}`}>
              <Ghost className="w-6 h-6" />
            </div>
            <Badge variant="outline" className={profile.ghostModeActive ? 'border-emerald-500 text-emerald-500' : 'border-zinc-800 text-zinc-500'}>
              {profile.ghostModeActive ? 'Active' : 'Idle'}
            </Badge>
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-zinc-100">Ghost Mode</h3>
            <p className="text-xs text-zinc-500 font-medium mb-4">
              {profile.ghostModeActive 
                ? `Simulating: ${profile.activePersona || 'Random Persona'}`
                : 'Background noise engine is currently offline.'}
            </p>
            <Button 
              onClick={toggleGhost}
              variant={profile.ghostModeActive ? "destructive" : "default"}
              className={`w-full font-bold uppercase tracking-widest text-xs ${!profile.ghostModeActive && 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950'}`}
            >
              {profile.ghostModeActive ? <><PowerOff className="w-4 h-4 mr-2" /> Stop Engine</> : <><Power className="w-4 h-4 mr-2" /> Start Engine</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {stats.map((stat, i) => (
        <Card key={i} className="border-2 border-zinc-800 bg-zinc-950">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-zinc-900 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{stat.label}</p>
              <p className="text-2xl font-black text-zinc-100">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
