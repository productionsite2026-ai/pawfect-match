import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, Clock, ArrowLeft, Share2, 
  Facebook, Twitter, Linkedin, BookOpen, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import { getArticleBySlug, getRelatedArticles } from "@/data/blogData";
import { toast } from "@/hooks/use-toast";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = slug ? getArticleBySlug(slug) : null;
  const relatedArticles = slug ? getRelatedArticles(slug) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-8">
            L'article que vous recherchez n'existe pas.
          </p>
          <Button onClick={() => navigate("/blog")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au blog
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const shareUrl = `https://dogwalking.fr/blog/${article.slug}`;

  const handleShare = async (platform: string) => {
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(article.title)}`
    };

    if (platform === "copy") {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Lien copié !", description: "Le lien a été copié dans le presse-papier" });
    } else {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  // Article Schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role
    },
    publisher: {
      "@type": "Organization",
      name: "DogWalking",
      logo: {
        "@type": "ImageObject",
        url: "https://dogwalking.fr/logo.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": shareUrl
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${article.title} | Blog DogWalking`}
        description={article.excerpt}
        canonical={shareUrl}
        image={article.image}
      />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>

      <Header />

      <article className="container mx-auto px-4 py-24 max-w-4xl">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <Link to="/" className="hover:text-primary">Accueil</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/blog" className="hover:text-primary">Blog</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate">{article.title}</span>
        </motion.nav>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{article.category}</Badge>
            {article.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-6">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={article.author.avatar} alt={article.author.name} />
                <AvatarFallback>{article.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{article.author.name}</p>
                <p className="text-sm text-muted-foreground">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(article.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime}
              </span>
            </div>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.figure
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-[300px] md:h-[400px] object-cover rounded-2xl"
          />
        </motion.figure>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
        />

        {/* Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border-t border-b py-6 mb-12"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-semibold flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Partager cet article
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("copy")}
              >
                Copier le lien
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Author Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-muted/50 mb-12">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={article.author.avatar} alt={article.author.name} />
                  <AvatarFallback className="text-xl">{article.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg">{article.author.name}</p>
                  <p className="text-muted-foreground mb-2">{article.author.role}</p>
                  <p className="text-sm text-muted-foreground">
                    Expert(e) en bien-être canin, {article.author.name} partage ses connaissances 
                    pour aider les Propriétaires à mieux comprendre et prendre soin de leurs compagnons.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.slug} to={`/blog/${related.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="h-40 overflow-hidden rounded-t-lg">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <Badge variant="outline" className="mb-2">{related.category}</Badge>
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {related.readTime}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Back to Blog */}
        <div className="text-center mt-12">
          <Button variant="outline" onClick={() => navigate("/blog")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au blog
          </Button>
        </div>
      </article>

      <Footer />
      <FloatingContact />
    </div>
  );
};

// Helper function to format markdown-like content to HTML
function formatContent(content: string): string {
  return content
    // Headers
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Lists
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^✅ (.*$)/gim, '<li class="ml-4 flex items-start gap-2"><span class="text-green-500">✅</span>$1</li>')
    .replace(/^⚠️ (.*$)/gim, '<li class="ml-4 flex items-start gap-2"><span class="text-amber-500">⚠️</span>$1</li>')
    .replace(/^❌ (.*$)/gim, '<li class="ml-4 flex items-start gap-2"><span class="text-red-500">❌</span>$1</li>')
    .replace(/^🚫 (.*$)/gim, '<li class="ml-4 flex items-start gap-2"><span class="text-red-500">🚫</span>$1</li>')
    .replace(/^🚨 (.*$)/gim, '<p class="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-900 my-4">🚨 $1</p>')
    // Tables (simple)
    .replace(/\| (.*) \|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      return `<tr>${cells.map(c => `<td class="border px-3 py-2">${c.trim()}</td>`).join('')}</tr>`;
    })
    // Numbered lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>');
}

export default BlogArticle;
