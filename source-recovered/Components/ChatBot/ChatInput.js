import { useState } from "react";

function ChatInput({ sendMessage }) {

  const [message, setMessage] = useState("");

  const handleSend = () => {

    if (!message.trim()) return;

    sendMessage(message);

    setMessage("");

  };

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      handleSend();

    }

  };

  return (

    <div className="chat-input-container">

      <input

        type="text"

        className="chat-input"

        placeholder="Type your message..."

        value={message}

        onChange={(e) => setMessage(e.target.value)}

        onKeyDown={handleKeyDown}

      />

      <button

        className="send-button"

        onClick={handleSend}

      >

        ➤

      </button>

    </div>

  );

}

export default ChatInput;