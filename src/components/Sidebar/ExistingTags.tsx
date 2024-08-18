import React from "react";
import { Tag } from "primereact/tag";
import './SidebarComponent.scss'; // Certifique-se de importar o SCSS

const ExistingTags: React.FC = () => {
  const tags = [
    "Tag 1",
    "Tag 2",
    "Tag 3",
    "Tag 4",
    "Tag 5",
    "Tag 6",
    "Tag 7",
    "Tag 8",
    "Tag 9",
    
  ];

  return (
    <div className="existing-tags-grid">
      {tags.map((tag, index) => (
        <div key={index} className="tag-item">
          <Tag value={tag} severity="info" />
        </div>
      ))}
    </div>
  );
};

export default ExistingTags;
