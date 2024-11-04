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
    // Função para buscar dados do localStorage e atualizar o estado
    const updateChartData = () => {
      const storedData = localStorage.getItem('reconciliationData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // Extrair dados de tagreconciled para o gráfico
        const labels = parsedData.tagname || []; // Usar tagname como rótulos
        const dataValues = parsedData.tagreconciled.map(Number); // Converter os valores para números

        // Configurar os dados do gráfico
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: 'Tag Reconciled',
              data: dataValues,
              fill: false,
              borderColor: '#42A5F5',
              tension: 0.1,
            },
          ],
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
