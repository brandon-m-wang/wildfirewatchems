import {createContext} from 'react';
import {UserLocationType, FireLocationType, AppContextType} from '../type/type';

export const blankData = {
  userLocation: {
    long: 0,
    lat: 0,
  },
  fireLocations: [{id: '', long: 0, lat: 0}],
  dangerLevel: false,
  updateUserLocation: (_: UserLocationType) => {},
  updateFireLocation: (_: FireLocationType[]) => {},
  updateDangerLevel: (_: Boolean) => {},
};
export default createContext<AppContextType>(blankData);
