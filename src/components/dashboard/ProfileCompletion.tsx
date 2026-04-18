import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowRight, CheckCircle, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ProfileStep {
  id: string;
  label: string;
  completed: boolean;
  icon?: LucideIcon;
}

interface ProfileCompletionProps {
  percentage: number;
  steps: ProfileStep[];
  onComplete?: () => void;
  variant?: 'minimal' | 'detailed';
}

export const ProfileCompletion = ({
  percentage,
  steps,
  onComplete,
  variant = 'minimal'
}: ProfileCompletionProps) => {
  if (percentage >= 100) return null;

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-900">
          <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold">Complétez votre profil</p>
                <p className="text-sm text-muted-foreground">Un profil complet inspire confiance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Progress value={percentage} className="w-24 h-2" />
                <span className="text-sm font-medium">{percentage}%</span>
              </div>
              <Button variant="outline" size="sm" onClick={onComplete} className="gap-2">
                Compléter <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-900">
        <CardContent className="py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Complétez votre profil ({percentage}%)</p>
              <Progress value={percentage} className="h-2 mt-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                  step.completed 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span>{step.label}</span>
              </div>
            ))}
          </div>
          
          <Button variant="outline" size="sm" onClick={onComplete} className="gap-2">
            Compléter mon profil <ArrowRight className="h-3 w-3" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileCompletion;
