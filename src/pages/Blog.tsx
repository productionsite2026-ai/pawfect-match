import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, ArrowRight, Search, Clock, Sparkles, BookOpen, Heart, TrendingUp } from 'lucide-react';
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import { motion } from "framer-motion";
import { AnimatedCard, AnimatedGrid, AnimatedGridItem } from "@/components/ui/animated-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { SectionHeader } from "@/components/ui/section-header";
import { Link } from "react-router-dom";
import blogHero from "@/assets/pages/blog-hero.jpg";
import { blogArticles, blogCategories, getFeaturedArticle, getArticlesByCategory } from "@/data/blogData";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const featuredArticle = getFeaturedArticle();
  const filteredArticles = getArticlesByCategory(activeCategory)
    .filter(article => !article.featured)
    .filter(article => 
      searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog DogWalking | Conseils Chien, Santé Canine, Éducation et Bien-être"
        description="Découvrez nos articles d'experts sur la santé canine, l'éducation, la nutrition et le bien-être de votre chien. Astuces pratiques et conseils de professionnels vétérinaires."
        canonical="https://dogwalking.fr/blog"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section animée */}
          <motion.div 
            className="relative rounded-3xl overflow-hidden mb-12"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src={blogHero} 
              alt="Blog DogWalking - Conseils et articles sur les chiens" 
              className="w-full h-56 md:h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <AnimatedIcon icon={BookOpen} size="lg" variant="primary" className="mx-auto mb-4" float />
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Blog DogWalking
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Conseils d'experts vétérinaires, astuces pratiques et actualités pour le bien-être de votre chien
              </motion.p>
            </div>
          </motion.div>

          {/* Contenu SEO enrichi */}
          <motion.div 
            className="max-w-4xl mx-auto mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              Bienvenue sur le blog DogWalking, votre source d'information fiable pour tout ce qui concerne 
              le bien-être canin. Nos articles sont rédigés par des vétérinaires, éducateurs canins et 
              professionnels du comportement animal. Que vous cherchiez des conseils sur la nutrition, 
              l'éducation, la santé ou simplement des idées d'activités, vous trouverez ici des ressources 
              de qualité pour prendre soin de votre compagnon à quatre pattes.
            </p>
          </motion.div>

          {/* Search and filters animés */}
          <motion.div 
            className="flex flex-col md:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un article..." 
                className="pl-12 h-12 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((category) => (
                <motion.div key={category.slug} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant={activeCategory === category.slug ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setActiveCategory(category.slug)}
                  >
                    {category.name} ({category.count})
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Article à la une animé */}
          {featuredArticle && (
            <AnimatedCard className="mb-12 overflow-hidden" glow>
              <div className="grid md:grid-cols-2">
                <motion.div 
                  className="h-64 md:h-auto overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-primary/10 text-primary">
                      <Sparkles className="h-3 w-3 mr-1" />
                      À la une
                    </Badge>
                    <Badge variant="outline">{featuredArticle.category}</Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors cursor-pointer">
                    <Link to={`/blog/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
                  </h2>
                  <p className="text-muted-foreground mb-6">{featuredArticle.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(featuredArticle.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4 text-accent" />
                      {featuredArticle.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {featuredArticle.readTime}
                    </span>
                  </div>
                  <Button className="w-fit" asChild>
                    <Link to={`/blog/${featuredArticle.slug}`}>
                      Lire l'article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimatedCard>
          )}

          {/* Section titre articles */}
          <SectionHeader
            title="Nos derniers articles"
            subtitle="Conseils, guides et actualités pour le bien-être de votre compagnon"
            icon={TrendingUp}
            iconVariant="accent"
          />

          {/* Articles grid avec animations */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun article trouvé pour cette recherche.</p>
            </div>
          ) : (
            <AnimatedGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
              {filteredArticles.map((article, index) => (
                <AnimatedGridItem key={article.id}>
                  <Link to={`/blog/${article.slug}`}>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer h-full border-2 hover:border-primary/30">
                        <div className="relative h-48 overflow-hidden">
                          <motion.img 
                            src={article.image} 
                            alt={article.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                          />
                          <Badge className="absolute top-4 left-4 bg-card/90 backdrop-blur">{article.category}</Badge>
                        </div>
                        <CardContent className="p-5">
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                </AnimatedGridItem>
              ))}
            </AnimatedGrid>
          )}

          {/* Load more */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Charger plus d'articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Newsletter améliorée */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mt-16 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <AnimatedIcon icon={Heart} size="xl" variant="primary" float />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">Restez informé</h3>
                    <p className="text-muted-foreground mb-6">
                      Recevez nos meilleurs conseils, guides exclusifs et actualités directement dans votre boîte mail. 
                      Rejoignez +10 000 Propriétaires de chiens passionnés !
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0">
                      <Input placeholder="Votre email" type="email" className="flex-1 h-12 rounded-xl" />
                      <Button size="lg" className="rounded-xl">
                        S'abonner
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Blog;
