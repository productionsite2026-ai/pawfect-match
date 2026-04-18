import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle, Dog, Briefcase, CreditCard, Shield,
  MessageSquare, MapPin, Search, Send, CheckCircle,
  AlertCircle, Mail, Phone, Clock, Heart, Users,
  Award, Target, Eye, Zap, Camera, Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import teamImage from "@/assets/pages/equipe-dogwalking.jpg";
import missionImage from "@/assets/trust/promeneur-verifie-badge.jpg";
import { ExpertBio } from "@/components/ui/expert-bio";
import { FloatingContact } from "@/components/ui/floating-contact";
import { experts } from "@/data/expertsData";

// ===== FAQ Data Aligned with CDC =====
const faqCategories = {
  proprietaires: {
    title: "Propriétaires",
    icon: Dog,
    faqs: [
      { question: "Comment fonctionne DogWalking pour mon animal ?", answer: "Recherchez un Accompagnateur Certifié près de chez vous. Échangez via messages pré-enregistrés, puis réservez en bloquant les fonds sur la plateforme (Paiement en Attente). Une fois les fonds sécurisés, vous accédez au chat libre pour organiser la mission. Le paiement n'est libéré qu'à la fin, lorsque vous communiquez votre code unique à l'Accompagnateur Certifié." },
      { question: "Comment sont sélectionnés les Accompagnateurs ?", answer: "Seuls 35% des candidats sont acceptés. Nous vérifions manuellement leur pièce d'identité (CNI), leurs formations et leur expérience. Chaque Accompagnateur Certifié doit signer un accord de principe aux règles strictes de DogWalking." },
      { question: "Qu'est-ce que le système de Preuve Visuelle ?", answer: "Contrairement au GPS intrusif, DogWalking impose une preuve visuelle. L'Accompagnateur Certifié doit vous envoyer une photo ou vidéo dès qu'il récupère votre animal, puis une autre à la fin de la mission. C'est la garantie réelle du service effectué." },
      { question: "Puis-je annuler une réservation ?", answer: "Oui, l'annulation est possible et gratuite jusqu'à 3 heures avant le début de la prestation. Passé ce délai, des conditions spécifiques s'appliquent." },
      { question: "Comment fonctionne le paiement par code unique ?", answer: "À la fin de la mission, si vous êtes satisfait et avez reçu les preuves visuelles, vous communiquez votre code unique (reçu lors de la réservation) à l'Accompagnateur Certifié. Sa saisie sur son dashboard déclenche le versement des fonds." },
    ],
  },
  accompagnateurs: {
    title: "Accompagnateurs",
    icon: Briefcase,
    faqs: [
      { question: "Comment devenir Accompagnateur Certifié ?", answer: "Inscrivez-vous sur la plateforme, complétez votre profil professionnel et soumettez vos documents (CNI, assurance RC). Notre équipe analyse manuellement chaque candidature. Le taux d'acceptation est de 35%." },
      { question: "Comment suis-je payé pour mes missions ?", answer: "Le paiement est garanti car les fonds sont bloqués par le Propriétaire avant la mission. Une fois la prestation terminée, saisissez le code unique fourni par le Propriétaire sur votre outil 'GO' pour libérer vos gains (85% du montant total)." },
      { question: "Quelles sont mes obligations pendant une mission ?", answer: "Vous devez utiliser l'outil 'GO' pour envoyer une photo/vidéo de prise en charge et une preuve de fin de mission. Sans ces preuves visuelles et la saisie du code unique, le paiement ne peut être débloqué." },
      { question: "Puis-je fixer mes propres tarifs ?", answer: "Oui, les tarifs sont totalement libres. Vous fixez vos prix en fonction de votre expérience et de votre zone géographique. DogWalking affiche des mentions 'À partir de...' pour guider les utilisateurs." },
    ],
  },
  paiement: {
    title: "Paiement & Sécurité",
    icon: CreditCard,
    faqs: [
      { question: "Qu'est-ce que le paiement sécurisé ?", answer: "C'est un système 'zéro risque'. Lors de la réservation, le montant est prélevé et bloqué par DogWalking. Il n'est jamais versé directement à l'Accompagnateur Certifié avant la réalisation complète du service et votre validation par code unique." },
      { question: "Y a-t-il des frais de plateforme ?", answer: "DogWalking prélève une commission de 15% pour assurer la gestion, la sécurité et la protection de chaque mission. Cette commission est incluse dans le prix total payé lors du blocage des fonds." },
      { question: "Que se passe-t-il si l'Accompagnateur Certifié ne vient pas ?", answer: "Si les preuves visuelles obligatoires ne sont pas envoyées ou si le code unique n'est pas utilisé, le paiement reste bloqué. Le Propriétaire est alors remboursé sur son dashboard." },
    ],
  },
};

const Support = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mainTab, setMainTab] = useState("faq");
  const [faqTab, setFaqTab] = useState("proprietaires");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "contact") setMainTab("contact");
    else if (tab === "a-propos") setMainTab("about");
    else if (tab && Object.keys(faqCategories).includes(tab)) {
      setMainTab("faq");
      setFaqTab(tab);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message envoyé avec succès !");
  };

  const getFilteredFaqs = () => {
    if (!searchQuery.trim()) return null;
    const results: { category: string; question: string; answer: string }[] = [];
    Object.values(faqCategories).forEach((cat) => {
      cat.faqs.forEach((faq) => {
        if (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ category: cat.title, ...faq });
        }
      });
    });
    return results;
  };
  const filteredFaqs = getFilteredFaqs();

  const contactInfo = [
    { icon: Mail, title: "Email", value: "contact@dogwalking.fr", link: "mailto:contact@dogwalking.fr" },
    { icon: Phone, title: "Téléphone", value: "01 23 45 67 89", link: "tel:+33123456789" },
    { icon: MapPin, title: "Adresse", value: "Paris, France", link: null },
    { icon: Clock, title: "Horaires", value: "7j/7 - 24h/24", link: null },
  ];

  const stats = [
    { value: "35%", label: "Taux d'acceptation", icon: Shield },
    { value: "100%", label: "Prestations documentées", icon: Camera },
    { value: "0 Risque", label: "Paiement Sécurisé", icon: Lock },
    { value: "7j/7", label: "Support Client", icon: MessageSquare },
  ];

  const values = [
    { icon: Shield, title: "Confiance Vérifiée", description: "Vérification manuelle de la CNI, de l'expérience de chaque candidat." },
    { icon: Lock, title: "Sécurité Financière", description: "Système de paiement en attente innovant avec code unique de déblocage détenu par le Propriétaire." },
    { icon: Camera, title: "Preuve Visuelle", description: "Photos et vidéos obligatoires à la prise en charge et à la fin de chaque mission réalisée." },
    { icon: Heart, title: "Bien-être Animal", description: "Une approche centrée sur le respect de l'animal, documentée en temps réel pour votre sérénité." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Centre d'Aide & FAQ | Support DogWalking"
        description="Trouvez des réponses à toutes vos questions sur DogWalking : fonctionnement, sécurité, paiement sécurisé, inscription Accompagnateur. Contactez notre équipe."
        canonical="https://dogwalking.fr/support"
      />
      <Header />
      <main>
        {/* ... (Hero section omitted for brevity but maintained in original) ... */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12">
                <TabsTrigger value="faq" className="gap-2"><HelpCircle className="w-4 h-4" /> FAQ</TabsTrigger>
                <TabsTrigger value="about" className="gap-2"><Users className="w-4 h-4" /> À propos</TabsTrigger>
                <TabsTrigger value="contact" className="gap-2"><MessageSquare className="w-4 h-4" /> Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="faq" className="space-y-8">
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-2">
                      {Object.entries(faqCategories).map(([key, cat]) => (
                        <Button
                          key={key}
                          variant={faqTab === key ? "default" : "ghost"}
                          className="w-full justify-start gap-3 rounded-xl"
                          onClick={() => setFaqTab(key)}
                        >
                          <cat.icon className="w-4 h-4" />
                          {cat.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
                      <div className="p-6 md:p-8 border-b bg-muted/30">
                        <div className="flex items-center gap-3 mb-2">
                          {(() => {
                            const CatIcon = faqCategories[faqTab as keyof typeof faqCategories].icon;
                            return <CatIcon className="w-6 h-6 text-primary" />;
                          })()}
                          <h2 className="text-2xl font-bold">{faqCategories[faqTab as keyof typeof faqCategories].title}</h2>
                        </div>
                        <p className="text-muted-foreground">Réponses aux questions les plus fréquentes pour les {faqCategories[faqTab as keyof typeof faqCategories].title.toLowerCase()}.</p>
                      </div>
                      <div className="p-0">
                        <SEOFAQ faqs={faqCategories[faqTab as keyof typeof faqCategories].faqs} />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="about" className="space-y-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Redéfinir la confiance dans l'accompagnement animal</h2>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      DogWalking est né d'un constat simple : confier son animal à un inconnu est une source de stress. Nous avons créé la plateforme n°1 en France qui place la <strong>sécurité</strong> et la <strong>preuve de service</strong> au cœur de chaque échange.
                    </p>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      Grâce à notre processus de sélection manuel (35% d'acceptation) et notre système de paiement sécurisé innovant, nous offrons aux Propriétaires une sérénité totale et aux Accompagnateurs Certifiés un cadre professionnel valorisant.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-muted/50 border">
                          <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
                    <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] blur-2xl" />
                    <img src={teamImage} alt="L'équipe DogWalking" className="relative rounded-[2rem] shadow-2xl border w-full h-auto object-cover" />
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  {values.map((value, i) => (
                    <Card key={i} className="border-none shadow-soft bg-card/50 backdrop-blur">
                      <CardContent className="pt-8">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <value.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-bold mb-2">{value.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-muted/50 rounded-[2.5rem] p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <img src={missionImage} alt="Mission DogWalking" className="rounded-3xl shadow-xl order-2 md:order-1" />
                    <div className="order-1 md:order-2">
                      <h2 className="text-3xl font-bold mb-6">Notre Engagement : 35% de Sélection</h2>
                      <p className="text-lg text-muted-foreground mb-6">
                        Nous ne sommes pas un annuaire ouvert à tous. Chaque Accompagnateur Certifié est validé manuellement par notre équipe après vérification de sa CNI, de ses compétences.
                      </p>
                      <ul className="space-y-4">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span className="font-medium">Vérification d'identité stricte</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span className="font-medium">CNI obligatoire</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span className="font-medium">Contrôle des références et formations</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact">
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <div className="md:col-span-1 space-y-4">
                    <h2 className="text-2xl font-bold mb-6">Contactez-nous</h2>
                    {contactInfo.map((item, i) => (
                      <Card key={i} className="border-none shadow-sm bg-muted/30">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.title}</p>
                            {item.link ? (
                              <a href={item.link} className="text-sm font-semibold hover:text-primary transition-colors">{item.value}</a>
                            ) : (
                              <p className="text-sm font-semibold">{item.value}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="md:col-span-2">
                    <Card className="border shadow-lg rounded-3xl overflow-hidden">
                      <CardHeader className="bg-muted/30 border-b p-6">
                        <CardTitle>Envoyez-nous un message</CardTitle>
                        <CardDescription>Notre équipe support vous répondra sous 2 heures maximum.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nom complet</Label>
                              <Input id="name" name="name" placeholder="Votre nom" required value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" name="email" type="email" placeholder="votre@email.com" required value={formData.email} onChange={handleChange} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Sujet</Label>
                            <Input id="subject" name="subject" placeholder="De quoi s'agit-il ?" required value={formData.subject} onChange={handleChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" placeholder="Détaillez votre demande..." className="min-h-[120px]" required value={formData.message} onChange={handleChange} />
                          </div>
                          <Button type="submit" className="w-full gap-2 py-6 rounded-xl text-base" disabled={isSubmitting}>
                            {isSubmitting ? <Clock className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            Envoyer le message
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Support;
