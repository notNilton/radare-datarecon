import React, { useEffect, useState, useCallback } from 'react';
import { Chart } from 'primereact/chart';
import './GraphComponent.scss';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
}

const GraphComponent: React.FC = () => {
  const [lineChartData, setLineChartData] = useState<ChartData | null>(null);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const updateChartData = useCallback(() => {
    const storedData = JSON.parse(localStorage.getItem("reconciliationData") || "[]");

    if (Array.isArray(storedData) && storedData.length > 0) {
      const numValues = storedData[0].tagreconciled.length;
      
      const datasets = Array.from({ length: numValues }).map((_, valueIndex) => ({
        label: `Valor ${valueIndex + 1}`,
        data: storedData.map(entry => parseFloat(entry.tagreconciled[valueIndex]) || 0),
        fill: false,
        borderColor: `hsl(${(valueIndex * 60) % 360}, 70%, 50%)`,
        tension: 0.1,
      }));

      const labels = storedData.map((_, index) => `Iteração ${index + 1}`);

      const chartData: ChartData = {
        labels,
        datasets,
      };

      setLineChartData(chartData);
    }
  }, []);

  useEffect(() => {
    updateChartData();

    const handleStorageUpdate = () => {
      updateChartData();
    };

    window.addEventListener("localStorageUpdated", handleStorageUpdate);

    return () => {
      window.removeEventListener("localStorageUpdated", handleStorageUpdate);
    };
  }, [updateChartData]);

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
