import { Tag } from "primereact/tag";
import React, { useState, useEffect } from "react";

interface ExistingTagsProps {}

const ExistingTags: React.FC<ExistingTagsProps> = () => {
  const [edgeNames, setEdgeNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:5000/reconciled-data");
        const data = await response.json();

        if (data.length > 0) {
          const names = data[0][0]; // Extrai os nomes das tags da resposta
          setEdgeNames(names);
        }
      } catch (error) {
        console.error("Erro ao carregar nomes das tags do backend:", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="existing-tags-grid">
      {edgeNames.map((tag, index) => (
        <div key={index} className="tag-item">
          <Tag value={tag} severity="info" />
        </div>
      ))}
    </div>
  );
};

export default ExistingTags;
