import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import "./GraphComponent.scss";

const GraphComponent: React.FC = () => {
  const [lineChartData, setLineChartData] = useState<any>(null);

  // Função para fazer a requisição GET e processar os dados do backend
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/reconciled-data');
      const data = await response.json();
      console.log('Dados recebidos do backend:', data);

      if (data.length > 0) {
        // Assume que todas as iterações têm os mesmos labels (nomes de tags)
        const labels = data[0][0]; // Extrai os nomes das tags

        // Cria um dataset para cada tag, agrupando os dados das correções
        const datasets = labels.map((label: string, index: number) => ({
          label: label,
          data: data.map((iteration: any) => parseFloat(iteration[1][index])), // Extrai as correções para cada iteração
          fill: false,
          borderColor: `hsl(${index * 72}, 70%, 50%)`,
        }));

        const chartData = {
          labels: data.map((_: any, index: number) => `Iteração ${index + 1}`), // Iterações no eixo X
          datasets: datasets, // Dados das correções no eixo Y
        };

        setLineChartData(chartData);
      } else {
        setLineChartData(null);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do backend:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Chama a função para buscar dados do backend

    return () => {
      // Remove qualquer evento de listener desnecessário
      window.removeEventListener("storage", fetchData);
    };
  }, []);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Exibe a legenda com os nomes das tags
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
