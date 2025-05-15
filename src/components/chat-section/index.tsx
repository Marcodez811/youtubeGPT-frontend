import toast, { Toaster } from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Youtube,
    Send,
    Copy,
    ArrowLeft,
    Book,
    Info,
    RotateCcw,
    Lightbulb,
} from "lucide-react";
import axios from "axios";
import { useParams } from "react-router";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Linkify from "react-linkify";
import YouTubePlayWrapper from "../YouTubePlayWrapper";

type ChatRoomInfo = {
    id: string;
    url: string;
    title: string;
    transcript: string;
    description: string;
    summary: string;
    transcript_wts: Array<TranscriptWTS>;
};

type TranscriptWTS = {
    text: string;
    start: number;
    duration: number;
};

interface Message {
    id: string;
    vid_id: string;
    sent_by: string;
    content: string;
    created_at: Date;
}

const componentDecorator = (href: string, text: string, key: number) => (
    <a
        href={href}
        key={key}
        target="_blank"
        className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
    >
        {text}
    </a>
);

const formatStart = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().slice(11, 19);
};

export default function ChatroomPage() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [videoInfo, setvideoInfo] = useState<ChatRoomInfo | null>(null);
    const [seekTime, setSeekTime] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const params = useParams();

    useEffect(() => {
        // Improved scroll behavior that's more reliable with growing content
        if (messagesEndRef.current && scrollAreaRef.current) {
            // Small timeout to ensure DOM has updated
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages]);

    useEffect(() => {
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
            const response = await axios.get(
                `http://localhost:8000/api/chatrooms/${params.vidId}`
            );
            setvideoInfo(response.data["vid_chat"]);
            setMessages(response.data["messages"]);
        };
        fetchChatroomInfo();
    }, []);

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        if (!params.vidId) return;
        // Create user message object
        const userMessage = {
            id: `user_${Date.now()}`,
            vid_id: params.vidId, // Add video ID to match backend model
            sent_by: "user", // Matches MessageSender.USER enum
            content: message,
            created_at: new Date(),
        };

        // Optimistically add user message
        setMessages((prev) => [...prev, userMessage]);
        setMessage("");

        // Create empty bot message placeholder
        const botMessage = {
            id: `bot_${Date.now()}`,
            vid_id: params.vidId, // Add video ID to match backend model
            sent_by: "bot", // Matches MessageSender.BOT enum
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
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: message, // Send just the raw message
                    }),
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
            // Update bot message with error
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const limitMessages = (msgs: Message[], limit = 50) => {
        if (msgs.length <= limit) return msgs;
        return msgs.slice(msgs.length - limit);
    };

    return (
        <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
            {/* Header - Fixed height */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-3 px-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <a href="/">
                            <ArrowLeft className="h-5 w-5" />
                        </a>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Youtube className="h-5 w-5 text-red-600" />
                        <span className="font-semibold text-lg">
                            YoutubeGPT
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content - Takes remaining height */}
            <div className="flex flex-col md:flex-row flex-1 min-h-0">
                {/* Video Section - Fixed proportional width */}
                <div className="w-full md:w-3/5 lg:w-2/5 flex flex-col min-h-0">
                    {/* Video Player - Fixed aspect ratio */}
                    <div className="relative bg-black aspect-video w-full flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {videoInfo && (
                                <YouTubePlayWrapper
                                    sourceId={videoInfo?.id}
                                    seekTime={
                                        seekTime > 0 ? seekTime : undefined
                                    }
                                />
                            )}
                        </div>
                    </div>

                    {/* Video Info Tabs - Takes remaining height */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <Tabs
                            defaultValue="info"
                            className="flex flex-col h-full"
                        >
                            <div className="px-2 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                                <TabsList className="flex gap-2 h-12">
                                    <TabsTrigger
                                        value="info"
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <Info />
                                        Video Info
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="transcript"
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <Book />
                                        Transcript
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="summary"
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <Lightbulb />
                                        Summary
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent
                                value="info"
                                className="flex-1 overflow-auto p-4"
                            >
                                <h2 className="text-xl font-bold mb-2">
                                    {videoInfo?.title}
                                </h2>
                                <Separator className="my-4" />
                                <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                                    <Linkify
                                        componentDecorator={componentDecorator}
                                    >
                                        {videoInfo?.description}
                                    </Linkify>
                                </p>
                            </TabsContent>
                            <TabsContent
                                value="transcript"
                                className="flex-1 overflow-auto p-4"
                            >
                                <h2 className="text-xl font-bold mb-4">
                                    Video Transcript
                                </h2>
                                <div className="space-y-4">
                                    {videoInfo?.transcript_wts.map(
                                        (chunk, idx) => (
                                            <div
                                                key={idx}
                                                className="space-y-1"
                                            >
                                                <p
                                                    className="hover:text-red-700 cursor-pointer text-xs text-slate-500 dark:text-slate-400"
                                                    onClick={() => {
                                                        setSeekTime(
                                                            chunk.start
                                                        );
                                                    }}
                                                >
                                                    {formatStart(chunk.start)}
                                                </p>
                                                <p className="text-sm">
                                                    {chunk.text}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent
                                value="summary"
                                className="flex-1 overflow-auto p-4"
                            >
                                <h2 className="text-xl font-bold mb-4">
                                    Overview
                                </h2>
                                <div className="space-y-4">
                                    <Markdown remarkPlugins={[remarkGfm]}>
                                        {videoInfo?.summary}
                                    </Markdown>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Chat Section - Takes remaining width and full height */}
                <div className="w-full md:w-2/5 lg:w-3/5 flex flex-col border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 min-h-0">
                    {/* Chat container - Fixed layout with scrollable messages */}
                    <div className="flex flex-col h-full">
                        {/* Messages - Scrollable area that takes remaining height */}
                        <div
                            className="flex-1 min-h-0 overflow-hidden"
                            ref={scrollAreaRef}
                        >
                            <ScrollArea className="h-full p-4">
                                <div className="space-y-4 pb-2">
                                    {limitMessages(messages).map(
                                        (msg: Message, idx) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${
                                                    msg.sent_by === "user"
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >
                                                <div
                                                    className={`flex gap-3 max-w-[85%] ${
                                                        msg.sent_by === "user"
                                                            ? "flex-row-reverse"
                                                            : ""
                                                    }`}
                                                >
                                                    {msg.sent_by !== "user" && (
                                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                                            <AvatarFallback className="bg-red-100 text-red-600">
                                                                AI
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    {msg.sent_by === "user" && (
                                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                                U
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    <div
                                                        className={`space-y-1 ${
                                                            msg.sent_by ===
                                                            "user"
                                                                ? "items-end"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className={`rounded-lg p-3 ${
                                                                msg.sent_by ===
                                                                "user"
                                                                    ? "bg-blue-100 dark:bg-blue-900/30 text-slate-800 dark:text-slate-100"
                                                                    : msg.sent_by ===
                                                                      "system"
                                                                    ? "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                                                                    : "bg-red-50 dark:bg-red-900/20 text-slate-800 dark:text-slate-100 border border-red-100 dark:border-red-900/30"
                                                            }`}
                                                        >
                                                            <div className="whitespace-pre-line">
                                                                <Markdown
                                                                    remarkPlugins={[
                                                                        remarkGfm,
                                                                    ]}
                                                                >
                                                                    {
                                                                        msg.content
                                                                    }
                                                                </Markdown>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                            <span>
                                                                {formatTime(
                                                                    new Date(
                                                                        msg.created_at
                                                                    )
                                                                )}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(
                                                                            msg.content
                                                                        );
                                                                        toast.success(
                                                                            "Copied"
                                                                        );
                                                                    }}
                                                                >
                                                                    <Copy className="h-3 w-3" />
                                                                </Button>
                                                                {msg.sent_by ===
                                                                    "bot" &&
                                                                    idx ===
                                                                        messages.length -
                                                                            1 && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-6 w-6"
                                                                        >
                                                                            <RotateCcw className="h-3 w-3" />
                                                                        </Button>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Message Input - Fixed height at bottom */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                            <div className="flex items-end gap-2">
                                <div className="flex-1 relative">
                                    <Textarea
                                        ref={inputRef}
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask about the video content..."
                                        className="min-h-[60px] max-h-[200px] pr-12 resize-none"
                                        rows={1}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!message.trim()}
                                        size="icon"
                                        className="absolute right-2 bottom-2 h-8 w-8 bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400">
                                YoutubeGPT may produce inaccurate information
                                about the video content.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
