import { useNavigate } from "react-router";
import { Card, CardFooter } from "@/components/ui/card";
import { MessageCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ChatRoom = {
    id: string;
    title: string;
};

type ChatroomProps = {
    videos: ChatRoom[];
    setVideos: React.Dispatch<React.SetStateAction<ChatRoom[] | undefined>>;
};

export const Chatrooms = ({ videos, setVideos }: ChatroomProps) => {
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [openAlertId, setOpenAlertId] = useState<string | null>(null);

    const handleDelete = async (videoId: string) => {
        setDeletingId(videoId);

        // Create a loading toast that we can dismiss later
        const loadingToastId = toast.loading("Deleting chatroom...");

        try {
            await axios.delete(
                `http://localhost:8000/api/chatrooms/${videoId}`
            );

            // Remove from state
            setVideos(videos.filter((v) => v.id !== videoId));

            // Show success toast and dismiss the loading toast
            toast.success("Chatroom successfully deleted", {
                id: loadingToastId,
            });
        } catch (err) {
            console.error("Failed to delete:", err);

            // Show error toast and dismiss the loading toast
            toast.error("Failed to delete chatroom", { id: loadingToastId });
        } finally {
            setDeletingId(null);
            setOpenAlertId(null);
        }
    };

    return (
        <div className="h-screen mx-auto container px-12 py-12 bg-pink">
            <h1 className="text-3xl font-bold text-center mb-8">
                Current Video Chatrooms
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.map((video) => (
                    <Card
                        key={video.id}
                        className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer group relative"
                    >
                        {/* Delete Button with Alert Dialog */}
                        <AlertDialog
                            open={openAlertId === video.id}
                            onOpenChange={(open) => {
                                if (!open) setOpenAlertId(null);
                            }}
                        >
                            <AlertDialogTrigger asChild>
                                <button
                                    className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenAlertId(video.id);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 text-white" />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Chatroom
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "
                                        {video.title}"? This action cannot be
                                        undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDelete(video.id)}
                                        disabled={deletingId === video.id}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {deletingId === video.id ? (
                                            <>
                                                <span className="animate-spin mr-2">
                                                    ⏳
                                                </span>
                                                Deleting...
                                            </>
                                        ) : (
                                            "Delete"
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Video Thumbnail */}
                        <div
                            className="relative aspect-video"
                            onClick={() => navigate(`/v/${video.id}`)}
                        >
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
            <Toaster
                position="top-right"
                toastOptions={{
                    // Default options for all toasts
                    duration: 4000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                    // Custom success toast styling
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: "#10B981",
                            secondary: "white",
                        },
                    },
                    // Custom error toast styling
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: "#EF4444",
                            secondary: "white",
                        },
                    },
                }}
            />
        </div>
    );
};
