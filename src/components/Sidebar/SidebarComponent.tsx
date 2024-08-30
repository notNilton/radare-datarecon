import React, { useState, useEffect } from "react";
import { Divider } from "primereact/divider"; 
import MatrixDisplay from "./MatrixDisplay";
import "./SidebarComponent.scss";
import ExistingTags from "./TagDisplayComp";
import ReconciledDataComp from "./ReconciledDataComp";  // Importa o novo componente
import { createAdjacencyMatrix } from "../Canva/utils/Reconciliacao";

interface SidebarComponentProps {
  nodes: any[];
  edges: any[];
  edgeNames: string[]; 
}

const SidebarComponent: React.FC<SidebarComponentProps> = ({
  nodes,
  edges,
  edgeNames,
}) => {
  const [visibleSidebarContent, setVisibleSidebarContent] = useState<{
    [key: string]: boolean;
  }>({
    "tags-existentes": true,
    "tags-selecionadas": true,
    matriz: true,
    reconciled: true,
  });

  const [matrixData, setMatrixData] = useState<number[][]>([]);

  useEffect(() => {
    const newMatrix = createAdjacencyMatrix(nodes, edges);
    setMatrixData(newMatrix);
  }, [nodes, edges]);

  const toggleSidebarContent = (key: string) => {
    setVisibleSidebarContent((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <>
      {/* Tags Existentes */}
      <div
        className="sidebar-title"
        onClick={() => toggleSidebarContent("tags-existentes")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && toggleSidebarContent("tags-existentes")}
      >
        Tags Existentes
      </div>
      <div
        className="sidebar-content"
        style={{
          display: visibleSidebarContent["tags-existentes"]
            ? "block"
            : "none",
        }}
      >
        <ExistingTags edgeNames={edgeNames} />
      </div>

      <Divider />

      {/* Matriz de Incidência */}
      <div
        className="sidebar-title matrix"
        onClick={() => toggleSidebarContent("matriz")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && toggleSidebarContent("matriz")}
      >
        Matriz de Incidência
      </div>
      <div
        className={`sidebar-content matrix${
          visibleSidebarContent["matriz"] ? "matrix-visible" : ""
        }`}
        style={{
          display: visibleSidebarContent["matriz"] ? "block" : "none",
        }}
      >
        <div className="matrix-container">
          <MatrixDisplay matrix={matrixData} />
        </div>
      </div>

      <Divider />

      {/* Dados Reconciliados */}
      <div
        className="sidebar-title reconciled"
        onClick={() => toggleSidebarContent("reconciled")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && toggleSidebarContent("reconciled")}
      >
        Dados Reconciliados
      </div>
      <div
        className={`sidebar-content reconciled${
          visibleSidebarContent["reconciled"] ? "matrix-visible" : ""
        }`}
        style={{
          display: visibleSidebarContent["reconciled"] ? "block" : "none",
        }}
      >
        <ReconciledDataComp /> {/* Usa o componente ReconciledDataComp */}
      </div>
    </>
  );
};

export default SidebarComponent;
