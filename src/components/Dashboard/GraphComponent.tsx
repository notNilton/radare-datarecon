import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import "./GraphComponent.scss";

interface GraphComponentProps {
  nodes: any[];
  edges: any[];
  edgeNames: string[]; // Array de nomes das arestas
}

const GraphComponent: React.FC<GraphComponentProps> = ({ edgeNames }) => {
  const [lineChartData, setLineChartData] = useState<any>(null);

  const loadGraphData = () => {
    const storedData = Object.keys(localStorage)
      .map((key) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch (error) {
          console.error("Erro ao carregar dados do localStorage:", error);
          return null;
        }
      })
      .filter(Boolean);

    // Número de dados que queremos plotar no eixo X (assumindo que cada aresta tem o mesmo número de valores)
    const dataLength = storedData.length;
    const labels = Array.from(
      { length: dataLength },
      (_, i) => `Dado ${i + 1}`
    );

    const chartData = {
      labels, // Usando índices como labels no eixo X
      datasets: edgeNames.map((name, index) => {
        const correspondingData = storedData.map(
          (data) => data.reconciledMeasures[index]
        );
        return {
          label: name, // Nome da aresta como label da linha
          data: correspondingData, // Usando os valores reconciliados correspondentes
          fill: false,
          borderColor: `hsl(${index * 72}, 70%, 50%)`, // Cor dinâmica baseada no índice
        };
      }),
    };

    setLineChartData(chartData);
  };

  useEffect(() => {
    loadGraphData();

    const handleStorageChange = () => {
      loadGraphData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [edgeNames]); // Certifique-se de que só atualiza quando `edgeNames` mudar

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left",
      },
    },
  };

  return (
    <div className="graph-component">
      <div className="graph-bar-title">Análise Resumida</div>
      <div className="graph-bar-content">
        {lineChartData ? (
          <Chart type="line" data={lineChartData} options={lineChartOptions} />
        ) : (
          <div>Nenhum dado disponível para exibição no gráfico</div>
        )}
      </div>
    </div>
  );
};

// Usando React.memo para evitar re-renderizações desnecessárias
export default React.memo(GraphComponent);
