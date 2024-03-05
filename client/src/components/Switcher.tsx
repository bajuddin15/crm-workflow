import { useState } from "react";
import useDarkSide from "../hooks/useDarkSide";
import { MdLightMode, MdOutlineLightMode } from "react-icons/md";

export default function Switcher() {
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState<boolean>(colorTheme === "dark");

  const toggleDarkMode = (checked: boolean) => {
    setDarkSide(checked);
    setTheme(checked ? "dark" : "light");
  };

  return (
    <>
      {darkSide ? (
        <div
          className="border border-gray-600 p-[7px] rounded-md bg-slate-800 cursor-pointer"
          onClick={() => toggleDarkMode(false)}
        >
          <MdOutlineLightMode size={20} />
        </div>
      ) : (
        <div
          className="border border-gray-400 p-[7px] rounded-md bg-gray-100 cursor-pointer"
          onClick={() => toggleDarkMode(true)}
        >
          <MdLightMode size={20} />
        </div>
      )}
    </>
  );
}
