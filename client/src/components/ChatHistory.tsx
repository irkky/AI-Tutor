import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Clock } from "lucide-react";
import { ConversationWithExplanation } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChatHistoryProps {
  conversations: ConversationWithExplanation[];
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onDownloadHistory: () => void;
}

export function ChatHistory({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onDownloadHistory,
}: ChatHistoryProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center space-y-4">
        <Clock className="w-12 h-12 mx-auto text-muted-foreground/50" />
        <div className="space-y-2">
          <p className="text-sm font-medium">No history yet</p>
          <p className="text-xs text-muted-foreground">
            Your conversations will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 py-4">
          {conversations.map((conversation) => {
            const isActive = conversation.id === currentConversationId;
            const firstLine = conversation.question.split('\n')[0];
            const truncated = firstLine.length > 60 
              ? firstLine.substring(0, 60) + '...' 
              : firstLine;

            return (
              <div
                key={conversation.id}
                data-testid={`history-item-${conversation.id}`}
                className={`group rounded-lg p-3 cursor-pointer transition-all hover-elevate ${
                  isActive ? 'border-l-4 border-l-primary bg-sidebar-accent' : ''
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium truncate" data-testid="text-conversation-question">
                      {truncated}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {conversation.topic && (
                        <Badge variant="outline" className="text-xs">
                          {conversation.topic}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(conversation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        data-testid={`button-delete-${conversation.id}`}
                        size="icon"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this conversation.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          data-testid="button-download-history"
          onClick={onDownloadHistory}
          variant="outline"
          className="w-full gap-2"
        >
          <Download className="w-4 h-4" />
          Download History
        </Button>
      </div>
    </div>
  );
}
