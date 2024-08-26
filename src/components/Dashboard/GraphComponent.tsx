import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import "./GraphComponent.scss";

const GraphComponent: React.FC = () => {
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

    const dataLength = storedData.length;
    const labels = Array.from(
      { length: dataLength },
      (_, i) => `Dado ${i + 1}`
    );

    const chartData = {
      labels, // Usando índices como labels no eixo X
      datasets: [
        {
          label: "Template Data", // Um label padrão
          data: storedData.map((data) => data.reconciledMeasures[0]), // Usando o primeiro conjunto de dados reconciliados
          fill: false,
          borderColor: "hsl(0, 70%, 50%)", // Cor estática para o gráfico
        },
      ],
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
  }, []); // Remove `edgeNames` das dependências

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
