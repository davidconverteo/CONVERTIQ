"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrainCircuit, Send, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { askChatbot } from "@/ai/flows/chatbot-flow";
import Image from "next/image";

type Message = {
  text: string;
  sender: "user" | "ai";
};

function ChatWindow({ isOpen, onToggle, messages, isLoading, input, setInput, handleSendMessage, messagesEndRef }: any) {
    return (
        <div className={cn(
          "fixed bottom-20 left-4 z-50 transition-all sm:w-96 w-80",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}>
          <Card className="flex h-[70vh] max-h-[600px] flex-col shadow-2xl">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BrainCircuit className="h-5 w-5 text-primary" /> Assistant ConvertIQ
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggle}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((msg: Message, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-end gap-2",
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3 text-sm",
                          msg.sender === "user"
                            ? "rounded-br-none bg-primary text-primary-foreground"
                            : "rounded-bl-none bg-muted"
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                     <div className="flex items-end gap-2 justify-start">
                       <div className="rounded-lg p-3 text-sm bg-muted flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Réflexion...</span>
                       </div>
                     </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question..."
                  autoComplete="off"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
    );
}

export default function ChatbotTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const addWelcomeMessage = useCallback(() => {
    setMessages([
      {
        text: "Bonjour ! Je suis l'assistant ConvertIQ. Comment puis-je vous aider ?",
        sender: "ai",
      },
    ]);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addWelcomeMessage();
    }
  }, [isOpen, messages, addWelcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askChatbot({ prompt: input });
      const aiMessage: Message = { text: response.response, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = {
        text: "Désolé, une erreur est survenue. Veuillez réessayer.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className={cn(
          'flex w-full items-center gap-4 rounded-md px-4 py-2 text-sm font-medium transition-colors',
          'hover:bg-sidebar-accent/50'
        )}
      >
        <Image src="https://i.postimg.cc/BvSXnkMw/Convert-IQ-logo.png" alt="ConvertIQ Logo" width={20} height={20} className="object-contain brightness-[10] contrast-[1.2]" />
        <span>Assistant IA</span>
      </button>
      <ChatWindow 
        isOpen={isOpen}
        onToggle={handleToggle}
        messages={messages}
        isLoading={isLoading}
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
      />
    </>
  );
}