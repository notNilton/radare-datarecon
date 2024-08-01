import React, { useRef } from "react";

const FileUpload = ({ onFileUploadSuccess }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

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
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <button className="button add-button" onClick={handleFileButtonClick}>
        Adc. Arq.
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".json"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default FileUpload;
