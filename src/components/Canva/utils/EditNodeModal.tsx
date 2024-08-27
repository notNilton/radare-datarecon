// EditNodeModal.js
import React, { useState, useEffect } from "react";
import "./EditNodeModal.css";

const EditNodeModal = ({ isVisible, node, onClose, onUpdate }) => {
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (node) {
      setLabel(node.data.label);
    }
  }, [node]);

  const handleSave = () => {
    onUpdate({ ...node, data: { ...node.data, label } });
  };

  if (!isVisible) return null;

  return (
    <div className="edit-node-modal-overlay">
      <div className="edit-node-modal">
        <h2>Editar Nó</h2>
        <label>
          Rótulo:
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </label>
        <div className="edit-node-modal-buttons">
          <button onClick={handleSave}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditNodeModal;
