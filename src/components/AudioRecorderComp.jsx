import { useRef, useState } from "react";

const AudioRecorderComp = ({ setAudioBlob }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);
  const chunks = useRef([]);
  const stopRecording = async () => {
    setIsRecording(false);
    console.log(recordedBlob);

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
        setRecordedBlob(recordedObj);
        setAudioBlob(recordedObj);
        chunks.current = [];
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isRecording ? (
        <button onClick={stopRecording}>থামুন</button>
      ) : (
        <button onClick={startRecording}>কথা বলুন</button>
      )}
    </div>
  );
};

export default AudioRecorderComp;
