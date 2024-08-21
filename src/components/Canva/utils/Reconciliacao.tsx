// ReconciliationUtils.js
export const createAdjacencyMatrix = (nodes: any[], edges: any[]) => {
  const cnOneTwoNodes = nodes.filter((node) => node.type === "cnOneTwo");
  const incidencematrix = Array.from({ length: cnOneTwoNodes.length }, () =>
    Array(edges.length).fill(0)
  );

  edges.forEach((edge, edgeIndex) => {
    const sourceIndex = cnOneTwoNodes.findIndex(
      (node) => node.id === edge.source
    );
    const targetIndex = cnOneTwoNodes.findIndex(
      (node) => node.id === edge.target
    );

    if (sourceIndex !== -1) incidencematrix[sourceIndex][edgeIndex] = -1;
    if (targetIndex !== -1) incidencematrix[targetIndex][edgeIndex] = 1;
  });

  return incidencematrix;
};

export const calcularReconciliacao = (
  nodes: any[],
  edges: any[],
  reconciliarApi: {
    (
      incidenceMatrix: any,
      values: any,
      tolerances: any,
      names: any[],
      atualizarProgresso: any
    ): Promise<void>;
    (
      arg0: any[][],
      arg1: any,
      arg2: any,
      arg3: any,
      arg4: any[]
    ): void;
  },
  atualizarProgresso: { (message: string): void; (arg0: string): void },
  edgeNames: any[]
) => {
  const value = edges.map((edge) => edge.value); // Captura os valores
  const tolerance = edges.map((edge) => edge.tolerance); // Captura as tolerâncias

  const incidencematrix = createAdjacencyMatrix(nodes, edges); // Gera a matriz de adjacência

  // Exibe os valores capturados no console
  console.log("Valores de Medida:", value);
  console.log("Valores de Tolerância:", tolerance);
  console.log("Nomes das Arestas:", edgeNames);
  console.log("Matriz de Adjacência:", incidencematrix);

  // Se necessário, você ainda pode chamar a API de reconciliação aqui
  atualizarProgresso("Chamando API de reconciliação...");
  reconciliarApi(incidencematrix, value, tolerance, edgeNames, atualizarProgresso);
};

export const reconciliarApi = async (
  incidence_matrix: any,
  values: any,
  tolerances: any,
  names: any[],
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
        incidence_matrix: incidence_matrix,
        values: values,
        tolerances: tolerances,
        names: names, // Enviando o array de nomes para o servidor
      }),
    });

    if (response.ok) {
      const data = await response.json();

      // Corrigido: Agora os dados são corretamente exibidos no console
      console.log("Dados recebidos:", data);

      const reconciledMeasures = JSON.stringify(data.reconciled_values, null, 2);
      const correction = JSON.stringify(data.correction, null, 2);

      console.log("Valores Reconciliados:", reconciledMeasures);
      console.log("Correções:", correction);

      // Gera um ID único
      const id = Date.now().toString();

      // Corrigido: Armazena os dados corretos no localStorage
      const storedData = {
        id,
        reconciledMeasures: data.reconciled_values, // Armazena o array original em vez de string
        correction: data.correction,               // Armazena o array original em vez de string
        names: data.names,                         // Inclui os nomes para referência
      };

      // Armazena os dados no localStorage
      localStorage.setItem(id, JSON.stringify(storedData));
      window.dispatchEvent(new Event("storage"));

      atualizarProgresso(
        `Reconciliação bem-sucedida.\n\nValores Reconciliados: ${reconciledMeasures}\n\nCorreções: ${correction}`
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

