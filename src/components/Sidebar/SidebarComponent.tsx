import React, { useState } from "react";

interface SidebarComponentProps {
  nodes: any[];
  edges: any[];
  setNodes: (nodes: any[]) => void;
  setEdges: (edges: any[]) => void;
  atualizarProgresso: (message: string) => void;
  addNode: (nodeType: string) => void;
}

const SidebarComponent: React.FC<SidebarComponentProps> = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  atualizarProgresso,
  addNode,
}) => {
  const [visibleSidebarContent, setVisibleSidebarContent] = useState<{
    [key: string]: boolean;
  }>({
    "arvore-funcionalidades": true,
    analise: true,
    matriz: true,
    classificacao: true,
    "tags-originais": true,
    "tags-reconciliadas": true,
    "erros-das-tags": true,
  });

  const toggleSidebarContent = (key: string) => {
    setVisibleSidebarContent((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <div className="l-sidebar-structure">
      <div
        className="sidebar-title"
        onClick={() => toggleSidebarContent("arvore-funcionalidades")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter" && toggleSidebarContent("arvore-funcionalidades")
        }
      >
        Árvore de Funcionalidades
      </div>
      <div
        className="sidebar-content"
        style={{
          display: visibleSidebarContent["arvore-funcionalidades"]
            ? "block"
            : "none",
        }}
      ></div>
      <div
        className="sidebar-title"
        onClick={() => toggleSidebarContent("analise")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && toggleSidebarContent("analise")}
      >
        Análise
      </div>
      <div
        className="sidebar-content"
        style={{
          display: visibleSidebarContent["analise"] ? "block" : "none",
        }}
      >
        {/* Placeholder for Análise content */}
      </div>
      <div
        className="sidebar-title"
        onClick={() => toggleSidebarContent("matriz")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && toggleSidebarContent("matriz")}
      >
        Matriz
      </div>
      <div
        className="sidebar-content"
        style={{
          display: visibleSidebarContent["matriz"] ? "block" : "none",
        }}
      >
        {/* Placeholder for Matriz content */}
      </div>
      <div
        className="sidebar-title"
        onClick={() => toggleSidebarContent("classificacao")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter" && toggleSidebarContent("classificacao")
        }
      >
        Classificação
      </div>
      <div
        className="sidebar-content"
        style={{
          display: visibleSidebarContent["classificacao"] ? "block" : "none",
        }}
      >
        {/* Placeholder for Classificação content */}
      </div>
    </div>
  );
};

export default SidebarComponent;
