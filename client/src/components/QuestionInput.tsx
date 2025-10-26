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
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="relative">
        <div className="relative group">
          <Textarea
            ref={textareaRef}
            data-testid="input-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about coding, math, science, or AI/ML..."
            className="min-h-32 max-h-64 resize-none pr-20 text-base leading-relaxed rounded-xl border-2 border-muted-foreground/20 focus:border-primary/50 transition-all duration-300 bg-gradient-to-br from-background to-muted/20 focus:from-background focus:to-muted/10 shadow-lg hover:shadow-xl focus:shadow-xl"
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3">
            <Button
              data-testid="button-submit-question"
              onClick={handleSubmit}
              disabled={!question.trim() || isLoading}
              size="default"
              className="gap-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Thinking...
                </>
              ) : (
                <>
                  Ask Question
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {charCount > 0 && (
                <span className="bg-muted/50 rounded-full px-3 py-1">
                  {charCount} characters
                </span>
              )}
            </span>
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span>AI is thinking...</span>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
