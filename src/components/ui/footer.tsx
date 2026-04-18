import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-earthy text-white py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🐕</div>
              <span className="text-xl font-bold">DogWalking</span>
            </Link>
            <p className="text-white/70 text-sm mb-4">
              La plateforme de confiance n°1 en France pour les Propriétaires d'animaux et les Accompagnateurs Certifiés. 
              Paiement sécurisé, preuves visuelles obligatoires.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Nos Services */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider">Nos Services</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/services/promenade" className="hover:text-white transition-colors">Promenade</Link></li>
              <li><Link to="/services/garde" className="hover:text-white transition-colors">Hébergement & Garde</Link></li>
              <li><Link to="/services/visite" className="hover:text-white transition-colors">Visite à domicile</Link></li>
              <li><Link to="/services/garde-domicile" className="hover:text-white transition-colors">Garde à Domicile</Link></li>
              <li><Link to="/services/garde-multi-animaux" className="hover:text-white transition-colors">Garde Multi-Animaux</Link></li>
              <li><Link to="/tarifs" className="hover:text-white transition-colors">Nos tarifs</Link></li>
            </ul>
          </div>

          {/* Propriétaires */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider">Propriétaires</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/walkers" className="hover:text-white transition-colors">Trouver un Accompagnateur</Link></li>
              <li><Link to="/nous-sommes-presents" className="hover:text-white transition-colors">Zones d'intervention</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Mon espace Propriétaire</Link></li>
              <li><Link to="/dashboard?tab=parrainage" className="hover:text-white transition-colors">Parrainage</Link></li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider">Ressources</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/support?tab=a-propos" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Centre d'aide</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/walker/register" className="hover:text-white transition-colors">Devenir Accompagnateur</Link></li>
              <li><Link to="/support?tab=contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@dogwalking.fr" className="hover:text-white transition-colors">contact@dogwalking.fr</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>01 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/50 gap-4">
            <p>© {new Date().getFullYear()} DogWalking. Tous droits réservés.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/ressources-legales?tab=mentions" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link to="/ressources-legales?tab=cgu" className="hover:text-white transition-colors">CGU/CGV</Link>
              <Link to="/ressources-legales?tab=confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
