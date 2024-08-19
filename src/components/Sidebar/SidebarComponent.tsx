import React, { useState, useEffect } from "react";
import { Tag } from "primereact/tag"; // Importando o componente Tag do PrimeReact
import { Divider } from "primereact/divider"; // Importando o componente Divider do PrimeReact
import MatrixDisplay from "./MatrixDisplay";

import { createAdjacencyMatrix } from "../Canva/utils/CreateAdjMatrix";
import "./SidebarComponent.scss";
import SelectedTags from "./SelectedTags";
import ExistingTags from "./ExistingTags";

interface SidebarComponentProps {
  nodes: any[];
  edges: any[];
  edgeNames: string[]; // Adicione esta linha
}

const SidebarComponent: React.FC<SidebarComponentProps> = ({
  nodes,
  edges,
  edgeNames, // Receba edgeNames como prop
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

      {/* Tags Selecionadas */}
      <div
        className="sidebar-title"
        onClick={() => toggleSidebarContent("tags-selecionadas")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter" && toggleSidebarContent("tags-selecionadas")
        }
      >
        Tags Selecionadas
      </div>
      <div
        className="sidebar-content"
        style={{
          display: visibleSidebarContent["tags-selecionadas"]
            ? "block"
            : "none",
        }}
      >
        <SelectedTags />
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
        <div className="reconciled-container">
          <MatrixDisplay matrix={matrixData} />
          <MatrixDisplay matrix={matrixData} />
          <MatrixDisplay matrix={matrixData} /><MatrixDisplay matrix={matrixData} /><MatrixDisplay matrix={matrixData} /><MatrixDisplay matrix={matrixData} /><MatrixDisplay matrix={matrixData} /><MatrixDisplay matrix={matrixData} /><MatrixDisplay matrix={matrixData} /><MatrixDisplay matrix={matrixData} /><MatrixDisplay matrix={matrixData} /><MatrixDisplay matrix={matrixData} />
        </div>
      </div>
    </>
  );
};

export default SidebarComponent;
