import { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { TabNavigation } from "./TabNavigation";
import { SettingsDropdown } from "./SettingsDropdown";
import { ChatWindow } from "./ChatWindow";
import { MessageInput } from "./MessageInput";

export default function DynamicIssueViewer({
    tabs = {
        summary: "Summary",
        possible_fixes: "Possible Fixes"
    },
    apiEndpoint = "/api/data"
}) {
    const [context, setContext] = useState({
        repoUrl: "",
        issueUrl: "",
        prUrl: "",
        type: "repo"
    });
    const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]);
    const [showSettings, setShowSettings] = useState(false);
    const chatContainerRef = useRef(null);
    const settingsRef = useRef(null);

    const {
        chatHistory,
        setChatHistory,
        newMessage,
        setNewMessage,
        isLoading,
        fetchTabData,
        handleSendMessage,
        chatHistoryKey
    } = useChat(apiEndpoint, context, activeTab);

    // Context detection logic
    useEffect(() => {
        const currentUrl = window.location.href;
        const githubUrlPattern = /github\.com\/([^/]+)\/([^/]+)(?:\/?(issues|pull)\/(\d+))?/;
        const match = currentUrl.match(githubUrlPattern);

        if (match) {
            const [, owner, repo, contentType, number] = match;
            const repoUrl = `https://github.com/${owner}/${repo}`;

            const newContext = {
                repoUrl,
                issueUrl: "",
                prUrl: "",
                type: "repo"
            };

            if (contentType === 'issues') {
                newContext.issueUrl = `${repoUrl}/issues/${number}`;
                newContext.type = "issue";
            } else if (contentType === 'pull') {
                newContext.prUrl = `${repoUrl}/pull/${number}`;
                newContext.type = "pr";
            }

            setContext(newContext);
        }
    }, []);

    // Other useEffects remain the same...
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setShowSettings(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initialize chat history
    useEffect(() => {
        const savedHistory = localStorage.getItem(chatHistoryKey);
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                setChatHistory(parsed);
                // Check if current tab has any messages
                if (!parsed[activeTab] || parsed[activeTab].length === 0) {
                    fetchTabData(activeTab);
                }
            } catch (e) {
                console.error("Error parsing saved chat history:", e);
                setChatHistory({});
                fetchTabData(activeTab);
            }
        } else {
            setChatHistory({});
            fetchTabData(activeTab);
        }
    }, [chatHistoryKey]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (Object.keys(chatHistory).length > 0) {
                localStorage.setItem(chatHistoryKey, JSON.stringify(chatHistory));
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [chatHistory, chatHistoryKey]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    useEffect(() => {
        fetchTabData(activeTab);
    }, [activeTab, context.repoUrl, context.type]);

    const clearCurrentChat = async () => {
        localStorage.removeItem(chatHistoryKey);
        setChatHistory(prev => ({
            ...prev,
            [activeTab]: []
        }));
        setShowSettings(false);
        await fetchTabData(activeTab);
    };

    const clearAllChats = () => {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('chat_history_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        setChatHistory({});
        setShowSettings(false);
        fetchTabData(activeTab);
    };

    return (
        <div className="flex flex-col gap-6 h-[600px]">
            <div className="flex-1 w-full rounded-lg shadow-md border flex flex-col h-full max-h-full overflow-hidden">
                <div className="flex items-center border-b">
                    <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                    <SettingsDropdown
                        showSettings={showSettings}
                        setShowSettings={setShowSettings}
                        clearCurrentChat={clearCurrentChat}
                        clearAllChats={clearAllChats}
                        settingsRef={settingsRef}
                    />
                </div>
                <ChatWindow
                    isLoading={isLoading}
                    chatHistory={chatHistory}
                    activeTab={activeTab}
                    chatContainerRef={chatContainerRef}
                />
                <MessageInput
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
}