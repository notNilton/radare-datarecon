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

  const generateRandomValues = (count: number, min: number, max: number) => {
    return Array.from({ length: count }, () =>
      (Math.random() * (max - min) + min).toFixed(2)
    );
  };

  const handleToggleGraph = () => {
    // Chama a função toggleGraph original
    toggleGraph();

    // Recupera os dados existentes do localStorage ou cria uma lista vazia
    const storedData = JSON.parse(localStorage.getItem("reconciliationData") || "[]");

    // Gera um novo id único baseado no comprimento da lista existente
    const newId = storedData.length ? storedData[storedData.length - 1].id + 1 : 1;

    // Novo item para adicionar
    const newItem = {
      id: newId,
      user: "postgres",
      time: new Date().toISOString(),
      tagname: ["Alucard", "Laravel", "Orion", "Sigma", "Phoenix"],
      tagreconciled: generateRandomValues(5, 10, 150), // 5 valores aleatórios entre 10 e 150
      tagcorrection: ["1.83", "-0.02", "-0.15", "0.82", "2.03"],
      tagmatrix: [
        [1, -1, -1, 0, 0],
        [0, 0, 1, -2, -3],
      ],
    };

    // Adiciona o novo item à lista existente e salva de volta no localStorage
    const updatedData = [...storedData, newItem];
    localStorage.setItem("reconciliationData", JSON.stringify(updatedData));
    console.log("Nova linha adicionada ao banco de dados local:", newItem);
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
