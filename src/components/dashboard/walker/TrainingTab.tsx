import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen, Play, Award, ChevronRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  DEFAULT_TRAINING_MODULES,
  DEFAULT_QUIZ_QUESTIONS,
  MINIMUM_PASSING_SCORE,
  calculateQuizScore,
  type TrainingModule,
  type QuizQuestion,
} from "@/services/training";

const WalkerTrainingTab = () => {
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const progress = (completedModules.length / DEFAULT_TRAINING_MODULES.length) * 100;
  const allCompleted = completedModules.length === DEFAULT_TRAINING_MODULES.length;

  const moduleQuestions = (moduleId: string) =>
    DEFAULT_QUIZ_QUESTIONS.filter((q) => q.moduleId === moduleId);

  const startQuiz = (module: TrainingModule) => {
    setActiveModule(module);
    setQuizMode(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    const questions = moduleQuestions(activeModule!.id);
    if (newAnswers.length >= questions.length) {
      const result = calculateQuizScore(newAnswers, questions);
      setLastScore(result.score);
      setShowResult(true);
      if (result.passed && !completedModules.includes(activeModule!.id)) {
        setCompletedModules((prev) => [...prev, activeModule!.id]);
        toast({ title: "🎉 Module validé !", description: `Score: ${result.score}%` });
      }
    } else {
      setCurrentQuestion(newAnswers.length);
    }
  };

  const exitQuiz = () => {
    setQuizMode(false);
    setActiveModule(null);
    setShowResult(false);
  };

  if (quizMode && activeModule) {
    const questions = moduleQuestions(activeModule.id);

    if (showResult) {
      const passed = lastScore !== null && lastScore >= MINIMUM_PASSING_SCORE;
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6 text-center space-y-4">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                {passed ? <Award className="w-10 h-10" /> : <RotateCcw className="w-10 h-10" />}
              </div>
              <h2 className="text-2xl font-black">{passed ? "Félicitations !" : "Réessayez"}</h2>
              <p className="text-muted-foreground">
                Score : <span className="font-bold text-foreground">{lastScore}%</span> — Minimum requis : {MINIMUM_PASSING_SCORE}%
              </p>
              <div className="flex gap-3 justify-center pt-2">
                {!passed && (
                  <Button variant="outline" onClick={() => startQuiz(activeModule)}>
                    <RotateCcw className="w-4 h-4 mr-2" /> Recommencer
                  </Button>
                )}
                <Button onClick={exitQuiz}>Retour aux modules</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    const q = questions[currentQuestion];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={exitQuiz}>← Retour</Button>
          <Badge variant="secondary">{currentQuestion + 1}/{questions.length}</Badge>
        </div>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-bold">{q.question}</h3>
            <div className="space-y-2">
              {q.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectAnswer(idx)}
                  className="w-full text-left p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="font-medium">{option}</span>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" /> Formation
        </h2>
        {allCompleted && (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" /> Validée
          </Badge>
        )}
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {completedModules.length}/{DEFAULT_TRAINING_MODULES.length} modules complétés
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {DEFAULT_TRAINING_MODULES.map((module, idx) => {
          const done = completedModules.includes(module.id);
          const questions = moduleQuestions(module.id);
          return (
            <motion.div key={module.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`overflow-hidden ${done ? "border-green-300 bg-green-50/50 dark:bg-green-950/20" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"}`}>
                      {done ? <CheckCircle className="w-5 h-5" /> : <span className="font-bold">{idx + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>⏱ {module.duration} min</span>
                        <span>📝 {questions.length} questions</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={done ? "outline" : "default"}
                      onClick={() => startQuiz(module)}
                      className="shrink-0"
                    >
                      {done ? "Refaire" : <><Play className="w-3 h-3 mr-1" /> Quiz</>}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {allCompleted && (
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-300">
          <CardContent className="p-4 text-center space-y-2">
            <Award className="w-12 h-12 mx-auto text-green-600" />
            <h3 className="text-lg font-bold text-green-700">Formation Terminée 🎉</h3>
            <p className="text-sm text-muted-foreground">
              Vous êtes prêt à accepter vos premières missions !
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default WalkerTrainingTab;
