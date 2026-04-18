import { motion } from "framer-motion";
import { Heart, Users, MapPin, Shield, Clock, Sparkles, Lock, Camera } from "lucide-react";

// Import images for visual appeal
import servicePromenade from "@/assets/service-promenade.jpg";
import serviceGarde from "@/assets/service-garde.jpg";
import serviceVisite from "@/assets/service-visite.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5 }
  }
};

export const WhySection = () => {
  const reasons = [
    {
      icon: Users,
      title: "Sélection Élite",
      description: "Seulement 35% des candidats sont retenus après vérification manuelle de leur CNI",
      gradient: "from-primary to-accent",
      bgGradient: "from-primary/10 to-accent/10"
    },
    {
      icon: Lock,
      title: "Paiement en Attente",
      description: "Vos fonds sont bloqués jusqu'à la communication du code de fin de service. Zéro risque financier.",
      gradient: "from-primary to-primary/70",
      bgGradient: "from-primary/10 to-primary/5"
    },
    {
      icon: Camera,
      title: "Preuves Visuelles",
      description: "Les Accompagnateurs envoyant photos/vidéos bénéficient d'un meilleur positionnement. Transparence récompensée.",
      gradient: "from-accent to-primary",
      bgGradient: "from-accent/10 to-primary/10"
    },
    {
      icon: Shield,
      title: "Code Unique",
      description: "C'est vous qui libérez le paiement en communiquant votre code unique à l'Accompagnateur Certifié.",
      gradient: "from-primary/80 to-accent",
      bgGradient: "from-primary/10 to-accent/5"
    },
    {
      icon: Clock,
      title: "Flexibilité",
      description: "Réservez selon vos horaires, annulez gratuitement jusqu'à 3h avant la mission.",
      gradient: "from-accent to-accent/70",
      bgGradient: "from-accent/10 to-accent/5"
    }
  ];

  return (
    <section id="pourquoi" className="py-16 md:py-24 px-4 bg-gradient-to-b from-muted/50 via-background to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/10 text-primary px-5 py-2 rounded-full text-sm font-semibold mb-4 border border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            La Confiance Vérifiée
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Pourquoi choisir DogWalking pour{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              votre animal ?
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Nous ne sommes pas un simple site de mise en relation. Nous sommes le garant de la sécurité et du bien-être de votre compagnon grâce à un protocole strict.
          </p>
        </motion.div>

        {/* Visual showcase with images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-3 md:gap-6 mb-12 md:mb-16 max-w-4xl mx-auto"
        >
          {[servicePromenade, serviceGarde, serviceVisite].map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl group"
            >
              <img 
                src={img} 
                alt={`Service ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5"
        >
          {reasons.map((reason, index) => (
            <motion.div 
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.2 } 
              }}
              className="group relative bg-card rounded-2xl p-6 shadow-lg border border-border/50 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${reason.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${reason.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              
              <div className="relative">
                <motion.div 
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${reason.gradient} mb-5 shadow-lg`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <reason.icon className="h-7 w-7 text-white" />
                </motion.div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {reason.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
              
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${reason.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
