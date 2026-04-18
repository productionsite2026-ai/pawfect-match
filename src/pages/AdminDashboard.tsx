import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { SEOHead } from "@/components/seo/SEOHead";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, Dog, Calendar, Euro, Shield, Scale, AlertTriangle,
  BarChart3, Activity, CheckCircle, XCircle, Clock, FileCheck, FileX, Eye, Lock, Camera, Search
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalWalkers: 0,
    activeWalkers: 0,
    pendingWalkers: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    revenue: 0,
    commission: 0,
    averageBookingValue: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();

    if (!roles) {
      toast.error("Accès réservé aux administrateurs");
      navigate('/dashboard');
      return;
    }

    fetchAdminStats();
  };

  const fetchAdminStats = async () => {
    try {
      // Fetch Profiles
      const { data: profilesData } = await supabase.from('profiles').select('user_type');
      const owners = profilesData?.filter(p => p.user_type === 'owner').length || 0;
      const walkers = profilesData?.filter(p => p.user_type === 'walker').length || 0;

      // Fetch Walker Profiles
      const { data: walkerProfiles } = await supabase.from('walker_profiles').select('verified');
      const activeWalkers = walkerProfiles?.filter(w => w.verified).length || 0;
      const pendingWalkers = walkerProfiles?.filter(w => !w.verified).length || 0;

      // Bookings stats
      const { data: bookingsData } = await supabase.from('bookings').select('status, price, created_at');
      const completed = bookingsData?.filter(b => b.status === 'completed') || [];
      const revenue = completed.reduce((sum, b) => sum + Number(b.price || 0), 0);
      const commission = revenue * 0.15; // Updated to 15% as per CDC

      // Recent bookings
      const { data: recentBookingsData } = await supabase
        .from('bookings')
        .select('*, dogs(name)')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentBookings(recentBookingsData || []);

      // Recent users
      const { data: recentUsersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentUsers(recentUsersData || []);

      // Pending Documents
      const { data: docsData } = await supabase
        .from('walker_documents')
        .select('*')
        .eq('verification_status', 'pending')
        .order('submitted_at', { ascending: false });
      
      if (docsData && docsData.length > 0) {
        const walkerIds = [...new Set(docsData.map(d => d.walker_id))];
        const { data: docProfiles } = await supabase.from('profiles').select('id, first_name, last_name, email').in('id', walkerIds);
        const profileMap = new Map(docProfiles?.map(p => [p.id, p]) || []);
        setPendingDocuments(docsData.map(d => ({ ...d, profile: profileMap.get(d.walker_id) || null })));
      } else {
        setPendingDocuments([]);
      }

      setStats({
        totalUsers: profilesData?.length || 0,
        totalOwners: owners,
        totalWalkers: walkers,
        activeWalkers,
        pendingWalkers,
        totalBookings: bookingsData?.length || 0,
        completedBookings: completed.length,
        pendingBookings: bookingsData?.filter(b => b.status === 'pending').length || 0,
        cancelledBookings: bookingsData?.filter(b => b.status === 'cancelled').length || 0,
        revenue,
        commission,
        averageBookingValue: completed.length > 0 ? revenue / completed.length : 0
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (docId: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { error } = await supabase.from('walker_documents').update({
        verification_status: status,
        verified_by: session.user.id,
        verified_at: new Date().toISOString(),
        rejection_reason: status === 'rejected' ? (reason || 'Document non conforme') : null,
      }).eq('id', docId);
      if (error) throw error;
      
      const doc = pendingDocuments.find((d: any) => d.id === docId);
      if (doc) {
        await supabase.from('notifications').insert({
          user_id: doc.walker_id,
          title: status === 'approved' ? '✅ Document validé' : '❌ Document refusé',
          message: status === 'approved'
            ? `Votre ${doc.document_type} a été vérifié et approuvé.`
            : `Votre ${doc.document_type} a été refusé : ${reason || 'Non conforme'}. Veuillez le renvoyer.`,
          type: 'verification',
          link: '/walker/dashboard?tab=profil',
        });
      }
      toast.success(status === 'approved' ? 'Document approuvé' : 'Document refusé');
      fetchAdminStats();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SEOHead title="Administration | DogWalking" description="Tableau de bord administrateur DogWalking." canonical="https://dogwalking.fr/admin" noindex={true} />
      <Header />
      <main className="container mx-auto px-4 py-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Espace Admin</h1>
            <p className="text-muted-foreground font-medium">Gestion de la plateforme DogWalking</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-background text-sm px-4 py-2 font-bold border-2">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              Accès Administrateur
            </Badge>
            <Button variant="outline" size="icon" onClick={() => fetchAdminStats()}>
              <Activity className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Chiffre d'Affaires", value: `${stats.revenue.toFixed(0)}€`, icon: Euro, color: "text-primary", bg: "bg-primary/10" },
            { label: "Commission (15%)", value: `${stats.commission.toFixed(0)}€`, icon: BarChart3, color: "text-accent", bg: "bg-accent/10" },
            { label: "Accompagnateurs", value: stats.totalWalkers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Missions Terminées", value: stats.completedBookings, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
          ].map((s, i) => (
            <Card key={i} className="border-2">
              <CardContent className="p-6">
                <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-black text-foreground">{s.value}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border-2 p-1 h-auto rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-1">
            <TabsTrigger value="overview" className="rounded-xl font-bold py-2.5">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="verification" className="rounded-xl font-bold py-2.5 relative">
              Vérifications
              {pendingDocuments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center">
                  {pendingDocuments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="missions" className="rounded-xl font-bold py-2.5">Missions</TabsTrigger>
            <TabsTrigger value="users" className="rounded-xl font-bold py-2.5">Utilisateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Process Card */}
              <Card className="lg:col-span-2 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Flux de Sélection (Cible 35%)
                  </CardTitle>
                  <CardDescription>Suivi du taux d'acceptation des Accompagnateurs Certifiés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border">
                      <div>
                        <p className="text-sm font-bold text-muted-foreground">Taux d'acceptation actuel</p>
                        <p className="text-3xl font-black text-primary">
                          {stats.totalWalkers > 0 ? ((stats.activeWalkers / stats.totalWalkers) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-muted-foreground">Objectif CDC</p>
                        <p className="text-3xl font-black text-muted-foreground">35.0%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border-2 rounded-2xl">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">En attente (CNI)</p>
                        <p className="text-xl font-black">{stats.pendingWalkers}</p>
                      </div>
                      <div className="p-4 border-2 rounded-2xl">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Accompagnateurs Certifiés</p>
                        <p className="text-xl font-black text-green-600">{stats.activeWalkers}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Sécurité & Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-xs font-bold text-amber-700">Litiges en cours</p>
                      <p className="text-sm font-medium">0 dossier à traiter</p>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-blue-700">Support Client</p>
                      <p className="text-sm font-medium">Réponse sous 48h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Documents en attente de validation</CardTitle>
                <CardDescription>Vérification manuelle des CNI</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingDocuments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">Aucun document en attente</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingDocuments.map((doc) => (
                      <div key={doc.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border-2 rounded-2xl gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2">
                            <AvatarFallback className="bg-primary/10 font-bold">{doc.profile?.first_name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-foreground">{doc.profile?.first_name} {doc.profile?.last_name}</p>
                            <p className="text-xs text-muted-foreground font-medium">{doc.profile?.email}</p>
                            <Badge variant="secondary" className="mt-1 font-bold text-[10px] uppercase">{doc.document_type}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="font-bold" asChild>
                            <a href={`${supabase.storage.from('walker-documents').getPublicUrl(doc.file_path).data.publicUrl}`} target="_blank" rel="noreferrer">
                              <Eye className="h-4 w-4 mr-2" /> Voir
                            </a>
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 font-bold" onClick={() => handleVerifyDocument(doc.id, 'approved')}>
                            <FileCheck className="h-4 w-4 mr-2" /> Valider
                          </Button>
                          <Button size="sm" variant="destructive" className="font-bold" onClick={() => handleVerifyDocument(doc.id, 'rejected')}>
                            <FileX className="h-4 w-4 mr-2" /> Refuser
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

const MessageCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
);

export default AdminDashboard;
