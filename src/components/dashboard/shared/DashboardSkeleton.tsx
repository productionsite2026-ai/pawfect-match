import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface DashboardSkeletonProps {
  variant?: 'owner' | 'walker';
}

const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ variant = 'owner' }) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto px-4 pt-4 max-w-lg space-y-5">
        {/* Header skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-4 bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        </motion.div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Skeleton className="h-28 rounded-2xl" />
            </motion.div>
          ))}
        </div>

        {/* CTA button skeleton */}
        <Skeleton className="h-14 w-full rounded-xl" />

        {/* Quick actions skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Skeleton className="h-20 rounded-2xl" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Card skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Skeleton className="h-48 rounded-2xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Skeleton className="h-36 rounded-2xl" />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardSkeleton;