import { IVideo } from "@/models/Video";

export type VideoFormdata = Omit<IVideo,"_id">

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: Record<string, unknown> | string | null;
    headers?: Record<string, string>;
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        };
       const response = await fetch(`/api${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return response.json();
    }
    
    async getVideos() {
        return this.fetch<IVideo[]>("/videos");
    }
    
    async getAVideo(id: string) {
        return this.fetch<IVideo>(`/videos/${id}`);
    }

    async createVideo(videoData: VideoFormdata) {
        return this.fetch("/videos", {
            method: "POST",
            body: videoData as Record<string, unknown>
        });
    }
}

export const apiClient = new ApiClient();