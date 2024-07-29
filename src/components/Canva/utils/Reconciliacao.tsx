// ReconciliationUtils.js
export const createAdjacencyMatrix = (nodes, edges) => {
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
  nodes,
  edges,
  reconciliarApi,
  atualizarProgresso
) => {
  const medida = edges.map((edge) => edge.label);
  const tolerancia = edges.map((edge) => edge.tolerance);

  const adjMatrix = createAdjacencyMatrix(nodes, edges);

  const toleranciaAbs = medida.map((value, index) => value * tolerancia[index]);
  const toleranciaAbsSquared = toleranciaAbs.map((value) => value * value);
  const mPeso = [
    0,
    ...medida.map((value, index) => (2 * value) / toleranciaAbsSquared[index]),
    0,
  ];

  const diagSquared = toleranciaAbs.map((value) => Math.pow(value, 2));
  const inverseDiagSquared = diagSquared.map((value) => 1 / value);

  const size = toleranciaAbs.length;
  const Diag1 = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) =>
      i === j ? 2 * inverseDiagSquared[i] : 0
    )
  );

  console.log("Novo Teste");
  console.log("Valores de Medida:", medida);
  console.log("Valores de Tolerância:", tolerancia);
  console.log("Matriz de Adjacência:", adjMatrix);
  console.log("a:", toleranciaAbs);
  console.log("mPeso:", mPeso);
  console.log("Diagonal:", Diag1);

  atualizarProgresso("Chamando API de reconciliação...");
  reconciliarApi(adjMatrix, medida, tolerancia, atualizarProgresso);
};

export const reconciliarApi = async (
  incidenceMatrix,
  measurements,
  tolerances,
  atualizarProgresso
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
