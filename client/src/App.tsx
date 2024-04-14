// import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Workflow from "./pages/Workflow";
import Settings from "./pages/Workflow/pages/Settings";
import EnrollmentHistory from "./pages/Workflow/pages/EnrollmentHistory";
// import useDarkSide from "./hooks/useDarkSide";

const App = () => {
  // const [colorTheme, setTheme] = useDarkSide();
  // React.useEffect(() => {
  //   // Check if system prefers dark mode
  //   const prefersDarkMode = window.matchMedia(
  //     "(prefers-color-scheme: dark)"
  //   ).matches;
  //   console.log("theme ---", { colorTheme, prefersDarkMode });
  //   setTheme(prefersDarkMode ? "dark" : "light");
  // }, []);
  return (
    <div className="bg-white">
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
