import { calcularReconciliacao, reconciliarApi } from "./Reconciliacao";

export const handleReconcile = (
  nodes: any[],
  edges: any[],
  callback: (message: string) => void
) => {
  const edgeNames = edges.map((edge) => edge.nome);
  calcularReconciliacao(nodes, edges, reconciliarApi, callback, edgeNames);
};

export const handleFileUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/reconcile", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Upload bem-sucedido:", result);
      } else {
        console.error("Falha no upload:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
    }
  }
};
