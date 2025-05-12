import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Asset,
  PublishingFormData,
  MimirMessage,
  PublishingDestination,
} from "./types/types";
import { mimirCommunication } from "./utils/communication";
import { frameToTimecode, timecodeToFrame } from "./utils/timecode";
import { mapMimirToDestinations } from "./utils/destinations";
import AssetDetails from "./components/AssetDetails";
import PublishingForm from "./components/PublishingForm";
import DebugPanel from "./components/DebugPanel";

function App() {
  // State for the current asset
  const [asset, setAsset] = useState<Asset | null>(null);

  // State for in and out points (as timecode strings)
  const [inPointTimecode, setInPointTimecode] = useState("00:00:00:00");
  const [outPointTimecode, setOutPointTimecode] = useState("00:00:00:00");

  // State for publishing form data
  const [formData, setFormData] = useState<Partial<PublishingFormData>>({});

  // State for debug messages
  const [debugMessages, setDebugMessages] = useState<MimirMessage[]>([]);

  // Initialize communication with Mimir
  useEffect(() => {
    // Set up message listener
    mimirCommunication.setupMessageListener((message) => {
      console.log("Received message:", message);

      // Store message for debugging
      setDebugMessages((prev) => [...prev, message]);

      // Handle 'mimir_ready' message
      if (message.type === "mimir_ready") {
        mimirCommunication.sendPluginLoaded();
      }

      // Handle 'item_loaded' or 'item' message
      if (message.type === "item_loaded" || message.type === "item") {
        const receivedAsset = message.payload as Asset;

        console.log("Received asset:", receivedAsset);

        // Extract the title correctly from the asset
        // First try metadata.formData.title, then fallback to top-level title
        const assetTitle =
          receivedAsset.metadata?.formData?.title ||
          receivedAsset.title ||
          "Untitled";

        console.log("Extracted asset title:", assetTitle);

        // Get frame rate from technical metadata or mediaFrameRate
        const framerate =
          receivedAsset.technicalMetadata?.formData
            ?.technical_video_frame_rate ||
          receivedAsset.mediaFrameRate ||
          25;

        console.log("Extracted framerate:", framerate);

        // Get poster frame from attachments
        const posterFrame = receivedAsset.attachments?.find(
          (attachment) =>
            attachment.type === "poster" && attachment.role === "thumbnail"
        );

        console.log("Found poster frame:", posterFrame);

        // Enhance the asset with additional info
        const enhancedAsset: Asset = {
          ...receivedAsset,
          metadata: {
            ...receivedAsset.metadata,
            framerate: framerate,
            type: receivedAsset.itemType || "video",
            poster: posterFrame ? receivedAsset.thumbnail : undefined,
          },
        };

        setAsset(enhancedAsset);

        // Set in/out points (using timecode if available or defaults)
        if (receivedAsset.metadata.inPoint !== undefined) {
          setInPointTimecode(
            frameToTimecode(receivedAsset.metadata.inPoint, framerate)
          );
        } else if (receivedAsset.timecode) {
          setInPointTimecode(receivedAsset.timecode);
        }

        if (receivedAsset.metadata.outPoint !== undefined) {
          setOutPointTimecode(
            frameToTimecode(receivedAsset.metadata.outPoint, framerate)
          );
        } else if (receivedAsset.mediaDuration && framerate) {
          // Calculate out point as duration in frames
          const outFrame = Math.floor(
            receivedAsset.mediaDuration / (1000 / framerate)
          );
          setOutPointTimecode(frameToTimecode(outFrame, framerate));
        }

        // Get publishing locations from metadata
        const publishedLocations =
          receivedAsset.metadata?.formData?.publishedLoc || [];
        console.log("Published locations from metadata:", publishedLocations);

        // Map the location values to our destination types using utility function
        const destinations = mapMimirToDestinations(
          publishedLocations as string[]
        );

        console.log("Mapped destinations:", destinations);

        // Initialize form data with asset title and destinations
        setFormData((prev) => {
          console.log("Setting publishTitle to:", assetTitle);
          console.log("Setting destinations to:", destinations);
          return {
            ...prev,
            publishTitle: assetTitle,
            destinations:
              destinations.length > 0 ? destinations : prev.destinations || [],
          };
        });
      }
    });

    // Let parent know we're loaded
    mimirCommunication.sendPluginLoaded();
  }, []);

  // Handle in-point change
  const handleInPointChange = (timecode: string) => {
    setInPointTimecode(timecode);

    // Update asset metadata
    if (asset && asset.metadata.framerate) {
      const frameNumber = timecodeToFrame(timecode, asset.metadata.framerate);

      // Send update to Mimir
      console.log("Sending update to Mimir with inPoint:", frameNumber);
      mimirCommunication.sendUpdateMetadata("metadata", {
        inPoint: frameNumber,
      });
    }
  };

  // Handle out-point change
  const handleOutPointChange = (timecode: string) => {
    setOutPointTimecode(timecode);

    // Update asset metadata
    if (asset && asset.metadata.framerate) {
      const frameNumber = timecodeToFrame(timecode, asset.metadata.framerate);

      // Send update to Mimir
      mimirCommunication.sendUpdateMetadata("metadata", {
        outPoint: frameNumber,
      });
    }
  };

  // Handle form data change
  const handleFormDataChange = (data: PublishingFormData) => {
    setFormData(data);
  };

  // Function to simulate receiving an item_loaded message (for testing)
  const simulateItemLoaded = () => {
    const mockMessage = {
      type: "item_loaded",
      payload: {
        id: "mock-asset-1",
        itemType: "video",
        title: "Original File Title.mp4",
        mediaFrameRate: 25,
        mediaWidth: 1920,
        mediaHeight: 1080,
        mediaDuration: 13960, // in frames
        timecode: "00:00:00:00",
        metadata: {
          formId: "Common",
          formData: {
            title: "Mock Test Video",
            description: "This is a mock video asset for testing",
            mediaCreatedOn: "2025-05-02T07:12:31.724Z",
            createdOn: "2025-05-02T08:03:18.339Z",
            publishedLoc: ["tv2no", "play", "clearchannel"],
          },
        },
        technicalMetadata: {
          formId: "default_video",
          formData: {
            technical_video_frame_rate: 25,
            technical_video_width: 1920,
            technical_video_height: 1080,
          },
        },
        attachments: [
          {
            fileName: "poster-frame.png",
            modifiedOn: "2025-05-02T08:03:59.052Z",
            role: "thumbnail",
            type: "poster",
          },
        ],
        thumbnail: "https://via.placeholder.com/300x200",
      },
    };

    // Process the mock message as if it was received from Mimir
    console.log("Simulating item_loaded message:", mockMessage);
    setDebugMessages((prev) => [...prev, mockMessage]);

    const receivedAsset = mockMessage.payload as Asset;

    // Extract the title correctly from the asset
    const assetTitle =
      receivedAsset.metadata?.formData?.title ||
      receivedAsset.title ||
      "Untitled";

    console.log("Extracted asset title:", assetTitle);

    // Get frame rate from technical metadata or mediaFrameRate
    const framerate =
      receivedAsset.technicalMetadata?.formData?.technical_video_frame_rate ||
      receivedAsset.mediaFrameRate ||
      25;

    // Get poster frame from attachments
    const posterFrame = receivedAsset.attachments?.find(
      (attachment) =>
        attachment.type === "poster" && attachment.role === "thumbnail"
    );

    // Enhance the asset with additional info
    const enhancedAsset: Asset = {
      ...receivedAsset,
      metadata: {
        ...receivedAsset.metadata,
        framerate: framerate,
        type: receivedAsset.itemType || "video",
        poster: posterFrame ? receivedAsset.thumbnail : undefined,
      },
    };

    setAsset(enhancedAsset);

    // Set in/out points
    if (receivedAsset.timecode) {
      setInPointTimecode(receivedAsset.timecode);
    }

    if (receivedAsset.mediaDuration && framerate) {
      // Calculate out point as duration in frames
      const outFrame = Math.floor(
        receivedAsset.mediaDuration / (1000 / framerate)
      );
      setOutPointTimecode(frameToTimecode(outFrame, framerate));
    }

    // Get publishing locations from metadata
    const publishedLocations =
      receivedAsset.metadata?.formData?.publishedLoc || [];
    console.log("Published locations from metadata:", publishedLocations);

    // Map the location values to our destination types using utility function
    const destinations = mapMimirToDestinations(publishedLocations as string[]);

    console.log("Mapped destinations:", destinations);

    // Initialize form data with asset title and destinations
    setFormData((prev) => ({
      ...prev,
      publishTitle: assetTitle,
      destinations:
        destinations.length > 0 ? destinations : prev.destinations || [],
    }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Publishing Tool</h1>

        {/* Test button - only visible in development */}
        {process.env.NODE_ENV === "development" && (
          <button onClick={simulateItemLoaded} className="test-button">
            Simulate Item Loaded
          </button>
        )}
      </header>

      <main className="app-content">
        <section className="asset-section">
          <AssetDetails
            asset={asset}
            inPointTimecode={inPointTimecode}
            outPointTimecode={outPointTimecode}
            onInPointChange={handleInPointChange}
            onOutPointChange={handleOutPointChange}
          />
        </section>

        <section className="publishing-section">
          <PublishingForm
            initialData={formData}
            asset={asset}
            onFormDataChange={handleFormDataChange}
          />
        </section>
      </main>

      {/* Debug panel will be visible in development */}
      {process.env.NODE_ENV === "development" && (
        <DebugPanel messages={debugMessages} />
      )}
    </div>
  );
}

export default App;
