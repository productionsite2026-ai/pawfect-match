import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";

const CGU = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Conditions Générales d'Utilisation | DogWalking"
        description="CGU de DogWalking : règles et obligations pour les Propriétaires de chiens et Accompagnateurs Certifiés sur notre plateforme."
        canonical="https://dogwalking.fr/cgu"
        noindex
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          {/* Préambule */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Préambule</h2>
            <p className="text-muted-foreground">
              Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'utilisation 
              de la plateforme DogWalking accessible à l'adresse www.dogwalking.fr (ci-après "la Plateforme").
            </p>
            <p className="text-muted-foreground mt-4">
              En accédant à la Plateforme et en utilisant ses services, vous acceptez sans réserve 
              les présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser 
              la Plateforme.
            </p>
          </section>

          {/* Article 1 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 1 - Définitions</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>"Plateforme"</strong> : désigne le site internet DogWalking et l'ensemble de ses fonctionnalités</li>
              <li><strong>"Utilisateur"</strong> : désigne toute personne physique ou morale utilisant la Plateforme</li>
              <li><strong>"Propriétaire"</strong> : désigne l'utilisateur inscrit en qualité de Propriétaire d'animal</li>
              <li><strong>"Accompagnateur Certifié"</strong> : désigne l'utilisateur inscrit en qualité de prestataire de services après validation de son profil</li>
              <li><strong>"Prestation"</strong> : désigne tout service réservé via la Plateforme (promenade, garde, etc.)</li>
              <li><strong>"Compte"</strong> : désigne l'espace personnel de l'Utilisateur sur la Plateforme</li>
            </ul>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 2 - Objet de la Plateforme</h2>
            <p className="text-muted-foreground">
              DogWalking est une plateforme de mise en relation entre Propriétaires d'animaux et 
              Accompagnateurs Certifiés. La Plateforme permet :
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li>La recherche et consultation de profils d'Accompagnateurs Certifiés</li>
              <li>La réservation et paiement de Prestations par système de paiement sécurisé</li>
              <li>La communication sécurisée entre Propriétaires et Accompagnateurs Certifiés</li>
              <li>Le suivi des Prestations avec preuves visuelles obligatoires</li>
              <li>La libération du paiement par code unique communiqué par le Propriétaire</li>
            </ul>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 3 - Inscription et Compte</h2>
            <h3 className="text-xl font-medium mb-2">3.1 Conditions d'inscription</h3>
            <p className="text-muted-foreground">
              L'inscription est ouverte à toute personne physique majeure (18 ans minimum) ou 
              à toute personne morale légalement constituée. L'inscription est gratuite.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">3.2 Processus d'inscription</h3>
            <p className="text-muted-foreground">
              L'Utilisateur doit fournir des informations exactes et à jour. Tout Compte créé 
              avec des informations fausses ou frauduleuses pourra être supprimé sans préavis.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">3.3 Vérification des Accompagnateurs Certifiés</h3>
            <p className="text-muted-foreground">
              Les Accompagnateurs Certifiés doivent fournir des documents justificatifs (pièce d'identité, 
              CNI, documents professionnels) qui seront vérifiés manuellement par 
              nos équipes. Seuls 35% des candidats sont retenus pour garantir une sécurité optimale.
            </p>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 4 - Services proposés</h2>
            <h3 className="text-xl font-medium mb-2">4.1 Types de prestations</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Promenade</strong> : balade de l'animal en extérieur</li>
              <li><strong>Visite à domicile</strong> : passage au domicile du Propriétaire</li>
              <li><strong>Hébergement de nuit</strong> : garde de l'animal la nuit chez l'Accompagnateur Certifié</li>
              <li><strong>Garderie de jour</strong> : garde de l'animal la journée chez l'Accompagnateur Certifié</li>
              <li><strong>Garde à domicile</strong> : l'Accompagnateur Certifié reste au domicile du Propriétaire</li>
              <li><strong>Visite sanitaire</strong> : soins et hygiène de l'animal</li>
              <li><strong>Accompagnement Vétérinaire</strong> : transport et assistance aux rendez-vous</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 mt-4">4.2 Preuves de prestation</h3>
            <p className="text-muted-foreground">
              L'Accompagnateur Certifié s'engage à fournir des preuves visuelles (photo et/ou vidéo) obligatoires au début et à la fin de chaque Prestation. 
              Ces preuves sont indispensables pour garantir la transparence du service.
            </p>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 5 - Tarifs et Paiement</h2>
            <h3 className="text-xl font-medium mb-2">5.1 Tarification</h3>
            <p className="text-muted-foreground">
              Les tarifs sont librement fixés par les Accompagnateurs Certifiés ("À partir de..."). DogWalking perçoit une commission de 15% sur le montant total de la Prestation pour assurer le fonctionnement du service, du paiement en attente et du support.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">5.2 Système de Paiement Sécurisé et Code Unique</h3>
            <p className="text-muted-foreground">
              Le paiement est sécurisé lors de la réservation. Les fonds ne sont débloqués à l'Accompagnateur Certifié 
              qu'une fois que le Propriétaire a communiqué son code unique de validation à la fin de la mission.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">5.3 Annulation</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Annulation gratuite jusqu'à 3h avant la mission.</li>
              <li>Passé ce délai, des frais de dédommagement peuvent s'appliquer selon les modalités précisées lors de la réservation.</li>
            </ul>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 6 - Obligations des Utilisateurs</h2>
            <h3 className="text-xl font-medium mb-2">6.1 Obligations du Propriétaire</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Fournir des informations exactes sur son animal (santé, comportement, besoins)</li>
              <li>S'assurer que l'animal est à jour de ses vaccinations</li>
              <li>Informer l'Accompagnateur Certifié de tout problème de santé ou comportemental</li>
              <li>Communiquer le code unique uniquement après réalisation effective de la mission</li>
              <li>Respecter les horaires convenus</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 mt-4">6.2 Obligations de l'Accompagnateur Certifié</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Fournir obligatoirement les preuves visuelles de chaque mission</li>
              <li>Traiter les animaux avec bienveillance et professionnalisme</li>
              <li>Informer immédiatement le Propriétaire et le support DogWalking de tout incident</li>
              <li>Respecter scrupuleusement les consignes de sécurité</li>
            </ul>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 7 - Protection & Sécurité</h2>
            <p className="text-muted-foreground">
              DogWalking met en place un système de médiation et de protection pour les Prestations réalisées 
              via la Plateforme. En cas de litige, nos équipes interviennent pour analyser les preuves visuelles 
              fournies et arbitrer le déblocage des fonds sous paiement en attente.
            </p>
          </section>

          {/* Article 8 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 8 - Responsabilité</h2>
            <p className="text-muted-foreground">
              DogWalking agit en qualité d'intermédiaire technique et n'est pas partie au 
              contrat conclu entre le Propriétaire et l'Accompagnateur Certifié. À ce titre, DogWalking 
              ne saurait être tenue responsable :
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li>De l'exécution ou de la non-exécution des Prestations par les tiers</li>
              <li>Des dommages causés par ou à l'animal en dehors du cadre de la mission vérifiée</li>
              <li>Des informations inexactes fournies par les Utilisateurs</li>
            </ul>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 9 - Propriété intellectuelle</h2>
            <p className="text-muted-foreground">
              Tous les éléments de la Plateforme (textes, images, logos, etc.) sont protégés 
              par le droit de la propriété intellectuelle. Toute reproduction ou utilisation 
              non autorisée est interdite.
            </p>
          </section>

          {/* Article 10 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 10 - Protection des données</h2>
            <p className="text-muted-foreground">
              Le traitement des données personnelles est régi par notre{" "}
              <a href="/confidentialite" className="text-primary hover:underline">Politique de confidentialité</a>.
            </p>
          </section>

          {/* Article 11 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 11 - Résiliation</h2>
            <p className="text-muted-foreground">
              L'Utilisateur peut résilier son Compte à tout moment depuis son espace personnel. 
              DogWalking se réserve le droit de suspendre ou supprimer un Compte en cas de 
              violation des présentes CGU ou du protocole de sécurité, sans préavis ni indemnité.
            </p>
          </section>

          {/* Article 12 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 12 - Droit applicable et litiges</h2>
            <p className="text-muted-foreground">
              Les présentes CGU sont soumises au droit français. En cas de litige, les parties 
              s'engagent à rechercher une solution amiable via le service de médiation DogWalking. 
              À défaut, les tribunaux de Paris seront seuls compétents.
            </p>
          </section>

          {/* Article 13 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Article 13 - Contact</h2>
            <p className="text-muted-foreground">
              Pour toute question relative aux présentes CGU, vous pouvez nous contacter :
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2">
              <li>Par email : contact@dogwalking.fr</li>
              <li>Par courrier : DogWalking France, 123 Avenue des Champs-Élysées, 75008 Paris</li>
            </ul>
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

export default CGU;
