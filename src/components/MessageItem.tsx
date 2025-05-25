import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw } from "lucide-react";
import Markdown from "react-markdown";
import { Message } from "@/lib/types";
import remarkGfm from "remark-gfm";

const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const MessageItem = ({
    message,
    isLatest,
    onCopy,
}: {
    message: Message;
    isLatest: boolean;
    onCopy: (content: string) => void;
}) => {
    const isUser = message.sent_by === "user";
    const isSystem = message.sent_by === "system";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`flex gap-3 max-w-[85%] ${
                    isUser ? "flex-row-reverse" : ""
                }`}
            >
                <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback
                        className={
                            isUser
                                ? "bg-blue-100 text-blue-600"
                                : "bg-red-100 text-red-600"
                        }
                    >
                        {isUser ? "U" : "AI"}
                    </AvatarFallback>
                </Avatar>

                <div className={`space-y-1 ${isUser ? "items-end" : ""}`}>
                    <div
                        className={`rounded-lg p-3 ${
                            isUser
                                ? "bg-blue-100 dark:bg-blue-900/30 text-slate-800 dark:text-slate-100"
                                : isSystem
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                                : "bg-red-50 dark:bg-red-900/20 text-slate-800 dark:text-slate-100 border border-red-100 dark:border-red-900/30"
                        }`}
                    >
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                        </Markdown>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{formatTime(new Date(message.created_at))}</span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => onCopy(message.content)}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>

                            {!isUser && isLatest && (
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
    );
};
