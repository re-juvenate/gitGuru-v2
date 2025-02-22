import { User, Bot } from "lucide-react";

export const ChatMessage = ({ message }) => (
  <div className={`flex items-start gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
    <div
      className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
      title={message.role === 'user' ? 'You' : 'Bot'}
    >
      {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
    </div>
    <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'bg-green-600' : 'bg-gray-700'}`}>
      <p className="text-white">{message.message}</p>
    </div>
  </div>
);