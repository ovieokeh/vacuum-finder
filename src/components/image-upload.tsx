// ImageUpload.tsx
import React, { useCallback, useEffect, useState } from "react";
import { supabaseFrontend } from "../providers/site-config";

interface ImageUploadProps {
  bucket?: string;
  // Show a preview of the uploaded image after success
  currentUrl?: string;
  label?: React.ReactNode;
  showPreview?: boolean;
  // Called with the public URL upon successful upload
  onUpload?: (url: string) => void;
  // Additional styling, if desired
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  bucket = "product-images",
  currentUrl = "",
  label,
  showPreview = true,
  onUpload,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUrl) {
      setPreviewUrl(currentUrl);
    }
  }, [currentUrl]);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      if (!file.type.startsWith("image/")) {
        setError("Only image file types are allowed.");
        return;
      }

      setIsUploading(true);

      try {
        const fileName = file.name;
        const { data: existingFile } = await supabaseFrontend.storage.from(bucket).exists(fileName);

        if (existingFile) {
          const { data } = supabaseFrontend.storage.from(bucket).getPublicUrl(fileName);
          console.log("File already exists", fileName, existingFile);
          if (showPreview) {
            setPreviewUrl(data.publicUrl);
          }

          onUpload?.(data.publicUrl);
          return;
        }

        // You could also rename the file or generate a random name
        const { error: uploadError } = await supabaseFrontend.storage.from(bucket).upload(fileName, file);

        if (uploadError) throw uploadError;

        // Make the file publicly available
        const { data } = supabaseFrontend.storage.from(bucket).getPublicUrl(fileName);

        if (!data) throw new Error("Could not get public URL");

        const publicURL = data.publicUrl;

        if (showPreview) {
          setPreviewUrl(publicURL);
        }
        onUpload?.(publicURL);
      } catch (err: any) {
        setError(err.message || "An error occurred while uploading");
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, onUpload, showPreview]
  );

  return (
    <label
      className={`w-full min-h-[18rem] max-w-[34rem] md:min-w-[22rem] md:min-h-[22rem] flex flex-col items-center gap-2 p-2 text-text rounded shadow cursor-pointer hover:bg-background-alt ${className}`}
    >
      {/* Preview section */}
      {showPreview && isUploading ? (
        <div className="flex items-center space-x-2">
          {/* Simple tailwind-based spinner */}
          <div className="w-5 h-5 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <span>Uploading...</span>
        </div>
      ) : previewUrl ? (
        <img
          src={previewUrl}
          alt="Uploaded Preview"
          className="object-contain w-auto h-[20rem] rounded shadow bg-background"
        />
      ) : (
        <span className="text-sm text-text/90">{label ?? "No image uploaded"}</span>
      )}

      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Display error if any */}
      <div className="min-h-6">
        <span className="text-red-600 text-sm">{error}</span>
      </div>

      {label && <span className="block text-center text-sm text-text/90">{label}</span>}
    </label>
  );
};

export default ImageUpload;
