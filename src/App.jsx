import "./App.css";
import { Link } from "react-router-dom";
import schoolLogo from "../src/assets/school-logo.jpeg";
import doctorLogo from "../src/assets/doctor-logo.svg";
import priceCheckerLogo from "../src/assets/Frame 2.svg";
import sharshongkhepLogo from "../src/assets/sharshongkhepLogo.svg";
function App() {
  return (
    <div className="home">
      <h1 className="landing-heading">কৃষি সহযোগী</h1>
      <div className="logomark">
        <h3 style={{ fontWeight: 200 }}>Brought to you by</h3>
        <img src={schoolLogo} alt="" className="school-logo" />
      </div>
      <h4>
        আপনার কৃষির যাবতীয় সকল সমস্যার সমাধান কৃত্রিম বুদ্ধিমত্তার সাহায্যে
      </h4>
      <div className="container card">
        <img src={doctorLogo} alt="" width={100} className="doctor-logo" />
        <h2>সবুজ সমাধান</h2>
        <p>
          আপনার মতো আপনার গাছ ও অসুস্থ হতে পারে। আমাদের কাছে আছে তার রোগের
          চিকিৎসা
        </p>
        <Link to={"/doctor"}>
          <button className="primary-btn">ডাক্তার দেখান</button>
        </Link>
      </div>
      <div className="container card">
        <img
          src={priceCheckerLogo}
          alt=""
          width={100}
          className="price-checker-logo"
        />
        <h2>বাজারি</h2>
        <p>আপনার ফসলের প্রকৃত বাজার মূল্য জেনে নিন, বর্তমান বাজারের ভিত্তিতে</p>
        <Link to={"/market-prices"}>
          <button className="primary-btn">ফসলের মূল্য বের করুন</button>
        </Link>
      </div>
      <div className="container card">
        <img
          src={sharshongkhepLogo}
          alt=""
          width={100}
          className="price-checker-logo"
        />
        <h2>সারসংক্ষেপ</h2>
        <p>আপনার ফসলের যথাযথ বৃদ্ধির জন্য সার খুজুন</p>
        <Link to={"/fertilizer-rec"}>
          <button className="primary-btn">সার খুঁজুন</button>
        </Link>
      </div>
    </div>
  );
}

export default App;
