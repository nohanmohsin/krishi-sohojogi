import { createPartFromUri, createUserContent, Type } from "@google/genai";
import React, { useEffect, useState } from "react";
import { ai } from "../util/aiFunctions";

const PricePage = () => {
  const [image, setImage] = useState(null);
  const [ResText, setResText] = useState(null);
  function handleImageChange(e) {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  }
  useEffect(() => {
    console.log(ResText);
  }, [ResText]);
  const checkPrice = async () => {
    if (image) {
      const imgBlob = await fetch(URL.createObjectURL(image)).then((r) =>
        r.blob()
      );
      const imgFile = await ai.files.upload({
        file: imgBlob,
        config: { mimeType: image.type },
      });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
          createPartFromUri(imgFile.uri, imgFile.mimeType),
          "",
        ]),
        config: {
          systemInstruction:
            "You are an agricultural expert. you only help farmers and agricultural entrepreneurs, who are exporters figure out the prices they should set based on the market rate currently. you will judge how good the crop is by seeing the size and the color and give it a rating out of 5. Try to give ripe products a higher rating than unripe products. using that you will determine the price of the produce in tons. you will generate this in bdt. you will explain why and how you set the price in great detail. try your best to only generate the productName and ratingDescription in Bangla. make sure there's not much difference between ripe and unripe products prices",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productName: {
                type: Type.STRING,
              },
              productPrice: {
                type: Type.INTEGER,
              },
              productRating: {
                type: Type.INTEGER,
              },
              RatingDescription: {
                type: Type.STRING,
              },
            },
            propertyOrdering: [
              "productName",
              "productPrice",
              "productRating",
              "RatingDescription",
            ],
          },
        },
      });
      setResText(JSON.parse(response.text));
    }
  };
  return (
    <main>
      {ResText ? (
        <>
          <h2>ফসল বিশ্লেষণ</h2>
          <img
            src={URL.createObjectURL(image)}
            alt=""
            className={`fosol-img ${
              ResText.productRating > 3
                ? "green-confidence-img"
                : "red-confidence-img"
            }`}
          />
          <div>
            <div className="price">
              <h1 className="product-price">৳{ResText.productPrice}</h1>
              <span>/টন</span>
            </div>
            <span
              className={
                ResText.productRating > 3
                  ? "green-confidence"
                  : "red-confidence"
              }
            >
              {ResText.productRating}/5
            </span>
          </div>
          <div className="rating-description">
            <h2>রেটিং</h2>
            {ResText.RatingDescription}
          </div>
        </>
      ) : (
        <>
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
          <button onClick={checkPrice}>ফসলের ছবি দিন</button>
        </>
      )}
    </main>
  );
};

export default PricePage;
