import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QuestionInput } from "@/components/QuestionInput";
import { AIResponse } from "@/components/AIResponse";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ChatHistory } from "@/components/ChatHistory";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { History, X } from "lucide-react";
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
      return response;
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

  const showEmptyState = !currentConversation && !submitQuestionMutation.isPending;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* History Sidebar - Desktop */}
      <div className="hidden lg:block w-80 border-r bg-sidebar">
        <div className="h-16 border-b px-4 flex items-center">
          <h2 className="font-semibold">Chat History</h2>
        </div>
        <ChatHistory
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onDownloadHistory={handleDownloadHistory}
        />
      </div>

      {/* History Sidebar - Mobile Overlay */}
      {historyOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="h-16 border-b px-4 flex items-center justify-between">
            <h2 className="font-semibold">Chat History</h2>
            <Button
              data-testid="button-close-history"
              size="icon"
              variant="ghost"
              onClick={() => setHistoryOpen(false)}
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
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b px-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              data-testid="button-toggle-history"
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setHistoryOpen(!historyOpen)}
            >
              <History className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">AI Tutor</h1>
          </div>
        </header>

        {/* Conversation Area */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="min-h-full flex flex-col">
            {showEmptyState ? (
              <div className="flex-1 flex items-center justify-center">
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
        <div className="border-t bg-background flex-shrink-0">
          <QuestionInput
            onSubmit={handleSubmitQuestion}
            isLoading={submitQuestionMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
