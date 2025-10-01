import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { toast } from 'sonner';

interface DeployInitProps {
  handleDeploy: (file: File) => void;
}

const DeployInit = ({ handleDeploy }: DeployInitProps) => {
  const {
    file,
    fileInputRef,
    handleFileSelection,
    handleFileInputChange,
    browseFiles,
  } = useFileUpload({
    maxSize: 100 * 1024 * 1024, // 100MB
    acceptedTypes: ['.zip'],
  });

  const { isDragOver, dragProps } = useDragAndDrop({
    onFilesDrop: (files) => {
      if (files.length === 1) {
        handleFileSelection(files[0]);
      }
    },
    maxFiles: 1,
  });

  const handleDeployClick = () => {
    if (!file) {
      toast.error('Please select a ZIP file first');
      return;
    }
    handleDeploy(file);
  };

  const handleBrowseClick = () => {
    browseFiles();
  };

  return (
    <div className="max-w-2xl w-full text-center space-y-8">
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Deploy a new project
        </h1>
        <p className="text-lg text-primary">
          Simply drag and drop your project's zip folder
        </p>
      </div>

      {/* Drag and Drop Area */}
      <div
        className={`bg-card border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : file
            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
            : 'border-border hover:border-primary/50'
        }`}
        {...dragProps}
        onClick={handleBrowseClick}
      >
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">
            {isDragOver ? 'Drop your file here' : 'Drag and drop here'}
          </p>

          <div className="flex flex-col items-center space-y-4">
            <div
              className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                file ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'
              }`}
            >
              <Upload
                className={`w-8 h-8 ${
                  file
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-muted-foreground'
                }`}
              />
            </div>

            {file ? (
              <div className="text-center">
                <p className="text-green-600 dark:text-green-400 font-medium">
                  {file.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Drop <span className="font-semibold">.ZIP</span> file here or
                browse
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Deploy Button */}
      <Button
        onClick={handleDeployClick}
        disabled={!file}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {file ? 'Deploy now' : 'Select a file first'}
      </Button>
    </div>
  );
};

export default DeployInit;
