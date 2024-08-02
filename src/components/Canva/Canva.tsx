import { useCallback, useState, MouseEvent } from "react";
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
  BackgroundVariant,
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
import Functions from "../Sidebar/Functions";
const getNodeId = () => `randomnode_${+new Date()}`;

const Node = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    node: any;
  } | null>(null);
  const [editNodeModal, setEditNodeModal] = useState<{
    isVisible: boolean;
    node: any | null;
  }>({
    isVisible: false,
    node: null,
  });

  const atualizarProgresso = (message: string) => {
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

  const onEdgeDoubleClick = (edgeId: string) => {
    const labelValue = window.prompt(
      "Digite um valor para o rótulo da aresta:"
    );
    const toleranceValue = window.prompt("Digite um valor para a tolerância:");

    if (
      labelValue &&
      toleranceValue &&
      !isNaN(Number(labelValue)) &&
      !isNaN(Number(toleranceValue))
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

  const onNodeDoubleClick = (event: MouseEvent, node: any) => {
    setEditNodeModal({ isVisible: true, node });
  };

  const addNode = useCallback(
    (nodeType: string) => {
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
    const connectionTolerance = edges.map((edge) => (edge as any).tolerance);
    const multiplied = multiplyArrays(
      edgeLabels as number[],
      connectionTolerance as number[]
    );

    console.log("Todos os valores de conexão:", edgeLabels);
    console.log("Todos os valores de tolerância:", connectionTolerance);
    console.log(multiplied);
  };

  const checkNodesEdges = () => {
    const allEdges = getConnectedEdges(nodes, edges);
    console.log("Todos os nós e conexões:", allEdges);
  };

  const handleNodeContextMenu = (event: MouseEvent, node: any) => {
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
    const node = contextMenu!.node;
    setEditNodeModal({ isVisible: true, node });
    handleCloseContextMenu();
  };

  const handleDeleteNode = () => {
    const node = contextMenu!.node;
    setNodes((prevNodes) => prevNodes.filter((n) => n.id !== node.id));
    setEdges((prevEdges) =>
      prevEdges.filter((e) => e.source !== node.id && e.target !== node.id)
    );
    handleCloseContextMenu();
  };

  const handleUpdateNode = (updatedNode: any) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === updatedNode.id ? { ...n, data: updatedNode.data } : n
      )
    );
    fecharEditNodeModal();
  };

  const handleFileUploadSuccess = (data: any) => {
    console.log("File uploaded successfully:", data);
    // Update your nodes or edges based on the uploaded data if needed
  };

  return (
    <div className="node-container">
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
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <ProgressModal
        isVisible={isModalVisible}
        progress={progress}
        onClose={fecharModal}
      />
      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
          onMouseLeave={handleCloseContextMenu}
        >
          <button onClick={handleEditNode} className="context-menu-button">
            Editar
          </button>
          <button onClick={handleDeleteNode} className="context-menu-button">
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
      <Functions
        calcularReconciliacao={() =>
          calcularReconciliacao(
            nodes,
            edges,
            reconciliarApi,
            atualizarProgresso
          )
        }
        createAdjacencyMatrix={() => createAdjacencyMatrix(nodes, edges)}
        addNode={addNode}
        handleFileUploadSuccess={handleFileUploadSuccess}
      />
    </div>
  );
};

export default Node;
