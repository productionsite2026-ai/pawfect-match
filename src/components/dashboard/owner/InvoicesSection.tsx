import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, CheckCircle, Clock, Receipt } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Invoice {
  id: string;
  booking_id: string;
  amount: number;
  service_type: string;
  scheduled_date: string;
  status: string;
  walker_name?: string;
  dog_name?: string;
}

const InvoicesSection = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, price, service_type, scheduled_date, status, dogs(name)')
        .eq('owner_id', session.user.id)
        .in('status', ['completed', 'confirmed'])
        .order('scheduled_date', { ascending: false });

      if (bookings) {
        const invoiceData: Invoice[] = bookings.map((b: any) => ({
          id: `INV-${b.id.slice(0, 8).toUpperCase()}`,
          booking_id: b.id,
          amount: Number(b.price || 0),
          service_type: b.service_type,
          scheduled_date: b.scheduled_date,
          status: b.status === 'completed' ? 'paid' : 'pending',
          dog_name: b.dogs?.name
        }));
        setInvoices(invoiceData);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceLabel = (type: string) => {
    const labels: Record<string, string> = {
      promenade: "Promenade",
      garde: "Garde",
      visite: "Visite",
      veterinaire: "Vétérinaire"
    };
    return labels[type] || type;
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'all') return true;
    return inv.status === filter;
  });

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);

  const handleDownload = (invoice: Invoice) => {
    // Generate simple invoice text content
    const content = `
FACTURE ${invoice.id}
========================
DogWalking France - Services d'Accompagnement

Date: ${new Date(invoice.scheduled_date).toLocaleDateString('fr-FR')}
Service: ${getServiceLabel(invoice.service_type)}
Animal: ${invoice.dog_name || 'Non spécifié'}

Montant: ${invoice.amount.toFixed(2)} €
Statut: ${invoice.status === 'paid' ? 'Payée' : 'En attente'}

Merci pour votre confiance !
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Receipt className="h-6 w-6 text-primary" />
          Mes Factures
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total payé</p>
                <p className="text-3xl font-bold text-green-600">{totalPaid.toFixed(0)}€</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-3xl font-bold text-amber-600">{totalPending.toFixed(0)}€</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Factures</p>
                <p className="text-3xl font-bold">{invoices.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">Toutes ({invoices.length})</TabsTrigger>
          <TabsTrigger value="paid">Payées ({invoices.filter(i => i.status === 'paid').length})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({invoices.filter(i => i.status === 'pending').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium mb-2">Aucune facture</p>
            <p className="text-muted-foreground">
              Vos factures apparaîtront ici après vos réservations d'Accompagnement
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        {invoice.status === 'paid' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{invoice.id}</p>
                          <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                            {invoice.status === 'paid' ? 'Payée' : 'En attente'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getServiceLabel(invoice.service_type)} • {invoice.dog_name} • {new Date(invoice.scheduled_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-lg">{invoice.amount.toFixed(2)}€</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(invoice)}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Télécharger</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default InvoicesSection;
