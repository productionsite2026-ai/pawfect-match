import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Euro, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Info, Loader2, Calendar, CheckCircle, Clock } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { EarningsChart } from "@/components/dashboard/EarningsChart";

interface Earning {
  id: string;
  booking_id: string | null;
  amount: number;
  commission: number;
  net_amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
}

const WalkerEarningsTab = () => {
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState({
    available: 0,
    pending: 0,
    total: 0,
    thisMonth: 0,
    lastMonth: 0
  });
  const [transactions, setTransactions] = useState<Earning[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch from walker_earnings table
      const { data: earningsData, error } = await supabase
        .from('walker_earnings')
        .select('*')
        .eq('walker_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching earnings:', error);
        // Fallback to calculating from bookings
        await fetchFromBookings(session.user.id);
        return;
      }

      if (earningsData && earningsData.length > 0) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const paid = earningsData.filter(e => e.status === 'paid');
        const pending = earningsData.filter(e => e.status === 'pending');

        const thisMonthEarnings = earningsData
          .filter(e => new Date(e.created_at) >= startOfMonth)
          .reduce((sum, e) => sum + Number(e.net_amount), 0);

        const lastMonthEarnings = earningsData
          .filter(e => {
            const date = new Date(e.created_at);
            return date >= startOfLastMonth && date < startOfMonth;
          })
          .reduce((sum, e) => sum + Number(e.net_amount), 0);

        setEarnings({
          available: paid.reduce((sum, e) => sum + Number(e.net_amount), 0),
          pending: pending.reduce((sum, e) => sum + Number(e.net_amount), 0),
          total: earningsData.reduce((sum, e) => sum + Number(e.net_amount), 0),
          thisMonth: thisMonthEarnings,
          lastMonth: lastMonthEarnings
        });

        setTransactions(earningsData.slice(0, 10));

        // Build chart data for last 6 months
        const chartMonths = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
          const monthData = earningsData.filter(e => {
            const eDate = new Date(e.created_at);
            return eDate >= date && eDate <= monthEnd;
          });
          chartMonths.push({
            month: date.toLocaleDateString('fr-FR', { month: 'short' }),
            earnings: monthData.reduce((sum, e) => sum + Number(e.net_amount), 0),
            walks: monthData.length
          });
        }
        setChartData(chartMonths);
      } else {
        // No earnings in table, try to calculate from bookings
        await fetchFromBookings(session.user.id);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFromBookings = async (userId: string) => {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('walker_id', userId)
      .order('scheduled_date', { ascending: false });

    if (!bookings) return;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const completed = bookings.filter(b => b.status === 'completed');
    const pending = bookings.filter(b => b.status === 'confirmed');

    const commission = 0.15; // 15% commission DogWalking

    const thisMonth = completed
      .filter(b => new Date(b.scheduled_date) >= startOfMonth)
      .reduce((s, b) => s + Number(b.price || 0) * (1 - commission), 0);

    const lastMonth = completed
      .filter(b => {
        const date = new Date(b.scheduled_date);
        return date >= startOfLastMonth && date < startOfMonth;
      })
      .reduce((s, b) => s + Number(b.price || 0) * (1 - commission), 0);

    const total = completed.reduce((s, b) => s + Number(b.price || 0) * (1 - commission), 0);
    const pendingAmount = pending.reduce((s, b) => s + Number(b.price || 0) * (1 - commission), 0);

    setEarnings({
      available: total,
      pending: pendingAmount,
      total,
      thisMonth,
      lastMonth
    });

    setTransactions(completed.slice(0, 10).map(b => ({
      id: b.id,
      booking_id: b.id,
      amount: Number(b.price || 0),
      commission: Number(b.price || 0) * commission,
      net_amount: Number(b.price || 0) * (1 - commission),
      status: 'paid',
      created_at: b.scheduled_date,
      paid_at: b.scheduled_date
    })));

    // Build chart data
    const chartMonths = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthData = completed.filter(b => {
        const bDate = new Date(b.scheduled_date);
        return bDate >= date && bDate <= monthEnd;
      });
      chartMonths.push({
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        earnings: monthData.reduce((s, b) => s + Number(b.price || 0) * (1 - commission), 0),
        walks: monthData.length
      });
    }
    setChartData(chartMonths);
  };

  const percentChange = earnings.lastMonth > 0 
    ? ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth * 100).toFixed(0) 
    : earnings.thisMonth > 0 ? 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Euro className="h-6 w-6 text-green-600" />
          Mes Gains
        </h2>
        <Button className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
          <Wallet className="h-4 w-4" />
          Demander un retrait
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 border-green-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Disponible</p>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-600">{earnings.available.toFixed(0)}€</p>
            <p className="text-sm text-muted-foreground mt-1">Prêt à retirer</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">En attente</p>
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-4xl font-bold text-amber-600">{earnings.pending.toFixed(0)}€</p>
            <p className="text-sm text-muted-foreground mt-1">Libéré après 48h</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total gagné</p>
              <Euro className="h-5 w-5 text-primary" />
            </div>
            <p className="text-4xl font-bold">{earnings.total.toFixed(0)}€</p>
            <p className="text-sm text-muted-foreground mt-1">Depuis le début</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison */}
      <Card className="mb-8 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Évolution mensuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Ce mois</p>
              <p className="text-3xl font-bold">{earnings.thisMonth.toFixed(0)}€</p>
            </div>
            <Badge className={`text-sm ${Number(percentChange) >= 0 ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
              {Number(percentChange) >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {percentChange}%
            </Badge>
            <div className="text-sm text-muted-foreground">
              vs mois dernier ({earnings.lastMonth.toFixed(0)}€)
            </div>
          </div>
          {chartData.length > 0 && (
            <EarningsChart 
              data={chartData} 
              serviceBreakdown={[]} 
              totalEarnings={earnings.thisMonth} 
              previousPeriodEarnings={earnings.lastMonth} 
              period="month" 
            />
          )}
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Historique des transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Euro className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-lg font-semibold mb-2">Aucune transaction</p>
              <p className="text-muted-foreground">Vos gains apparaîtront ici après vos premières missions</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors border">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      t.status === 'paid' ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      {t.status === 'paid' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Promenade</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+{t.net_amount.toFixed(2)}€</p>
                    {t.commission > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Commission: {t.commission.toFixed(2)}€
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg mb-1">Comment ça fonctionne ?</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Les paiements sont libérés <strong>48h après</strong> la fin de la mission</li>
              <li>• La commission DogWalking est de <strong>13%</strong></li>
              <li>• Les retraits sont traités sous <strong>2-3 jours ouvrés</strong></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalkerEarningsTab;
