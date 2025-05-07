import { Youtube } from "lucide-react";

interface VideoPlayerProps {
    title: string;
    channel: string;
    views: string;
}

export default function VideoPlayer({
    title,
    channel,
    views,
}: VideoPlayerProps) {
    return (
        <div className="relative bg-black aspect-video w-full">
            <div className="absolute inset-0 flex items-center justify-center">
                <Youtube className="h-16 w-16 text-red-600 opacity-50" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-2 rounded">
                <p className="font-medium">{title}</p>
                <p className="text-sm opacity-80">
                    {channel} • {views}
                </p>
            </div>
        </div>
    );
}
