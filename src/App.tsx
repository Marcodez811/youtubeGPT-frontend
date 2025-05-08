import { useState, useRef, useEffect } from "react";
import { HeroSection } from "./components/HeroSection";
import { MainSection } from "./components/MainSection";
import { Footer } from "./components/Footer";
import { Chatrooms } from "./components/Chatrooms";
import axios from "axios";

type ChatRoom = {
    id: string;
    title: string;
};

export default function App() {
    const [chatrooms, setChatRooms] = useState<ChatRoom[]>();
    const fetchChatrooms = async () => {
        const result = await axios.get("http://localhost:8000/api/chatrooms");
        setChatRooms(result.data);
    };

    useEffect(() => {
        fetchChatrooms();
    }, []);
    const mainSectionRef = useRef<HTMLDivElement>(null);
    const scrollToMain = () => {
        mainSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <HeroSection scrollToMain={scrollToMain} />
            {/* Main Content */}
            {chatrooms && <Chatrooms videos={chatrooms} />}
            <MainSection mainRef={mainSectionRef} />
            {/* Footer Section */}
            <Footer />
        </div>
    );
}
