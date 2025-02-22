import { useState, useEffect, useRef } from "react";
import { User, Bot, Send, Settings, Trash2 } from "lucide-react";

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
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [chatHistory, setChatHistory] = useState({});
    const [newMessage, setNewMessage] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const chatContainerRef = useRef(null);
    const settingsRef = useRef(null);

    // Context detection logic remains the same...
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

    // Close settings dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setShowSettings(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const chatHistoryKey = `chat_history_${context.repoUrl}_${context.type === "issue" ? context.issueUrl : context.type === "pr" ? context.prUrl : ""}`;

    const clearCurrentChat = async () => {
        localStorage.removeItem(chatHistoryKey);
        setChatHistory(prev => ({
            ...prev,
            [activeTab]: []
        }));
        setShowSettings(false);
        // Fetch initial data since chat is empty
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
        // Fetch initial data since chat is empty
        fetchTabData(activeTab);
    };

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

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    useEffect(() => {
        fetchTabData(activeTab);
    }, [activeTab, context.repoUrl, context.type]);

    const fetchTabData = async (tabName) => {
        try {
            setIsLoading(true);
            const contextData = {
                repoUrl: context.repoUrl,
                ...(context.type === "issue" && { issueUrl: context.issueUrl }),
                ...(context.type === "pr" && { prUrl: context.prUrl }),
            };

            const response = await fetch(`${apiEndpoint}?tab=${tabName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contextData),
            });

            const result = await response.json();
            setData(prevData => ({
                ...prevData,
                [tabName]: result
            }));

            setChatHistory(prev => ({
                ...prev,
                [tabName]: [{
                    role: 'bot',
                    message: result,
                    timestamp: new Date().toISOString()
                }]
            }));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        if ((e.key === "Enter" && !e.shiftKey) || e.type === "click") {
            e.preventDefault();
            if (!newMessage.trim()) return;

            const userMessage = {
                role: 'user',
                message: newMessage,
                timestamp: new Date().toISOString()
            };

            setChatHistory(prev => ({
                ...prev,
                [activeTab]: [...(prev[activeTab] || []), userMessage]
            }));

            setNewMessage("");

            try {
                const contextData = {
                    repoUrl: context.repoUrl,
                    ...(context.type === "issue" && { issueUrl: context.issueUrl }),
                    ...(context.type === "pr" && { prUrl: context.prUrl }),
                    message: newMessage,
                    activeTab,
                    chatHistory: chatHistory[activeTab] || []
                };

                // For demo purposes
                const dummyResponse = newMessage.toLowerCase() === 'hi' ? 'Hi there!' : 'I received your message';

                const botMessage = {
                    role: 'bot',
                    message: dummyResponse,
                    timestamp: new Date().toISOString()
                };

                setChatHistory(prev => ({
                    ...prev,
                    [activeTab]: [...(prev[activeTab] || []), botMessage]
                }));
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[600px]">
            <div className="flex-1 w-full rounded-lg shadow-md border flex flex-col h-full max-h-full overflow-hidden">
                {/* Header with Tabs and Settings */}
                <div className="flex items-center border-b">
                    <nav className="flex-1 flex flex-row">
                        {Object.entries(tabs).map(([key, label]) => (
                            <button
                                key={key}
                                className={`flex-1 py-4 font-semibold transition-colors hover:bg-green-600 hover:text-white ${activeTab === key
                                    ? "text-green-600 border-b-2 border-green-600"
                                    : "text-white"
                                    }`}
                                onClick={() => setActiveTab(key)}
                            >
                                {label}
                            </button>
                        ))}
                    </nav>
                    {/* Settings Dropdown */}
                    <div className="relative" ref={settingsRef}>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-4 text-white hover:text-green-600 transition-colors"
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        {showSettings && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                    <button
                                        onClick={clearCurrentChat}
                                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear Current Chat
                                    </button>
                                    <button
                                        onClick={clearAllChats}
                                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear All Chats
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area - remains mostly the same */}
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
                                <div
                                    key={index}
                                    className={`flex items-start gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                        }`}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
                                        title={message.role === 'user' ? 'You' : 'Bot'}
                                    >
                                        {message.role === 'user' ?
                                            <User className="w-5 h-5" /> :
                                            <Bot className="w-5 h-5" />
                                        }
                                    </div>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user'
                                        ? 'bg-green-600'
                                        : 'bg-gray-700'
                                        }`}>
                                        <p className="text-white">{message.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Input - remains the same */}
                <div className="p-2 flex gap-2 bg-gray-900">
                    <textarea
                        className="flex-1 border border-white rounded-lg p-2 px-3 text-white bg-transparent outline-none break-words resize-none"
                        placeholder="Enter your message here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleSendMessage}
                        rows={1}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="Send message"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}