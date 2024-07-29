# Data Reconciliation Dashboard

This is the online data reconciliation dashboard, a web-based application built using React.js, allowing users to create plant models of the sensors and.

## CanvaLogic Component

This component, `CanvaLogic.tsx`, is a React component designed for visualizing and manipulating directed graphs within a canvas environment. It utilizes the ReactFlow library for building the graph visualization component.

### Features

- Add and customize nodes with different types.
- Create directed edges between nodes.
- Modify edge labels and tolerance values.
- Generate adjacency matrix for visualization.
- Calculate reconciliation based on edge labels and tolerance values.

### Getting Started

To use the CanvaLogic component in your own project:

1. Copy the `CanvaLogic.tsx` file into your project.
2. Import the `CanvaLogic` component into your desired file.
3. Use the `CanvaLogic` component within your React application as needed.

```javascript
import CanvaLogic from './path/to/CanvaLogic';

function MyComponent() {
  return (
    <div>
      <CanvaLogic />
    </div>
  );
}
