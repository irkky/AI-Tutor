import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 animate-in fade-in-50 duration-500">
      {/* User Question Skeleton */}
      <div className="flex justify-end">
        <div className="h-20 w-96 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 animate-pulse"></div>
      </div>

      {/* AI Response Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-24 rounded-full bg-gradient-to-r from-muted to-muted/50 animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div className="h-4 w-16 bg-gradient-to-r from-muted to-muted/50 animate-pulse rounded"></div>
          </div>
        </div>

        <Card className="border-l-4 border-l-primary p-8 space-y-8 bg-gradient-to-br from-card to-card/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-blue-500 animate-ping"></div>
            </div>
            <div className="space-y-1">
              <span className="text-base font-medium text-foreground" data-testid="text-ai-thinking">AI is thinking...</span>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:0ms]"></div>
                <div className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:150ms]"></div>
                <div className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:300ms]"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 animate-pulse"></div>
              <div className="h-6 w-32 bg-gradient-to-r from-muted to-muted/50 animate-pulse rounded"></div>
            </div>
            <div className="h-24 w-full rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse"></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 animate-pulse"></div>
              <div className="h-6 w-48 bg-gradient-to-r from-muted to-muted/50 animate-pulse rounded"></div>
            </div>
            <div className="h-32 w-full rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse"></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
