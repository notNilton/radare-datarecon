export const createAdjacencyMatrix = (nodes: any[], edges: any[]) => {
  const cnOneTwoNodes = nodes.filter(
    (node: { type: string }) => node.type === "cnOneTwo"
  );
  const adjMatrix = Array.from({ length: cnOneTwoNodes.length }, () =>
    Array(edges.length).fill(0)
  );

  edges.forEach(
    (edge: { source: any; target: any }, edgeIndex: string | number) => {
      const sourceIndex = cnOneTwoNodes.findIndex(
        (node: { id: any }) => node.id === edge.source
      );
      const targetIndex = cnOneTwoNodes.findIndex(
        (node: { id: any }) => node.id === edge.target
      );

      if (sourceIndex !== -1) adjMatrix[sourceIndex][edgeIndex] = -1;
      if (targetIndex !== -1) adjMatrix[targetIndex][edgeIndex] = 1;
    }
  );

  return adjMatrix;
};
