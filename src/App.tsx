import React, { useState } from "react";
import "./App.scss";
import "./styles/global.css";
import Node from "./components/Canva/Node";
import AboutModal from "./components/About/AboutModal";
import NavbarComponent from "./components/Navbar/NavbarComponent";

const version = require("../package.json").version;

const App: React.FC = () => {
  const [showAbout, setShowAbout] = useState<boolean>(false);

  const toggleAboutPopup = () => {
    setShowAbout(!showAbout);
  };

  return (
    <div className="app-container">
      <NavbarComponent version={version} toggleAboutPopup={toggleAboutPopup} />

      <Node />

      <AboutModal showAbout={showAbout} toggleAboutPopup={toggleAboutPopup} />
    </div>
  );
};

export default App;
