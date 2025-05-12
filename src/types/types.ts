// Asset types
export interface AssetMetadata {
  formId?: string;
  formData?: {
    title?: string;
    description?: string;
    mediaCreatedOn?: string;
    createdOn?: string;
    headline?: string;
    [key: string]: any;
  };
  title?: string; // Fallback title
  description?: string; // Fallback description
  inPoint?: number; // Frame number for in point
  outPoint?: number; // Frame number for out point
  poster?: string; // URL to poster frame
  framerate?: number; // Frames per second for timecode calculations
  duration?: number; // Duration in seconds
  type?: string; // "video", "audio", "image", etc.
}

export interface Asset {
  id: string;
  metadata: AssetMetadata;
  mediaType?: string;
  itemType?: string; // "video", "audio", "image", etc.
  proxy?: string; // URL to web proxy
  editProxyUrl?: string; // URL to edit proxy
  highRes?: string; // URL to high resolution version
  thumbnail?: string; // URL to thumbnail
  vttUrl?: string; // URL to VTT subtitles
  srtUrl?: string; // URL to SRT subtitles
  proxyAudioTrackUrls?: string[]; // URLs to audio tracks
  title?: string; // Top-level title
  timecode?: string; // Starting timecode
  mediaFrameRate?: number; // Frame rate
  mediaDuration?: number; // Duration in frames
  mediaWidth?: number; // Width in pixels
  mediaHeight?: number; // Height in pixels
  attachments?: Array<{
    fileName: string;
    role: string;
    type: string;
    modifiedOn: string;
  }>;
  technicalMetadata?: {
    formId: string;
    formData: {
      technical_video_frame_rate?: number;
      [key: string]: any;
    };
  };
}

// Publishing destinations
export type PublishingDestination =
  | "TV2.no"
  | "Play"
  | "Direktesport"
  | "MyGame";

// Publishing form data
export interface PublishingFormData {
  publishStartDate: string; // ISO date string with time
  publishEndDate: string; // ISO date string with time
  publishTitle: string;
  seoTitle: string;
  tags: string[];
  category: string;
  destinations: PublishingDestination[];
  inPoint: string; // Timecode format hh:mm:ss:ff
  outPoint: string; // Timecode format hh:mm:ss:ff
  showLogo: boolean;
  ingress: string;
}

// Communication types
export interface MimirMessage {
  type?: string;
  action?: string;
  payload?: any;
}

export interface UpdateMetadataMessage {
  action: "update_metadata";
  payload: {
    formId: string;
    formData: Record<string, any>;
  };
}

export interface SaveMetadataMessage {
  action: "save_metadata";
}

export interface PluginLoadedMessage {
  action: "plugin_loaded";
}
