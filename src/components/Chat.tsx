import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken, removeToken } from '../auth';
import { FaMoon, FaSun, FaSignOutAlt, FaPaperPlane } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';

type Message = { user: string; content: string; timestamp?: string };

export default function Chat({ onLogout }: { onLogout: () => void }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [username, setUsername] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = io('http://localhost:3001', {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('userInfo', (user: { username: string }) => {
      setUsername(user.username);
    });

    socket.on('chat message', (data: Message) => {
      const timestamped = { ...data, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, timestamped]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socketRef.current) {
      socketRef.current.emit('chat message', message);
      setMessage('');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  const getAvatar = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col h-screen p-4 transition-all`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BsFillPersonFill className="text-blue-500" /> Chat App
        </h2>
        <div className="flex items-center gap-4">
          <button
            className="text-sm flex items-center gap-1 text-red-500"
            onClick={() => {
              removeToken();
              onLogout();
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
          <button
            onClick={toggleDarkMode}
            className="text-yellow-400"
            title="Toggle Dark Mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-1">
        {messages.map((msg, i) => {
          const isMine = msg.user === username;
          return (
            <div
              key={i}
              className={`flex items-end ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              {!isMine && (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 text-white text-sm font-bold mr-2">
                  {getAvatar(msg.user)}
                </div>
              )}
              <div
                className={`max-w-xs break-words p-3 rounded shadow ${
                  darkMode
                    ? isMine
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-white'
                    : isMine
                    ? 'bg-blue-500 text-white'
                    : 'bg-white'
                }`}
              >
                <div className="text-sm font-semibold">{msg.user}</div>
                <div>{msg.content}</div>
                {msg.timestamp && (
                  <div className="text-xs text-gray-300 mt-1 text-right">
                    {formatDistanceToNow(new Date(msg.timestamp), {
                      addSuffix: true,
                    })}
                  </div>
                )}
              </div>
              {isMine && (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400 text-white text-sm font-bold ml-2">
                  {getAvatar(msg.user)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className={`flex-1 border p-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <FaPaperPlane /> Send
        </button>
      </form>
    </div>
  );
}
