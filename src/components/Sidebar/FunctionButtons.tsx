import React from "react";
import "./FunctionButtons.scss";

interface FunctionButtonsProps {
  nodes: any[];
  edges: any[];
  setNodes: (nodes: any[]) => void;
  setEdges: (edges: any[]) => void;
  atualizarProgresso: (message: string) => void;
  addNode: (nodeType: string) => void;
}

const FunctionButtons: React.FC<FunctionButtonsProps> = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  atualizarProgresso,
  addNode,
}) => {
  const handleReconciliation = () => {
    console.log("Reconciliation button clicked");
    atualizarProgresso("Reconciliation started");
    // Your reconciliation logic here
  };

  const handleAdjacencyMatrix = () => {
    console.log("Adjacency Matrix button clicked");
    // Your adjacency matrix logic here
  };

  const handleValues = () => {
    console.log("Values button clicked");
    // Your values logic here
  };

  const handleTolerances = () => {
    console.log("Tolerances button clicked");
    // Your tolerances logic here
  };

  return (
    <div className="function-buttons">
      <button className="button run-button" onClick={handleReconciliation}>
        Reconciliar
      </button>
      <button className="button vis-button" onClick={handleAdjacencyMatrix}>
        Matriz
      </button>
      <button className="button vis-button" onClick={handleValues}>
        Valores
      </button>
      <button className="button vis-button" onClick={handleTolerances}>
        Tolerâncias
      </button>
      <button className="button add-button" onClick={() => addNode("cnOneTwo")}>
        Adc Nó
      </button>
      <button className="button add-button" onClick={() => addNode("cnOneTwo")}>
        Adc Nó*
      </button>
      <button className="button add-button" onClick={() => addNode("input")}>
        Adc E.
      </button>
      <button className="button add-button" onClick={() => addNode("output")}>
        Adc S.
      </button>
    </div>
  );
};

export default FunctionButtons;
