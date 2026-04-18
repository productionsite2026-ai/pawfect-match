import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Plane, Briefcase, CloudRain, HeartPulse, Accessibility, 
  Baby, Clock3, Home, Sparkles, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const useCases = [
  {
    icon: Plane,
    title: "Vous partez en voyage",
    description: "Vacances, week-end ou déplacement : votre animal reste chez vous ou est promené chaque jour, sans stress de transport.",
    gradient: "from-primary to-accent",
    bgGradient: "from-primary/10 to-accent/10"
  },
  {
    icon: Briefcase,
    title: "Journée de travail chargée",
    description: "Réunions, déplacements pro, horaires à rallonge : un Accompagnateur passe sortir votre chien pendant que vous travaillez sereinement.",
    gradient: "from-accent to-primary",
    bgGradient: "from-accent/10 to-primary/10"
  },
  {
    icon: HeartPulse,
    title: "Maladie ou convalescence",
    description: "Grippe, opération, fatigue passagère : on s'occupe de votre animal le temps que vous récupériez tranquillement à la maison.",
    gradient: "from-primary/80 to-accent",
    bgGradient: "from-primary/10 to-accent/5"
  },
  {
    icon: Accessibility,
    title: "Personne âgée ou à mobilité réduite",
    description: "Garder son compagnon malgré les difficultés à le sortir : nos Accompagnateurs vous soulagent au quotidien, en douceur.",
    gradient: "from-accent to-accent/70",
    bgGradient: "from-accent/10 to-accent/5"
  },
  {
    icon: CloudRain,
    title: "Mauvaise météo ou fatigue",
    description: "Pluie, froid, journée épuisante… votre chien a quand même besoin de sortir. On prend le relais sans culpabilité.",
    gradient: "from-primary to-primary/70",
    bgGradient: "from-primary/10 to-primary/5"
  },
  {
    icon: Baby,
    title: "Arrivée d'un bébé",
    description: "Nouveau rythme familial, nuits courtes : votre animal continue à profiter de promenades régulières et d'attention.",
    gradient: "from-accent to-primary/80",
    bgGradient: "from-accent/10 to-primary/10"
  },
  {
    icon: Clock3,
    title: "Imprévu de dernière minute",
    description: "Rendez-vous médical, urgence familiale : trouvez un Accompagnateur disponible rapidement près de chez vous.",
    gradient: "from-primary to-accent/80",
    bgGradient: "from-primary/10 to-accent/10"
  },
  {
    icon: Home,
    title: "Garde à domicile pendant l'absence",
    description: "Votre animal reste dans son environnement habituel, avec ses repères, ses jouets et ses habitudes. Moins de stress, plus de confort.",
    gradient: "from-accent/80 to-primary",
    bgGradient: "from-accent/10 to-primary/5"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } }
};

export const UseCasesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Pensé pour votre quotidien
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Quand faire appel à{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DogWalking ?
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            La vie ne s'arrête jamais, mais votre animal a toujours besoin d'attention.
            Voici les situations du quotidien dans lesquelles nos Accompagnateurs Certifiés
            prennent le relais — pour vous soulager et pour son bien-être.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-12"
        >
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className="group relative h-full bg-card border border-border/50 shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${useCase.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                <CardContent className="relative p-5 md:p-6">
                  <motion.div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${useCase.gradient} mb-4 shadow-md`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <useCase.icon className="h-6 w-6 text-white" />
                  </motion.div>

                  <h3 className="text-base md:text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {useCase.description}
                  </p>
                </CardContent>

                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${useCase.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-muted-foreground text-sm md:text-base mb-4">
            Quelle que soit votre situation, on a une solution adaptée.
          </p>
          <Button
            size="lg"
            className="group"
            onClick={() => navigate('/walkers')}
          >
            Trouver un Accompagnateur près de chez moi
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
