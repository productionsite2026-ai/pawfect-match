import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gift, Copy, Share2, Check, Users, Loader2, CheckCircle, Clock } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Referral {
  id: string;
  referral_code: string;
  referred_id: string | null;
  status: string;
  reward_amount: number;
  created_at: string;
  completed_at: string | null;
  referred_profile?: { first_name: string | null; avatar_url: string | null } | null;
}

const ReferralTab = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, totalReward: 0 });

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch user's referral code or create one
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_id', session.user.id)
        .limit(1)
        .maybeSingle();

      if (existingReferral) {
        setReferralCode(existingReferral.referral_code);
      } else {
        // Create a new referral entry with auto-generated code
        const newCode = `DW${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const { data: newReferral, error } = await supabase
          .from('referrals')
          .insert({
            referrer_id: session.user.id,
            referral_code: newCode
          })
          .select('referral_code')
          .single();

        if (!error && newReferral) {
          setReferralCode(newReferral.referral_code);
        }
      }

      // Fetch all referrals made by this user
      const { data: allReferrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', session.user.id)
        .order('created_at', { ascending: false });

      if (allReferrals && allReferrals.length > 0) {
        // Enrich with referred user profiles
        const referredIds = allReferrals.filter(r => r.referred_id).map(r => r.referred_id);
        let profilesMap = new Map();
        
        if (referredIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, first_name, avatar_url')
            .in('id', referredIds);
          
          profiles?.forEach(p => profilesMap.set(p.id, p));
        }

        const enrichedReferrals = allReferrals.map(r => ({
          ...r,
          referred_profile: r.referred_id ? profilesMap.get(r.referred_id) : null
        }));

        setReferrals(enrichedReferrals);

        // Calculate stats
        const completed = enrichedReferrals.filter(r => r.status === 'completed');
        const pending = enrichedReferrals.filter(r => r.status === 'pending' && r.referred_id);
        setStats({
          total: enrichedReferrals.filter(r => r.referred_id).length,
          completed: completed.length,
          pending: pending.length,
          totalReward: completed.reduce((sum, r) => sum + Number(r.reward_amount || 10), 0)
        });
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copié !", description: `${label} copié dans le presse-papier` });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rejoignez DogWalking !',
          text: `Inscrivez-vous avec mon code ${referralCode} et recevez 10€ de crédit !`,
          url: referralLink
        });
      } catch (err) {
        handleCopy(referralLink, "Lien de parrainage");
      }
    } else {
      handleCopy(referralLink, "Lien de parrainage");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center shadow-xl">
          <Gift className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Programme de Parrainage</h2>
        <p className="text-muted-foreground">Gagnez 15€ pour vous, 10€ pour vos amis</p>
      </div>
      
      {/* Reward Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">15€</div>
            <p className="text-muted-foreground">Pour vous</p>
            <p className="text-xs text-muted-foreground mt-1">Par filleul inscrit</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-accent mb-2">10€</div>
            <p className="text-muted-foreground">Pour votre ami</p>
            <p className="text-xs text-muted-foreground mt-1">Crédit sur sa 1ère réservation</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Your Code Card */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Votre code de parrainage
          </CardTitle>
          <CardDescription>Partagez ce code avec vos proches</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              value={referralCode} 
              readOnly 
              className="font-mono text-xl text-center bg-muted/50 border-2 border-dashed" 
            />
            <Button 
              onClick={() => handleCopy(referralCode, "Code")} 
              size="icon"
              variant={copied ? "default" : "outline"}
              className="shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => handleCopy(referralLink, "Lien")} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Copier le lien
            </Button>
            <Button onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Invitations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-sm text-muted-foreground">Complétés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalReward}€</div>
              <p className="text-sm text-muted-foreground">Gagnés</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Vos parrainages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.filter(r => r.referred_id).length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="font-semibold text-lg mb-2">Aucun parrainage pour le moment</p>
              <p className="text-muted-foreground">Partagez votre code pour commencer à gagner !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.filter(r => r.referred_id).map(referral => (
                <div key={referral.id} className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{referral.referred_profile?.first_name || 'Utilisateur'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(referral.created_at || '').toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {referral.status === 'completed' ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        +{referral.reward_amount}€
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-200">
                        <Clock className="h-3 w-3 mr-1" />
                        En attente
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReferralTab;
