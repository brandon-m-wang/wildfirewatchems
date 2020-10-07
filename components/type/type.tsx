export interface AppContextType {
  userLocation: UserLocationType;
  fireLocations: FireLocationType[];
  dangerLevel: Boolean;
  updateUserLocation: (location: UserLocationType) => void;
  updateFireLocation: (fire: FireLocationType[]) => void;
  updateDangerLevel: (level: Boolean) => void;
}

export interface FireLocationType {
  id: string;
  long: number;
  lat: number;
}
export interface UserLocationType {
  long: number;
  lat: number;
}
