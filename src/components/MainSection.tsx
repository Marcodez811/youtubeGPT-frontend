import {
    Card,
    CardTitle,
    CardHeader,
    CardDescription,
    CardContent,
} from "./ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "./ui/tabs";
import { PlaySquare, Youtube } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";

type MainSectionType = {
    mainRef: React.RefObject<HTMLDivElement | null>;
};

type Chatroom = {
    id: string;
    title: string;
};

const fetchYouTubeTitle = async (url: string): Promise<string | null> => {
    try {
        const response = await axios.get("http://localhost:8000/get-title/", {
            params: { url },
        });
        return response.data.title;
    } catch (error) {
        console.error("Error fetching title:", error);
        return null;
    }
};

/**
 * returns whether the url is in valid format.
 * @param url the url of the video
 */
const validateURL = (url: string) => {
    return url.startsWith("https://www.youtube.com/watch?v=");
};

/**
 * returns whether the url is in valid format.
 * @param url the url of the video
 */
const getVideoId = (url: string) => {
    if (!validateURL(url)) return null;
    return url.split("https://www.youtube.com/watch?v=")[1].split("&")[0];
};

/**
 * returns whether the thumbnail is a valid image.
 * @param url the url of the thumbnail.
 */
const isImageValid = async (url: string): Promise<boolean> => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () =>
                reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    };
    try {
        await loadImage(url);
    } catch (error) {
        console.error("Source image load error:", error);
        return false;
    }
    return true;
};

export const MainSection = ({ mainRef }: MainSectionType) => {
    const [videoUrl, setVideoUrl] = useState("");
    // const [enhance, setEnhance] = useState(true);
    const [thumbnail, setThumbnail] = useState("");
    const [videoName, setVideoName] = useState("Fetching Video");
    const [loading, setLoading] = useState(false);
    const [typed, setTyped] = useState("");
    // const [playlistUrl, setPlaylistUrl] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const validateThumbnail = async () => {
            if (validateURL(videoUrl)) {
                const videoId = getVideoId(videoUrl);
                if (!videoId) return;
                const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                const isValid = await isImageValid(thumbnailUrl);
                const vidName = await fetchYouTubeTitle(videoUrl);
                if (isValid && vidName) {
                    setThumbnail(thumbnailUrl);
                    setVideoName(vidName);
                } else {
                    setThumbnail("");
                    setVideoName("Fetching Video");
                }
            }
        };

        validateThumbnail();
    }, [videoUrl]);

    return (
        <main
            ref={mainRef}
            className="h-screen flex justify-center items-center bg-gradient-to-br from-red-50 to-slate-100 px-4 py-16 scroll-mt-16"
        >
            <Card className="w-full max-w-3xl mx-auto shadow-xl border-2 border-slate-200 dark:border-slate-700">
                <CardHeader className="text-center rounded-t-lg">
                    <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                        <Youtube className="h-6 w-6 text-red-600" />
                        YoutubeGPT
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Create a chatroom to discuss educational YouTube content
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Tabs defaultValue="video" className="w-full">
                        <TabsList className="grid w-full grid-cols-1 mb-6">
                            <TabsTrigger
                                value="video"
                                className="cursor-pointer flex items-center gap-2"
                            >
                                <PlaySquare className="h-4 w-4" /> Single Video
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="video" className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">
                                    YouTube Video URL
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Paste the URL of an educational YouTube
                                    video you'd like to discuss
                                </p>
                            </div>
                            <div className="space-y-4">
                                <Input
                                    className="w-full"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={videoUrl}
                                    onChange={(e) => {
                                        setVideoUrl(e.target.value);
                                    }}
                                />
                                {/* <div className="flex flex-col items-center space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={enhance}
                                            onCheckedChange={() => {
                                                setEnhance(!enhance);
                                            }}
                                            id="enhance-btn"
                                            className="cursor-pointer"
                                        />
                                        <Label htmlFor="enhance-btn">
                                            Enhance Transcript
                                        </Label>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        AI rewrites the transcript into
                                        accessable format
                                    </p>
                                </div> */}
                                <div className="flex justify-center">
                                    <Button
                                        onClick={async () => {
                                            setLoading(true);
                                            try {
                                                const payload = {
                                                    url: videoUrl,
                                                };
                                                const result = await axios.post(
                                                    "http://localhost:8000/api/chatrooms/",
                                                    payload
                                                );
                                                const chatroomData: Chatroom =
                                                    result.data;
                                                navigate(
                                                    `/v/${chatroomData.id}`
                                                );
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        className="cursor-pointer bg-red-600 hover:bg-red-700 w-full sm:w-auto px-8"
                                        disabled={!validateURL(videoUrl)}
                                    >
                                        Create Video Chatroom
                                    </Button>
                                </div>
                            </div>

                            {validateURL(videoUrl) && (
                                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                        Preview:
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {thumbnail ? (
                                            <img
                                                className="rounded-md w-24 h-16 flex items-center justify-center"
                                                src={thumbnail}
                                                alt="Preview"
                                            />
                                        ) : (
                                            <div className="bg-slate-200 dark:bg-slate-700 rounded-md w-24 h-16 flex items-center justify-center">
                                                <Youtube className="h-6 w-6 text-red-600" />
                                            </div>
                                        )}
                                        <div className="flex-1 truncate">
                                            <p className="font-medium truncate">
                                                {videoName}
                                            </p>
                                            <a
                                                href={videoUrl}
                                                target="_blank"
                                                className="hover:underline text-sm text-slate-500 dark:text-slate-400 truncate"
                                            >
                                                {videoUrl}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <Dialog open={loading}>
                <DialogContent className="flex flex-col items-center gap-4 [&>button]:hidden">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                    <TypingText text="Creating chatroom..." speed={100} />
                    <p className="font-bold"></p>
                </DialogContent>
            </Dialog>
        </main>
    );
};

function TypingText({ text, speed = 100 }: { text: string; speed: number }) {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prevText) => prevText + text[index]);
                setIndex((prevIndex) => prevIndex + 1);
            }, speed);
            return () => clearTimeout(timeout);
        } else {
            const resetTimeout = setTimeout(() => {
                setDisplayedText("");
                setIndex(0);
            }, speed * 10);
            return () => clearTimeout(resetTimeout);
        }
    }, [index, text, speed]);

    return <p className="font-bold">{displayedText}</p>;
}
