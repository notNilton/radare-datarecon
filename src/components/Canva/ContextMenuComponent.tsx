import React from "react";

interface ContextMenuProps {
  contextMenu: { mouseX: number; mouseY: number; node: any } | null;
  handleEditNode: () => void;
  handleDeleteNode: () => void;
  handleCloseContextMenu: () => void;
}

const ContextMenuComponent: React.FC<ContextMenuProps> = ({
  contextMenu,
  handleEditNode,
  handleDeleteNode,
  handleCloseContextMenu,
}) => {
  if (!contextMenu) return null;

  return (
    <div
      className="context-menu"
      style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
      onMouseLeave={handleCloseContextMenu}
    >
      <button onClick={handleEditNode} className="context-menu-button">
        Editar
      </button>
      <button onClick={handleDeleteNode} className="context-menu-button">
        Deletar
      </button>
    </div>
  );
};

export default ContextMenuComponent;
