import { useState } from "react";
import { createUserContent, createPartFromUri } from "@google/genai";
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
        config: { mimeType: "image/png" },
      });
      console.log(imgFile.uri);
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
          createPartFromUri(imgFile.uri, imgFile.mimeType),
          "",
        ]),
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
