import { Send } from "lucide-react";

export const MessageInput = ({ newMessage, setNewMessage, handleSendMessage }) => (
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
);
