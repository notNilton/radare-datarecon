import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface ReconciledRowData {
  id: string;
  [key: string]: number; // Chaves dinâmicas para os valores numéricos
}

const ReconciledDataDisplay: React.FC = () => {
  const [reconciledData, setReconciledData] = useState<ReconciledRowData[]>([]);

  const fetchReconciledData = async () => {
    try {
      const response = await fetch("http://localhost:5000/reconciled-data");
      const data = await response.json();

      if (data.length > 0) {
        // Formata os dados para o estado
        const formattedData = data.map((valueSet: string[], index: number) =>
          createRowData(valueSet[1], index) // valueSet[1] contém os valores reconciliados
        );

        setReconciledData(formattedData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados reconciliados do backend:", error);
    }
  };

  useEffect(() => {
    fetchReconciledData();
  }, []);

  const createRowData = (data: string[], index: number): ReconciledRowData => {
    const rowData: ReconciledRowData = {
      id: `${index + 1}`, // Identificador da linha
    };

    data.forEach((value, idx) => {
      rowData[`V${idx + 1}`] = parseFloat(value); // Associa cada valor a uma chave genérica como `V1`, `V2`, etc.
    });

    return rowData;
  };

  return (
    <div className="reconciled-container">
      {reconciledData.length > 0 ? (
        <DataTable
          value={reconciledData}
          scrollable
          scrollHeight="200px"
          style={{ width: "100%", fontSize: "12px" }}
          className="p-datatable-sm"
        >
          <Column
            field="id"
            header="ID"
            style={{ width: "100px", padding: "4px 8px" }}
          />
          {reconciledData[0] &&
            Object.keys(reconciledData[0])
              .filter((key) => key !== "id")
              .map((key, index) => (
                <Column
                  key={index}
                  field={key}
                  header={`V${index + 1}`} // Cabeçalhos genéricos V1, V2, etc.
                  style={{ width: "80px", padding: "4px 8px" }}
                />
              ))}
        </DataTable>
      ) : (
        <div>Nenhum dado reconciliado disponível</div>
      )}
    </div>
  );
};

export default ReconciledDataDisplay;
