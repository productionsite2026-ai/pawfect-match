import { Euro, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Wallet, ChevronRight, ShieldCheck, Lock, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useEarnings } from "@/hooks/useEarnings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mockEarnings } from "@/data/demoData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EarningsTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: realEarnings } = useEarnings();
  const isDemo = !user;
  const earnings = isDemo ? mockEarnings : (realEarnings || { today: 0, week: 0, month: 0, trend: 0 });
  const [period, setPeriod] = useState<"week" | "month" | "all">("month");

  const { data: transactions = [] } = useQuery({
    queryKey: ["walker-earnings-list", user?.id, period],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("walker_earnings")
        .select("*, booking:booking_id(dogs(name), scheduled_date)")
        .eq("walker_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return (data || []).map((t: any) => ({
        id: t.id,
        dogName: t.booking?.dogs?.name || "Mission",
        date: t.booking?.scheduled_date || new Date(t.created_at).toLocaleDateString("fr-FR"),
        amount: t.net_amount,
        commission: t.commission,
        type: t.net_amount >= 0 ? "credit" : "debit",
        status: t.status,
      }));
    },
    enabled: !!user,
  });

  const demoTransactions = [
    { id: "1", dogName: "Max", date: "28 mars", amount: 18, commission: 2.7, type: "credit", status: "paid" },
    { id: "2", dogName: "Bella", date: "27 mars", amount: 15, commission: 2.3, type: "credit", status: "paid" },
    { id: "3", dogName: "Rex", date: "26 mars", amount: 22, commission: 3.3, type: "credit", status: "paid" },
    { id: "4", dogName: "Luna", date: "25 mars", amount: 20, commission: 3.0, type: "credit", status: "pending" },
    { id: "5", dogName: "Charlie", date: "24 mars", amount: 25, commission: 3.8, type: "credit", status: "paid" },
    { id: "6", dogName: "Nala", date: "23 mars", amount: 18, commission: 2.7, type: "credit", status: "paid" },
  ];

  const displayTransactions = isDemo ? demoTransactions : (transactions.length > 0 ? transactions : demoTransactions);

  const totalPaid = displayTransactions.filter(t => t.status === "paid" && t.type === "credit").reduce((a, t) => a + t.amount, 0);
  const totalPending = displayTransactions.filter(t => t.status === "pending").reduce((a, t) => a + t.amount, 0);

  const stats = [
    { label: "Aujourd'hui", value: earnings.today, emoji: "💰" },
    { label: "Semaine", value: earnings.week, emoji: "📊" },
    { label: "Mois", value: earnings.month, emoji: "📈" },
  ];

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Euro className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-black text-foreground">Mes Gains</h2>
        </div>
        <button onClick={() => navigate("/walker/dashboard?tab=factures")}
          className="text-xs font-bold text-primary flex items-center gap-1">
          Factures <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Hero Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-primary rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <p className="text-xs font-semibold opacity-80">Revenu net ce mois</p>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-3xl font-black">{earnings.month}€</span>
          {earnings.trend > 0 && (
            <span className="flex items-center gap-0.5 text-xs font-bold opacity-90 mb-1">
              <TrendingUp className="w-3 h-3" /> +{earnings.trend}%
            </span>
          )}
        </div>
        <div className="flex gap-4 mt-3 text-[10px] font-semibold">
          <span>💰 Libéré: {totalPaid.toFixed(0)}€</span>
          <span>⏳ En attente code: {totalPending.toFixed(0)}€</span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-2xl shadow-card p-3 flex flex-col items-center gap-1">
            <span className="text-lg">{s.emoji}</span>
            <span className="text-lg font-black text-foreground">{s.value}€</span>
            <span className="text-[9px] text-muted-foreground font-semibold">{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Security info - CDC Aligned */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-foreground">Système de Paiement Sécurisé</p>
          <p className="text-[10px] text-muted-foreground">Vos revenus sont garantis et libérés dès la saisie du code unique du client.</p>
        </div>
      </motion.div>

      {/* Payment info - CDC Aligned */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-foreground">85% Reversés</p>
          <p className="text-[10px] text-muted-foreground">Commission de 15% incluse pour la sécurité et le support 7j/7.</p>
        </div>
      </motion.div>

      {/* Period filter */}
      <div className="flex gap-2">
        {(["week", "month", "all"] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              period === p ? "gradient-primary text-white shadow-card" : "bg-muted text-muted-foreground"
            }`}>
            {p === "week" ? "Semaine" : p === "month" ? "Mois" : "Tout"}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground text-sm">Dernières transactions</h3>
        {displayTransactions.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card rounded-xl shadow-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === "credit" ? "bg-primary/10" : "bg-destructive/10"}`}>
                {t.type === "credit" ? <ArrowUpRight className="w-4 h-4 text-primary" /> : <ArrowDownRight className="w-4 h-4 text-destructive" />}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">🐕 {t.dogName}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-muted-foreground">{t.date}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-bold text-sm ${t.type === "credit" ? "text-primary" : "text-destructive"}`}>
                +{t.amount}€
              </span>
              {t.status === "pending" && (
                <p className="text-[8px] text-amber-500 font-bold flex items-center justify-end gap-1">
                  <Clock className="w-2 h-2" /> Attente code
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EarningsTab;
