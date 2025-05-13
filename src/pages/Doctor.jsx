import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
            {ResText ? (
              <Link
                to={`/doctor-chat/You are an expert in Agriculture in Bangladesh. you will exclusively help in agricultural queries. Try your best to generate all text in Bangla. Imagine, Previously, I sent you an image of a ${ResText.treeName} plant with ${ResText.treeDisease}. you generated ${ResText.diseaseRemedy} as a treatment. Now you will further help me with my questions about this plant and its diseases`}
              >
                <button className="primary-btn">বিস্তারিত জানুন</button>
              </Link>
            ) : (
              <ImageUploader />
            )}
          </div>
        </AIResponseContext.Provider>
      </DoctorImageContext.Provider>
    </main>
  );
};

export default Doctor;
