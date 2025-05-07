import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "./message-item";

interface Message {
    id: number;
    role: string;
    content: string;
    timestamp: Date;
}

interface MessageListProps {
    messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="h-full space-y-4">
            <ScrollArea className="flex-1 p-4">
                {messages.map((msg) => (
                    <MessageItem key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </ScrollArea>
        </div>
    );
}
