import { useCallback, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Panel,
  getConnectedEdges,
} from "reactflow";

import "reactflow/dist/style.css";
import "./Canva.css";

import {
  initialNodes,
  initialEdges,
  nodeTypes,
} from "./utils/initialCanvaDataIII";
import { multiplyArrays } from "./utils/arrayUtils";
import {
  calcularReconciliacao,
  reconciliarApi,
  createAdjacencyMatrix,
} from "./utils/Reconciliacao";
import ProgressModal from "./utils/ReconciliacaoModal";
import EditNodeModal from "./utils/EditNodeModal";
import FileUpload from "./UploadFile"; // Import the new component

const getNodeId = () => `randomnode_${+new Date()}`;

const Node = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [editNodeModal, setEditNodeModal] = useState({
    isVisible: false,
    node: null,
  });

  const atualizarProgresso = (message) => {
    setProgress(message);
    if (!isModalVisible) {
      setIsModalVisible(true);
    }
  };

  const fecharModal = () => {
    setIsModalVisible(false);
  };

  const fecharEditNodeModal = () => {
    setEditNodeModal({ isVisible: false, node: null });
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onEdgeDoubleClick = (edgeId) => {
    const labelValue = window.prompt(
      "Digite um valor para o rótulo da aresta:"
    );
    const toleranceValue = window.prompt("Digite um valor para a tolerância:");

    if (
      labelValue &&
      toleranceValue &&
      !isNaN(labelValue) &&
      !isNaN(toleranceValue)
    ) {
      const numericLabel = parseFloat(labelValue);
      const numericTolerance = parseFloat(toleranceValue);

      setEdges((prevEdges) =>
        prevEdges.map((edge) =>
          edge.id === edgeId
            ? { ...edge, label: numericLabel, tolerance: numericTolerance }
            : edge
        )
      );
    }
  };

  const onNodeDoubleClick = (event, node) => {
    setEditNodeModal({ isVisible: true, node });
  };

  const addNode = useCallback(
    (nodeType) => {
      const newNode = {
        id: getNodeId(),
        type: nodeType,
        data: { label: "Simples", isConnectable: true },
        style: {
          background: "white",
          border: "2px solid black",
          padding: "3px",
          width: "100px",
        },
        position: {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const getConnectedEdgeLabels = () => {
    const edgeLabels = edges.map((edge) => edge.label);
    const connectionTolerance = edges.map((edge) => edge.tolerance);
    const multiplied = multiplyArrays(edgeLabels, connectionTolerance);

    console.log("Todos os valores de conexão:", edgeLabels);
    console.log("Todos os valores de tolerância:", connectionTolerance);
    console.log(multiplied);
  };

  const checkNodesEdges = () => {
    const allEdges = getConnectedEdges(nodes, edges);
    console.log("Todos os nós e conexões:", allEdges);
  };

  const handleNodeContextMenu = (event, node) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      node,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleEditNode = () => {
    const node = contextMenu.node;
    setEditNodeModal({ isVisible: true, node });
    handleCloseContextMenu();
  };

  const handleDeleteNode = () => {
    const node = contextMenu.node;
    setNodes((prevNodes) => prevNodes.filter((n) => n.id !== node.id));
    setEdges((prevEdges) =>
      prevEdges.filter((e) => e.source !== node.id && e.target !== node.id)
    );
    handleCloseContextMenu();
  };

  const handleUpdateNode = (updatedNode) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === updatedNode.id ? { ...n, data: updatedNode.data } : n
      )
    );
    fecharEditNodeModal();
  };

  const handleFileUploadSuccess = (data) => {
    console.log("File uploaded successfully:", data);
    // Update your nodes or edges based on the uploaded data if needed
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        onEdgeDoubleClick={(event, edge) => onEdgeDoubleClick(edge.id)}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeContextMenu={handleNodeContextMenu}
      >
        <Panel
          position="top-left"
          style={{
            height: "35%",
            width: "200px",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <button
            className="button run-button"
            onClick={() =>
              calcularReconciliacao(
                nodes,
                edges,
                reconciliarApi,
                atualizarProgresso
              )
            }
          >
            Reconciliar
          </button>
          <button
            className="button vis-button"
            onClick={() => createAdjacencyMatrix(nodes, edges)}
          >
            Matriz
          </button>

          <button
            className="button vis-button"
            onClick={() => createAdjacencyMatrix(nodes, edges)}
          >
            Valores
          </button>

          <button
            className="button vis-button"
            onClick={() => createAdjacencyMatrix(nodes, edges)}
          >
            Tolerâncias
          </button>

          <button
            className="button add-button"
            onClick={() => addNode("cnOneTwo")}
          >
            Adc Nó
          </button>

          <button
            className="button add-button"
            onClick={() => addNode("cnOneTwo")}
          >
            Adc Nó*
          </button>

          <button
            className="button add-button"
            onClick={() => addNode("input")}
          >
            Adc E.
          </button>
          <button
            className="button add-button"
            onClick={() => addNode("output")}
          >
            Adc S.
          </button>

          <FileUpload onFileUploadSuccess={handleFileUploadSuccess} />
        </Panel>

        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      <ProgressModal
        isVisible={isModalVisible}
        progress={progress}
        onClose={fecharModal}
      />
      {contextMenu && (
        <div
          style={{
            position: "absolute",
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
            zIndex: 1000,
            padding: "10px",
          }}
          onMouseLeave={handleCloseContextMenu}
        >
          <button
            onClick={handleEditNode}
            style={{
              display: "block",
              width: "100%",
              marginBlock: "5px",
            }}
          >
            Editar
          </button>
          <button
            onClick={handleDeleteNode}
            style={{ display: "block", width: "100%" }}
          >
            Deletar
          </button>
        </div>
      )}
      <EditNodeModal
        isVisible={editNodeModal.isVisible}
        node={editNodeModal.node}
        onClose={fecharEditNodeModal}
        onUpdate={handleUpdateNode}
      />
    </div>
  );
};

export default Node;
