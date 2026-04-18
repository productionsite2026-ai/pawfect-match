import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, Dog } from "lucide-react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Page non trouvée - DogWalking</title>
        <meta name="description" content="Cette page n'existe pas. Retournez à l'accueil pour trouver le meilleur promeneur de chien près de chez vous." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="text-center max-w-lg">
          {/* Animated dog illustration */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
              <Dog className="h-16 w-16 text-primary" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-muted rounded-full blur-sm" />
          </div>

          {/* Error code */}
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          
          {/* Message */}
          <h2 className="text-2xl font-semibold mb-4">Oups ! Page introuvable</h2>
          <p className="text-muted-foreground mb-8">
            On dirait que cette page s'est enfuie comme un chien sans laisse ! 
            Ne vous inquiétez pas, on va vous ramener à la maison.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/find-walkers">
                <Search className="h-4 w-4 mr-2" />
                Trouver un promeneur
              </Link>
            </Button>
          </div>

          {/* Back button */}
          <Button 
            variant="ghost" 
            className="mt-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retourner en arrière
          </Button>

          {/* Popular links */}
          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">Pages populaires :</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="link" size="sm" asChild>
                <Link to="/tarifs">Tarifs</Link>
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link to="/securite">Sécurité</Link>
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link to="/walker/register">Devenir promeneur</Link>
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link to="/find-walkers">Trouver un promeneur</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
