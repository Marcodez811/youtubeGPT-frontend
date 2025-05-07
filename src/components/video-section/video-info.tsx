import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface VideoInfoProps {
    videoInfo: {
        title: string;
        channel: string;
        views: string;
        published: string;
        description: string;
    };
}

export default function VideoInfo({ videoInfo }: VideoInfoProps) {
    return (
        <>
            <h2 className="text-xl font-bold mb-2">{videoInfo.title}</h2>
            <div className="flex items-center gap-2 mb-4">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>
                        {videoInfo.channel.substring(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">{videoInfo.channel}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {videoInfo.views} • {videoInfo.published}
                    </p>
                </div>
            </div>
            <Separator className="my-4" />
            <p className="text-slate-700 dark:text-slate-300">
                {videoInfo.description}
            </p>
        </>
    );
}
