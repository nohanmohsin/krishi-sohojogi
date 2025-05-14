import { useRef, useState } from "react";

const AudioRecorderComp = ({ setAudioBlob }) => {
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);
  const chunks = useRef([]);
  const stopRecording = async () => {
    setIsRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      mediaRecorder.current.onstop = () => {
        console.log(chunks.current);
        const recordedObj = new Blob(chunks.current, { type: "audio/mp3" });
        setAudioBlob(recordedObj);
        chunks.current = [];
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="recorder-wrapper">
      {isRecording ? (
        <button onClick={stopRecording} className="primary-btn">
          থামুন
        </button>
      ) : (
        <button onClick={startRecording} className="primary-btn">
          কথা বলুন
        </button>
      )}
    </div>
  );
};

export default AudioRecorderComp;
