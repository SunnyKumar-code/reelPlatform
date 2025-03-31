"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import VideoUploadForm from "@/app/components/VideoUploadForm";
import { useNotification } from "@/app/components/Notification";
import { Loader2 } from "lucide-react";

export default function VideoUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    // Redirect if user is not authenticated
    if (status === "unauthenticated") {
      showNotification("You must be logged in to upload videos", "error");
      router.push("/login");
    }
  }, [status, router, showNotification]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null; // This will not render as we're redirecting in the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-200 rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Upload New Reel</h1>
          <p className="text-base-content/70 mb-6">
            Share your creative content with the world. Videos should be in portrait mode
            for best viewing experience.
          </p>
          <VideoUploadForm />
        </div>
      </div>
    </div>
  );
} 