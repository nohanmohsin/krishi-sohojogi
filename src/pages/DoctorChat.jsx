import { useEffect, useRef, useState } from "react";

import { ai } from "../util/aiFunctions";
import { useParams } from "react-router-dom";
import AudioRecorderComp from "../components/AudioRecorderComp";
import { createPartFromUri, createUserContent } from "@google/genai";

const DoctorChat = () => {
  const inputRef = useRef(null);
  const [currentText, setCurrentText] = useState("");
  const { instructions } = useParams();
  const [chatHistory, setChatHistory] = useState([]);
  const [visibleChatHistory, setVisibleChatHistory] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: chatHistory,
    config: {
      systemInstruction: instructions,
    },
  });
  useEffect(() => {
    const fetchTranscript = async () => {
      const myfile = await ai.files.upload({
        file: audioBlob,
        config: { mimeType: "audio/mp3" },
      });

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
          createPartFromUri(myfile.uri, myfile.mimeType),
          "Generate a transcript of the speech.",
        ]),
      });
      console.log(result.text);
      if (result.text.length > 0) {
        setChatHistory([
          ...chatHistory,
          {
            role: "user",
            parts: [{ text: result.text }],
          },
        ]);
        let res = await chat.sendMessage({
          message: result.text,
        });
        if (res.text) {
          console.log("text res paisi send trans e");
          setChatHistory([
            ...chatHistory,
            {
              role: "model",
              parts: [{ text: res.text }],
            },
          ]);
          setVisibleChatHistory([
            ...visibleChatHistory,
            {
              role: "user",
              text: result.text,
            },
            {
              role: "model",
              text: res.text,
            },
          ]);
        } else {
          alert("something went wrong");
        }
      }
    };
    if (audioBlob) {
      console.log("here calling fetchtrans");
      fetchTranscript();
    }
  }, [audioBlob]);
  useEffect(() => {
    console.log(visibleChatHistory);
    if (visibleChatHistory.length > 0) {
      visibleChatHistory.map((chat) => chat.role);
      inputRef.current.value = "";
    }
  }, [visibleChatHistory]);
  const sendText = async () => {
    setChatHistory([
      ...chatHistory,
      {
        role: "user",
        parts: [{ text: currentText }],
      },
    ]);
    setVisibleChatHistory([...visibleChatHistory]);
    let res = await chat.sendMessage({
      message: currentText,
    });
    if (res.text) {
      setChatHistory([
        ...chatHistory,
        {
          role: "model",
          parts: [{ text: res.text }],
        },
      ]);
      setVisibleChatHistory([
        ...visibleChatHistory,
        {
          role: "user",
          text: currentText,
        },
        {
          role: "model",
          text: res.text,
        },
      ]);
    } else {
      alert("something went wrong");
    }
  };
  return (
    <main className="doc-chat">
      <div className="chat">
        <p className="model-text text">কিভাবে আপনার সাহায্য করতে পারি?</p>
        {visibleChatHistory.length > 0 ? (
          visibleChatHistory.map((chat) =>
            chat.role === "user" ? (
              <p className="user-text text">{chat.text}</p>
            ) : (
              <p className="model-text text">{chat.text}</p>
            )
          )
        ) : (
          <></>
        )}
      </div>
      <div className="input-area">
        <div className="text-input-area">
          <input
            type="text"
            ref={inputRef}
            onChange={(e) => {
              setCurrentText(e.target.value);
            }}
            placeholder={"গাছ এবং গাছের রোগ নিয়ে বলুন"}
            className="text-input-area-input-field"
          />
          <button
            onClick={sendText}
            disabled={currentText.length > 0 ? false : true}
            className="doc-chat-text-btn"
          >
            পাঠান
          </button>
        </div>
        <span className="othoba">অথবা</span>
        <AudioRecorderComp setAudioBlob={setAudioBlob} />
      </div>
    </main>
  );
};

export default DoctorChat;
