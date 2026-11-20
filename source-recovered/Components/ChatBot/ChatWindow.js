import { useEffect, useRef, useState } from "react";
import "./ChatBot.css";

import chatbotData from "../../data/chatbotData";

import Message from "./Message";
import ChatInput from "./ChatInput";
import BottomSheet from "./BottomSheet";
import ContactForm from "./ContactForm";

function ChatWindow({ closeChat }) {

  const chatBodyRef = useRef(null);

  /* ===========================
      CHAT MESSAGES
  =========================== */

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: chatbotData.welcomeMessages[0],
    },
    {
      type: "bot",
      text: chatbotData.welcomeMessages[1],
    },
    {
      type: "bot",
      text: chatbotData.welcomeMessages[2],
    },
  ]);

  /* ===========================
      BOTTOM SHEET
  =========================== */

  const [sheetOpen, setSheetOpen] = useState(false);

  const [sheetTitle, setSheetTitle] = useState("All Options");

  const [sheetItems, setSheetItems] = useState([]);

  /* ===========================
      CURRENT SCREEN
  =========================== */

  const [currentScreen, setCurrentScreen] =
    useState("main");

  /* ===========================
      SELECTED COURSE
  =========================== */

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  /* ===========================
      CONTACT FORM
  =========================== */

  const [showContactForm, setShowContactForm] =
    useState(false);

  /* ===========================
      AUTO SCROLL
  =========================== */

  useEffect(() => {

    if (chatBodyRef.current) {

      chatBodyRef.current.scrollTop =
        chatBodyRef.current.scrollHeight;

    }

  }, [messages]);

  /* ===========================
      OPEN MAIN MENU
  =========================== */

  const openMainMenu = () => {

    setCurrentScreen("main");

    setSheetTitle("All Options");

    setSheetItems(chatbotData.mainMenu);

    setSheetOpen(true);

  };

    /* ===========================
      MENU CLICK
  =========================== */

  const handleMenuSelect = (item) => {

    /* ================= COURSES ================= */

    if (item.id === "courses") {

      setCurrentScreen("courses");

      setSheetTitle("Courses");

      setSheetItems(

        chatbotData.courses.map((course) => ({

          id: course.id,

          icon: course.icon,

          title: course.name,

          subtitle: course.shortDescription,

          course

        }))

      );

      return;

    }

    /* ================= COURSE ================= */

    if (currentScreen === "courses") {

      setSelectedCourse(item.course);

      setCurrentScreen("courseDetails");

      setSheetTitle(item.course.name);

      setSheetItems([

        {
          id: "duration",
          icon: "📅",
          title: "Duration"
        },

        {
          id: "mode",
          icon: "💻",
          title: "Mode"
        },

        {
          id: "eligibility",
          icon: "🎓",
          title: "Eligibility"
        },

        {
          id: "syllabus",
          icon: "📚",
          title: "Syllabus"
        },

        {
          id: "projects",
          icon: "🚀",
          title: "Projects"
        },

        {
          id: "certificate",
          icon: "🏆",
          title: "Certificate"
        },

        {
          id: "placement",
          icon: "💼",
          title: "Placement"
        },

        {
          id: "trainer",
          icon: "👨‍🏫",
          title: "Trainer"
        },

        {
          id: "apply",
          icon: "📝",
          title: "Apply Now"
        }

      ]);

      return;

    }

    /* ================= COURSE DETAILS ================= */

    if (currentScreen === "courseDetails") {

      switch (item.id) {

        case "duration":

          setMessages((prev) => [

            ...prev,

            {

              type: "bot",

              text: `📅 Duration\n\n${selectedCourse.duration}`

            }

          ]);

          setSheetOpen(false);

          break;

        case "mode":

          setMessages((prev) => [

            ...prev,

            {

              type: "bot",

              text: `💻 Mode\n\n${selectedCourse.mode}`

            }

          ]);

          setSheetOpen(false);

          break;

        case "eligibility":

          setMessages((prev) => [

            ...prev,

            {

              type: "bot",

              text: `🎓 Eligibility\n\n${selectedCourse.eligibility}`

            }

          ]);

          setSheetOpen(false);

          break;


                  case "syllabus":

          setMessages((prev) => [

            ...prev,

            {

              type: "bot",

              text:
                "📚 Syllabus\n\n" +
                selectedCourse.syllabus.join("\n")

            }

          ]);

          setSheetOpen(false);

          break;

        case "projects":

          setMessages((prev) => [

            ...prev,

            {

              type: "bot",

              text:
                "🚀 Live Projects\n\n" +
                selectedCourse.projects.join("\n")

            }

          ]);

          setSheetOpen(false);

          break;

        case "certificate":

          setMessages((prev) => [

            ...prev,

            {

              type: "bot",

              text:
                "🏆 Certificate\n\n" +
                selectedCourse.certificate

            }

          ]);

          setSheetOpen(false);

          break;

        case "placement":

          setMessages((prev) => [

            ...prev,

            {

              type: "bot",

              text:
                "💼 Placement\n\n" +
                selectedCourse.placement

            }

          ]);

          setSheetOpen(false);

          break;

        case "trainer":

          setMessages((prev) => [

            ...prev,

            {

              type: "bot",

              text:
                "👨‍🏫 Trainer\n\n" +
                selectedCourse.trainer

            }

          ]);

          setSheetOpen(false);

          break;

        case "apply":

          setSheetOpen(false);

          setShowContactForm(true);

          break;

        default:

          break;

      }

      return;

    }

    /* ================= OTHER MENU ================= */

    if (item.id === "internship") {

      setMessages((prev) => [

        ...prev,

        {

          type: "bot",

          text:
            chatbotData.internship.description

        }

      ]);

      setSheetOpen(false);

      return;

    }

    if (item.id === "services") {

      setMessages((prev) => [

        ...prev,

        {

          type: "bot",

          text:
            chatbotData.services
              .map((s) => "• " + s.title)
              .join("\n")

        }

      ]);

      setSheetOpen(false);

      return;

    }

    if (item.id === "placement") {

      setMessages((prev) => [

        ...prev,

        {

          type: "bot",

          text:
            chatbotData.placement.benefits.join("\n")

        }

      ]);

      setSheetOpen(false);

      return;

    }

    if (item.id === "contact") {

      setSheetOpen(false);

      setShowContactForm(true);

      return;

    }

  };

    /* ===========================
      SEND MESSAGE
  =========================== */

  const sendMessage = (text) => {

    if (!text.trim()) return;

    setMessages((prev) => [

      ...prev,

      {

        type: "user",

        text,

      },

      {

        type: "bot",

        text: "Please use the menu below to continue.",

      },

    ]);

  };

  /* ===========================
      BACK BUTTON
  =========================== */

  const handleBack = () => {

    if (currentScreen === "courseDetails") {

      setCurrentScreen("courses");

      setSheetTitle("Courses");

      setSheetItems(

        chatbotData.courses.map((course) => ({

          id: course.id,

          icon: course.icon,

          title: course.name,

          subtitle: course.shortDescription,

          course

        }))

      );

      return;

    }

    openMainMenu();

  };

  /* ===========================
      JSX
  =========================== */

  return (

    <div className="chat-window">

      {/* ================= HEADER ================= */}

      <div className="chat-header">

        <div className="header-left">

          <div className="bot-icon">

            🤖

          </div>

          <div>

            <h3>

              {chatbotData.settings.chatbotName}

            </h3>

            <span>

              {chatbotData.settings.onlineStatus}

            </span>

          </div>

        </div>

        <button

          className="close-btn"

          onClick={closeChat}

        >

          ✕

        </button>

      </div>

      {/* ================= CHAT BODY ================= */}

      <div

        className="chat-body"

        ref={chatBodyRef}

      >

        {

          messages.map((msg, index) => (

            <Message

              key={index}

              type={msg.type}

              text={msg.text}

            />

          ))

        }

        {

          showContactForm && (

            <ContactForm

              course={

                selectedCourse

                  ? selectedCourse.name

                  : ""

              }

            />

          )

        }

      </div>

      {/* ================= FOOTER ================= */}

      <div className="chat-footer">

        <button

          className="menu-button"

          onClick={openMainMenu}

        >

          📋 View All Options

        </button>

        <ChatInput

          sendMessage={sendMessage}

        />

      </div>

      {/* ================= BOTTOM SHEET ================= */}

      <BottomSheet

        isOpen={sheetOpen}

        title={sheetTitle}

        items={sheetItems}

        onSelect={handleMenuSelect}

        onClose={() => setSheetOpen(false)}

        onBack={handleBack}

        showBack={currentScreen !== "main"}

      />

    </div>

  );

}

export default ChatWindow;