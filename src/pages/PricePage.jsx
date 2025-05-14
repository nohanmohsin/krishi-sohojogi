import { createPartFromUri, createUserContent, Type } from "@google/genai";
import React, { useEffect, useState } from "react";
import marketDemandIcon from "../assets/market-demand-icon.svg";
import regionalAverageIcon from "../assets/regional-average-icon.svg";
import wheatIcon from "../assets/wheat-icon.svg";
import { ai } from "../util/aiFunctions";

const PricePage = () => {
  const [image, setImage] = useState(null);
  const [ResText, setResText] = useState(null);
  const [addedCrops, setAddedCrops] = useState([]);
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
            "You are an agricultural expert. you only help farmers and agricultural entrepreneurs, who are exporters figure out the prices they should set based on the market rate currently. you will judge how good the crop is by seeing the size and the color and give it a rating out of 5. Try to give ripe products a higher rating than unripe products. using that you will determine the price of the produce in tons. you will generate this in bdt. you will explain why and how you set the price in great detail. try your best to only generate the productName and ratingDescription in Bangla. good products will be priced way higher than bad products",
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
              marketDemand: {
                type: Type.INTEGER,
              },
            },
            propertyOrdering: [
              "productName",
              "productPrice",
              "productRating",
              "RatingDescription",
              "marketDemand",
            ],
          },
        },
      });
      setResText(JSON.parse(response.text));
      setAddedCrops([...addedCrops, JSON.parse(response.text)]);
    }
  };
  return (
    <main className="price-page-main">
      {ResText ? (
        <>
          <h2 style={{ textAlign: "center" }}>ফসল বিশ্লেষণ</h2>
          <img
            src={URL.createObjectURL(image)}
            alt=""
            className={`fosol-img ${
              ResText.productRating > 3
                ? "green-confidence-img"
                : "red-confidence-img"
            }`}
          />
          <div className="price-wrapper">
            <div className="price">
              <h1
                className={`product-price ${
                  ResText.productRating > 3
                    ? "green-confidence-text"
                    : "red-confidence-text"
                }`}
              >
                ৳
                {ResText.productRating > 3
                  ? ResText.productPrice * 10 + 70000
                  : ResText.productPrice - 10000}
              </h1>
              <span>/টন</span>
            </div>
            <span
              className={
                ResText.productRating > 3
                  ? "green-confidence-text"
                  : "red-confidence-text"
              }
            >
              {ResText.productRating}/5
            </span>
          </div>
          <div
            className="crop-description"
            style={{
              backgroundColor:
                ResText.productRating > 3
                  ? "rgba(4, 248, 4, 0.2)"
                  : "rgb(255 2 2 / 44%)",
            }}
          >
            <h3>ফসল তত্ত</h3>
            <div className="foshol-name desc-item">
              <span>ফসল</span>
              <span style={{ fontWeight: 900 }}>{ResText.productName}</span>
            </div>
            <div className="desc-item">
              <span>গুনাগুন</span>
              <span style={{ fontWeight: 900 }}>
                {ResText.productRating > 3 ? "উৎকৃষ্ট" : "অগ্রহণযোগ্য"}
              </span>
            </div>
          </div>
          <section className="price-factor">
            <h3>দামের যৌক্তিকতা</h3>
            <div className="factor-container">
              <img src={marketDemandIcon} alt="" />
              <div className="factor-text">
                <span>বাজার চাহিদা</span>
                <span style={{ fontWeight: 900 }}>
                  {ResText.marketDemand > 80
                    ? "উচ্চ"
                    : ResText.marketDemand > 50
                    ? "তুলনামুলক কম"
                    : "অত্যন্ত কম"}
                </span>
              </div>
            </div>
            <div className="factor-container">
              <img src={regionalAverageIcon} alt="" />
              <div className="factor-text">
                <span>আঞ্চলিক গড় মূল্য</span>
                <span style={{ fontWeight: 900 }}>
                  ৳
                  {ResText.productRating > 3
                    ? ResText.productPrice * 10 + 70000
                    : ResText.productPrice - 10000}
                </span>
              </div>
            </div>
            <div className="factor-container"></div>
          </section>
          <div className="rating-description">
            <h2 style={{ marginBottom: "10px" }}>AI নোট্‌স</h2>
            {ResText.RatingDescription}
          </div>
          <button
            className="primary-btn"
            onClick={() => {
              setResText(null);
              setImage(null);
            }}
          >
            সংরক্ষণ করুন
          </button>
        </>
      ) : (
        <main className="price-page-initial">
          <div className="bazari-image-selector">
            <h2>নতুন ফসল বিশ্লেষণ করুন</h2>
            <label htmlFor="imageuploader" className="primary-btn">
              ফসলের ছবি সিলেক্ট করুন
            </label>
            <input
              id="imageuploader"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              hidden
            />

            {image && (
              <>
                <button onClick={checkPrice} className="primary-btn">
                  +
                </button>
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  className="bazari-image-selector-preview"
                />
              </>
            )}
          </div>
          <div className="today-market">
            <h2>আজকের বাজার মূল্যসমূহ</h2>
            <div className="today-market-product">
              <div className="today-market-product-name">
                <img
                  src={wheatIcon}
                  alt=""
                  className="today-market-product-img"
                />
                <h3>গম</h3>
              </div>
              <div className="today-market-product-price">
                <h3>৳400000</h3>
              </div>
            </div>
          </div>
          <div className="your-crops">
            <h2>আপনার ফসলসমুহ</h2>
            {addedCrops &&
              addedCrops.map((crop) => (
                <div
                  className={`crop ${
                    crop.productRating > 3
                      ? "green-confidence-crop"
                      : "red-confidence-crop"
                  }`}
                >
                  <h3>{crop.productName}</h3>
                  <span>
                    {crop.productRating > 3
                      ? crop.productPrice * 10 + 70000
                      : crop.productPrice - 10000}
                  </span>
                </div>
              ))}
          </div>
        </main>
      )}
    </main>
  );
};

export default PricePage;
