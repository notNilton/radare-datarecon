// src/components/GraphComponent.tsx

import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import './GraphComponent.scss';

const GraphComponent: React.FC = () => {
  const [lineChartData, setLineChartData] = useState(null);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  useEffect(() => {
    // Função para buscar todos os dados do localStorage e atualizar o estado
    const updateChartData = () => {
      const storedData = JSON.parse(localStorage.getItem("reconciliationData") || "[]");

      // Verifica se existem dados armazenados e itera sobre cada entrada
      if (Array.isArray(storedData)) {
        const datasets = storedData.map((entry: any, index: number) => ({
          label: `Iteração ${entry.id}`,
          data: entry.tagreconciled.map(Number), // Converte os valores para números
          fill: false,
          borderColor: `hsl(${(index * 45) % 360}, 70%, 50%)`, // Gera uma cor única para cada série
          tension: 0.1,
        }));

        // Usa as tags da primeira entrada como rótulos
        const labels = storedData[0]?.tagname || [];

        // Configura os dados para o gráfico
        const chartData = {
          labels,
          datasets,
        };

        setLineChartData(chartData);
      }
    };

    // Atualiza os dados na montagem do componente
    updateChartData();

    // Escuta mudanças no localStorage para atualizar os dados
    const handleStorageChange = () => {
      updateChartData();
    };

    // Adiciona o event listener
    window.addEventListener('storage', handleStorageChange);

    // Remove o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
