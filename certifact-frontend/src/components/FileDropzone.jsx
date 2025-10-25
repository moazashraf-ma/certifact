import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';

const FileDropzone = ({ onFileSelected, acceptedFileTypes, disabled }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
    setDragActive(false);
  }, [onFileSelected]);

  const onDragEnter = useCallback(() => {
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    accept: acceptedFileTypes || { 'image/*': [], 'video/*': [] }, // Default accepts images and videos
    multiple: false,
    disabled: disabled
  });

  return (
    <div
      {...getRootProps()}
      className={`file-dropzone p-5 border-dashed border-2 rounded-lg text-center cursor-pointer transition-all ${
        dragActive || isDragActive ? 'border-primary bg-light' : 'border-secondary'
      } ${disabled ? 'bg-light text-muted' : ''}`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label="Drag and drop file to upload"
    >
      <input {...getInputProps()} disabled={disabled} />
      <FiUploadCloud size={48} className={`mb-3 ${disabled ? 'text-muted' : 'text-primary'}`} />
      {
        disabled ? (
          <p className="mb-0 text-muted">Upload is disabled</p>
        ) : (
          <>
            {isDragActive ? (
              <p className="mb-0">Drop the file here ...</p>
            ) : (
              <p className="mb-0">Drag & drop an image or video here, or click to select file</p>
            )}
            <small className="text-muted">Max file size: 10MB</small>
          </>
        )
      }
    </div>
  );
};

export default FileDropzone;