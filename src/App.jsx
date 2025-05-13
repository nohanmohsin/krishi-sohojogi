import "./App.css";
import { Link } from "react-router-dom";
import schoolLogo from "../src/assets/school-logo.jpeg";
import doctorLogo from "../src/assets/doctor-logo.svg";
function App() {
  return (
    <div className="home">
      <h1 className="landing-heading">কৃষি সহযোগী</h1>
      <div className="logomark">
        <h3 style={{ fontWeight: 200 }}>Brought to you by</h3>
        <img src={schoolLogo} alt="" className="school-logo" />
      </div>
      <h4>আপনার কৃষির যাবতীয় সকল সুবিধা কৃত্রিম বুদ্ধিমত্তার সাহায্যে</h4>
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
    </div>
  );
}

export default App;
