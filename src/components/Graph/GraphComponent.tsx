// src/components/GraphComponent.tsx

import React from 'react';
import { Chart } from 'primereact/chart';
import useGraphData from '../../hooks/GraphHook';
import './GraphComponent.scss';

const GraphComponent: React.FC = () => {
  const { lineChartData, error } = useGraphData();

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="graph-component">
      <div className="graph-bar-title">Análise Resumida</div>
      <div className="graph-bar-content">
        {error && <div>{error}</div>}
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
