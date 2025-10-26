import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, BookOpen, Lightbulb, Code2, CheckCircle } from "lucide-react";
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
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8 animate-in fade-in-50 duration-500">
      {/* User Question */}
      <div className="flex justify-end">
        <div className="max-w-4xl rounded-2xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary-foreground font-bold text-sm">Q</span>
            </div>
            <p className="text-base leading-relaxed font-medium" data-testid="text-user-question">{question}</p>
          </div>
        </div>
      </div>

      {/* AI Response */}
      <div className="space-y-8">
        {/* Response Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {topic && (
              <Badge 
                variant="outline" 
                className="rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-colors duration-300 px-4 py-2" 
                data-testid={`badge-topic-${topic.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {topic}
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span data-testid="text-timestamp">
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Main Response Card */}
        <Card className="border-l-4 border-l-primary p-8 space-y-10 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Definition Section */}
          {explanation.definition && (
            <div className="space-y-6" data-testid="section-definition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Definition</h3>
                  <p className="text-sm text-muted-foreground mt-1">Core concept and meaning</p>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10 p-8 border border-blue-200/20 dark:border-blue-800/20">
                <div className="prose prose-lg max-w-none dark:prose-invert prose-blue dark:prose-blue">
                  <ReactMarkdown 
                    components={{
                      p: ({ children }) => <p className="text-base leading-relaxed mb-4">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-blue-700 dark:text-blue-300">{children}</strong>,
                      em: ({ children }) => <em className="italic text-blue-600 dark:text-blue-400">{children}</em>,
                    }}
                  >
                    {explanation.definition}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {/* Separator */}
          {explanation.definition && explanation.explanation && (
            <Separator className="my-8 bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent" />
          )}

          {/* Explanation Section */}
          <div className="space-y-6" data-testid="section-explanation">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Step-by-Step Explanation</h3>
                <p className="text-sm text-muted-foreground mt-1">Detailed breakdown and walkthrough</p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 p-8 border border-green-200/20 dark:border-green-800/20">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-green dark:prose-green">
                <ReactMarkdown 
                  components={{
                    p: ({ children }) => <p className="text-base leading-relaxed mb-4">{children}</p>,
                    ul: ({ children }) => <ul className="space-y-2 mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="space-y-2 mb-4">{children}</ol>,
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    li: ({ children }) => (
                      <li className="flex items-start gap-2 list-none">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>{children}</span>
                      </li>
                    ),
                    strong: ({ children }) => <strong className="font-semibold text-green-700 dark:text-green-300">{children}</strong>,
                    em: ({ children }) => <em className="italic text-green-600 dark:text-green-400">{children}</em>,
                    h1: ({ children }) => <h1 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4 mt-6">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3 mt-5">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold text-green-600 dark:text-green-400 mb-2 mt-4">{children}</h3>,
                  }}
                >
                  {explanation.explanation}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Code Example Section */}
          {explanation.codeExample && (
            <>
              <Separator className="my-8 bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent" />
              <div className="space-y-6" data-testid="section-code-example">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Code Example</h3>
                    <p className="text-sm text-muted-foreground mt-1">Practical implementation and usage</p>
                  </div>
                </div>
                <CodeBlock code={explanation.codeExample} />
              </div>
            </>
          )}

          {/* Summary Section */}
          {explanation.summary && (
            <>
              <Separator className="my-8 bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent" />
              <div className="space-y-6" data-testid="section-summary">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Key Points</h3>
                    <p className="text-sm text-muted-foreground mt-1">Important takeaways and summary</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-orange-50/50 to-red-50/30 dark:from-orange-950/20 dark:to-red-950/10 p-8 border border-orange-200/20 dark:border-orange-800/20">
                  <div className="prose prose-lg max-w-none dark:prose-invert prose-orange dark:prose-orange">
                    <ReactMarkdown 
                      components={{
                        p: ({ children }) => <p className="text-base leading-relaxed mb-4">{children}</p>,
                        ul: ({ children }) => <ul className="space-y-2 mb-4">{children}</ul>,
                        ol: ({ children }) => <ol className="space-y-2 mb-4">{children}</ol>,
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                        li: ({ children }) => (
                          <li className="flex items-start gap-2 list-none">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                            <span>{children}</span>
                          </li>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-orange-700 dark:text-orange-300">{children}</strong>,
                        em: ({ children }) => <em className="italic text-orange-600 dark:text-orange-400">{children}</em>,
                      }}
                    >
                      {explanation.summary}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </>
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

  // Detect language from code content
  const detectLanguage = (code: string) => {
    if (code.includes('function') || code.includes('const') || code.includes('let') || code.includes('var')) {
      return 'JavaScript';
    }
    if (code.includes('def ') || code.includes('import ') || code.includes('class ')) {
      return 'Python';
    }
    if (code.includes('public class') || code.includes('System.out')) {
      return 'Java';
    }
    if (code.includes('SELECT') || code.includes('FROM') || code.includes('WHERE')) {
      return 'SQL';
    }
    if (code.includes('<!DOCTYPE') || code.includes('<html') || code.includes('<div')) {
      return 'HTML';
    }
    if (code.includes('{') && code.includes('}') && code.includes('color:')) {
      return 'CSS';
    }
    return 'Code';
  };

  const language = detectLanguage(code);

  return (
    <div className="relative group rounded-2xl overflow-hidden border border-purple-200/20 dark:border-purple-800/20 shadow-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-50/80 to-pink-50/60 dark:from-purple-950/80 dark:to-pink-950/60 px-6 py-3 border-b border-purple-200/20 dark:border-purple-800/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{language}</span>
          </div>
        </div>
        <Button
          data-testid="button-copy-code"
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 bg-purple-100/50 hover:bg-purple-200/50 dark:bg-purple-900/50 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>
          )}
        </Button>
      </div>
      <pre className="p-8 overflow-x-auto bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
        <code className="language-javascript text-sm font-mono leading-relaxed">{code}</code>
      </pre>
    </div>
  );
}
