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
      category: "Programming"
    },
    {
      icon: Calculator,
      question: "What is the Pythagorean theorem and how do I use it?",
      category: "Math"
    },
    {
      icon: Lightbulb,
      question: "How do neural networks learn from data?",
      category: "AI/ML"
    },
    {
      icon: BookOpen,
      question: "Explain the difference between supervised and unsupervised learning",
      category: "Data Science"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold">Start by asking your first question</h2>
        <p className="text-muted-foreground">
          Get clear, structured explanations on any coding, math, science, or AI topic
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Try these examples:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleQuestions.map((example, index) => {
            const Icon = example.icon;
            return (
              <Card
                key={index}
                data-testid={`card-example-${index}`}
                className="p-4 hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => onExampleClick(example.question)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-relaxed">{example.question}</p>
                    <p className="text-xs text-muted-foreground">{example.category}</p>
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
