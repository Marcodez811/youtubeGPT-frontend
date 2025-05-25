import { useEffect, useState, useRef } from "react";
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";

interface YouTubePlayWrapperProps {
    sourceId: string | null;
    seekTime?: number;
    onTimeUpdate?: (currentTime: number) => void;
}

const YouTubePlayWrapper: React.FC<YouTubePlayWrapperProps> = ({
    sourceId,
    seekTime,
    onTimeUpdate,
}) => {
    // Player reference and state
    const playerRef = useRef<YouTubePlayer | null>(null);
    const [timeUpdateInterval, setTimeUpdateInterval] =
        useState<NodeJS.Timeout | null>(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    // Track the last applied seek time to avoid redundant seeks
    const lastAppliedSeekTimeRef = useRef<number | null>(null);

    // Handle player ready event
    const onPlayerReady: YouTubeProps["onReady"] = (event) => {
        console.log("Player ready event fired");
        playerRef.current = event.target;
        setIsPlayerReady(true);
    };

    // Handle player state changes
    const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
        const playerState = event.data;

        // Handle playing state (1)
        if (playerState === 1) {
            // Set up time update interval when playing
            if (onTimeUpdate) {
                // Clear any existing interval
                if (timeUpdateInterval) {
                    clearInterval(timeUpdateInterval);
                }

                // Create new interval to report current time
                const interval = setInterval(() => {
                    if (playerRef.current) {
                        try {
                            const currentTime =
                                playerRef.current.getCurrentTime();
                            onTimeUpdate(currentTime);
                        } catch (error) {
                            console.error("Error getting current time:", error);
                        }
                    }
                }, 250); // Update more frequently (250ms)

                setTimeUpdateInterval(interval);
            }
        } else if (playerState !== 1 && timeUpdateInterval) {
            // Clear interval when video is not playing
            clearInterval(timeUpdateInterval);
            setTimeUpdateInterval(null);
        }
    };

    // Apply seek time when it changes or when player becomes ready
    useEffect(() => {
        // Only proceed if we have a valid seek time and player is ready
        if (seekTime !== undefined && isPlayerReady && playerRef.current) {
            // Avoid redundant seeks
            if (seekTime !== lastAppliedSeekTimeRef.current) {
                console.log(`Seeking to ${seekTime} seconds`);

                try {
                    // Perform the seek operation
                    playerRef.current.seekTo(seekTime, true);

                    // Update the last applied seek time
                    lastAppliedSeekTimeRef.current = seekTime;

                    // Notify parent of time update
                    if (onTimeUpdate) {
                        onTimeUpdate(seekTime);
                    }
                } catch (error) {
                    console.error("Error seeking:", error);
                }
            }
        }
    }, [seekTime, isPlayerReady, onTimeUpdate]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeUpdateInterval) {
                clearInterval(timeUpdateInterval);
            }
            playerRef.current = null;
            setIsPlayerReady(false);
        };
    }, []);

    // YouTube player options
    const opts: YouTubeProps["opts"] = {
        width: "100%",
        height: "100%",
        playerVars: {
            autoplay: 0,
            controls: 1, // Show controls for debugging
        },
    };

    if (!sourceId) return <div>Loading...</div>;

    return (
        <div className="w-full h-full">
            <YouTube
                className="w-full h-full"
                videoId={sourceId}
                opts={opts}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
            />
        </div>
    );
};

export default YouTubePlayWrapper;
