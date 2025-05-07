import { useState, useEffect } from "react";
import { useParams } from "react-router";
import ChatHeader from "@/components/chatheader";
import VideoSection from "@/components/video-section";
import ChatSection from "@/components/chat-section";
import axios from "axios";

type Message = {
    id: number;
    role: "user" | "bot";
    content: string;
    timestamp: Date;
};

type TranscriptWTS = {
    text: string;
    start: number;
    duration: number;
};

type ChatRoomInfo = {
    url: string;
    transcript: string;
    title: string;
    id: string;
    description: string;
    transcript_wts: Array<TranscriptWTS>;
};

export default function Chatroom() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatroomInfo, setChatroomInfo] = useState<ChatRoomInfo | null>(null);
    const params = useParams();
    const fetchChatroomInfo = async () => {
        const response = await axios.get(
            `http://localhost:8000/api/chatrooms/${params.vidId}`
        );
        setChatroomInfo(response.data);
    };

    useEffect(() => {
        fetchChatroomInfo();
    }, []);

    // console.log(chatroomInfo);

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        const newUserMessage: Message = {
            id: messages.length + 1,
            role: "user",
            content: message,
            timestamp: new Date(),
        };

        setMessages([...messages, newUserMessage]);

        const response = await axios.post(
            `http://localhost:8000/api/chatrooms/${params.vidId}/query`,
            { query: message }
        );
        const { intent, content } = response.data;
        console.log(response.data);
        const newAIMessage: Message = {
            id: messages.length + 2,
            role: "bot",
            content: content,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newAIMessage]);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
            <ChatHeader />
            <div className="overflow-hidden">
                {/* <VideoSection videoInfo={null} className="w-full md:w-1/2" /> */}
                <ChatSection
                // messages={messages}
                // onSendMessage={handleSendMessage}
                // className="h-full w-full"
                />
            </div>
        </div>
    );
}
