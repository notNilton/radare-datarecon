// ReconciliationUtils.js
export const createAdjacencyMatrix = (nodes: any[], edges: any[]) => {
  const cnOneTwoNodes = nodes.filter((node) => node.type === "cnOneTwo");
  const adjMatrix = Array.from({ length: cnOneTwoNodes.length }, () =>
    Array(edges.length).fill(0)
  );

  edges.forEach((edge, edgeIndex) => {
    const sourceIndex = cnOneTwoNodes.findIndex(
      (node) => node.id === edge.source
    );
    const targetIndex = cnOneTwoNodes.findIndex(
      (node) => node.id === edge.target
    );

    if (sourceIndex !== -1) adjMatrix[sourceIndex][edgeIndex] = -1;
    if (targetIndex !== -1) adjMatrix[targetIndex][edgeIndex] = 1;
  });

  return adjMatrix;
};

export const calcularReconciliacao = (
  nodes: any[],
  edges: any[],
  reconciliarApi: { (incidenceMatrix: any, measurements: any, tolerances: any, atualizarProgresso: any): Promise<void>; (arg0: any[][], arg1: any, arg2: any, arg3: any): void; },
  atualizarProgresso: { (message: string): void; (arg0: string): void; }
) => {
  const medida = edges.map((edge) => edge.value); // Captura os valores (antes estava usando o label)
  const tolerancia = edges.map((edge) => edge.tolerance); // Captura as tolerâncias

  const adjMatrix = createAdjacencyMatrix(nodes, edges); // Gera a matriz de adjacência

  // Exibe os valores capturados no console
  console.log("Valores de Medida:", medida);
  console.log("Valores de Tolerância:", tolerancia);
  console.log("Matriz de Adjacência:", adjMatrix);

  // Se necessário, você ainda pode chamar a API de reconciliação aqui
  atualizarProgresso("Chamando API de reconciliação...");
  reconciliarApi(adjMatrix, medida, tolerancia, atualizarProgresso);
};

export const reconciliarApi = async (
  incidenceMatrix: any,
  measurements: any,
  tolerances: any,
  atualizarProgresso: (arg0: string) => void
) => {
  try {
    atualizarProgresso("Enviando dados para o servidor...");
    const response = await fetch("http://localhost:5000/reconcile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        incidence_matrix: incidenceMatrix,
        measurements: measurements,
        tolerances: tolerances,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const reconciledMeasures = JSON.stringify(
        data.reconciled_measurements.reconciled_measurements,
        null,
        2
      );
      const correction = JSON.stringify(
        data.reconciled_measurements.correction,
        null,
        2
      );
      console.log("Medidas Reconciliadas:", reconciledMeasures);
      console.log("Correções:", correction);
      atualizarProgresso(
        `Reconciliação bem-sucedida.\n\nMedidas Reconciliadas: ${reconciledMeasures}\n\nCorreções: ${correction}`
      );
    } else {
      console.error("Falha na reconciliação dos dados");
      atualizarProgresso("Falha na reconciliação.");
    }
  } catch (error) {
    console.error("Erro ao reconciliar dados:", error);
    atualizarProgresso("Erro durante a reconciliação.");
  }
};
