import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { SearchForm } from "@/components/ui/search-form";
import { WhySection } from "@/components/ui/why-section";
import { HowItWorksSection } from "@/components/ui/how-it-works-section";
import { ServicesSection } from "@/components/ui/services-section";
import { DogWalkingProtect } from "@/components/ui/dogwalking-protect";
import { UserTypesSection } from "@/components/ui/user-types-section";
import { UseCasesSection } from "@/components/ui/use-cases-section";

import { HomeIntroSection } from "@/components/ui/home-intro-section";
import { HomeFAQSection } from "@/components/ui/home-faq-section";
import { Footer } from "@/components/ui/footer";
import { FloatingContact } from "@/components/ui/floating-contact";
import { SEOHead } from "@/components/seo/SEOHead";
import { ExpertBio } from "@/components/ui/expert-bio";
import { getRandomExpert } from "@/data/expertsData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Accompagnement Animal Partout en France | Accompagnateurs Certifiés | DogWalking"
        description="Trouvez un Accompagnateur Certifié près de chez vous. Paiement sécurisé, code unique et preuves visuelles obligatoires. Service de promenade et garde dans toute la France."
        canonical="https://dogwalking.fr"
      />
      <Header />
      <main>
        <HeroSection />
        <section className="py-8 md:py-12 px-4 -mt-16 md:-mt-24 relative z-10">
          <div className="container mx-auto">
            <SearchForm />
          </div>
        </section>
        
        {/* Section Services immédiatement après le formulaire */}
        <ServicesSection />

        {/* Mises en situation : quand faire appel à DogWalking */}
        <UseCasesSection />

        {/* Section Comment ça marche après les services */}
        <HowItWorksSection />
        
        <HomeIntroSection />
        
        {/* Section Pourquoi Choisir DogWalking pour votre animal ? */}
        <WhySection />
        

        <DogWalkingProtect />
        <UserTypesSection />
        
        <HomeFAQSection />
        
        {/* Section Expert (E-E-A-T) */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nos Experts au Service de Votre Animal
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                DogWalking est dirigée par une équipe d'experts reconnus en comportement animal, vétérinaire et bien-être.
              </p>
            </div>
            <ExpertBio expert={getRandomExpert()} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Index;
