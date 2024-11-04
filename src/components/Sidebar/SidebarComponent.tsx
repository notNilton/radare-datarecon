import React, { useState, useEffect } from "react";
import { Divider } from "primereact/divider"; 
import MatrixDisplay from "./MatrixDisplay";
import "./SidebarComponent.scss";
import ExistingTags from "./TagDisplayComp";

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
  const [correctionValues, setCorrectionValues] = useState<string[]>([]);

  useEffect(() => {
    // Função para carregar a última tagmatrix e tagcorrection do localStorage
    const loadLastEntryData = () => {
      const storedData = JSON.parse(localStorage.getItem("reconciliationData") || "[]");
      if (Array.isArray(storedData) && storedData.length > 0) {
        const lastEntry = storedData[storedData.length - 1];
        return {
          matrix: lastEntry.tagmatrix || [],
          corrections: lastEntry.tagcorrection || []
        };
      }
      return { matrix: [], corrections: [] };
    };

    // Carrega e define matrixData e correctionValues com a última entrada
    const { matrix, corrections } = loadLastEntryData();
    setMatrixData(matrix);
    setCorrectionValues(corrections);
  }, []); // Apenas carrega uma vez na montagem do componente

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

      {/* Valores de Correção */}
      <div
        className="sidebar-title reconciled"
        onClick={() => toggleSidebarContent("reconciled")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && toggleSidebarContent("reconciled")}
      >
        Valores de Correção
      </div>
      <div
        className={`sidebar-content reconciled${
          visibleSidebarContent["reconciled"] ? "matrix-visible" : ""
        }`}
        style={{
          display: visibleSidebarContent["reconciled"] ? "block" : "none",
        }}
      >
        <ul>
          {correctionValues.length > 0 ? (
            correctionValues.map((value, index) => (
              <li key={index}>{value}</li>
            ))
          ) : (
            <div>Nenhum valor de correção disponível</div>
          )}
        </ul>
      </div>
    </>
  );
};

export default SidebarComponent;
