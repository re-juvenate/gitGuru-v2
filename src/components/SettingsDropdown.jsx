import { Settings, Trash2 } from "lucide-react";

export const SettingsDropdown = ({ showSettings, setShowSettings, clearCurrentChat, clearAllChats, settingsRef }) => (
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
);