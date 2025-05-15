import { Type } from "@google/genai";
import { useEffect, useState } from "react";
import Select from "react-select";
import { ai } from "../util/aiFunctions";
import dupeChart from "../assets/dupe-chart.svg";
import wheatIcon from "../assets/wheat-icon.svg";
const Fertilizer = () => {
  const products = [
    {
      fertilizerName: "ইউরিয়া ৪৬-০-০",
      fertilizerID: 1,
      fertilizerDesc: "মাটিতে নাইট্রোজেন সরবরাহের জন্য উপযোগী",
      fertilizerPrice: 3000,
    },
    {
      fertilizerName: "টিএসপি",
      fertilizerID: 2,
      fertilizerDesc: "ফসফরাস ও ক্যালসিয়ামের যোগান দেয়।  ",
      fertilizerPrice: 4000,
    },
  ];
  const [optionPicked, setOptionPicked] = useState("");
  const [ResText, setResText] = useState(null);
  useEffect(() => {
    console.log(ResText);
  }, [ResText]);
  const options = [
    { value: "Rice", label: "ধান" },
    { value: "Jute", label: "পাট" },
  ];
  const suggestFertilizer = async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Crop: ${optionPicked.value}
            Region: Sherpur
Soil Type: Clay
Previous Crop: rice`,
      config: {
        systemInstruction: `you are an agricultural expert in Bangladesh. you will suggest fertilizers for crops such as rice, jute etc AI System Instructions: Fertilizer Suggestions for Bangladeshi Crops
The AI should provide fertilizer recommendations based on crop type, region, season, and optionally soil type, land size, and previous crop. Suggestions must include the names of fertilizers, dosage per unit of land (e.g., kg per decimal or hectare), and instructions on how to apply the fertilizer. Generate response in Bangla. You have to generate an application amount for how many KG fertilizer needs to be applied per bigha.  it will always be larger than 10 KG.
you have to generate a fertilizer ID. if you are recommending Urea then it is 1, if you are recommending TSP then it is 2, if you are recommending DAP it is 3. you may only choose fertilizers from these 3 options. You have to generate an application instruction step by step in applicationSteps
Input Format:
Crop: [Name]
Region: [Optional]
Season: [Kharif/Rabi/Boro]
Soil Type: [Optional]
Land Size: [Optional]
Previous Crop: [Optional]

Example Input:
Crop: Rice
Region: Jessore
Season: Boro
Soil Type: Clay
Land Size: 1 bigha
Previous Crop: Mustard

Example Output:
fertilizerName: Urea
fertilizerID:1
applicationInstructions: সার ব্যবহারের সময় কিছু বিষয় মনে রাখতে হবে:
মাটির পরীক্ষা করে নিলে ভালো হয়, এতে সঠিক পরিমাণে সার ব্যবহার করা যায়।
এঁটেল মাটি সাধারণত পানি ধরে রাখতে পারে, তাই অতিরিক্ত সেচ পরিহার করুন।
বৃষ্টি বেশি হলে ইউরিয়া সারের উপরি প্রয়োগের পরিমাণ কমিয়ে দিন।
বোরো মৌসুমে ঠান্ডার কারণে চারা দুর্বল হয়ে গেলে, অতিরিক্ত ১ কেজি ইউরিয়া প্রতি বিঘা জমিতে প্রয়োগ করতে পারেন।
applicationAmount: 20`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fertilizerName: {
              type: Type.STRING,
            },
            fertilizerID: {
              type: Type.INTEGER,
            },
            applicationSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            applicationAmount: {
              type: Type.NUMBER,
            },
          },
          propertyOrdering: [
            "fertilizerName",
            "fertilizerID",
            "applicationSteps",
            "applicationAmount",
          ],
        },
      },
    });
    setResText(JSON.parse(response.text));
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "400px",
      borderRadius: "5px",
      boxShadow: "none",
      textAlign: "left",
    }),
    options: (provided, state) => ({
      ...provided,
      color: "#e9e9e9",
      backgroundColor: state.isSelected ? " #1ea145" : "white",
    }),
  };
  return (
    <main>
      {ResText ? (
        <>
          <div className="card crop-information-fertilizer">
            <div className="aside">
              <h1>{optionPicked.label}</h1>
              <span>জমি: 5.2 একর</span>
            </div>
            <img
              src={wheatIcon}
              alt=""
              style={{ width: "40px", height: "40px", display: "inline-block" }}
            />
          </div>
          <img src={dupeChart} alt="" width={"100%"} />
          <section className="recommended-fertilizer-section">
            <h3>প্রয়োজনীয় সার</h3>
            <h2>
              {
                products.find(
                  (product) => product.fertilizerID === ResText.fertilizerID
                ).fertilizerName
              }
            </h2>
            <span>পরিমান: {ResText.applicationAmount}kg/একর</span>
            <h1>
              ৳
              {
                products.find(
                  (product) => product.fertilizerID === ResText.fertilizerID
                ).fertilizerPrice
              }
            </h1>
            <button className="order-fertilizer-btn-main primary-btn">
              কিনুন
            </button>
          </section>
          <section className="application-steps card">
            <h2>নির্দেশনা</h2>
            {ResText.applicationSteps.map((step, index) => (
              <div className="application-step">
                <span className="index">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </section>
        </>
      ) : (
        <>
          {/* <Select
        options={options}
        styles={customStyles}
        onChange={(option) => {
          setOptionPicked(option);
        }}
      />
      <button onClick={suggestFertilizer} className="primary-btn">
        সার খুজুন
      </button>
      <div className="products">
        <h2>আমাদের পণ্যসমূহ</h2>
        {products.map((product) => (
          <div className="fertilizer-dummy-product">
            <div>
<h3>{product.fertilizerName}</h3>
            <span>{product.fertilizerDesc}</span>
            <span>৳{product.fertilizerPrice}</span>

            </div>
            <button className="order-dummy">কিনুন</button>
          </div>
        ))} */}
          <Select
            options={options}
            styles={customStyles}
            onChange={(option) => {
              setOptionPicked(option);
            }}
          />
          <button onClick={suggestFertilizer} className="primary-btn">
            সার খুজুন
          </button>
          <div className="products">
            <h2>আমাদের পণ্যসমূহ</h2>
            {products.map((product) => (
              <div className="fertilizer-dummy-product">
                <div className="dummy-info">
                  <h3>{product.fertilizerName}</h3>
                  <p>{product.fertilizerDesc}</p>
                  <h3 className="dummy-price">৳{product.fertilizerPrice}</h3>
                </div>
                <button className="order-dummy primary-btn">কিনুন</button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Fertilizer;
