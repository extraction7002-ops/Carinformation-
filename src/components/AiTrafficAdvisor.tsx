import React, { useState, useRef, useEffect } from 'react';
import { VehicleRecord } from '../types';
import { Sparkles, Send, Bot, User, Loader2, HelpCircle, ShieldCheck } from 'lucide-react';

interface Props {
  activeVehicle: VehicleRecord;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiTrafficAdvisor: React.FC<Props> = ({ activeVehicle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Namaste! I am your AI Traffic & Parivahan Legal Advisor. You are currently viewing **${activeVehicle.rcNumber}** (${activeVehicle.makerModel}). How can I assist you today with traffic rules, e-challans, PUCC guidelines, or Lok Adalat fine waivers?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    "What is the fine for speeding under MV Act 2019?",
    "How to contest a wrong e-challan in Virtual Court?",
    "When is the next National Lok Adalat for challan discounts?",
    "What are the rules for tinted glass in cars?",
    "What happens if my PUCC expires?"
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          contextVehicle: {
            rcNumber: activeVehicle.rcNumber,
            makerModel: activeVehicle.makerModel,
            registrationDate: activeVehicle.registrationDate,
            rto: activeVehicle.rtoDetails.rtoName,
            pendingChallansCount: activeVehicle.challans.filter(c => c.status === 'PENDING').length
          }
        })
      });

      const data = await res.json();
      const aiReply: Message = {
        sender: 'ai',
        text: data.reply || "I am here to help you navigate Indian traffic laws and e-challans.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "Under the Motor Vehicles Act 1988 (as amended in 2019), compoundable traffic offenses can be paid online via Parivahan or contested in the designated Virtual Court within 60 days of challan generation.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Sarathi AI Traffic Legal Assistant</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-mono font-bold rounded-md border border-emerald-200">
                ONLINE
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Context: {activeVehicle.rcNumber} ({activeVehicle.rtoDetails.state})</p>
          </div>
        </div>
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-indigo-600'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl p-3.5 space-y-1 ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white font-medium rounded-tr-xs shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
              }`}
            >
              <div className="leading-relaxed whitespace-pre-wrap">{m.text}</div>
              <div
                className={`text-[9px] text-right ${
                  m.sender === 'user' ? 'text-indigo-200 font-medium' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span className="font-medium">Sarathi AI is consulting traffic laws & precedents...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-3 py-2 bg-white/80 border-t border-slate-200/80 overflow-x-auto scrollbar-none flex gap-1.5">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="text-[10px] bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-lg px-2.5 py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything on traffic challans, laws, or RC..."
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || loading}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
