import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, MessageSquare } from "lucide-react";
import VideoPlayer from "./video-player";
import VideoInfo from "./video-info";
import VideoTranscript from "./video-transcript";

interface VideoSectionProps {
    videoInfo: {
        title: string;
        channel: string;
        views: string;
        published: string;
        description: string;
        url: string;
    };
    className?: string;
}

export default function VideoSection({
    videoInfo,
    className = "",
}: VideoSectionProps) {
    return (
        <div className={`flex flex-col ${className}`}>
            <VideoPlayer
                title={videoInfo.title}
                channel={videoInfo.channel}
                views={videoInfo.views}
            />

            <div className="flex-1 overflow-hidden border-r border-slate-200 dark:border-slate-700">
                <Tabs defaultValue="info" className="w-full h-full">
                    <div className="flex px-4 border-b border-slate-200 dark:border-slate-700">
                        <TabsList className="h-12">
                            <TabsTrigger
                                value="info"
                                className="flex items-center gap-2"
                            >
                                <Info className="h-4 w-4" /> Video Info
                            </TabsTrigger>
                            <TabsTrigger
                                value="transcript"
                                className="flex items-center gap-2"
                            >
                                <MessageSquare className="h-4 w-4" /> Transcript
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent
                        value="info"
                        className="p-4 h-full overflow-auto"
                    >
                        <VideoInfo videoInfo={videoInfo} />
                    </TabsContent>
                    <TabsContent
                        value="transcript"
                        className="p-4 h-full overflow-auto"
                    >
                        <VideoTranscript />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
