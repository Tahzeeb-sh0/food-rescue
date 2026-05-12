import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatBox = ({ donationId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Reset state when donation changes — prevents messages from different donations mixing
    setMessages([]);
    setNewMessage('');
    setHistoryError(false);
    setIsLoadingHistory(true);

    // Fetch history for this specific donation
    fetch(`${API_BASE}/api/chat/${donationId}/history`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(data => setMessages(data))
      .catch(() => setHistoryError(true))
      .finally(() => setIsLoadingHistory(false));

    // Connect WebSocket and subscribe to this donation's chat topic
    const socket = new SockJS('${API_BASE}/ws');
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect({}, () => {
      client.subscribe(`/topic/chat/${donationId}`, (msg) => {
        const message = JSON.parse(msg.body);
        setMessages(prev => {
          // Deduplicate: don't add if same id already exists
          if (prev.find(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      });
    });

    setStompClient(client);

    return () => {
      if (client.connected) client.disconnect();
    };
  }, [donationId]); // re-runs whenever donationId changes

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !stompClient || !stompClient.connected) return;

    const chatMsg = {
      donationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage.trim(),
    };

    stompClient.send(`/app/chat/${donationId}`, {}, JSON.stringify(chatMsg));
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
        <h4 className="text-sm font-bold text-slate-800">Chat</h4>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full text-slate-300">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : historyError ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <AlertCircle size={24} />
            <p className="text-xs">Could not load message history.</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-slate-400">No messages yet. Start the conversation.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                msg.senderId === currentUser.id
                  ? 'bg-primary-700 text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}>
                <p className={`text-[10px] font-bold mb-1 ${msg.senderId === currentUser.id ? 'text-primary-200' : 'text-slate-400'}`}>
                  {msg.senderName}
                </p>
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          maxLength={500}
          className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="p-2 bg-primary-700 text-white rounded hover:bg-primary-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
