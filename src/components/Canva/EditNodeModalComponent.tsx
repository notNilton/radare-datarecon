import React from "react";
import EditNodeModal from "./utils/EditNodeModal"; // Adjust the path as necessary

interface EditNodeModalProps {
  isVisible: boolean;
  node: any;
  onClose: () => void;
  onUpdate: (updatedNode: any) => void;
}

const EditNodeModalComponent: React.FC<EditNodeModalProps> = ({
  isVisible,
  node,
  onClose,
  onUpdate,
}) => {
  return (
    <EditNodeModal
      isVisible={isVisible}
      node={node}
      onClose={onClose}
      onUpdate={onUpdate}
    />
  );
};

export default EditNodeModalComponent;
