import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Workflow from "./pages/Workflow";
import Settings from "./pages/Workflow/pages/Settings";
import EnrollmentHistory from "./pages/Workflow/pages/EnrollmentHistory";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workflow/:id" element={<Workflow />} />
        <Route path="/workflow/:id/settings" element={<Settings />} />
        <Route path="/workflow/:id/status" element={<EnrollmentHistory />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;
