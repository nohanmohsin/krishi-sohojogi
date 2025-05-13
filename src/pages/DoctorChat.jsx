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
  const [audioBlob, setAudioBlob] = useState(null);
  const [currentAudioTranscript, setCurrentAudioTranscript] = useState("");
  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: chatHistory,
    config: {
      systemInstruction: instructions,
    },
  });
  const sendAudioTranscript = async () => {
    setChatHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: [{ text: currentAudioTranscript }],
      },
    ]);
    let res = await chat.sendMessage({
      message: currentAudioTranscript,
    });
    if (res.text) {
      setChatHistory((oldHistory) => [
        ...oldHistory,
        {
          role: "model",
          parts: [{ text: res.text }],
        },
      ]);
      setCurrentAudioTranscript("");
      console.log(res.text);
    } else {
      alert("something went wrong");
    }
  };
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
      setCurrentAudioTranscript(result.text);
    };
    if (audioBlob) {
      console.log("here");
      fetchTranscript();
      sendAudioTranscript();
    }
  }, [audioBlob]);

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
      <span>অথবা</span>
      <AudioRecorderComp setAudioBlob={setAudioBlob} />
    </main>
  );
};

export default DoctorChat;
