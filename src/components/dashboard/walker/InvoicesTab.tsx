import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Download, Calendar, Euro, Clock, CheckCircle, 
  TrendingUp, Wallet, Receipt
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Invoice {
  id: string;
  date: string;
  ownerName: string;
  dogName: string;
  serviceType: string;
  duration: number;
  grossAmount: number;
  commission: number;
  netAmount: number;
  status: 'pending' | 'paid' | 'blocked';
}

const WalkerInvoicesTab = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [summary, setSummary] = useState({
    totalGross: 0,
    totalCommission: 0,
    totalNet: 0,
    thisMonthNet: 0,
    servicesCount: 0
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch completed bookings with earnings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*, dogs(name)')
      .eq('walker_id', session.user.id)
      .in('status', ['completed', 'confirmed', 'in_progress'])
      .order('scheduled_date', { ascending: false });

    if (bookings) {
      const commissionRate = 0.15; // 15% commission as per CDC
      
      const invoiceData: Invoice[] = bookings.map(b => {
        const gross = Number(b.price || 0);
        const comm = gross * commissionRate;
        const net = gross - comm;
        
        return {
          id: `FAC-${b.id.slice(0, 8).toUpperCase()}`,
          date: b.scheduled_date,
          ownerName: 'Propriétaire', 
          dogName: b.dogs?.name || 'Animal',
          serviceType: b.service_type,
          duration: b.duration_minutes || 60,
          grossAmount: gross,
          commission: comm,
          netAmount: net,
          status: b.status === 'completed' ? 'paid' : b.status === 'in_progress' ? 'pending' : 'pending'
        };
      });

      setInvoices(invoiceData);

      // Calculate summary
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthInvoices = invoiceData.filter(
        i => new Date(i.date) >= startOfMonth
      );
      
      setSummary({
        totalGross: invoiceData.reduce((s, i) => s + i.grossAmount, 0),
        totalCommission: invoiceData.reduce((s, i) => s + i.commission, 0),
        totalNet: invoiceData.reduce((s, i) => s + i.netAmount, 0),
        thisMonthNet: thisMonthInvoices.reduce((s, i) => s + i.netAmount, 0),
        servicesCount: invoiceData.length
      });
    }

    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      pending: { 
        label: 'En attente', 
        className: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: Clock
      },
      paid: { 
        label: 'Payé', 
        className: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle
      },
      blocked: { 
        label: 'Bloqué', 
        className: 'bg-red-100 text-red-700 border-red-200',
        icon: Clock
      }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.className} gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getServiceLabel = (type: string) => {
    const types: Record<string, string> = {
      promenade: 'Promenade',
      garde: 'Garde',
      visite: 'Visite',
      veterinaire: 'Vétérinaire'
    };
    return types[type] || type;
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filter === "all") return true;
    return invoice.status === filter;
  });

  const handleDownload = (invoice: Invoice) => {
    const content = `
FACTURE ${invoice.id}
========================
DogWalking France - Services d'Accompagnement

Date: ${new Date(invoice.date).toLocaleDateString('fr-FR')}
Service: ${getServiceLabel(invoice.serviceType)}
Animal: ${invoice.dogName}
Durée: ${invoice.duration} min

Montant brut: ${invoice.grossAmount.toFixed(2)} €
Commission (15%): -${invoice.commission.toFixed(2)} €
--------------------------
Net à percevoir: ${invoice.netAmount.toFixed(2)} €

Statut: ${invoice.status === 'paid' ? 'Payé' : 'En attente'}

www.dogwalking.fr
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <motion.div 
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Receipt className="h-6 w-6 text-primary" />
          Mes Factures
        </h2>
        <Button variant="outline" className="gap-2" disabled={invoices.length === 0}>
          <Download className="h-4 w-4" />
          Exporter tout
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="shadow-sm border border-stat-green/15">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Net ce mois</p>
              <TrendingUp className="h-5 w-5 text-stat-green" />
            </div>
            <p className="text-3xl font-bold text-stat-green">{summary.thisMonthNet.toFixed(0)}€</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total brut</p>
              <Euro className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{summary.totalGross.toFixed(0)}€</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Commission totale</p>
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-stat-yellow">{summary.totalCommission.toFixed(0)}€</p>
            <p className="text-xs text-muted-foreground">15% pour DogWalking</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Missions</p>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{summary.servicesCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">Toutes ({invoices.length})</TabsTrigger>
          <TabsTrigger value="paid">Payées ({invoices.filter(i => i.status === 'paid').length})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({invoices.filter(i => i.status === 'pending').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Invoices List */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-lg font-semibold mb-2">Aucune facture</p>
              <p className="text-muted-foreground">Vos factures apparaîtront ici après vos missions d'Accompagnement</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredInvoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{invoice.id}</p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getServiceLabel(invoice.serviceType)} • {invoice.dogName} • {new Date(invoice.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Brut: {invoice.grossAmount.toFixed(2)}€</p>
                      <p className="text-stat-yellow">-{invoice.commission.toFixed(2)}€</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-stat-green">+{invoice.netAmount.toFixed(2)}€</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(invoice)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Euro className="h-5 w-5 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-semibold mb-1">Comprendre vos factures</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Montant brut</strong> : Prix payé par le Propriétaire</li>
              <li>• <strong>Commission (15%)</strong> : Frais de service DogWalking</li>
              <li>• <strong>Net</strong> : Ce que vous percevez réellement après mission</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalkerInvoicesTab;
