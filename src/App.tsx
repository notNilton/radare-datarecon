import React, { useState } from "react";
import "./App.scss";
import "./styles/global.css";
import Node from "./components/Canva/Node";
import NavbarComponent from "./components/Navbar/NavbarComponent";

const App: React.FC = () => {
  const [showAbout, setShowAbout] = useState<boolean>(false);

  const toggleAboutPopup = () => {
    setShowAbout(!showAbout);
  };

  return (
    <div className="app-container">
      <NavbarComponent toggleAboutPopup={toggleAboutPopup} version={""} />

      <Node />
    </div>
  );
};

export default App;
