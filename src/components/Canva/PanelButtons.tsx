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

  const handleToggleGraph = () => {
    // Chama a função toggleGraph original
    toggleGraph();

    // Adiciona a linha no banco de dados local com a estrutura especificada
    // Adiciona a linha no banco de dados local com a estrutura especificada
    const data = {
      id: [7],
      user: ["postgres"],
      time: ["Thu, 29 Aug 2024 12:00:00 GMT"],
      tagname: ["Alucard", "Laravel", "Orion", "Sigma", "Phoenix"],
      tagreconciled: ["110.45", "128.99", "40.73", "11.29", "115.87"],
      tagcorrection: ["1.83", "-0.02", "-0.15", "0.82", "2.03"],
      tagmatrix: [
        [1, -1, -1, 0, 0],
        [0, 0, 1, -1, -1],
      ],
    };

    localStorage.setItem("reconciliationData", JSON.stringify(data));
    console.log("Linha adicionada ao banco de dados local:", data);
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
        onClick={handleToggleGraph}
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
