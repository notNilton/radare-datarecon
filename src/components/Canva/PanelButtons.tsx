import React, { useRef } from "react";
import { Button } from "primereact/button";
import "./PanelButtons.scss"; // Importando o arquivo SCSS

interface PanelButtonsProps {
  addNode: (nodeType: string) => void;
  showNodesAndEdges: () => void;
  toggleSidebar: () => void;
  toggleGraph: () => void;
  handleReconcile: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSidebarVisible: boolean;
  isGraphVisible: boolean;
}

const PanelButtons: React.FC<PanelButtonsProps> = ({
  addNode,
  toggleSidebar,
  toggleGraph,
  handleReconcile,
  handleFileUpload,
  isSidebarVisible,
  isGraphVisible,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="panel-buttons-container">
      <Button
        label="Adicionar Input"
        icon="pi pi-plus"
        onClick={() => addNode("type1")}
        className="p-button-sm p-button-primary"
      />
      <Button
        label="Adicionar Output"
        icon="pi pi-plus"
        onClick={() => addNode("type2")}
        className="p-button-sm p-button-primary"
      />{" "}
      <Button
        label="Adicionar Nódulo 1-1"
        icon="pi pi-plus"
        onClick={() => addNode("type1")}
        className="p-button-sm p-button-primary"
      />
      <Button
        label="Adicionar Nódulo 1-2"
        icon="pi pi-plus"
        onClick={() => addNode("type2")}
        className="p-button-sm p-button-primary"
      />
      <Button
        label="Adicionar Nódulo 2-1"
        icon="pi pi-plus"
        onClick={() => addNode("type2")}
        className="p-button-sm p-button-primary"
      />
      <Button
        label={isSidebarVisible ? "Esconder Sidebar" : "Mostrar Sidebar"}
        icon={isSidebarVisible ? "pi pi-eye-slash" : "pi pi-eye"}
        onClick={toggleSidebar}
        className="p-button-sm p-button-info"
      />
      <Button
        label={isGraphVisible ? "Esconder Gráfico" : "Mostrar Gráfico"}
        icon={isGraphVisible ? "pi pi-eye-slash" : "pi pi-eye"}
        onClick={toggleGraph}
        className="p-button-sm p-button-info"
      />
      <Button
        label="Reconciliar Dados"
        icon="pi pi-refresh"
        onClick={handleReconcile}
        className="p-button-sm p-button-success"
      />
      <Button
        label="Upload Arquivo"
        icon="pi pi-upload"
        onClick={handleClick}
        className="p-button-sm p-button-secondary p-mt-2"
      />
      <input
        type="file"
        accept=".json,.csv"
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default PanelButtons;
