import { useEffect, useState } from "react";
import ImageUploader from "../components/ImageUploader";
import { DoctorImageContext } from "../contexts/doctorImageContext";
import { AIResponseContext } from "../contexts/AIResponseContext";
import DiseaseDescription from "../components/DiseaseDescription";

const Doctor = () => {
  const [image, setImage] = useState(null);
  const [AIResponse, setAIResponse] = useState(null);
  const [ResText, setResText] = useState(null);
  useEffect(() => {
    if (AIResponse) {
      setResText(JSON.parse(AIResponse.text));
    }
  }, [AIResponse]);
  return (
    <main className="doctor-page">
      <DoctorImageContext.Provider value={{ image, setImage }}>
        <AIResponseContext.Provider
          value={{ AIResponse, setAIResponse, ResText, setResText }}
        >
          {ResText ? (
            <DiseaseDescription />
          ) : (
            <>
              <h2>প্রথমে রোগাক্রান্ত গাছের ছবি দিন</h2>
            </>
          )}
          <div className="doc-page-bottom-btn">
            {ResText ? <></> : <ImageUploader />}
          </div>
        </AIResponseContext.Provider>
      </DoctorImageContext.Provider>
    </main>
  );
};

export default Doctor;
