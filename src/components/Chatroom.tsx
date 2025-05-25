import ChatSection from "@/components/ChatSection";

export default function Chatroom() {
    return (
        <div className="flex font-poppins flex-col h-screen bg-slate-50 dark:bg-slate-900">
            <div className="overflow-hidden">
                <ChatSection />
            </div>
        </div>
    );
}
