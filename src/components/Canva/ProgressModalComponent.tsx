import React from "react";
import ProgressModal from "./utils/ReconciliacaoModal"; // Adjust the path as necessary

interface ProgressModalProps {
  isVisible: boolean;
  progress: string;
  onClose: () => void;
}

const ProgressModalComponent: React.FC<ProgressModalProps> = ({
  isVisible,
  progress,
  onClose,
}) => {
  return (
    <ProgressModal
      isVisible={isVisible}
      progress={progress}
      onClose={onClose}
    />
  );
};

export default ProgressModalComponent;
