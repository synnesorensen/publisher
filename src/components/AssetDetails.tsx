import React from 'react';
import { Asset } from '../types/types';
import PosterFrame from './PosterFrame';
import TimecodeInput from './TimecodeInput';
import { frameToTimecode } from '../utils/timecode';

interface AssetDetailsProps {
  asset: Asset | null;
  inPointTimecode: string;
  outPointTimecode: string;
  onInPointChange: (timecode: string) => void;
  onOutPointChange: (timecode: string) => void;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({
  asset,
  inPointTimecode,
  outPointTimecode,
  onInPointChange,
  onOutPointChange
}) => {
  if (!asset) {
    return <div className="asset-details-empty">No asset loaded</div>;
  }

  const { metadata } = asset;
  const isVideo = metadata.type === 'video' || asset.itemType === 'video';
  const framerate = metadata.framerate || asset.mediaFrameRate || 25;

  // Get title, using correct path or fallback
  const title = metadata.formData?.title || metadata.title || asset.title || 'Untitled';
  
  // Get description
  const description = metadata.formData?.description || metadata.description || '';

  // Use thumbnail as poster if poster is not available
  const posterUrl = metadata.poster || asset.thumbnail;

  return (
    <div className="asset-details">
      <h2>Asset Details</h2>
      <div className="asset-title">{title}</div>
      
      {description && (
        <div className="asset-description">{description}</div>
      )}
      
      {isVideo && (
        <>
          <div className="asset-poster">
            <PosterFrame src={posterUrl} alt={metadata.title ?? ""} />
          </div>
          
          <div className="asset-timecodes">
            <TimecodeInput 
              label="In" 
              value={inPointTimecode} 
              onChange={onInPointChange} 
              framerate={framerate} 
            />
            
            <TimecodeInput 
              label="Out" 
              value={outPointTimecode} 
              onChange={onOutPointChange} 
              framerate={framerate} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AssetDetails;