import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageInputProps {
    onSendMessage: (message: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        onSendMessage(message);
        setMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                    <Textarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Chat about the video content..."
                        className="min-h-[60px] max-h-[200px] pr-12 resize-none"
                        rows={1}
                        aria-label="Message input"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        size="icon"
                        className="absolute right-2 bottom-2 h-8 w-8 bg-red-600 hover:bg-red-700 text-white"
                        aria-label="Send message"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400">
                YoutubeGPT may produce inaccurate information about the video
                content.
            </div>
        </div>
    );
}
