import React, { useCallback } from "react";
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
  MarkerType,
} from "reactflow";

import cnOneThree from "./customNodeOneThree";
import cnOneOne from "./customNodeOneOne";
import cnTwoTwo from "./customNodeTwoTwo";
import cnTwoOne from "./customNodeOneTwo";
import cnOneTwo from "./customNodeOneTwo";

const nodeTypes = {
  cnOneThree: cnOneThree,
  cnOneOne: cnOneOne,
  cnTwoTwo: cnTwoTwo,
  cnTwoOne: cnTwoOne,
  cnOneTwo: cnOneTwo,
};

const initialNodes = [
  {
    id: "Node",
    type: "cnOneTwo",
    data: { label: "Node", isConnectable: true },
    style: {
      background: "white",
      border: "2px solid black",
      padding: "3px",
      width: "100px",
    },
    position: { x: 100, y: 350 },
  },
  {
    id: "Input",
    type: "input",
    data: { label: "Input", isConnectable: true },
    style: {
      background: "white",
      border: "2px solid black",
      padding: "3px",
      width: "100px",
    },
    position: { x: 100, y: 150 },
  },
  {
    id: "Output1",
    type: "output",
    data: { label: " ", isConnectable: true },
    style: {
      background: "white",
      border: "2px solid black",
      padding: "3px",
      width: "50px",
      heigth: "50px",
    },
    position: { x: -100, y: 450 },
  },
  {
    id: "Output2",
    type: "output",
    data: { label: " ", isConnectable: true },
    style: {
      background: "white",
      border: "2px solid black",
      padding: "3px",
      width: "50px",
      heigth: "50px",
    },
    position: { x: 350, y: 450 },
  },
];

const initialEdges = [
  {
    label: 161,
    tolerance: 0.05,
    id: "ei-1",
    type: "step",
    source: "Input",
    // sourceHandle: "b",
    target: "Node",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    label: 79,
    tolerance: 0.01,
    id: "ei-2",
    type: "step",
    source: "Node",
    // sourceHandle: "b",
    target: "Output1",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    label: 80,
    tolerance: 0.01,
    id: "ei-3",
    type: "step",
    source: "Node",
    sourceHandle: "b",
    target: "Output2",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

export { initialNodes, initialEdges, nodeTypes };
