import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";

const ReconciledDataDisplay: React.FC = () => {
  const [reconciledData, setReconciledData] = useState<any[]>([]);

  const loadReconciledData = () => {
    const storedData = Object.keys(localStorage).map((key) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item).reconciledMeasures : null;
      } catch (error) {
        console.error("Erro ao carregar dados do localStorage:", error);
        return null;
      }
    }).filter(Boolean);

    setReconciledData(storedData);
  };

  useEffect(() => {
    loadReconciledData();

    const handleStorageChange = () => {
      loadReconciledData();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const createRowData = (data: any[], index: number) => {
    return {
      id: ` ${index + 1}`,
      ...data.reduce((acc, value, idx) => {
        acc[`value${idx + 1}`] = value;
        return acc;
      }, {})
    };
  };

  const tableData = reconciledData.map((data, index) => createRowData(data, index));

  return (
    <div className="reconciled-container">
      {reconciledData.length > 0 ? (
        <DataTable 
          value={tableData} 
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
          {Array.from({ length: reconciledData[0].length }).map((_, index) => (
            <Column 
              key={index} 
              field={`value${index + 1}`} 
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
