import { useState } from "react";
import { createUserContent, createPartFromUri, Type } from "@google/genai";
import { ai } from "../util/aiFunctions";
const ImageUploader = () => {
  const [image, setImage] = useState(null);
  // const [status, setStatus] = useState("idle");

  function handleImageChange(e) {
    if (e.target.files) {
      setImage(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  }

  async function uploadImage() {
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
            "only generate cures and remedies for ill plants. Return a false in diseaseDetected if you see any image that doesn't resemble a plant or the plant seems to be healthy. Try your best to generate the text in Bangla. diseaseRemedyAudioScript will also be in Bangla but with English letters keep the bangla wording very casual and phonetically sound them out in the audio script. make sure the script for audio version of the disease remedy is the same size as the diseaseRemedy",
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
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
              },
              diseaseRemedy: {
                type: Type.STRING,
              },
              diseaseRemedyAudioScript: {
                type: Type.STRING,
              },
            },
            propertyOrdering: [
              "treeName",
              "treeDisease",
              "diseaseDetected",
              "diseaseRemedy",
              "diseaseRemedyAudioScript",
            ],
          },
        },
      });
      console.log(response.text);
    }
  }

  return (
    <div>
      <label htmlFor="imageuploader">upload an image</label>
      <input
        id="imageuploader"
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        hidden
      />
      <button onClick={uploadImage}>upload Image</button>
    </div>
  );
};

export default ImageUploader;
