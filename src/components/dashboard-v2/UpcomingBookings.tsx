import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Booking {
  id: string;
  dogName: string;
  date: string;
  time: string;
  duration: string;
  status: "confirmée" | "en_attente";
}

const UpcomingBookings = ({ bookings }: { bookings: Booking[] }) => {
  if (bookings.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="font-bold text-foreground px-1">📅 Prochaines missions confirmées</h3>
      {bookings.map((b, i) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-card rounded-2xl shadow-card p-3.5 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-card">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">🐕 {b.dogName}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  b.status === "confirmée"
                    ? "bg-primary/12 text-primary"
                    : "bg-amber-500/12 text-amber-600"
                }`}
              >
                {b.status === "confirmée" ? "✓ Confirmée" : "⏳ En attente"}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{b.date} · {b.time}</span>
              <span className="text-[10px]">({b.duration})</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UpcomingBookings;
