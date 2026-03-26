import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ScholarshipProvider } from "./context/ScholarshipContext";
import { InternshipProvider } from "./context/InternshipContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ScholarshipProvider>
        <InternshipProvider>
          <App />
        </InternshipProvider>
      </ScholarshipProvider>
    </AuthProvider>
  </BrowserRouter>
);
