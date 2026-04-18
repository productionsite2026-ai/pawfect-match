import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import FindWalkersHero from "@/components/findwalkers/HeroSection";
import SearchSection from "@/components/findwalkers/SearchSection";
import DemandesSection from "@/components/findwalkers/DemandesSection";

const FindWalkers = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Trouver un Accompagnateur de Confiance | DogWalking"
        description="Trouvez facilement un promeneur ou gardien vérifié près de chez vous. Promenade, garde, visites : consultez les profils et réservez en quelques clics."
        canonical="https://dogwalking.fr/find-walkers"
      />
      <Header />
      <FindWalkersHero />
      <SearchSection />
      <DemandesSection />
      <Footer />
    </div>
  );
};

export default FindWalkers;
