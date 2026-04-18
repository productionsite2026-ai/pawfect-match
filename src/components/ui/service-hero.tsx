import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface TrustIndicator {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

interface StatBadge {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}

interface ServiceHeroProps {
  backgroundImage: string;
  badgeIcon: React.ComponentType<{ className?: string }>;
  badgeText: string;
  title: ReactNode;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  trustIndicators: TrustIndicator[];
  statBadge?: StatBadge;
  imageAlt: string;
}

export const ServiceHero = ({
  backgroundImage,
  badgeIcon: BadgeIcon,
  badgeText,
  title,
  description,
  ctaText,
  ctaLink,
  secondaryCtaText = "Voir les tarifs",
  secondaryCtaLink = "/tarifs",
  trustIndicators,
  statBadge,
  imageAlt,
}: ServiceHeroProps) => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        role="img"
        aria-label={imageAlt}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white py-16 md:py-0">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6"
          >
            <BadgeIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{badgeText}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight"
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto w-full sm:w-auto shadow-button"
                onClick={() => navigate(ctaLink)}
              >
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto bg-white/10 border-white/30 text-white hover:bg-white/20 w-full sm:w-auto backdrop-blur-sm"
                onClick={() => navigate(secondaryCtaLink)}
              >
                {secondaryCtaText}
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <div className="mt-8 md:mt-12 flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm">
            {trustIndicators.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5"
              >
                <item.icon className="h-4 w-4 text-primary" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Optional Stat Badge */}
          {statBadge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3"
            >
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <statBadge.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-xl">{statBadge.value}</p>
                <p className="text-xs opacity-70">{statBadge.label}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
