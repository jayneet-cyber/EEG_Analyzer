import { useRef } from 'react';
import { Upload, FileCheck, X } from 'lucide-react';

interface FileUploadZoneProps {
  label: string;
  accept: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  description: string;
}

export function FileUploadZone({ label, accept, file, onFileSelect, description }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm" style={{ color: 'var(--text-heading)' }}>{label}</label>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-200"
        style={{
          borderColor: file ? 'var(--accent)' : 'var(--color-3)',
          backgroundColor: file ? 'var(--accent-light)' : 'var(--background)',
          borderWidth: '3px'
        }}
        onMouseEnter={(e) => {
          if (!file) {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!file) {
            e.currentTarget.style.borderColor = 'var(--color-3)';
            e.currentTarget.style.backgroundColor = 'var(--background)';
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          {file ? (
            <>
              <FileCheck className="w-12 h-12 mb-3" style={{ color: 'var(--accent)' }} />
              <p className="mb-1" style={{ color: 'var(--accent-hover)' }}>{file.name}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(2)} KB</p>
              <button
                onClick={handleRemoveFile}
                className="absolute top-3 right-3 p-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  color: 'var(--text-muted)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-elevated)';
                  e.currentTarget.style.color = 'var(--error)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="mb-1" style={{ color: 'var(--text-heading)' }}>Click or drag file to upload</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{description}</p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>Accepts {accept} files</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}