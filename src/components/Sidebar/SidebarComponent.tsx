import React, { useState, useEffect } from "react";
import { Divider } from "primereact/divider"; 
import "./SidebarComponent.scss";

interface CorrectionEntry {
  id: number;
  values: string[];
}

const SidebarComponent: React.FC = () => {
  const [visibleSidebarContent, setVisibleSidebarContent] = useState<{
    [key: string]: boolean;
  }>({
    "tags-existentes": true,
    "tags-selecionadas": true,
    matriz: true,
    reconciled: true,
  });

  const [correctionValues, setCorrectionValues] = useState<CorrectionEntry[]>([]);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [matrixData, setMatrixData] = useState<number[][]>([]);

  useEffect(() => {
    // Função para carregar todas as tagcorrection do localStorage
    const loadAllCorrectionValues = (): CorrectionEntry[] => {
      const storedData = JSON.parse(localStorage.getItem("reconciliationData") || "[]");
      if (Array.isArray(storedData)) {
        return storedData.map((entry: { id: number; tagcorrection: string[] }) => ({
          id: entry.id,
          values: entry.tagcorrection || [],
        }));
      }
      return [];
    };

    // Função para carregar tagname e tagmatrix da última entrada
    const loadLastEntryData = () => {
      const storedData = JSON.parse(localStorage.getItem("reconciliationData") || "[]");
      if (Array.isArray(storedData) && storedData.length > 0) {
        const lastEntry = storedData[storedData.length - 1];
        
        if (lastEntry.tagname) {
          console.log("Valores de tagname da última entrada:", lastEntry.tagname);
          setExistingTags(lastEntry.tagname);
        }
        
        if (lastEntry.tagmatrix) {
          setMatrixData(lastEntry.tagmatrix);
        }
      }
    };

    // Carrega e define correctionValues, existingTags e matrixData
    setCorrectionValues(loadAllCorrectionValues());
    loadLastEntryData();
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
        <div className="tag-container">
          {existingTags.map((tag, index) => (
            <div key={index} className="tag-item">
              {tag}
            </div>
          ))}
        </div>
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
          <table>
            <tbody>
              {matrixData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
        <table>
          <thead>
            <tr>
              <th>ID</th>
              {correctionValues.length > 0 &&
                correctionValues[0].values.map((_, index) => (
                  <th key={index}>Valor {index + 1}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {correctionValues.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                {entry.values.map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SidebarComponent;