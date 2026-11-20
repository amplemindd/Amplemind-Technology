import { useState, useEffect } from "react";
import "./ChatBot.css";
import ChatWindow from "./ChatWindow";

function ChatBot() {

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, []);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>

      {isOpen && (
        <ChatWindow closeChat={closeChat} />
      )}

      {/* Floating Chat Button */}
      {!(isMobile && isOpen) && (
        <button
          className="chatbot-button"
          onClick={toggleChat}
        >
          {isOpen ? "✕" : "💬"}
        </button>
      )}

    </>
  );
}

export default ChatBot;