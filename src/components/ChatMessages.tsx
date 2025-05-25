import { Message } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";

const limitMessages = (msgs: Message[], limit = 50) => {
    if (msgs.length <= limit) return msgs;
    return msgs.slice(msgs.length - limit);
};

export const ChatMessages = ({
    messages,
    messagesEndRef,
    scrollAreaRef,
    onCopyMessage,
}: {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    scrollAreaRef: React.RefObject<HTMLDivElement | null>;
    onCopyMessage: (content: string) => void;
}) => (
    <div className="flex-1 min-h-0 overflow-hidden" ref={scrollAreaRef}>
        <ScrollArea className="h-full p-4">
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-2 py-10">
                        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100">
                            Start the Conversation...
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Ask me anything about the video content
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 pb-2">
                    {limitMessages(messages).map((msg, idx) => (
                        <MessageItem
                            key={msg.id}
                            message={msg}
                            isLatest={idx === messages.length - 1}
                            onCopy={onCopyMessage}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </ScrollArea>
    </div>
);
