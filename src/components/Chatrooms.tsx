import { useNavigate } from "react-router";
import { Card, CardFooter } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

type ChatRoom = {
    id: string;
    title: string;
};

type ChatroomProps = {
    videos: ChatRoom[];
};

export const Chatrooms = ({ videos }: ChatroomProps) => {
    const navigate = useNavigate();

    return (
        <div className="h-screen mx-auto container px-12 py-12 bg-pink">
            <h1 className="text-3xl font-bold text-center mb-8">
                Current Video Chatrooms
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.map((video) => (
                    <Card
                        key={video.id}
                        className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer group"
                        onClick={() => navigate(`/v/${video.id}`)}
                    >
                        <div className="relative aspect-video">
                            <img
                                src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                <MessageCircle className="text-white w-12 h-12" />
                            </div>
                        </div>

                        <CardFooter className="p-4">
                            <h3 className="font-medium line-clamp-2">
                                {video.title}
                            </h3>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};
