import { useContext } from "react";
import { createUserContent, createPartFromUri, Type } from "@google/genai";
import { ai } from "../util/aiFunctions";
import { AIResponseContext } from "../contexts/AIResponseContext";
import { DoctorImageContext } from "../contexts/doctorImageContext";
const ImageUploader = () => {
  const { image, setImage } = useContext(DoctorImageContext);

  // const [status, setStatus] = useState("idle");
  const { AIResponse, setAIResponse, setLoading } =
    useContext(AIResponseContext);
  if (!image) {
    console.log(image);
  }
  function handleImageChange(e) {
    if (e.target.files) {
      setImage(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  }

  async function uploadImage() {
    setLoading(true);
    if (image) {
      const imgBlob = await fetch(URL.createObjectURL(image)).then((r) =>
        r.blob()
      );
      const imgFile = await ai.files.upload({
        file: imgBlob,
        config: { mimeType: image.type },
      });
      console.log(imgFile.uri);
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
          createPartFromUri(imgFile.uri, imgFile.mimeType),
          "",
        ]),
        config: {
          systemInstruction:
            "you are an expert botanist. generate concise but complete cure for ill plants and its diseases. only generate and remedies for ill plants. Return a false in diseaseDetected if you see any image that doesn't resemble a plant or the plant seems to be healthy. Try your best to generate the text in Bangla. diseaseTreatmentAudioScript will also be in Bangla but with English letters keep the bangla wording very casual and phonetically sound them out in the audio script. make sure the script for audio version of the disease treatment is the same size as the diseaseTreatment",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              treeName: {
                type: Type.STRING,
              },
              diseaseDetected: {
                type: Type.BOOLEAN,
              },
              treeDisease: {
                type: Type.STRING,
              },
              diseaseRemedy: {
                type: Type.STRING,
              },
              diseaseRemedyAudioScript: {
                type: Type.STRING,
              },
              diseaseInformation: {
                type: Type.STRING,
              },
            },
            propertyOrdering: [
              "treeName",
              "treeDisease",
              "diseaseDetected",
              "diseaseRemedy",
              "diseaseRemedyAudioScript",
              "diseaseInformation",
            ],
          },
        },
      });
      setAIResponse(response);
      setLoading(false);
    }
  }

  return (
    <div className="image-uploader">
      <label htmlFor="imageuploader" className="primary-btn">
        ছবি সিলেক্ট করুন
      </label>
      <input
        id="imageuploader"
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        hidden
      />
      {image ? (
        <button onClick={uploadImage} className="primary-btn">
          সমাধান
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ImageUploader;
