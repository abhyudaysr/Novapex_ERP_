"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X } from "lucide-react"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "bot", text: "Hello 👋, I’m your ERP Assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")

  const handleSend = async () => {
  if (!input.trim()) return;

  // Add user message
  setMessages([...messages, { sender: "user", text: input }]);

  // Collect frontend data (dummy example, replace with real states/props)
  const context = {
    employees: [
      { name: "Sarah Johnson", status: "Present" },
      { name: "Mike Chen", status: "On Leave" },
    ],
    attendance: { total: 247, present: 198, leave: 12 },
    performance: { pendingReviews: 5, goals: "Quarterly OKRs" },
  };

  try {
    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, context }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: data.reply || "Sorry, something went wrong." },
    ]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "⚠️ Error: Unable to connect to AI." },
    ]);
  }

  setInput("");
  };


  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="w-80"
          >
            <Card className="shadow-2xl border-primary/30 rounded-2xl overflow-hidden">
              <CardHeader className="bg-primary text-white p-3 flex justify-between items-center">
                <CardTitle className="text-lg">💬 ERP Chatbot</CardTitle>
                <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent className="h-96 flex flex-col justify-between p-3">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-2">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-2 rounded-lg max-w-[80%] ${
                        msg.sender === "user"
                          ? "ml-auto bg-primary text-white"
                          : "mr-auto bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </motion.div>
                  ))}
                </div>

                {/* Input Box */}
                <div className="flex items-center gap-2 mt-3">
                  <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} className="bg-primary text-white">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
