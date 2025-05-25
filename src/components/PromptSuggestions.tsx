import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { PromptSuggestion } from "@/lib/types";

export const PromptSuggestions = ({
    suggestions,
    onSelectPrompt,
}: {
    suggestions: PromptSuggestion[];
    onSelectPrompt: (prompt: string) => Promise<void>;
}) => {
    if (suggestions.length === 0) return null;

    return (
        <div className="p-6 space-y-4">
            {/* Suggestions */}
            <div className="space-y-3">
                <div className="flex flex-col flex-wrap gap-3">
                    {suggestions.map((suggestion, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            className="justify-start text-left h-auto py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-all duration-200 group w-full"
                            onClick={async () =>
                                await onSelectPrompt(suggestion.content)
                            }
                        >
                            <div className="flex items-start gap-3 w-full overflow-hidden">
                                <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
                                <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 break-words hyphens-auto whitespace-normal overflow-wrap-anywhere w-full">
                                    {suggestion.content}
                                </span>
                            </div>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Decorative element */}
            <div className="flex justify-center pt-2">
                <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
            </div>
        </div>
    );
};
