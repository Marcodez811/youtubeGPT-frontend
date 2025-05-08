import ChatHeader from "@/components/chatheader";
import ChatSection from "@/components/chat-section";

export default function Chatroom() {
    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
            <ChatHeader />
            <div className="overflow-hidden">
                <ChatSection />
            </div>
        </div>
    );
}
