import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4 animate-in fade-in duration-300">
      {/* User Question Skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-20 w-96 rounded-2xl" />
      </div>

      {/* AI Response Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>

        <Card className="border-l-4 border-l-primary p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <span className="text-sm text-muted-foreground ml-2" data-testid="text-ai-thinking">AI is thinking...</span>
          </div>
          
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        </Card>
      </div>
    </div>
  );
}
