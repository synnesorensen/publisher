import { PublishingDestination } from "../types/types";

// Maps from Mimir's location format to our PublishingDestination enum
export const mapMimirToDestinations = (
  mimirLocations: string[]
): PublishingDestination[] => {
  const destinationMap: Record<string, PublishingDestination> = {
    tv2no: "TV2.no",
    play: "Play",
    direktesport: "Direktesport",
    mygame: "MyGame",
  };

  return mimirLocations
    .map((loc) => destinationMap[loc])
    .filter((dest) => dest !== undefined) as PublishingDestination[];
};

// Maps from our PublishingDestination enum to Mimir's location format
export const mapDestinationsToMimir = (
  destinations: PublishingDestination[]
): string[] => {
  const destinationMap: Record<PublishingDestination, string> = {
    "TV2.no": "tv2no",
    Play: "play",
    Direktesport: "direktesport",
    MyGame: "mygame",
  };

  return destinations.map((dest) => destinationMap[dest]);
};
