import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message envoyé avec succès !");
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@dogwalking.fr",
      link: "mailto:contact@dogwalking.fr"
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "01 23 45 67 89",
      link: "tel:+33123456789"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "Paris, France",
      link: null
    },
    {
      icon: Clock,
      title: "Horaires",
      value: "Lun-Ven: 9h-18h",
      link: null
    }
  ];

  const faqItems = [
    {
      question: "Comment trouver un Accompagnateur près de chez moi ?",
      answer: "Utilisez notre page 'Trouver un Accompagnateur' en indiquant votre localisation. Nous vous proposerons les Accompagnateurs vérifiés disponibles dans votre zone."
    },
    {
      question: "Comment devenir Accompagnateur DogWalking ?",
      answer: "Inscrivez-vous via 'Devenir Accompagnateur', complétez votre profil et soumettez vos documents pour vérification. Une fois validé, vous pourrez recevoir des demandes."
    },
    {
      question: "Le paiement est-il sécurisé ?",
      answer: "Oui, nous utilisons un système de paiement sécurisé. Votre paiement est bloqué et libéré à l'Accompagnateur uniquement après validation de la promenade avec preuves photo."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact | DogWalking - Nous Contacter"
        description="Contactez l'équipe DogWalking pour toute question sur nos services de promenade de chiens. Réponse sous 48 h garantie."
        canonical="https://dogwalking.fr/contact"
      />
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Réponse sous 48 h</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contactez-nous
              </h1>
              <p className="text-lg text-muted-foreground">
                Une question sur nos services ? Besoin d'aide pour votre réservation ? 
                Notre équipe est là pour vous accompagner.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 -mt-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{info.value}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Envoyez-nous un message</CardTitle>
                    <CardDescription>
                      Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Message envoyé !</h3>
                        <p className="text-muted-foreground mb-6">
                          Nous vous répondrons sous 24h maximum.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} variant="outline">
                          Envoyer un autre message
                        </Button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nom complet *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Jean Dupont"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="jean@exemple.fr"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="06 12 34 56 78"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Sujet *</Label>
                            <Input
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              placeholder="Demande d'information"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Décrivez votre demande..."
                            rows={5}
                            required
                          />
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? (
                            "Envoi en cours..."
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Envoyer le message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Questions fréquentes</h2>
                  <p className="text-muted-foreground">
                    Trouvez rapidement des réponses à vos questions.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-2">{item.question}</h3>
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* CTA Cards */}
                <div className="mt-8 space-y-4">
                  <Card className="bg-primary text-primary-foreground">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Vous êtes Propriétaire ?</h3>
                      <p className="text-sm opacity-90 mb-4">
                        Trouvez un Accompagnateur vérifié près de chez vous en quelques clics.
                      </p>
                      <Button variant="secondary" asChild>
                        <a href="/find-walkers">Trouver un Accompagnateur</a>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-secondary">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Vous aimez les chiens ?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Rejoignez notre communauté d'Accompagnateurs et générez des revenus.
                      </p>
                      <Button variant="outline" asChild>
                        <a href="/walker/register">Devenir Accompagnateur</a>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
