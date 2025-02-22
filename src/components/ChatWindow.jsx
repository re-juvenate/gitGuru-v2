import { ChatMessage } from "./ChatMessage";
export const ChatWindow = ({ isLoading, chatHistory, activeTab, chatContainerRef }) => (
    <div
        ref={chatContainerRef}
        className="flex-1 p-4 sm:p-6 text-sm text-white overflow-y-auto scrollbar-hide"
        style={{ maxHeight: "calc(100% - 120px)" }}
    >
        {isLoading ? (
            <div className="flex justify-center items-center h-40">
                <div className="animate-pulse text-white">Loading...</div>
            </div>
        ) : (
            <div className="space-y-4">
                {(chatHistory[activeTab] || []).map((message, index) => (
                    <ChatMessage key={index} message={message} />
                ))}
            </div>
        )}
    </div>
);