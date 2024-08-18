import React from "react";
import { Chart } from 'primereact/chart';
import "./GraphComponent.scss";

interface GraphComponentProps {
  nodes: any[];
  edges: any[];
}

const GraphComponent: React.FC<GraphComponentProps> = ({ nodes, edges }) => {
  // Sample data for the line chart
  const lineChartData = {
    labels: Array.from({ length: 15 }, (_, i) => `Point ${i + 1}`),
    datasets: [
      {
        label: 'Line 1',
        data: Array.from({ length: 15 }, () => Math.floor(Math.random() * 100)),
        fill: false,
        borderColor: '#42A5F5'
      },
      {
        label: 'Line 2',
        data: Array.from({ length: 15 }, () => Math.floor(Math.random() * 100)),
        fill: false,
        borderColor: '#66BB6A'
      },
      {
        label: 'Line 3',
        data: Array.from({ length: 15 }, () => Math.floor(Math.random() * 100)),
        fill: false,
        borderColor: '#FFA726'
      },
      {
        label: 'Line 4',
        data: Array.from({ length: 15 }, () => Math.floor(Math.random() * 100)),
        fill: false,
        borderColor: '#FF7043'
      },
      {
        label: 'Line 5',
        data: Array.from({ length: 15 }, () => Math.floor(Math.random() * 100)),
        fill: false,
        borderColor: '#AB47BC'
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  return (
    <div className="graph-component">
      <div className="graph-bar-title">
        <a href="analise-resumida">Análise Resumida</a>
      </div>
      <div className="graph-bar-content">
        {/* Line chart from PrimeReact */}
        <Chart type="line" data={lineChartData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default GraphComponent;
