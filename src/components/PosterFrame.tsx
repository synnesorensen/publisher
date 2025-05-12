import React from 'react';

interface PosterFrameProps {
  src: string | undefined;
  alt: string;
}

const PosterFrame: React.FC<PosterFrameProps> = ({ src, alt }) => {
  if (!src) {
    return (
      <div className="poster-frame poster-frame-empty">
        <div className="poster-frame-placeholder">No poster frame available</div>
      </div>
    );
  }

  return (
    <div className="poster-frame">
      <img src={src} alt={alt} />
      <div className="poster-frame-caption">Poster Frame</div>
    </div>
  );
};

export default PosterFrame;