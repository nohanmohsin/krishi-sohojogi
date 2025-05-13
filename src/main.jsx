import { createBrowserRouter, RouterProvider } from "react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Doctor from "./pages/Doctor.jsx";
import DoctorChat from "./pages/DoctorChat.jsx";
import AudioRecorderComp from "./components/AudioRecorderComp.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/doctor",
    element: <Doctor />,
  },
  {
    path: "/doctor-chat/:instructions",
    element: <DoctorChat />,
  },
  {
    path: "/audio",
    element: <AudioRecorderComp />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
