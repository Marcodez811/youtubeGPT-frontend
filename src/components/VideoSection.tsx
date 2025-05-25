import { ChatRoomInfo } from "@/lib/types";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Info, Lightbulb } from "lucide-react";
import YouTubePlayWrapper from "./YouTubePlayWrapper";
import Linkify from "react-linkify";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/components/ui/separator";

const formatStart = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().slice(11, 19);
};

const componentDecorator = (href: string, text: string, key: number) => (
    <a
        href={href}
        key={key}
        target="_blank"
        className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        rel="noreferrer"
    >
        {text}
    </a>
);

export const VideoSection = ({
    videoInfo,
    seekTime,
    setSeekTime,
}: {
    videoInfo: ChatRoomInfo | null;
    seekTime: number;
    setSeekTime: (time: number) => void;
}) => {
    // Track current playback time
    const [currentTime, setCurrentTime] = useState(0);

    // Function to determine if a transcript chunk is active
    const isActiveChunk = (chunk: any) => {
        if (!videoInfo) return false;

        // Find the next chunk to determine the end time of current chunk
        const chunkIndex = videoInfo.transcript_wts.findIndex(
            (c) => c.start === chunk.start
        );
        const nextChunk = videoInfo.transcript_wts[chunkIndex + 1];

        // Calculate end time (either next chunk start or current + duration)
        const endTime = nextChunk
            ? nextChunk.start
            : chunk.start + chunk.duration;

        // Return true if current time is within this chunk's range
        return currentTime >= chunk.start && currentTime < endTime;
    };

    // Handle time updates from the YouTube player
    const handleTimeUpdate = (time: number) => {
        setCurrentTime(time);
    };

    return (
        <div className="w-full md:w-3/5 lg:w-2/5 flex flex-col min-h-0">
            {/* Video Player - Fixed aspect ratio */}
            <div className="relative bg-black aspect-video w-full flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                    {videoInfo && (
                        <YouTubePlayWrapper
                            sourceId={videoInfo?.id}
                            seekTime={seekTime > 0 ? seekTime : undefined}
                            onTimeUpdate={handleTimeUpdate}
                        />
                    )}
                </div>
            </div>

            {/* Video Info Tabs - Takes remaining height */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <Tabs defaultValue="info" className="flex flex-col h-full">
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
                            <Linkify componentDecorator={componentDecorator}>
                                {videoInfo?.description
                                    ? videoInfo?.description
                                    : "No description available."}
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
                        <Separator className="my-4" />
                        <div className="space-y-4">
                            {videoInfo?.transcript_wts.map((chunk, idx) => {
                                const active = isActiveChunk(chunk);
                                return (
                                    <div
                                        key={idx}
                                        className={`space-y-1 p-2 rounded-md transition-colors ${
                                            active
                                                ? "bg-pink-100 text-red-700 dark:bg-pink-900/20"
                                                : ""
                                        }`}
                                    >
                                        <p
                                            className={`${
                                                active
                                                    ? "text-red-700"
                                                    : "text-slate-500"
                                            } hover:text-red-700 cursor-pointer text-xs dark:text-slate-400`}
                                            onClick={() =>
                                                setSeekTime(chunk.start)
                                            }
                                        >
                                            {formatStart(chunk.start)}
                                        </p>
                                        <p
                                            className={`text-sm ${
                                                active ? "font-medium" : ""
                                            }`}
                                        >
                                            {chunk.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="summary"
                        className="flex-1 overflow-auto p-4"
                    >
                        <h2 className="text-xl font-bold mb-4">Overview</h2>
                        <Separator className="my-4" />
                        <div className="space-y-4">
                            <Markdown remarkPlugins={[remarkGfm]}>
                                {videoInfo?.summary}
                            </Markdown>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
