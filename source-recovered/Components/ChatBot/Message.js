function Message({ text, type }) {

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (

    <div className={`message-row ${type}`}>

      {type === "bot" && (

        <div className="avatar bot-avatar">

          🤖

        </div>

      )}

      <div className="message-wrapper">

        <div className={`message-bubble ${type}`}>

          {text}

        </div>

        <span className="message-time">

          {currentTime}

        </span>

      </div>

      {type === "user" && (

        <div className="avatar user-avatar">

          👤

        </div>

      )}

    </div>

  );

}

export default Message;