import React from "react";
import { Button } from "@mui/material";
import FileUpload from "../Canva/UploadFile";

interface FunctionsProps {
  calcularReconciliacao: () => void;
  createAdjacencyMatrix: () => void;
  addNode: (nodeType: string) => void;
  handleFileUploadSuccess: (data: any) => void;
}

const Functions: React.FC<FunctionsProps> = ({
  calcularReconciliacao,
  createAdjacencyMatrix,
  addNode,
  handleFileUploadSuccess,
}) => {
  return (
    <div className="funcoes-component">
      <h3>Funções Disponíveis</h3>
      <Button
        variant="contained"
        color="primary"
        onClick={calcularReconciliacao}
      >
        Reconciliar
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => createAdjacencyMatrix()}
      >
        Matriz
      </Button>
      <Button variant="contained" onClick={() => createAdjacencyMatrix()}>
        Valores
      </Button>
      <Button variant="contained" onClick={() => createAdjacencyMatrix()}>
        Tolerâncias
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => addNode("cnOneTwo")}
      >
        Adc Nó
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => addNode("cnOneTwo")}
      >
        Adc Nó*
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => addNode("input")}
      >
        Adc E.
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => addNode("output")}
      >
        Adc S.
      </Button>
      <FileUpload onFileUploadSuccess={handleFileUploadSuccess} />
    </div>
  );
};

export default Functions;
