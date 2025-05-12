/**
 * Convert frame number to timecode string (hh:mm:ss:ff)
 * @param frame Frame number
 * @param framerate Frames per second (default: 25)
 * @returns Timecode string
 */
export const frameToTimecode = (frame: number, framerate: number = 25): string => {
  if (frame < 0) return '00:00:00:00';
  
  const totalSeconds = Math.floor(frame / framerate);
  const frames = Math.floor(frame % framerate);
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
    frames.toString().padStart(2, '0')
  ].join(':');
};

/**
 * Convert timecode string (hh:mm:ss:ff) to frame number
 * @param timecode Timecode string
 * @param framerate Frames per second (default: 25)
 * @returns Frame number
 */
export const timecodeToFrame = (timecode: string, framerate: number = 25): number => {
  const match = timecode.match(/^(\d{2}):(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return 0;
  
  const [, hoursStr, minutesStr, secondsStr, framesStr] = match;
  
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);
  const frames = parseInt(framesStr, 10);
  
  const totalFrames = 
    hours * 3600 * framerate +
    minutes * 60 * framerate +
    seconds * framerate +
    frames;
    
  return totalFrames;
};

/**
 * Validate timecode string
 * @param timecode Timecode string
 * @param framerate Frames per second (default: 25)
 * @returns Whether the timecode is valid
 */
export const isValidTimecode = (timecode: string, framerate: number = 25): boolean => {
  const match = timecode.match(/^(\d{2}):(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return false;
  
  const [, , minutesStr, secondsStr, framesStr] = match;
  
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);
  const frames = parseInt(framesStr, 10);
  
  return minutes < 60 && seconds < 60 && frames < framerate;
};