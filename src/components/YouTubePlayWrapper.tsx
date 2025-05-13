import React, { useEffect, useState } from "react";
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";

interface YouTubePlayWrapperProps {
    sourceId: string | null;
    seekTime?: number;
}

const YouTubePlayWrapper: React.FC<YouTubePlayWrapperProps> = ({
    sourceId,
    seekTime,
}) => {
    const [playerRef, setPlayerRef] = useState<YouTubePlayer>();

    const onPlayerReady: YouTubeProps["onReady"] = (event) => {
        console.log("onPlayerReady", event.target);
        event.target.pauseVideo();
        setPlayerRef(event.target);
    };

    useEffect(() => {
        return () => {
            console.log("vidPlayer cleanup");
            setPlayerRef(undefined);
        };
    }, []);

    useEffect(() => {
        console.log("vidPlayer seek:", seekTime);
        if (seekTime != null) {
            if (!playerRef) {
                console.error("seekTo - but no playerRef", { seekTime });
            } else {
                playerRef.seekTo(seekTime, true);
            }
        }
    }, [seekTime, playerRef]);

    const opts: YouTubeProps["opts"] = {
        width: "100%",
        height: "100%",

        playerVars: {
            autoplay: 0,
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
            />
        </div>
    );
};

export default YouTubePlayWrapper;
