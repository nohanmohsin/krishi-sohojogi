import "./App.css";
import { Link } from "react-router-dom";
function App() {
  return (
    <div>
      <h1>
        কৃষি সহযোগী <br />
      </h1>
      <p>আপনার গাছের যাবতীয় সকল চিকিৎসা</p>
      <Link to={"/doctor"}>ডাক্তার দেখান</Link>
    </div>
  );
}

export default App;
