import React, { useState, useEffect, ChangeEvent } from "react";
import {
  PublishingFormData,
  PublishingDestination,
  Asset,
} from "../types/types";
import { mimirCommunication } from "../utils/communication";
import { mapDestinationsToMimir } from "../utils/destinations";

const DESTINATIONS: PublishingDestination[] = [
  "TV2.no",
  "Play",
  "Direktesport",
  "MyGame",
];

interface PublishingFormProps {
  initialData: Partial<PublishingFormData>;
  asset: Asset | null;
  onFormDataChange: (data: PublishingFormData) => void;
}

const PublishingForm: React.FC<PublishingFormProps> = ({
  initialData,
  asset,
  onFormDataChange,
}) => {
  // Initialize form data with defaults
  const [formData, setFormData] = useState<PublishingFormData>({
    publishStartDate: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
    publishEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16), // 1 year from now
    publishTitle: asset?.metadata.title || "",
    seoTitle: "",
    tags: [],
    category: "",
    destinations: [],
    inPoint: "00:00:00:00",
    outPoint: "00:00:00:00",
    showLogo: true,
    ingress: "",
  });

  // Update form data when initial data or asset changes
  useEffect(() => {
    console.log("PublishingForm useEffect - initialData:", initialData);
    console.log("PublishingForm useEffect - asset:", asset);

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        ...initialData,
        publishTitle:
          initialData.publishTitle ||
          asset?.metadata.title ||
          prevData.publishTitle,
      };

      console.log("PublishingForm useEffect - updating formData:", updatedData);
      return updatedData;
    });
  }, [initialData, asset]);

  // Generic handler for text inputs
  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      onFormDataChange(updated);
      return updated;
    });
  };

  // Handler for date-time inputs
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      onFormDataChange(updated);
      return updated;
    });
  };

  // Handler for tags input (comma-separated)
  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    setFormData((prev) => {
      const updated = { ...prev, tags };
      onFormDataChange(updated);
      return updated;
    });
  };

  // Handler for destination checkboxes
  const handleDestinationChange = (destination: PublishingDestination) => {
    setFormData((prev) => {
      const destinations = prev.destinations.includes(destination)
        ? prev.destinations.filter((d) => d !== destination)
        : [...prev.destinations, destination];

      const updated = { ...prev, destinations };
      onFormDataChange(updated);

      // Convert destinations to Mimir's format using utility function
      const publishedLoc = mapDestinationsToMimir(destinations);

      // Send update to Mimir
      mimirCommunication.sendUpdateMetadata("Common", {
        publishedLoc,
      });

      return updated;
    });
  };

  // Handler for logo checkbox
  const handleShowLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const showLogo = e.target.checked;

    setFormData((prev) => {
      const updated = { ...prev, showLogo };
      onFormDataChange(updated);
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Convert destinations to Mimir's format using utility function
    const publishedLoc = mapDestinationsToMimir(formData.destinations);

    // Create the metadata to send back to Mimir
    const metadata = {
      title: formData.publishTitle,
      publishStartDate: formData.publishStartDate,
      publishEndDate: formData.publishEndDate,
      seoTitle: formData.seoTitle,
      tags: formData.tags,
      category: formData.category,
      publishedLoc: publishedLoc,
      showLogo: formData.showLogo,
      ingress: formData.ingress,
    };

    console.log("Sending metadata to Mimir:", metadata);

    // Send update to the parent Mimir application
    mimirCommunication.sendUpdateMetadata("Common", metadata);

    // Also send the complete form data for our own record
    mimirCommunication.sendUpdateMetadata("publishing", {
      publishingData: formData,
    });

    // Notify Mimir that we want to save the data
    mimirCommunication.sendSaveMetadata();
  };

  return (
    <div className="publishing-form">
      <h2>Publishing Settings</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="publishStartDate">From:</label>
          <input
            type="datetime-local"
            id="publishStartDate"
            name="publishStartDate"
            value={formData.publishStartDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="publishEndDate">To:</label>
          <input
            type="datetime-local"
            id="publishEndDate"
            name="publishEndDate"
            value={formData.publishEndDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="publishTitle">Title:</label>
          <input
            type="text"
            id="publishTitle"
            name="publishTitle"
            value={formData.publishTitle}
            onChange={handleTextChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="seoTitle">SEO Title:</label>
          <input
            type="text"
            id="seoTitle"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleTextChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="ingress">Ingress:</label>
        <textarea
          id="ingress"
          name="ingress"
          value={formData.ingress}
          onChange={handleTextChange}
          rows={2}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated):</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags.join(", ")}
            onChange={handleTagsChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleTextChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Publish to:</label>
        <div className="checkbox-group">
          {DESTINATIONS.map((destination) => (
            <div className="checkbox-item" key={destination}>
              <input
                type="checkbox"
                id={`destination-${destination}`}
                checked={formData.destinations.includes(destination)}
                onChange={() => handleDestinationChange(destination)}
              />
              <label htmlFor={`destination-${destination}`}>
                {destination}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="showLogo"
            checked={formData.showLogo}
            onChange={handleShowLogoChange}
          />
          <label htmlFor="showLogo">TV 2 logo i player</label>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="primary-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default PublishingForm;
