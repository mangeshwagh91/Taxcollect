import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { properties } from "@/data/mockData";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function processQuery(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("top") && q.includes("defaulter")) {
    const count = parseInt(q.match(/\d+/)?.[0] || "10");
    const defaulters = properties.filter((p) => p.paymentStatus === "unpaid").sort((a, b) => b.taxAmount - a.taxAmount).slice(0, count);
    let response = `### Top ${count} Defaulters\n\n| # | Property ID | Owner | Tax Due | Ward |\n|---|---|---|---|---|\n`;
    defaulters.forEach((d, i) => { response += `| ${i + 1} | ${d.id} | ${d.ownerName} | ₹${d.taxAmount.toLocaleString()} | ${d.ward} |\n`; });
    response += `\n**Total Outstanding:** ₹${defaulters.reduce((s, d) => s + d.taxAmount, 0).toLocaleString()}`;
    return response;
  }

  if (q.includes("revenue") && (q.includes("total") || q.includes("month"))) {
    const total = properties.filter((p) => p.paymentStatus === "paid").reduce((s, p) => s + p.taxAmount, 0);
    return `### Revenue Summary\n\n- **Total Revenue Collected:** ₹${total.toLocaleString()}\n- **Properties Paid:** ${properties.filter((p) => p.paymentStatus === "paid").length}\n- **Collection Rate:** ${Math.round((properties.filter((p) => p.paymentStatus === "paid").length / properties.length) * 100)}%`;
  }

  if (q.includes("unpaid") && q.includes("year")) {
    const years = parseInt(q.match(/\d+/)?.[0] || "1");
    const longDefaulters = properties.filter((p) => {
      if (p.paymentStatus === "paid" || !p.lastPaymentDate) return p.paymentStatus === "unpaid";
      return (Date.now() - new Date(p.lastPaymentDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000) >= years;
    });
    return `### Properties Unpaid for ${years}+ Years\n\nFound **${longDefaulters.length}** properties:\n\n${longDefaulters.slice(0, 10).map((p) => `- **${p.id}** - ${p.ownerName} (₹${p.taxAmount.toLocaleString()}) — ${p.ward}`).join("\n")}\n\n${longDefaulters.length > 10 ? `...and ${longDefaulters.length - 10} more` : ""}`;
  }

  if (q.includes("how many") && q.includes("propert")) {
    return `### Property Statistics\n\n- **Total Properties:** ${properties.length}\n- **Residential:** ${properties.filter((p) => p.type === "residential").length}\n- **Commercial:** ${properties.filter((p) => p.type === "commercial").length}\n- **Paid:** ${properties.filter((p) => p.paymentStatus === "paid").length}\n- **Unpaid:** ${properties.filter((p) => p.paymentStatus === "unpaid").length}`;
  }

  if (q.includes("ward")) {
    const wards = ["Ward A", "Ward B", "Ward C", "Ward D", "Ward E"];
    let response = "### Ward-wise Breakdown\n\n| Ward | Total | Paid | Unpaid | Revenue |\n|---|---|---|---|---|\n";
    wards.forEach((w) => {
      const wp = properties.filter((p) => p.ward === w);
      const paid = wp.filter((p) => p.paymentStatus === "paid");
      response += `| ${w} | ${wp.length} | ${paid.length} | ${wp.length - paid.length} | ₹${paid.reduce((s, p) => s + p.taxAmount, 0).toLocaleString()} |\n`;
    });
    return response;
  }

  return `I can help you with property tax queries! Try asking:\n\n- "Show top 10 defaulters"\n- "Total revenue this month"\n- "Properties unpaid for 2 years"\n- "How many properties are there?"\n- "Ward-wise breakdown"\n\nI'll search the database and provide insights instantly.`;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "👋 Hello! I'm your AI Property Tax Assistant. Ask me anything about properties, revenues, defaulters, or analytics.\n\nTry: *\"Show top 10 defaulters\"* or *\"Total revenue this month\"*" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = processQuery(input);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-lg bg-primary/10"><Bot className="text-primary" size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold">AI Chatbot</h1>
          <p className="text-muted-foreground text-sm">Natural language query assistant</p>
        </div>
      </div>

      <div className="flex-1 glass-card rounded-xl p-4 overflow-y-auto space-y-4 mb-4">
        {messages.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
          >
            {m.role === "assistant" && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot size={16} className="text-primary" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-xl px-4 py-3 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {m.role === "assistant" ? (
                <div className="prose prose-sm max-w-none [&_table]:w-full [&_th]:text-left [&_th]:p-1.5 [&_td]:p-1.5 [&_tr]:border-b">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : m.content}
            </div>
            {m.role === "user" && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User size={16} className="text-primary-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Bot size={16} className="text-primary" /></div>
            <div className="bg-muted rounded-xl px-4 py-3 flex gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse-dot" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse-dot" style={{ animationDelay: "0.3s" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse-dot" style={{ animationDelay: "0.6s" }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about properties, revenue, defaulters..." className="flex-1"
        />
        <Button onClick={send} disabled={!input.trim() || isTyping}><Send size={18} /></Button>
      </div>
    </motion.div>
  );
}
