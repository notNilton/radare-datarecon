// TabComponent.tsx
import React from "react";

interface TabComponentProps {
  currentTab: string;
  handleTabClick: (tabName: string) => void;
}

const TabComponent: React.FC<TabComponentProps> = ({
  currentTab,
  handleTabClick,
}) => {
  return (
    <div className="tab-structure">
      {["Aba1", "Aba2", "Aba3", "Aba4", "Aba5"].map((tab) => (
        <div
          key={tab}
          className={`tab ${currentTab === tab ? "active" : ""}`}
          onClick={() => handleTabClick(tab)}
        >
          <a href={tab.toLowerCase()}>{tab}</a>
        </div>
      ))}
    </div>
  );
};

export default TabComponent;
