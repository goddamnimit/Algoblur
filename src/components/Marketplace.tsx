import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';
import { AdCampaign, Ad } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ShoppingBag, Plus, CheckCircle2, TrendingUp, Users, ShieldCheck } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const data = await dbService.getCampaigns();
      setCampaigns(data);
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  const createDemoCampaign = async () => {
    if (!user) return;
    const newAd: Omit<Ad, 'id' | 'createdAt'> = {
      title: "Local Artisanal Coffee",
      description: "Direct trade beans roasted in small batches. No tracking, just caffeine.",
      category: "Sustainable Living",
      imageUrl: "https://picsum.photos/seed/coffee/800/600",
      targetUrl: "https://example.com",
      price: 25
    };

    const adId = await dbService.addAd(newAd as any);
    const campaign: AdCampaign = {
      businessId: user.uid,
      businessName: "EcoBrew Roasters",
      adId,
      budget: 5000, // $50.00
      impressionsRemaining: 1000,
      status: 'active'
    };

    await dbService.createCampaign(campaign);
    const updated = await dbService.getCampaigns();
    setCampaigns(updated);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-100">Clean Marketplace</h2>
          <p className="text-zinc-500 text-sm font-medium">Bypass RTB auctions. Direct-placement ads for ethical businesses.</p>
        </div>
        <Button onClick={createDemoCampaign} className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold uppercase tracking-widest text-xs">
          <Plus className="w-4 h-4 mr-2" /> Start Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-zinc-800 bg-zinc-950">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="text-lg font-bold uppercase text-zinc-100 mb-1">Fixed Pricing</h3>
            <p className="text-xs text-zinc-500">No bidding wars. Pay a flat fee per 1,000 impressions. Predictable and fair.</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-zinc-800 bg-zinc-950">
          <CardContent className="p-6">
            <Users className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="text-lg font-bold uppercase text-zinc-100 mb-1">Conscious Audience</h3>
            <p className="text-xs text-zinc-500">Reach users who value privacy and support independent, ethical brands.</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-zinc-800 bg-zinc-950">
          <CardContent className="p-6">
            <ShieldCheck className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="text-lg font-bold uppercase text-zinc-100 mb-1">Zero Leakage</h3>
            <p className="text-xs text-zinc-500">No third-party trackers. Your ad is served directly from our secure infrastructure.</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="bg-zinc-900" />

      <div className="space-y-4">
        <h3 className="text-xl font-black uppercase tracking-tight text-zinc-100 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" /> Active Campaigns
        </h3>
        
        {loading ? (
          <div className="p-12 text-center border-2 border-dashed border-zinc-900 rounded-xl">
            <p className="text-zinc-600 font-mono text-xs uppercase animate-pulse">Loading Marketplace...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-zinc-900 rounded-xl">
            <p className="text-zinc-600 font-mono text-xs uppercase">No active campaigns. Be the first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="border-2 border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-colors">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-zinc-100 uppercase tracking-tight">{campaign.businessName}</h4>
                      <Badge variant="outline" className="border-emerald-900 text-emerald-500 text-[10px]">Active</Badge>
                    </div>
                    <p className="text-xs text-zinc-500 font-mono">Campaign ID: {campaign.id?.slice(0, 8)}...</p>
                  </div>
                  
                  <div className="flex gap-8 items-center">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Budget</p>
                      <p className="text-lg font-black text-zinc-100 font-mono">${(campaign.budget / 100).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Remaining</p>
                      <p className="text-lg font-black text-emerald-500 font-mono">{campaign.impressionsRemaining}</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:bg-zinc-900">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
