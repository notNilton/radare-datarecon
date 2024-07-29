// ProgressModal.js
import React from "react";
import "./ReconciliacaoModal.css";

const ProgressModal = ({ isVisible, progress, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="progress-modal-overlay">
      <div className="progress-modal">
        <h2>Progresso da Reconciliação</h2>
        <pre>{progress}</pre>
        <button onClick={onClose} className="close-button">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ProgressModal;
