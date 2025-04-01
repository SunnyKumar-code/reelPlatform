"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'details'>('upload');
  const { showNotification } = useNotification();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  const title = watch("title");
  // We use title in the character counter display

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("videoUrl", response.filePath);
    setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    showNotification("Video uploaded successfully!", "success");
    
    // Move to the details step after upload
    setStep('details');
    
    // If we have a thumbnail URL, set it as preview
    if (response.thumbnailUrl) {
      setVideoPreviewUrl(`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${response.thumbnailUrl}`);
    }
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      showNotification("Please upload a video first", "error");
      return;
    }

    setLoading(true);
    try {
      await apiClient.createVideo(data);
      showNotification("Video published successfully!", "success");

      // Reset form values
      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setUploadProgress(0);
      setVideoPreviewUrl(null);
      setStep('upload');
      
      // Redirect to home page after successful upload
      setTimeout(() => {
        router.push("/");
      }, 1500); // Short delay to allow the success notification to be seen
      
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setValue("videoUrl", "");
    setValue("thumbnailUrl", "");
    setVideoPreviewUrl(null);
    setUploadProgress(0);
    setStep('upload');
  };

  return (
    <div className="bg-base-100 rounded-lg overflow-hidden">
      {step === 'upload' ? (
        // UPLOAD SCREEN (Instagram-like)
        <div className="flex flex-col items-center justify-center py-10 px-4">
          <div className="w-full max-w-md mx-auto text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share your video</h3>
              <p className="text-base-content/70 text-sm mb-6">
                Upload a video to share with your followers
              </p>
            </div>
            
            <div className="relative">
              <div className="border-2 border-dashed border-base-300 rounded-lg p-8 transition-all hover:border-primary">
                <FileUpload
                  fileType="video"
                  onSuccess={handleUploadSuccess}
                  onProgress={handleUploadProgress}
                />
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="absolute inset-0 bg-base-100/80 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 flex items-center justify-center mb-2">
                    <div 
                      className="radial-progress text-primary" 
                      style={{ '--value': uploadProgress } as React.CSSProperties} 
                      role="progressbar"
                    >
                      {uploadProgress}%
                    </div>
                  </div>
                  <p className="text-sm font-medium">Uploading video...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // DETAILS SCREEN (Instagram-like)
        <div className="flex flex-col md:flex-row">
          {/* Preview Section */}
          <div className="md:w-1/2 bg-black flex items-center justify-center p-4 min-h-[300px]">
            {videoPreviewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Replace img with Next.js Image component */}
                <div className="relative w-auto max-h-[400px]">
                  <Image 
                    src={videoPreviewUrl}
                    alt="Video thumbnail"
                    width={400}
                    height={400}
                    className="max-h-[400px] w-auto object-contain"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <button 
                  onClick={resetUpload}
                  className="absolute top-2 right-2 bg-base-100/30 hover:bg-base-100/50 p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-white/50">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p>No preview available</p>
              </div>
            )}
          </div>
          
          {/* Form Section */}
          <div className="md:w-1/2 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Add a title..."
                  className={`w-full bg-transparent text-lg font-medium border-b border-base-300 pb-2 focus:outline-none focus:border-primary ${
                    errors.title ? "border-error" : ""
                  }`}
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-error text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              
              <div className="mt-4">
                <textarea
                  placeholder="Write a description..."
                  rows={3}
                  className={`w-full bg-transparent text-sm border-b border-base-300 pb-2 focus:outline-none focus:border-primary ${
                    errors.description ? "border-error" : ""
                  }`}
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                  <p className="text-error text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <button 
                  type="button" 
                  onClick={resetUpload}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                
                <div className="flex items-center">
                  <span className="text-xs mr-4 text-base-content/70">
                    {title ? title.length : 0}/100
                  </span>
                  
                  <button
                    type="submit"
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? "Sharing..." : "Share"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}