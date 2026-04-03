import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Clock, Loader2 } from 'lucide-react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatBox = ({ donationId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Fetch History
    fetch(`http://localhost:8080/api/chat/${donationId}/history`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Chat history fetch failed", err));

    // Connect WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect({}, () => {
      client.subscribe(`/topic/chat/${donationId}`, (msg) => {
        const message = JSON.parse(msg.body);
        setMessages(prev => [...prev, message]);
      });
    });

    setStompClient(client);

    return () => {
      if (client.connected) client.disconnect();
    };
  }, [donationId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !stompClient) return;

    const chatMsg = {
      donationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage,
    };

    stompClient.send(`/app/chat/${donationId}`, {}, JSON.stringify(chatMsg));
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Operational Coordination</h4>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Channel</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.senderId === currentUser.id 
                ? 'bg-primary-700 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                 <span className={`text-[10px] font-bold uppercase tracking-tighter ${msg.senderId === currentUser.id ? 'text-primary-200' : 'text-slate-400'}`}>
                   {msg.senderName}
                 </span>
              </div>
              <p className="leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type coordination message..."
          className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
        />
        <button type="submit" className="p-2 bg-primary-700 text-white rounded hover:bg-primary-800 transition-colors shadow-sm">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
