import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Explanation, TopicCategory } from "@shared/schema";

interface AIResponseProps {
  question: string;
  explanation: Explanation;
  topic?: TopicCategory;
  timestamp: Date;
}

export function AIResponse({ question, explanation, topic, timestamp }: AIResponseProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4 animate-in fade-in duration-300">
      {/* User Question */}
      <div className="flex justify-end">
        <div className="max-w-3xl rounded-2xl bg-primary text-primary-foreground p-4">
          <p className="text-base leading-relaxed" data-testid="text-user-question">{question}</p>
        </div>
      </div>

      {/* AI Response */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {topic && (
            <Badge variant="outline" className="rounded-full" data-testid={`badge-topic-${topic.toLowerCase().replace(/\s+/g, '-')}`}>
              {topic}
            </Badge>
          )}
          <span className="text-sm text-muted-foreground" data-testid="text-timestamp">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <Card className="border-l-4 border-l-primary p-6 space-y-6">
          {/* Definition Section */}
          {explanation.definition && (
            <div className="space-y-3" data-testid="section-definition">
              <h3 className="text-lg font-semibold">Definition</h3>
              <div className="rounded-md bg-muted p-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>
                    {explanation.definition}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {/* Explanation Section */}
          <div className="space-y-3" data-testid="section-explanation">
            <h3 className="text-lg font-semibold">Step-by-Step Explanation</h3>
            <div className="rounded-md bg-muted p-4">
              <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed">
                <ReactMarkdown>
                  {explanation.explanation}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Code Example Section */}
          {explanation.codeExample && (
            <div className="space-y-3" data-testid="section-code-example">
              <h3 className="text-lg font-semibold">Code Example</h3>
              <CodeBlock code={explanation.codeExample} />
            </div>
          )}

          {/* Summary Section */}
          {explanation.summary && (
            <div className="space-y-3" data-testid="section-summary">
              <h3 className="text-lg font-semibold">Key Points</h3>
              <div class="rounded-md bg-muted p-4">
                <div class="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>
                    {explanation.summary}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load Prism.js for syntax highlighting
    if (typeof window !== 'undefined' && (window as any).Prism) {
      (window as any).Prism.highlightAll();
    }
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <Button
        data-testid="button-copy-code"
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
      <pre className="rounded-md p-4 overflow-x-auto bg-[#2d2d2d] text-white">
        <code className="language-javascript text-sm font-mono">{code}</code>
      </pre>
    </div>
  );
}
