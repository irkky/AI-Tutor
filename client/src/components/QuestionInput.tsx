import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export function QuestionInput({ onSubmit, isLoading }: QuestionInputProps) {
  const [question, setQuestion] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus on mount
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
      setQuestion("");
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charCount = question.length;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          data-testid="input-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about coding, math, science, or AI/ML..."
          className="min-h-32 max-h-64 resize-none pr-16 text-base leading-relaxed"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">
            {charCount > 0 && `${charCount} characters`}
          </span>
          <Button
            data-testid="button-submit-question"
            onClick={handleSubmit}
            disabled={!question.trim() || isLoading}
            size="default"
            className="gap-2"
          >
            {isLoading ? "Thinking..." : "Ask Question"}
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
