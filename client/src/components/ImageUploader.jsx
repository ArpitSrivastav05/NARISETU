import React, { useState, useRef } from "react";
import { uploadImage } from "../services/firebase";

export default function ImageUploader({ onUploadComplete, initialImageUrl = "", folder = "products" }) {
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("File is not an image."));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(
                  new File([blob], file.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  })
                );
              } else {
                reject(new Error("Compression failed."));
              }
            },
            "image/jpeg",
            0.8
          );
        };
        img.onerror = () => reject(new Error("Failed to load image."));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setIsUploading(true);
    setProgress(20); // Initial mock progress showing action started

    try {
      // Create local preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Compress client-side
      setProgress(50);
      const compressedFile = await compressImage(file);

      // Upload to Firebase Storage
      setProgress(75);
      const downloadUrl = await uploadImage(compressedFile, folder);

      setProgress(100);
      setPreviewUrl(downloadUrl);
      onUploadComplete(downloadUrl);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to upload image. Please try again.");
      setPreviewUrl(initialImageUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isUploading) return;
    const file = e.dataTransfer.files[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileChange({ target: { files: [file] } });
    }
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setPreviewUrl("");
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] ${
          isUploading
            ? "border-blue-400 bg-blue-50/5 pointer-events-none"
            : previewUrl
            ? "border-emerald-300 bg-emerald-50/5 hover:border-emerald-400"
            : "border-slate-200 hover:border-blue-400 bg-slate-50/30 hover:bg-blue-50/5"
        }`}
      >
        {previewUrl ? (
          <div className="relative w-full max-h-[220px] overflow-hidden rounded-xl flex items-center justify-center group">
            <img
              src={previewUrl}
              alt="Uploaded product preview"
              className="object-cover max-h-[220px] rounded-xl w-full"
            />
            {!isUploading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                  className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-white shadow transition transform hover:scale-105"
                >
                  🔄 Change
                </button>
                <button
                  type="button"
                  onClick={clearImage}
                  className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-rose-700 shadow transition transform hover:scale-105"
                >
                  🗑️ Remove
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2 py-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xl group-hover:scale-110 transition-transform">
              📸
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Click to capture or upload
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Supports camera capture & image files
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center p-4">
            <div className="h-7 w-7 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-600 mt-2">
              Uploading picture... {progress}%
            </p>
            <div className="w-2/3 bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-500 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
