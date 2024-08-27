import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";

interface ReconciledRowData {
  id: string;
  [key: string]: number | string; // Define que pode haver várias chaves dinâmicas com valores numéricos ou string
}

const ReconciledDataDisplay: React.FC = () => {
  const [reconciledData, setReconciledData] = useState<ReconciledRowData[]>([]);

  const loadReconciledData = () => {
    const storedData = Object.keys(localStorage)
      .map((key) => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsedItem = JSON.parse(item);
            // Garantia de que `reconciledata` e `values` não são null ou undefined
            return parsedItem.reconciledata?.[0]?.values || [];
          }
          return [];
        } catch (error) {
          console.error("Erro ao carregar dados do localStorage:", error);
          return [];
        }
      });

    // Formata os dados para o estado
    const formattedData = storedData.map((data, index) =>
      createRowData(data, index)
    );

    setReconciledData(formattedData);
  };

  useEffect(() => {
    loadReconciledData();

    const handleStorageChange = () => {
      loadReconciledData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const createRowData = (data: number[], index: number): ReconciledRowData => {
    const rowData: ReconciledRowData = {
      id: `${index + 1}`,
    };

    data.forEach((value, idx) => {
      rowData[`value${idx + 1}`] = value;
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
          style={{ width: '100%', fontSize: '12px' }}
          className="p-datatable-sm"
        >
          <Column
            field="id"
            header="ID"
            body={(rowData) => <Tag value={rowData.id} />}
            style={{ width: '100px', padding: '4px 8px' }}
          />
          {reconciledData[0] && Object.keys(reconciledData[0]).filter(key => key !== 'id').map((key, index) => (
            <Column
              key={index}
              field={key}
              header={`V${index + 1}`}
              style={{ width: '80px', padding: '4px 8px' }}
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
