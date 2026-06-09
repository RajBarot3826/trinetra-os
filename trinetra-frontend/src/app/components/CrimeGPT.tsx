"use client";

import { useState } from "react";
import { Send, Cpu, User } from "lucide-react";

export default function CrimeGPT() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "TRINETRA CrimeGPT online. Intelligence graph synchronized. How can I assist your investigation?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/crimegpt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Error connecting to Intelligence Engine." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[400px] border border-gray-700 rounded-lg bg-gray-900 overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg p-3 flex gap-3 ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-cyan-400 border border-cyan-900"}`}>
              {msg.sender === "ai" ? <Cpu className="w-5 h-5 mt-0.5 opacity-80" /> : <User className="w-5 h-5 mt-0.5 opacity-80" />}
              <p className="text-sm font-mono">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-cyan-900 text-cyan-400 rounded-lg p-3 flex gap-3">
              <Cpu className="w-5 h-5 animate-pulse" />
              <p className="text-sm font-mono animate-pulse">Analyzing...</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-gray-700 bg-gray-950 flex gap-2">
        <input
          type="text"
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2 focus:outline-none focus:border-cyan-500 font-mono text-sm"
          placeholder="Ask CrimeGPT..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button 
          onClick={sendMessage}
          className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
