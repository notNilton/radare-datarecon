import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  MouseEvent,
} from "react";
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
import "./Node.scss";

import {
  initialNodes,
  initialEdges,
  nodeTypes,
} from "./utils/initialCanvaDataIII";
import {
  calcularReconciliacao,
  reconciliarApi,
} from "./utils/Reconciliacao";
import ProgressModalComponent from "./ProgressModalComponent";
import EditNodeModalComponent from "./EditNodeModalComponent";
import ContextMenuComponent from "./ContextMenuComponent";
import SidebarComponent from "../Sidebar/SidebarComponent";
import GraphComponent from "../Dashboard/GraphComponent";

// Função para gerar nomes aleatórios
const generateRandomName = () => {
  const names = ["Laravel", "Alucard", "Sigma", "Delta", "Orion", "Phoenix"];
  return names[Math.floor(Math.random() * names.length)];
};

const getNodeId = () => `randomnode_${+new Date()}`;

const Node: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map((edge) => ({
      ...edge,
      nome: edge.nome || generateRandomName(), // Adiciona um nome aleatório se não existir
      label: `Nome: ${edge.nome || generateRandomName()}, Valor: ${
        edge.value
      }, Tolerância: ${edge.tolerance}`, // Label dinâmico
      type: 'step', // Definindo o tipo da aresta como 'step'
    }))
  );

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

  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Estado para controlar a visibilidade do sidebar
  const [isGraphVisible, setIsGraphVisible] = useState(true); // Estado para controlar a visibilidade do graph-component

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
    (params: Edge | Connection) => {
      const newEdge = {
        ...params,
        nome: generateRandomName(), // Adiciona um nome aleatório
        label: `Nome: ${generateRandomName()}, Valor: ${
          params.label || ""
        }, Tolerância: ${params.tolerance || ""}`,
        type: 'step', // Definindo o tipo da aresta como 'step'
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
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
            ? {
                ...edge,
                value: numericLabel,
                tolerance: numericTolerance,
                label: `Nome: ${edge.nome}, Valor: ${numericLabel}, Tolerância: ${numericTolerance}`,
              }
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/reconcile', { // Atualize o URL para o servidor Flask local
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Upload bem-sucedido:', result);
          // Lidar com a resposta do servidor aqui
        } else {
          console.error('Falha no upload:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
      }
    }
  };

  const handleReconcile = () => {
    calcularReconciliacao(nodes, edges, reconciliarApi, atualizarProgresso);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleGraph = () => {
    setIsGraphVisible(!isGraphVisible);
  };

  const showNodesAndEdges = () => {
    console.log("Nodes:", nodesRef.current);
    console.log("Edges:", edgesRef.current);
    alert(
      `Nodes: ${JSON.stringify(
        nodesRef.current,
        null,
        2
      )}\nEdges: ${JSON.stringify(edgesRef.current, null, 2)}`
    );
  };

  // Coleta os nomes, valores e tolerâncias das arestas para enviar ao GraphComponent
  const edgeDetails = edges.map((edge) => ({
    nome: edge.nome,
    value: edge.value,
    tolerance: edge.tolerance,
  }));

  const edgeNames = edges.map((edge) => edge.nome);

  return (
    <div
      className={`node-container ${isSidebarVisible ? "" : "sidebar-hidden"}`}
    >
      <div className="reactflow-component">
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
            <button onClick={() => addNode("type1")}>Add Node Type 1</button>
            <button onClick={() => addNode("type2")}>Add Node Type 2</button>
            <button onClick={() => showNodesAndEdges()}>
              Mostrar Nodes e Edges
            </button>
            <button onClick={toggleSidebar}>
              {isSidebarVisible ? "Esconder Sidebar" : "Mostrar Sidebar"}
            </button>
            <button onClick={toggleGraph}>
              {isGraphVisible ? "Esconder Gráfico" : "Mostrar Gráfico"}
            </button>
            <button onClick={handleReconcile}>
              Reconciliar Dados
            </button>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              style={{ marginTop: "10px" }}
            />
          </Panel>
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {isSidebarVisible && <SidebarComponent nodes={nodes} edges={edges} edgeNames={edgeNames} />}

      {isGraphVisible && (
        <div className="graph-component">
          <GraphComponent
            nodes={nodes}
            edges={edges}
            edgeNames={edgeNames}
          />
        </div>
      )}
    </div>
  );
};

export default Node;
