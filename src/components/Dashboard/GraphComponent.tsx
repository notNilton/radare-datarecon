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
          return item ? JSON.parse(item).reconciledMeasures : null;
        } catch (error) {
          console.error("Erro ao carregar dados do localStorage:", error);
          return null;
        }
      })
      .filter(Boolean);

    if (storedData.length > 0) {
      const dataLength = storedData[0].length;
      const labels = Array.from(
        { length: dataLength },
        (_, i) => `Dado ${i + 1}`
      );

      const chartData = {
        labels, // Usando índices como labels no eixo X
        datasets: storedData.map((data, index) => ({
          label: `Dataset ${index + 1}`,
          data: data || [],
          fill: false,
          borderColor: `hsl(${index * 72}, 70%, 50%)`, // Cor dinâmica baseada no índice
        })),
      };

      setLineChartData(chartData);
    } else {
      setLineChartData(null);
    }
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
  }, []); // Não há props a serem monitoradas

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
