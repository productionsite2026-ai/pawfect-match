import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, Dog, Briefcase, CreditCard, Shield, 
  MessageSquare, MapPin, Clock, Search, ArrowRight,
  CheckCircle, AlertCircle, Phone, Mail
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

// FAQ Data organized by theme
const faqCategories = {
  Proprietaires: {
    title: "Propriétaires d'animaux",
    icon: Dog,
    description: "Tout savoir sur la réservation et les services",
    faqs: [
      {
        question: "Comment fonctionne DogWalking pour trouver un Accompagnateur Certifié ?",
        answer: "Consultez les Profils, Avis et Tarifs des Accompagnateurs Certifiés disponibles près de chez vous. Le paiement est sécurisé via paiement en attente et libéré uniquement à la fin de la prestation, après saisie par vos soins d'un code à usage unique. Choisissez le service souhaité, entrez votre adresse et sélectionnez un ou plusieurs Accompagnateurs Certifiés : votre demande est envoyée et reste en attente de leur confirmation. Vous pouvez également déposer une annonce libre en définissant votre budget ; vous recevrez des propositions de prestataires et pourrez choisir le profil le plus adapté."
      },
      {
        question: "Les Accompagnateurs sont-ils vraiment vérifiés ?",
        answer: "Absolument. Chaque Accompagnateur Certifié fournit une pièce d'identité valide (CNI) et un extrait de . Notre équipe vérifie manuellement chaque document. Seuls 35% des candidats sont acceptés après ce processus de sélection rigoureux pour garantir une sécurité totale."
      },
      {
        question: "Que se passe-t-il si je ne suis pas satisfait de la prestation ?",
        answer: "Grâce à notre système de paiement sécurisé, votre argent reste protégé jusqu'à la validation finale. Seul le Propriétaire détient le code à usage unique, qu'il communique à l'Accompagnateur Certifié à la fin du service pour débloquer le paiement. Si le prestataire n'envoie pas les preuves visuelles obligatoires (photo/vidéo) ou si la prestation ne correspond pas à vos attentes, vous pouvez contester. Notre équipe support intervient sous 48h pour résoudre le litige."
      },
      {
        question: "Puis-je annuler une réservation et être remboursé ?",
        answer: "Oui, l'annulation est gratuite jusqu'à 3h avant le début de la prestation prévue, avec remboursement intégral automatique sur votre compte."
      },
      {
        question: "Comment ajouter mon animal sur la plateforme ?",
        answer: "Depuis votre tableau de bord Propriétaire, cliquez sur 'Mes Animaux' puis 'Ajouter'. Remplissez les informations essentielles : nom, espèce, race, âge, tempérament et besoins spécifiques. Ajoutez une photo pour aider l'Accompagnateur Certifié à reconnaître votre compagnon."
      },
      {
        question: "Puis-je demander le même Accompagnateur Certifié à chaque fois ?",
        answer: "Oui, vous pouvez ajouter un Accompagnateur Certifié à vos favoris et le réserver directement depuis votre tableau de bord. Les Accompagnateurs réguliers connaissent mieux votre animal et ses habitudes, ce qui renforce la confiance."
      }
    ]
  },
  Accompagnateurs: {
    title: "Accompagnateurs Certifiés",
    icon: Briefcase,
    description: "Devenir Accompagnateur et gérer son activité",
    faqs: [
      {
        question: "Comment devenir Accompagnateur Certifié DogWalking ?",
        answer: "Inscrivez-vous via la page 'Devenir Accompagnateur', complétez votre profil et soumettez vos documents obligatoires (CNI, ). Notre équipe étudie manuellement chaque candidature sous 48h. Rappel : le taux d'acceptation est de 35% pour maintenir l'excellence du réseau."
      },
      {
        question: "Quels documents sont nécessaires pour s'inscrire ?",
        answer: "Vous devez fournir : une pièce d'identité valide (CNI ou passeport), un extrait de  de moins de 3 mois, et une photo de profil professionnelle."
      },
      {
        question: "Comment fixer mes tarifs ?",
        answer: "Vous êtes libre de fixer vos propres tarifs. Les prix affichés sur la plateforme sont indiqués 'À partir de' pour respecter votre liberté tarifaire selon votre expérience et votre zone géographique."
      },
      {
        question: "Comment suis-je payé ?",
        answer: "Le paiement est libéré dès que vous saisissez dans l'application le code unique fourni par le Propriétaire à la fin de la mission. L'envoi des preuves visuelles (photo/vidéo) pendant la mission est obligatoire pour valider la prestation."
      },
      {
        question: "Quels sont les frais de service ?",
        answer: "DogWalking prélève une commission de 15% sur chaque transaction. Les 85% restants vous sont intégralement reversés. Ces frais financent la plateforme, le support client et le système de paiement sécurisé."
      },
      {
        question: "L'abonnement PRO est-il obligatoire ?",
        answer: "Non, l'abonnement PRO (6-12€/mois) est optionnel. Il offre des avantages : mise en avant prioritaire, badges premium et statistiques avancées. Vous pouvez exercer sans abonnement avec le statut certifié de base."
      }
    ]
  },
  Paiement: {
    title: "Paiement & Paiement en Attente",
    icon: CreditCard,
    description: "Comprendre le système de paiement sécurisé",
    faqs: [
      {
        question: "Comment fonctionne le paiement sécurisé ?",
        answer: "Le montant de la prestation est prélevé lors de la réservation mais reste bloqué sur un compte tiers sécurisé (paiement en attente). Il n'est versé à l'Accompagnateur Certifié qu'une fois la mission terminée et validée par votre code unique."
      },
      {
        question: "Que comprennent les frais de service ?",
        answer: "Les frais de service incluent l'accès à la plateforme sécurisée, la vérification manuelle des profils, le support client disponible 7j/7, et la gestion du système de paiement sécurisé garantissant le paiement."
      },
      {
        question: "Puis-je donner un pourboire à l'Accompagnateur Certifié ?",
        answer: "Oui, vous pouvez verser un pourboire après chaque prestation réussie. Les pourboires sont 100% reversés à l'Accompagnateur Certifié sans commission."
      },
      {
        question: "Que se passe-t-il si la prestation n'est pas effectuée ?",
        answer: "Si aucune preuve visuelle n'est envoyée ou si la prestation n'a pas eu lieu, l'argent reste sous paiement en attente et vous êtes remboursé intégralement après vérification par notre support."
      }
    ]
  },
  Securite: {
    title: "Sécurité & Confiance",
    icon: Shield,
    description: "Nos garanties et processus de vérification",
    faqs: [
      {
        question: "Comment DogWalking vérifie-t-il les Accompagnateurs ?",
        answer: "Chaque candidat passe par un processus rigoureux : vérification d'identité, contrôle du , et validation du respect du protocole de sécurité DogWalking. Seuls 35% des profils reçoivent le label Certifié."
      },
      {
        question: "Les preuves visuelles sont-elles obligatoires ?",
        answer: "Oui, chaque Accompagnateur Certifié doit envoyer au minimum une preuve photo ou vidéo (départ et pendant la mission) via l'application. C'est une condition sine qua non pour la validation de la mission."
      },
      {
        question: "Comment signaler un problème ?",
        answer: "Contactez immédiatement notre support via la messagerie intégrée ou par email à contact@dogwalking.fr. Une ligne prioritaire est activée pour les Propriétaires et Accompagnateurs pendant les missions en cours."
      },
      {
        question: "Comment DogWalking protège-t-il mes données ?",
        answer: "Vos données sont stockées de manière sécurisée conformément au RGPD. Nous ne partageons jamais vos informations personnelles avec des tiers sans votre consentement explicite."
      }
    ]
  }
};

const quickLinks = [
  { title: "Trouver un Accompagnateur", href: "/walkers", icon: Search, variant: "default" as const },
  { title: "Devenir Accompagnateur", href: "/walker/register", icon: Briefcase, variant: "secondary" as const },
  { title: "Nos tarifs", href: "/tarifs", icon: CreditCard, variant: "outline" as const },
  { title: "Nous contacter", href: "/contact", icon: MessageSquare, variant: "outline" as const }
];

const Aide = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("Proprietaires");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && Object.keys(faqCategories).includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const filteredFaqs = Object.entries(faqCategories).flatMap(([catId, cat]) => 
    cat.faqs.filter(f => 
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(f => ({ ...f, category: cat.title, catId }))
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Centre d'Aide & FAQ | DogWalking France"
        description="Besoin d'aide ? Retrouvez toutes les réponses sur le fonctionnement de DogWalking, le paiement sécurisé et la certification des Accompagnateurs."
        canonical="https://dogwalking.fr/aide"
      />
      
      <Header />
      
      <main>
        {/* Hero Search Section */}
        <section className="bg-primary/5 py-16 md:py-24 border-b">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                Centre d'Aide
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Comment pouvons-nous vous aider ?</h1>
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher une réponse (ex: paiement en attente, code unique, prix...)"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-lg shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            {searchQuery ? (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  Résultats pour "{searchQuery}" ({filteredFaqs.length})
                </h2>
                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, i) => (
                      <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <Badge variant="outline" className="mb-2">{faq.category}</Badge>
                          <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg text-muted-foreground">Aucun résultat trouvé. Essayez d'autres mots-clés.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                  {quickLinks.map((link) => (
                    <Button
                      key={link.title}
                      variant={link.variant}
                      className="h-auto py-6 flex flex-col gap-3 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                      onClick={() => navigate(link.href)}
                    >
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <link.icon className="h-6 w-6" />
                      </div>
                      <span className="font-semibold text-xs whitespace-normal">{link.title}</span>
                    </Button>
                  ))}
                </div>

                {/* Tabs FAQ */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50 rounded-2xl">
                    {Object.entries(faqCategories).map(([id, cat]) => (
                      <TabsTrigger 
                        key={id} 
                        value={id}
                        className="py-4 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm flex flex-col gap-1"
                      >
                        <cat.icon className="h-5 w-5 mb-1" />
                        <span className="text-xs font-bold">{cat.title}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(faqCategories).map(([id, cat]) => (
                    <TabsContent key={id} value={id} className="space-y-6">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">{cat.title}</h2>
                        <p className="text-muted-foreground">{cat.description}</p>
                      </div>
                      <div className="grid gap-4">
                        {cat.faqs.map((faq, i) => (
                          <Card key={i} className="hover:shadow-md transition-shadow border-primary/5">
                            <CardContent className="p-6">
                              <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                                {faq.question}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed pl-8">
                                {faq.answer}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto bg-background rounded-3xl p-8 md:p-12 shadow-xl border border-primary/10">
              <h2 className="text-3xl font-bold mb-4">Toujours besoin d'aide ?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Notre équipe support est disponible 7j/7 pour répondre à toutes vos questions concernant vos Animaux ou vos missions d'Accompagnement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-xl gap-2 px-8" onClick={() => navigate('/contact')}>
                  <MessageSquare className="h-5 w-5" />
                  Nous contacter
                </Button>
                <Button size="lg" variant="outline" className="rounded-xl gap-2 px-8" asChild>
                  <a href="mailto:contact@dogwalking.fr">
                    <Mail className="h-5 w-5" />
                    Email Support
                  </a>
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Réponse sous 48h
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Support 7j/7
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Aide;
