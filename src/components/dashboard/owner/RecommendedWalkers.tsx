import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Shield, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface RecommendedWalker {
  id: string;
  name: string;
  age?: number;
  photoUrl?: string;
  rating: number;
  verified: boolean;
  city?: string;
}

interface RecommendedWalkersProps {
  walkers: RecommendedWalker[];
  title?: string;
}

const RecommendedWalkers = ({ walkers, title = "Recommandé pour vous" }: RecommendedWalkersProps) => {
  const navigate = useNavigate();

  if (walkers.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button 
          onClick={() => navigate('/walkers')}
          className="text-sm text-primary flex items-center gap-1 hover:underline"
        >
          Voir tout <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {walkers.slice(0, 4).map((walker, index) => (
          <motion.div
            key={walker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/walker/${walker.id}`)}
            className="cursor-pointer"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/60">
              <CardContent className="p-0">
                {/* Photo avec overlay */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage 
                      src={walker.photoUrl} 
                      alt={walker.name}
                      className="object-cover w-full h-full"
                    />
                    <AvatarFallback className="rounded-none bg-gradient-to-br from-primary/20 to-accent/20 text-4xl">
                      {walker.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Badge vérifié */}
                  {walker.verified && (
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground gap-1 text-xs">
                      <Shield className="h-3 w-3" />
                      Vérifié
                    </Badge>
                  )}
                </div>
                
                {/* Infos */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm">
                    {walker.name}{walker.age ? `, ${walker.age} ans` : ''}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm">{walker.rating.toFixed(1)}</span>
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedWalkers;
