import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import type { ChatRoomInfo, Message, PromptSuggestion } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Youtube, ArrowLeft } from "lucide-react";
import { PromptSuggestions } from "./PromptSuggestions";
import { VideoSection } from "./VideoSection";
import { ChatMessages } from "./ChatMessages";
import { MessageInput } from "./MessageInput";

const Header = () => (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-3 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
                <a href="/">
                    <ArrowLeft className="h-5 w-5" />
                </a>
            </Button>
            <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-lg">YoutubeGPT</span>
            </div>
        </div>
    </header>
);

export default function ChatroomPage() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [videoInfo, setVideoInfo] = useState<ChatRoomInfo | null>(null);
    const [seekTime, setSeekTime] = useState(0);
    const [promptSuggestions, setPromptSuggestions] = useState<
        PromptSuggestion[]
    >([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const params = useParams();

    // Effects
    useEffect(() => {
        // Scroll to bottom when messages change
        if (messagesEndRef.current && scrollAreaRef.current) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages]);

    useEffect(() => {
        // Auto-resize textarea
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = `${Math.min(
                inputRef.current.scrollHeight,
                200
            )}px`;
        }
    }, [message]);

    useEffect(() => {
        const fetchChatroomInfo = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `http://localhost:8000/api/chatrooms/${params.vidId}`
                );
                setVideoInfo(response.data["vid_chat"]);
                setMessages(response.data["messages"]);
            } catch (error) {
                console.error("Failed to fetch chatroom info:", error);
                toast.error("Failed to load chatroom data");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.vidId) {
            fetchChatroomInfo();
        }
    }, [params.vidId]);

    // Handlers
    const handleSendMessage = async (messageContent?: string) => {
        const messageToSend = messageContent || message;
        if (!messageToSend.trim() || !params.vidId) return;

        // Create user message
        const userMessage: Message = {
            id: `user_${Date.now()}`,
            vid_id: params.vidId,
            sent_by: "user",
            content: messageToSend,
            created_at: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setMessage("");

        // Create empty bot message placeholder
        const botMessage: Message = {
            id: `bot_${Date.now()}`,
            vid_id: params.vidId,
            sent_by: "bot",
            content: "",
            created_at: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);

        const controller = new AbortController();

        try {
            const res = await fetch(
                `http://localhost:8000/api/chatrooms/${params.vidId}/query`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query: messageToSend }),
                    signal: controller.signal,
                }
            );

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            // Handle streaming response
            const reader = res.body?.getReader();
            if (!reader) return;

            const decoder = new TextDecoder();
            let accumulatedContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedContent += chunk;

                // Update bot message with streaming content
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === botMessage.id
                            ? { ...msg, content: accumulatedContent }
                            : msg
                    )
                );
            }
        } catch (err) {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === botMessage.id
                        ? {
                              ...msg,
                              content: "Error processing request",
                              error:
                                  err instanceof Error
                                      ? err.message
                                      : "Unknown error",
                          }
                        : msg
                )
            );
            console.error("API Error:", err);
        } finally {
            controller.abort();
        }
    };

    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(content);
        toast.success("Copied");
    };

    const fetchPromptSuggestions = async () => {
        if (messages.length === 0) {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/chatrooms/${params.vidId}/prompt-suggestions`
                );
                setPromptSuggestions(response.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Failed to fetch prompt suggestions:", error);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        fetchPromptSuggestions();
    }, [messages.length, params.vidId]);

    return (
        <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
            <Header />
            <div className="flex flex-col md:flex-row flex-1 min-h-0">
                <VideoSection
                    videoInfo={videoInfo}
                    seekTime={seekTime}
                    setSeekTime={setSeekTime}
                />
                <div className="w-full md:w-2/5 lg:w-3/5 flex flex-col border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 min-h-0">
                    <div className="flex flex-col h-full">
                        <ChatMessages
                            messages={messages}
                            messagesEndRef={messagesEndRef}
                            scrollAreaRef={scrollAreaRef}
                            onCopyMessage={handleCopyMessage}
                        />
                        {showSuggestions && messages.length === 0 && (
                            <PromptSuggestions
                                suggestions={promptSuggestions}
                                onSelectPrompt={async (prompt) => {
                                    setMessage(prompt);
                                    await handleSendMessage(prompt);
                                }}
                            />
                        )}
                        <MessageInput
                            message={message}
                            setMessage={setMessage}
                            onSend={handleSendMessage}
                            inputRef={inputRef}
                        />
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
