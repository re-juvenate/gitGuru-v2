import { useState, useEffect } from "react";

export const useChat = (apiEndpoint, context, activeTab) => {
    const [chatHistory, setChatHistory] = useState({});
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});


    const chatHistoryKey = `chat_history_${context.repoUrl}_${context.type === "issue" ? context.issueUrl : context.type === "pr" ? context.prUrl : ""
        }`;

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contextData),
            });

            const result = await response.json();
            setData(prevData => ({ ...prevData, [tabName]: result }));

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

    return {
        chatHistory,
        setChatHistory,
        newMessage,
        setNewMessage,
        isLoading,
        data,
        fetchTabData,
        handleSendMessage,
        chatHistoryKey
    };
};
