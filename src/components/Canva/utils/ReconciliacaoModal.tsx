// ProgressModal.js
import React from "react";
import "./ReconciliacaoModal.css";

const ProgressModal = ({ isVisible, progress, onClose }) => {
  if (!isVisible) return null;

  // Remove colchetes da string de progresso
  const formattedProgress = progress.replace(/[\[\]]/g, "");

  return (
    <div className="progress-modal-overlay">
      <div className="progress-modal">
        <h2>Progresso da Reconciliação</h2>
        <pre>{formattedProgress}</pre>
        <button onClick={onClose} className="close-button">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ProgressModal;
