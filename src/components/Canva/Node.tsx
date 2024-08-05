import { useCallback, useState, useRef, useEffect, MouseEvent } from "react";
import ReactFlow, {
  Controls,
  Panel,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
} from "reactflow";

import "reactflow/dist/style.css";
import "./Node.css";

import {
  initialNodes,
  initialEdges,
  nodeTypes,
} from "./utils/initialCanvaDataIII";
import {
  calcularReconciliacao,
  reconciliarApi,
  createAdjacencyMatrix,
} from "./utils/Reconciliacao";
import ProgressModalComponent from "./ProgressModalComponent";
import EditNodeModalComponent from "./EditNodeModalComponent";
import ContextMenuComponent from "./ContextMenuComponent";
import FunctionsComponent from "./FunctionsComponent";
import SidebarComponent from "../Sidebar/SidebarComponent";
import FileUpload from "./UploadFile";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InputIcon from "@mui/icons-material/Input";
import OutputIcon from "@mui/icons-material/Output";
import Tooltip from "@mui/material/Tooltip";

const getNodeId = () => `randomnode_${+new Date()}`;

const Node = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
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

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const atualizarProgresso = (message: string) => {
    setProgress(message);
    setIsModalVisible(true);
  };

  const fecharModal = () => setIsModalVisible(false);

  const fecharEditNodeModal = () =>
    setEditNodeModal({ isVisible: false, node: null });

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

  const onNodeDoubleClick = (event: MouseEvent, node: any) =>
    setEditNodeModal({ isVisible: true, node });

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

  const handleNodeContextMenu = (event: MouseEvent, node: any) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      node,
    });
  };

  const handleCloseContextMenu = () => setContextMenu(null);

  const handleEditNode = () => {
    setEditNodeModal({ isVisible: true, node: contextMenu!.node });
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
        <Panel position="top-left" className="top-left-panel">
          <Tooltip title="Run Reconciliation">
            <PlayArrowIcon
              className="button run-button"
              onClick={() =>
                calcularReconciliacao(
                  nodes,
                  edges,
                  reconciliarApi,
                  atualizarProgresso
                )
              }
            />
          </Tooltip>
          <Tooltip title="Add Node 1-2">
            <AddCircleOutlineIcon
              className="button add-button"
              onClick={() => addNode("cnOneTwo")}
            />
          </Tooltip>
          <Tooltip title="Add Custom Node">
            <AddCircleOutlineIcon
              className="button add-button"
              onClick={() => addNode("cnOneTwo")}
            />
          </Tooltip>
          <Tooltip title="Add Input">
            <InputIcon
              className="button add-button"
              onClick={() => addNode("input")}
            />
          </Tooltip>
          <Tooltip title="Add Output">
            <OutputIcon
              className="button add-button"
              onClick={() => addNode("output")}
            />
          </Tooltip>
          <Tooltip title="Upload File">
            <div className="upload-button">
              <FileUpload onFileUploadSuccess={handleFileUploadSuccess} />
            </div>
          </Tooltip>
        </Panel>
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <ProgressModalComponent
        isVisible={isModalVisible}
        progress={progress}
        onClose={fecharModal}
      />
      <ContextMenuComponent
        contextMenu={contextMenu}
        handleEditNode={handleEditNode}
        handleDeleteNode={handleDeleteNode}
        handleCloseContextMenu={handleCloseContextMenu}
      />
      <EditNodeModalComponent
        isVisible={editNodeModal.isVisible}
        node={editNodeModal.node}
        onClose={fecharEditNodeModal}
        onUpdate={handleUpdateNode}
      />
      {/* <FunctionsComponent
        className="functions-component"
        calcularReconciliacao={() =>
          calcularReconciliacao(
            nodesRef.current,
            edgesRef.current,
            reconciliarApi,
            atualizarProgresso
          )
        }
        createAdjacencyMatrix={() =>
          createAdjacencyMatrix(nodesRef.current, edgesRef.current)
        }
        addNode={addNode}
        handleFileUploadSuccess={handleFileUploadSuccess}
      /> */}
      <SidebarComponent nodes={nodes} edges={edges} />{" "}
      {/* Pass nodes and edges as props */}
    </div>
  );
};

export default Node;
