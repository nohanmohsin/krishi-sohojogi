import { useContext } from "react";
import { AIResponseContext } from "../contexts/AIResponseContext";
import { DoctorImageContext } from "../contexts/doctorImageContext";

const DiseaseDescription = () => {
  const { ResText } = useContext(AIResponseContext);
  const { image } = useContext(DoctorImageContext);
  if (!ResText.diseaseDetected) {
    alert(
      " দুঃখিত কোন রোগাক্রান্ত উদ্ভিদ ডিটেক্ট হয়নি। অনুগ্রহ করে আবার ছবি দিন"
    );
  }
  console.log(ResText);
  return (
    <div className="disease-description">
      {ResText ? (
        <>
          <img
            src={URL.createObjectURL(image)}
            alt=""
            className="disease-img"
          />
          <h2>{ResText.treeDisease}</h2>
          <h3>বিবরণ</h3>
          <p>{ResText.diseaseInformation}</p>
          <h3>করনীয়</h3>
          <p>{ResText.diseaseRemedy}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DiseaseDescription;
