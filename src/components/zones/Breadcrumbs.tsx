import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  name: string;
  url: string;
}

const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav aria-label="Fil d'Ariane" className="py-4">
    <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <li>
        <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Home className="w-4 h-4" />
          <span className="sr-only">Accueil</span>
        </Link>
      </li>
      {items.map((item, index) => (
        <li key={item.url} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium" aria-current="page">{item.name}</span>
          ) : (
            <Link to={item.url} className="hover:text-primary transition-colors">{item.name}</Link>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
