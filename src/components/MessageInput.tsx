import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

export const MessageInput = ({
    message,
    setMessage,
    onSend,
    inputRef,
}: {
    message: string;
    setMessage: (value: string) => void;
    onSend: () => void;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                    <Textarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about the video content..."
                        className="min-h-[60px] max-h-[200px] pr-12 resize-none"
                        rows={1}
                    />
                    <Button
                        onClick={onSend}
                        disabled={!message.trim()}
                        size="icon"
                        className="absolute right-2 bottom-2 h-8 w-8 bg-red-600 hover:bg-red-700 text-white"
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
};
