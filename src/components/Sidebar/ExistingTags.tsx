import { Tag } from "primereact/tag";

interface ExistingTagsProps {
  edgeNames: string[]; // Adicione esta linha
}

const ExistingTags: React.FC<ExistingTagsProps> = ({ edgeNames }) => {
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
