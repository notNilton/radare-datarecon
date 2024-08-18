import React from "react";
import "./GraphComponent.scss";

interface GraphComponentProps {
  nodes: any[];
  edges: any[];
}

const GraphComponent: React.FC<GraphComponentProps> = ({ nodes, edges }) => {
  return (
    <div className="graph-component">
      <div className="graph-bar-title">
        <a href="analise-resumida">Análise Resumida</a>
      </div>
      <div className="graph-bar-content">
        Aqui é um boilerplate
        {/* Placeholder for graph bar content */}
      </div>
    </div>
  );
};

export default GraphComponent;
