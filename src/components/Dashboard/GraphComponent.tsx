import React from "react";
import { Chart } from "primereact/chart";
import "./GraphComponent.scss";

interface EdgeDetail {
  nome: string;
  value: number;
  tolerance: number;
}

interface GraphComponentProps {
  nodes: any[];
  edges: any[];
  edgeDetails: EdgeDetail[]; // Adicionando edgeDetails como uma prop
}

const GraphComponent: React.FC<GraphComponentProps> = ({ edgeDetails }) => {
  const lineChartData = {
    labels: Array.from({ length: 15 }, (_, i) => `Point ${i + 1}`),
    datasets: edgeDetails.map((edge, index) => ({
      label: edge.nome, // Usando o nome da aresta como label
      data: Array.from({ length: 15 }, () => Math.floor(Math.random() * 100)), // Dados aleatórios
      fill: false,
      borderColor: `hsl(${index * 72}, 70%, 50%)`, // Cor dinâmica baseada no índice
    })),
  };

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
      <div className="graph-bar-title">
        <a href="analise-resumida">Análise Resumida</a>
      </div>
      <div className="graph-bar-content">
        <Chart type="line" data={lineChartData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default GraphComponent;
