import { useRef, useState } from "react";

import { ai } from "../util/aiFunctions";
import { useParams } from "react-router-dom";

const DoctorChat = () => {
  const inputRef = useRef(null);
  const [currentText, setCurrentText] = useState("");
  const { instructions } = useParams();
  const [chatHistory, setChatHistory] = useState([]);
  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: chatHistory,
    config: {
      systemInstruction: instructions,
    },
  });
  const sendText = async () => {
    setChatHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: [{ text: currentText }],
      },
    ]);
    let res = await chat.sendMessage({
      message: currentText,
    });
    if (res.text) {
      setChatHistory((oldHistory) => [
        ...oldHistory,
        {
          role: "model",
          parts: [{ text: res.text }],
        },
      ]);
      inputRef.current.value = "";
    } else {
      alert("something went wrong");
    }
  };
  return (
    <main>
      <input
        type="text"
        ref={inputRef}
        onChange={(e) => {
          setCurrentText(e.target.value);
        }}
      />
      <button
        onClick={sendText}
        disabled={currentText.length > 0 ? false : true}
      >
        পাঠান
      </button>
    </main>
  );
};

export default DoctorChat;
