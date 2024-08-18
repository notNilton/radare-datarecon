import React, { useState, useEffect } from "react";
import { Tag } from 'primereact/tag'; // Importando o componente Tag do PrimeReact
import { Divider } from 'primereact/divider'; // Importando o componente Divider do PrimeReact
import MatrixDisplay from "./MatrixDisplay";

import { createAdjacencyMatrix } from "../Canva/utils/CreateAdjMatrix";
import "./SidebarComponent.scss";
import SelectedTags from "./SelectedTags";
import ExistingTags from "./ExistingTags";

interface SidebarComponentProps {
  nodes: any[];
  edges: any[];
}

const SidebarComponent: React.FC<SidebarComponentProps> = ({
  nodes,
  edges,
}) => {
  const [visibleSidebarContent, setVisibleSidebarContent] = useState<{
    [key: string]: boolean;
  }>({
    "arvore-funcionalidades": true,
    analise: true,
    matriz: true,
    classificacao: true,
    "tags-selecionadas": true,
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
    <div className="sidebar-component">
      {/* Tags Existentes - Cannot be minimized */}
      <div className="sidebar-title">Tags Existentes</div>
      <div className="sidebar-content">
        <ExistingTags />  
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
        <SelectedTags/>
      </div>
      

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
    </div>
  );
};

export default SidebarComponent;
