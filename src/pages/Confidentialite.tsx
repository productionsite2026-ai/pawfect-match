import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Users, Database, Settings } from "lucide-react";

const Confidentialite = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Politique de Confidentialité | DogWalking"
        description="Politique RGPD de DogWalking : collecte, utilisation et protection des données personnelles. Vos droits et notre engagement."
        canonical="https://dogwalking.fr/confidentialite"
        noindex
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Politique de Confidentialité</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Chez DogWalking, la protection de vos données personnelles est notre priorité absolue.
        </p>

        {/* Key points cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="h-10 w-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Conforme RGPD</h3>
              <p className="text-sm text-muted-foreground">Respect du règlement européen</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Lock className="h-10 w-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Données sécurisées</h3>
              <p className="text-sm text-muted-foreground">Chiffrement SSL/TLS</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Eye className="h-10 w-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Transparence</h3>
              <p className="text-sm text-muted-foreground">Vous gardez le contrôle</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              1. Responsable du traitement
            </h2>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="mb-2"><strong>DogWalking France</strong></p>
              <p className="mb-2">123 Avenue des Champs-Élysées, 75008 Paris</p>
              <p className="mb-2">Email : dpo@dogwalking.fr</p>
              <p>SIRET : XXX XXX XXX XXXXX</p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              2. Données collectées
            </h2>
            
            <h3 className="text-xl font-medium mb-2">2.1 Données d'identification</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Nom, prénom, adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Adresse postale</li>
              <li>Photo de profil (optionnelle)</li>
            </ul>

            <h3 className="text-xl font-medium mb-2 mt-4">2.2 Données relatives aux animaux</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Nom, race, âge de l'animal</li>
              <li>Poids et caractéristiques physiques</li>
              <li>Tempérament et comportement</li>
              <li>Informations médicales (allergies, traitements)</li>
              <li>Photos de l'animal</li>
            </ul>

            <h3 className="text-xl font-medium mb-2 mt-4">2.3 Données des Accompagnateurs Certifiés</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Pièce d'identité</li>
              <li>Vérification d'identité approfondie ()</li>
              <li>Preuves visuelles des missions (photos/vidéos)</li>
              <li>Coordonnées bancaires (pour les reversements)</li>
              <li>Qualifications et expériences</li>
            </ul>

            <h3 className="text-xl font-medium mb-2 mt-4">2.4 Données de navigation</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Adresse IP</li>
              <li>Type de navigateur et système d'exploitation</li>
              <li>Pages visitées et durée des visites</li>
              <li>Cookies (voir section dédiée)</li>
            </ul>
          </section>

          {/* Finalités */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              3. Finalités du traitement
            </h2>
            <p className="text-muted-foreground mb-4">Vos données sont collectées pour :</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Gestion de votre compte</strong> : création, authentification, modification</li>
              <li><strong>Mise en relation</strong> : entre Propriétaires et Accompagnateurs Certifiés</li>
              <li><strong>Réservation et paiement</strong> : traitement des transactions via paiement en attente</li>
              <li><strong>Communication</strong> : notifications, messages, assistance</li>
              <li><strong>Sécurité</strong> : vérification manuelle des profils (35% d'acceptation)</li>
              <li><strong>Preuves de mission</strong> : stockage des preuves visuelles obligatoires</li>
              <li><strong>Obligations légales</strong> : fiscalité, contentieux</li>
            </ul>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Base légale des traitements</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 bg-muted">Traitement</th>
                    <th className="text-left p-3 bg-muted">Base légale</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="p-3">Gestion du compte</td>
                    <td className="p-3">Exécution du contrat</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Vérification des Accompagnateurs Certifiés</td>
                    <td className="p-3">Intérêt légitime (sécurité)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Paiements (Paiement en Attente)</td>
                    <td className="p-3">Exécution du contrat</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Preuves visuelles</td>
                    <td className="p-3">Exécution du contrat (sécurité)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Durée de conservation</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Données du compte</strong> : durée de la relation + 3 ans</li>
              <li><strong>Données de transaction</strong> : 10 ans (obligation légale)</li>
              <li><strong>Documents de vérification</strong> : durée de l'activité + 5 ans</li>
              <li><strong>Preuves visuelles</strong> : 12 mois après la mission (sauf litige)</li>
              <li><strong>Logs de connexion</strong> : 1 an</li>
            </ul>
          </section>

          {/* Destinataires */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Destinataires des données</h2>
            <p className="text-muted-foreground mb-4">Vos données peuvent être partagées avec :</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Autres utilisateurs</strong> : informations de profil pour la mise en relation</li>
              <li><strong>Prestataires de paiement</strong> : Stripe pour les transactions sécurisées</li>
              <li><strong>Hébergeur</strong> : Supabase (données stockées en UE)</li>
              <li><strong>Autorités</strong> : sur réquisition judiciaire uniquement</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Nous ne vendons jamais vos données à des tiers à des fins commerciales.
            </p>
          </section>

          {/* Vos droits */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Vos droits</h2>
            <p className="text-muted-foreground mb-4">
              Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de portabilité et d'opposition.
            </p>
            <p className="text-muted-foreground mt-6">
              Pour exercer vos droits, contactez-nous à <strong>dpo@dogwalking.fr</strong> 
              ou depuis les paramètres de votre compte. Nous répondons sous 30 jours.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
            <p className="text-muted-foreground">
              Nous utilisons des cookies techniques essentiels au fonctionnement du site (session, authentification) 
              et des cookies de mesure d'audience anonymisés pour améliorer votre expérience.
            </p>
          </section>

          {/* Date de mise à jour */}
          <p className="text-sm text-muted-foreground mt-12 pt-8 border-t">
            Dernière mise à jour : Avril 2026
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Confidentialite;
