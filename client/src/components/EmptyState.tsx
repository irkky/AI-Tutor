import { Card } from "@/components/ui/card";
import { Lightbulb, BookOpen, Code, Calculator } from "lucide-react";

interface EmptyStateProps {
  onExampleClick: (question: string) => void;
}

export function EmptyState({ onExampleClick }: EmptyStateProps) {
  const exampleQuestions = [
    {
      icon: Code,
      question: "Explain how async/await works in JavaScript",
      category: "Programming",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Calculator,
      question: "What is the Pythagorean theorem and how do I use it?",
      category: "Math",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: Lightbulb,
      question: "How do neural networks learn from data?",
      category: "AI/ML",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: BookOpen,
      question: "Explain the difference between supervised and unsupervised learning",
      category: "Data Science",
      gradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-12 animate-in fade-in-50 duration-700">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center animate-pulse">
              <Lightbulb className="w-10 h-10 text-primary animate-bounce" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-ping">
              <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Start by asking your first question
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get clear, structured explanations on any coding, math, science, or AI topic
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground bg-muted/50 rounded-full px-4 py-2 inline-block">
            Try these examples:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exampleQuestions.map((example, index) => {
            const Icon = example.icon;
            return (
              <Card
                key={index}
                data-testid={`card-example-${index}`}
                className={`group p-6 hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br ${example.gradient} border-0 hover:border-primary/20`}
                onClick={() => onExampleClick(example.question)}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${example.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-base font-medium leading-relaxed group-hover:text-foreground transition-colors">
                      {example.question}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
                        {example.category}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
