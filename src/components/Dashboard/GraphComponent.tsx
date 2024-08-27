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
      // Ordena os dados com base no timestamp ou ID
      const sortedData = storedData.sort((a, b) => a.id - b.id);

      // Cria labels para cada iteração
      const labels = sortedData.map((_, index) => `Iteração ${index + 1}`);

      // Cria um dataset para cada valor reconciliado
      const datasets = sortedData[0].reconciledata[0].values.map(
        (_: number, measureIndex: number) => ({
          label: `Medida ${measureIndex + 1}`,
          data: sortedData.map(
            (data) => data.reconciledata[0].values[measureIndex]
          ),
          fill: false,
          borderColor: `hsl(${measureIndex * 72}, 70%, 50%)`,
        })
      );

      const chartData = {
        labels, // Iterações no eixo X
        datasets, // Dados reconciliados no eixo Y
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
  }, []);

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

export default React.memo(GraphComponent);
