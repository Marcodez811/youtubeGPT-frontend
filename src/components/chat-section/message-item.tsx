import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThumbsUp, ThumbsDown, Copy, MoreHorizontal } from "lucide-react";
import Markdown from "react-markdown";

interface Message {
    id: number;
    role: string;
    content: string;
    timestamp: Date;
}

interface MessageItemProps {
    message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div
            className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`flex gap-3 max-w-[85%] ${
                    message.role === "user" ? "flex-row-reverse" : ""
                }`}
            >
                {message.role !== "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-red-100 text-red-600">
                            AI
                        </AvatarFallback>
                    </Avatar>
                )}
                {message.role === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                            U
                        </AvatarFallback>
                    </Avatar>
                )}
                <div
                    className={`space-y-1 ${
                        message.role === "user" ? "items-end" : ""
                    }`}
                >
                    <div
                        className={`rounded-lg p-3 ${
                            message.role === "user"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-slate-800 dark:text-slate-100"
                                : message.role === "system"
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                                : "bg-red-50 dark:bg-red-900/20 text-slate-800 dark:text-slate-100 border border-red-100 dark:border-red-900/30"
                        }`}
                    >
                        <div className="whitespace-pre-wrap">
                            <Markdown>{message.content}</Markdown>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{formatTime(message.timestamp)}</span>
                        {message.role === "assistant" && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    aria-label="Like message"
                                >
                                    <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    aria-label="Dislike message"
                                >
                                    <ThumbsDown className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    aria-label="Copy message"
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            aria-label="More options"
                                        >
                                            <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            Regenerate response
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Save to notes
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Report issue
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
