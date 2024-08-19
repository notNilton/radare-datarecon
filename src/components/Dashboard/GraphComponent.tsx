import React from "react";
import { Chart } from "primereact/chart";
import "./GraphComponent.scss";

interface GraphComponentProps {
  nodes: any[];
  edges: any[];
  edgeNames: string[]; // Array de nomes das arestas
}

const GraphComponent: React.FC<GraphComponentProps> = ({ nodes, edges, edgeNames }) => {
  const lineChartData = {
    labels: Array.from({ length: 15 }, (_, i) => `Point ${i + 1}`),
    datasets: edgeNames.map((name, index) => {
      const edge = edges.find(edge => edge.nome === name); // Encontra a aresta correspondente pelo nome
      return {
        label: name, // Usando o nome da aresta como label
        data: Array.from({ length: 15 }, () => Math.floor(Math.random() * 100)), // Dados aleatórios ou personalizados
        fill: false,
        borderColor: `hsl(${index * 72}, 70%, 50%)`, // Cor dinâmica baseada no índice
      };
    }),
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
        <a href="#analise-resumida">Análise Resumida</a>
      </div>
      <div className="graph-bar-content">
        <Chart type="line" data={lineChartData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default GraphComponent;
