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

    if (storedData.length > 0) {
      const labels = storedData[0].names; // Usando os nomes como labels no eixo X

      const chartData = {
        labels, // Usando nomes como labels no eixo X
        datasets: storedData.map((data, index) => ({
          label: `Medição ${index + 1}`,
          data: data.reconciledMeasures || [],
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
        display: false, // Desabilita a exibição da legenda
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
