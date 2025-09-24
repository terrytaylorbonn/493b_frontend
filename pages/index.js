import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Format history as pairs of [user_message, assistant_response]
      const history = [];
      for (let i = 0; i < newMessages.length; i += 2) {
        const userMsg = newMessages[i]?.role === "user" ? newMessages[i].content : null;
        const assistantMsg = newMessages[i + 1]?.role === "assistant" ? newMessages[i + 1].content : null;
        if (userMsg) {
          history.push([userMsg, assistantMsg || ""]);
        }
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: history
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Backend error (${res.status}): ${JSON.stringify(errorData)}`);
      }

      const data = await res.json();
      const steps = data.steps.join("\n");

      setMessages(prev => [...prev, { role: "assistant", content: steps }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Error: " + err.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      maxWidth: "600px",
      margin: "2rem auto",
      fontFamily: "sans-serif"
    }}>
      <h1>🤖 Multi-Tool Agent Chat</h1>
      <div style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        height: "400px",
        overflowY: "auto",
        marginBottom: "1rem"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === "user" ? "right" : "left",
            margin: "0.5rem 0"
          }}>
            <span style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              borderRadius: "12px",
              background: msg.role === "user" ? "#007bff" : "#eee",
              color: msg.role === "user" ? "white" : "black",
              whiteSpace: "pre-wrap"
            }}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div>⏳ Thinking...</div>}
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}
