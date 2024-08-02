import React from "react";
import Functions from "../Sidebar/Functions"; // Adjust the path as necessary

interface FunctionsProps {
  calcularReconciliacao: () => void;
  createAdjacencyMatrix: () => void;
  addNode: (nodeType: string) => void;
  handleFileUploadSuccess: (data: any) => void;
}

const FunctionsComponent: React.FC<FunctionsProps> = ({
  calcularReconciliacao,
  createAdjacencyMatrix,
  addNode,
  handleFileUploadSuccess,
}) => {
  return (
    <Functions
      calcularReconciliacao={calcularReconciliacao}
      createAdjacencyMatrix={createAdjacencyMatrix}
      addNode={addNode}
      handleFileUploadSuccess={handleFileUploadSuccess}
    />
  );
};

export default FunctionsComponent;
