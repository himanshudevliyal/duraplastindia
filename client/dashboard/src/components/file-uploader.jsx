"use client";

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function FileUpload({
  onFileChange,
  className,
  initialFiles,
  maxFiles = 10,
  multiple = true,
  maxSizeMB = 5,
  accept = "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
  grid = "",
  compact = false,
}) {
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: accept,
    maxSize,
    multiple,
    maxFiles,
    initialFiles: initialFiles,
    // onFilesChange: (files) => {
    //   onFileChange(() => files.map(({ file }) => file));
    // },
  });

  useEffect(() => {
    onFileChange?.(files.map(({ file }) => file));
  }, [files]);

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className={cn(
          "border-input bg-muted/30 hover:border-[#f5821f]/50 hover:bg-accent/40 data-[dragging=true]:border-[#f5821f] data-[dragging=true]:bg-accent has-[input:focus]:border-ring has-[input:focus]:ring-ring/30 relative flex flex-col items-center overflow-hidden rounded-[20px] border-2 border-dashed transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]",
          compact ? "min-h-0 p-3" : "min-h-40 p-4",
          className,
        )}
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Uploaded Files ({files.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                disabled={files.length >= maxFiles}
                type="button"
              >
                <UploadIcon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Add more
              </Button>
            </div>

            <div
              className={cn(
                "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4",
                grid,
              )}
            >
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-accent relative aspect-square rounded-md"
                >
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-full rounded-[inherit] object-cover"
                  />
                  <Button
                    onClick={() => removeFile(file.id)}
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove image"
                    type="button"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            {!compact && (
              <div
                className="bg-card mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border shadow-xs"
                aria-hidden="true"
              >
                <ImageIcon className="size-4 opacity-60" />
              </div>
            )}
            {!compact && (
              <p className="mb-1 text-sm font-medium">
                Drop {multiple ? "images" : "an image"} here
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              SVG, PNG, JPG or GIF · max {maxSizeMB}MB
            </p>
            <Button
              variant="outline"
              size="sm"
              className={compact ? "mt-2" : "mt-3"}
              onClick={openFileDialog}
              type="button"
            >
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              {multiple ? "Select images" : "Select image"}
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
