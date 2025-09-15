"use client"
import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
const [loader,setLoader]=useState(false);
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoader(true)
      const res = await axios.post("api/chat", {
        message: input,
      });

      const botMessage = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
      setLoader(false)
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Failed to get response" },
      ]);
       setLoader(false)
    }

    setInput("");
  };
  return (
    <>
   {loader && <div className="loading-overlay"><span className="loader"></span></div>} 
    <div>
      <h1 className="heading">AI  CHATBOT</h1>
      
      {messages.length>0 && <div
        style={{maxHeight:'600px',overflowY: "auto" }}
        className="chatbotWrapper"
      >
        <div className="messages">
          { messages.map((msg, index) => (
              <div className={msg.sender} key={`${msg.sender}${index}`}>
                <span  className="messageWrapper">
                  {msg.sender === "bot" ? (
                    <i className="fa-solid fa-robot"></i>
                  ) : (
                    <i className="fa-solid fa-user"></i>
                  )}
                  &nbsp;&nbsp;
                  <div>
                  <ReactMarkdown
                    children={msg.text}
                    components={{
                      p: ({ children }) => (
                        <p style={{ margin: 0, padding: 0 }}>{children}</p>
                      ),
                    }}
                  />
                  </div>
                </span>
              </div>

          ))}
        </div>
       
      </div>
}
       <div className="questionWrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything"
          />
          <button onClick={sendMessage}><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
        </div>
    </div>
    </>
  );
}

export default ChatBot;
