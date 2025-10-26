import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QuestionInput } from "@/components/QuestionInput";
import { AIResponse } from "@/components/AIResponse";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ChatHistory } from "@/components/ChatHistory";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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
import { History, X, Plus, Trash2 } from "lucide-react";
import { ConversationWithExplanation } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [currentConversationId, setCurrentConversationId] = useState<string>();
  const [historyOpen, setHistoryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch all conversations
  const { data: conversations = [] } = useQuery<ConversationWithExplanation[]>({
    queryKey: ["/api/conversations"],
  });

  // Fetch current conversation
  const { data: currentConversation } = useQuery<ConversationWithExplanation>({
    queryKey: ["/api/conversations", currentConversationId],
    enabled: !!currentConversationId,
  });

  // Submit question mutation
  const submitQuestionMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/conversations", { question });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setCurrentConversationId(data.id);
      
      // Scroll to bottom after response
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth"
        });
      }, 100);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get response. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/conversations/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setCurrentConversationId(undefined);
      toast({
        title: "Deleted",
        description: "Conversation deleted successfully",
      });
    },
  });

  const handleSubmitQuestion = (question: string) => {
    submitQuestionMutation.mutate(question);
  };

  const handleExampleClick = (question: string) => {
    submitQuestionMutation.mutate(question);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    setHistoryOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversationMutation.mutate(id);
  };

  const handleDownloadHistory = () => {
    const dataStr = JSON.stringify(conversations, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-tutor-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Chat history downloaded successfully",
    });
  };

  const handleNewChat = () => {
    setCurrentConversationId(undefined);
    toast({
      title: "New Chat",
      description: "Started a new conversation",
    });
  };

  const handleRenameConversation = (id: string, newName: string) => {
    // TODO: Implement rename functionality
    toast({
      title: "Renamed",
      description: "Conversation renamed successfully",
    });
  };

  const showEmptyState = !currentConversation && !submitQuestionMutation.isPending;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* History Sidebar - Desktop */}
      <div className="hidden lg:block w-80 border-r bg-sidebar/50 backdrop-blur-sm">
        <div className="h-16 border-b px-4 flex items-center bg-gradient-to-r from-sidebar to-sidebar/80">
          <h2 className="font-semibold text-sidebar-foreground">Chat History</h2>
        </div>
        <ChatHistory
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onDownloadHistory={handleDownloadHistory}
          onRenameConversation={handleRenameConversation}
        />
      </div>

      {/* History Sidebar - Mobile Overlay */}
      {historyOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-in slide-in-from-left duration-300">
          <div className="h-16 border-b px-4 flex items-center justify-between bg-gradient-to-r from-background to-muted/20">
            <h2 className="font-semibold">Chat History</h2>
            <Button
              data-testid="button-close-history"
              size="icon"
              variant="ghost"
              onClick={() => setHistoryOpen(false)}
              className="hover:bg-muted/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <ChatHistory
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onDownloadHistory={handleDownloadHistory}
            onRenameConversation={handleRenameConversation}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b px-4 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-background via-background to-muted/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button
              data-testid="button-toggle-history"
              size="icon"
              variant="ghost"
              className="lg:hidden hover:bg-muted/50 transition-colors"
              onClick={() => setHistoryOpen(!historyOpen)}
            >
              <History className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Tutor
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentConversationId && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    data-testid="button-delete-conversation"
                    variant="destructive"
                    size="icon"
                    className="h-9 w-9 hover:scale-105 transition-transform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                      onClick={() => handleDeleteConversation(currentConversationId)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button
              data-testid="button-new-chat"
              onClick={handleNewChat}
              variant="outline"
              className="gap-2 hover:scale-105 transition-all duration-200 hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>
        </header>

        {/* Conversation Area */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="min-h-full flex flex-col">
            {showEmptyState ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <EmptyState onExampleClick={handleExampleClick} />
              </div>
            ) : (
              <div className="flex-1 py-8 space-y-8">
                {currentConversation && currentConversation.explanation && (
                  <AIResponse
                    question={currentConversation.question}
                    explanation={currentConversation.explanation}
                    topic={currentConversation.topic as any}
                    timestamp={new Date(currentConversation.createdAt)}
                  />
                )}
                {submitQuestionMutation.isPending && <LoadingState />}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Question Input - Fixed at bottom */}
        <div className="border-t bg-background/80 backdrop-blur-sm flex-shrink-0">
          <QuestionInput
            onSubmit={handleSubmitQuestion}
            isLoading={submitQuestionMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
