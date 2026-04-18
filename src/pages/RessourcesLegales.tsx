import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText, Scale, Users, Database, Settings } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const RessourcesLegales = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("mentions");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["mentions", "cgu", "confidentialite"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Ressources Légales | DogWalking"
        description="Mentions légales, conditions générales d'utilisation et politique de confidentialité de DogWalking, plateforme de mise en relation sécurisée en France."
        canonical="https://dogwalking.fr/ressources-legales"
        noindex
      />
      <Header />

      <main className="container mx-auto px-4 py-24 max-w-5xl">
        <h1 className="text-4xl font-bold mb-2">Ressources Légales</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Retrouvez toutes les informations juridiques et réglementaires de DogWalking France.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="mentions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Mentions légales</span>
              <span className="sm:hidden">Mentions</span>
            </TabsTrigger>
            <TabsTrigger value="cgu" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span>CGU</span>
            </TabsTrigger>
            <TabsTrigger value="confidentialite" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Confidentialité</span>
              <span className="sm:hidden">RGPD</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== MENTIONS LÉGALES ===== */}
          <TabsContent value="mentions">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Éditeur du site</h2>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <p className="mb-2"><strong>Raison sociale :</strong> DogWalking France</p>
                  <p className="mb-2"><strong>Forme juridique :</strong> Société par Actions Simplifiée</p>
                  <p className="mb-2"><strong>Siège social :</strong> 123 Avenue des Champs-Élysées, 75008 Paris</p>
                  <p className="mb-2"><strong>SIRET :</strong> XXX XXX XXX XXXXX</p>
                  <p className="mb-2"><strong>Email :</strong> contact@dogwalking.fr</p>
                  <p><strong>Téléphone :</strong> 01 XX XX XX XX</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Hébergement</h2>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <p className="mb-2"><strong>Hébergeur :</strong> Supabase Inc.</p>
                  <p><strong>Site web :</strong> https://supabase.com</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Activité</h2>
                <p className="text-muted-foreground">
                  DogWalking est une plateforme de mise en relation entre Propriétaires d'animaux 
                  et Accompagnateurs Certifiés. Notre service permet de réserver des prestations 
                  de promenade, garde, et autres services animaliers avec un protocole de sécurité strict.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
                <p className="text-muted-foreground">
                  L'ensemble du contenu de ce site est la propriété exclusive de DogWalking France 
                  ou de ses partenaires, et est protégé par les lois françaises et internationales 
                  relatives à la propriété intellectuelle.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Protection des données personnelles</h2>
                <p className="text-muted-foreground">
                  Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit 
                  d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
                </p>
              </section>

              <p className="text-sm text-muted-foreground mt-12 pt-8 border-t">Dernière mise à jour : Avril 2026</p>
            </div>
          </TabsContent>

          {/* ===== CGU ===== */}
          <TabsContent value="cgu">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Préambule</h2>
                <p className="text-muted-foreground">
                  Les présentes Conditions Générales d'Utilisation régissent l'utilisation de la plateforme 
                  DogWalking accessible à l'adresse www.dogwalking.fr. En utilisant nos services, vous acceptez 
                  sans réserve les présentes CGU.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 1 - Définitions</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>"Plateforme"</strong> : le site internet DogWalking et ses fonctionnalités</li>
                  <li><strong>"Propriétaire"</strong> : utilisateur inscrit en qualité de Propriétaire d'animal</li>
                  <li><strong>"Accompagnateur Certifié"</strong> : utilisateur inscrit en qualité de prestataire de services après validation de son profil</li>
                  <li><strong>"Prestation"</strong> : tout service réservé via la Plateforme</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 2 - Objet de la Plateforme</h2>
                <p className="text-muted-foreground">
                  DogWalking est une plateforme de mise en relation permettant la recherche d'Accompagnateurs Certifiés, 
                  la réservation et le paiement de prestations via paiement en attente, avec preuves visuelles obligatoires.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 3 - Inscription et Certification</h2>
                <p className="text-muted-foreground">
                   L'inscription est ouverte à toute personne majeure. Les Accompagnateurs Certifiés doivent 
                   fournir des documents justificatifs (identité CNI, assurance RC) vérifiés manuellement 
                   par nos équipes (taux de sélection de 35%).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 4 - Tarifs et Paiement</h2>
                <p className="text-muted-foreground mb-4">
                  Les tarifs sont librement fixés par les Accompagnateurs Certifiés ("À partir de..."). Le paiement est sécurisé et libéré uniquement après saisie du code unique par le Propriétaire.
                </p>
                <h3 className="text-xl font-medium mb-2">Annulation</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Annulation gratuite jusqu'à 3h avant la mission.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 5 - Obligations des Utilisateurs</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Propriétaire</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                      <li>Informations exactes sur son animal</li>
                      <li>Vaccinations à jour</li>
                      <li>Respect des horaires</li>
                      <li>Communication du code unique après mission</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Accompagnateur Certifié</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                      <li>Qualifications nécessaires</li>
                      <li>Preuves visuelles de chaque prestation</li>
                      <li>Bienveillance envers les animaux</li>
                      <li>Respect du protocole de sécurité</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Article 6 - Protection & Sécurité</h2>
                <p className="text-muted-foreground">
                  DogWalking met en place un système de médiation et de protection pour les Prestations réalisées 
                  via la Plateforme, incluant la gestion des fonds sous paiement en attente.
                </p>
              </section>

              <p className="text-sm text-muted-foreground mt-12 pt-8 border-t">Dernière mise à jour : Avril 2026</p>
            </div>
          </TabsContent>

          {/* ===== CONFIDENTIALITÉ ===== */}
          <TabsContent value="confidentialite">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Responsable du traitement</h2>
                <p className="text-muted-foreground"><strong>DogWalking France</strong> - dpo@dogwalking.fr</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Identification (nom, email, tel)</li>
                  <li>Animaux (nom, race, santé, comportement)</li>
                  <li>Accompagnateurs Certifiés (identité CNI, assurance RC, preuves visuelles)</li>
                  <li>Transactions (Stripe, paiement en attente)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Finalités</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Gestion des comptes et mise en relation</li>
                  <li>Traitement des réservations et paiements sécurisés</li>
                  <li>Sécurité et vérification manuelle des profils</li>
                  <li>Stockage des preuves visuelles obligatoires</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Vos droits</h2>
                <p className="text-muted-foreground">
                  Vous disposez des droits d'accès, de rectification, de suppression et d'opposition 
                  en contactant dpo@dogwalking.fr.
                </p>
              </section>

              <p className="text-sm text-muted-foreground mt-12 pt-8 border-t">Dernière mise à jour : Avril 2026</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default RessourcesLegales;
