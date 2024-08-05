import React, { useRef, useState, ChangeEvent } from "react";
import "./UploadFile.css"; // Import the CSS for the progress modal
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface FileUploadProps {
  onFileUploadSuccess?: (data: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setProgress("Iniciando o upload...");

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log(data);
      if (onFileUploadSuccess) {
        onFileUploadSuccess(data);
      }
      setProgress("Upload concluído com sucesso!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setProgress(`Erro ao fazer upload: ${(error as Error).message}`);
    } finally {
      setTimeout(() => setIsUploading(false), 2000); // Close modal after 2 seconds
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCloseModal = () => {
    setIsUploading(false);
  };

  return (
    <div>
      <button className="button add-button" onClick={handleFileButtonClick}>
        <CloudUploadIcon />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden-file-input"
        accept=".json"
        onChange={handleFileUpload}
        aria-label="File upload" // Added aria-label for accessibility
      />
      {isUploading && (
        <div className="progress-modal-overlay">
          <div className="progress-modal">
            <h2>Progresso do Upload</h2>
            <pre>{progress}</pre>
            <button onClick={handleCloseModal} className="close-button">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
