import React, { useState } from "react";
import "./App.scss";
import "./styles/global.css";
import "./components/Canva/Node.css";
import Node from "./components/Canva/Node";
import AboutModal from "./components/About/AboutModal";
import NavbarComponent from "./components/Navbar/NavbarComponent";
import TabComponent from "./components/Navbar/TabsComponent";
import GraphComponent from "./components/Dashboard/GraphComponent";

const version = require("../package.json").version;

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("Aba1");
  const [showAbout, setShowAbout] = useState<boolean>(false);

  const handleTabClick = (tabName: string) => {
    setCurrentTab(tabName);
  };

  const toggleAboutPopup = () => {
    setShowAbout(!showAbout);
  };

  // State and handlers for FunctionButtons
  // const [nodes, setNodes] = useState<any[]>([]);
  // // const [edges, setEdges] = useState<any[]>([]);

  // const atualizarProgresso = (message: string) => {
  //   console.log(message);
  // };

  // const addNode = (nodeType: string) => {
  //   console.log(`Add node of type: ${nodeType}`);
  //   // Logic to add a node
  // };

  return (
    <div className="app-container">
      <NavbarComponent version={version} toggleAboutPopup={toggleAboutPopup} />

      <div className="central-area">
        <Node />
      </div>

      <TabComponent currentTab={currentTab} handleTabClick={handleTabClick} />

      <GraphComponent />

      <AboutModal showAbout={showAbout} toggleAboutPopup={toggleAboutPopup} />
    </div>
  );
};

export default App;
