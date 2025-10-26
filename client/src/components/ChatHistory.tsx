import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Trash2, 
  Clock, 
  MoreVertical, 
  Edit2
} from "lucide-react";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface ChatHistoryProps {
  conversations: ConversationWithExplanation[];
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onDownloadHistory: () => void;
  onRenameConversation?: (id: string, newName: string) => void;
}

export function ChatHistory({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onDownloadHistory,
  onRenameConversation,
}: ChatHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim() && onRenameConversation) {
      onRenameConversation(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground/60" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <p className="text-base font-medium text-foreground">No history yet</p>
          <p className="text-sm text-muted-foreground">
            Your conversations will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-2 sm:px-4">
        <div className="space-y-1 sm:space-y-2 py-2 sm:py-4">
          {conversations.map((conversation) => {
            const isActive = conversation.id === currentConversationId;
            const isEditing = editingId === conversation.id;
            const firstLine = conversation.question.split('\n')[0];
            const truncated = firstLine.length > 80 
              ? firstLine.substring(0, 80) + '...' 
              : firstLine;

            return (
              <ContextMenu key={conversation.id}>
                <ContextMenuTrigger asChild>
                  <div
                    data-testid={`history-item-${conversation.id}`}
                    className={`group rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-md ${
                      isActive 
                        ? 'border-l-4 border-l-primary bg-gradient-to-r from-sidebar-accent to-sidebar-accent/50 shadow-lg' 
                        : 'hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10'
                    }`}
                    onClick={() => !isEditing && onSelectConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                        {isEditing ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleSaveEdit}
                            className="text-sm font-medium h-7 sm:h-8"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p className="text-sm font-medium leading-relaxed line-clamp-2 sm:line-clamp-1" data-testid="text-conversation-question">
                            {truncated}
                          </p>
                        )}
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          {conversation.topic && (
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-colors"
                            >
                              {conversation.topic}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">
                              {new Date(conversation.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Overflow Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 hover:scale-110 hover:bg-muted/50 h-7 w-7 sm:h-8 sm:w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(conversation.id, truncated);
                            }}
                            className="gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                className="gap-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="animate-in zoom-in-95 duration-200">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this conversation.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDeleteConversation(conversation.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </ContextMenuTrigger>
                
                {/* Context Menu */}
                <ContextMenuContent className="w-40">
                  <ContextMenuItem 
                    onClick={() => handleStartEdit(conversation.id, truncated)}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Rename
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem 
                    onClick={() => onDeleteConversation(conversation.id)}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-2 sm:p-4 border-t bg-gradient-to-r from-sidebar to-sidebar/80">
        <Button
          data-testid="button-download-history"
          onClick={onDownloadHistory}
          variant="outline"
          className="w-full gap-2 hover:scale-105 transition-all duration-200 hover:shadow-md text-xs sm:text-sm h-8 sm:h-9"
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Download History</span>
          <span className="sm:hidden">Download</span>
        </Button>
      </div>
    </div>
  );
}
