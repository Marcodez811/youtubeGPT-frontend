import { Button } from "@/components/ui/button";
import { Youtube, ArrowLeft } from "lucide-react";

export default function ChatHeader() {
    return (
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-3 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                    <a href="/">
                        <span className="sr-only">Go back</span>
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
}
