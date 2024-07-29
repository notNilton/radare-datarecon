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

const initialNodes = [];

const initialEdges = [];

export { initialNodes, initialEdges, nodeTypes };
