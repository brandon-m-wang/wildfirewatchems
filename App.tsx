/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, StatusBar} from 'react-native';

import Welcome from './components/Welcome/Welcome';
import MapContent from './components/Map/MapContent';
import Notification from './components/Notification/Notification';
import {FireLocationType, UserLocationType} from './components/type/type';
import AppContext, {blankData} from './components/context';

export default function App() {
  const [userLocation, setUserLocation] = useState<UserLocationType>(
    blankData.userLocation,
  );
  const [fireLocations, setFireLocations] = useState<FireLocationType[]>(
    blankData.fireLocations,
  );
  const [dangerLevel, setDangerLevel] = useState<Boolean>(
    blankData.dangerLevel,
  );

  const updateUserLocation = (location: UserLocationType) => {
    setUserLocation({long: location.long, lat: location.lat});
  };
  const updateFireLocation = (fire: FireLocationType[]) => {
    setFireLocations([...fireLocations, ...fire]);
  };
  const updateDangerLevel = (level: Boolean) => {
    setDangerLevel(level);
  };

  return (
    <AppContext.Provider
      value={{
        userLocation,
        fireLocations,
        dangerLevel,
        updateUserLocation,
        updateFireLocation,
        updateDangerLevel,
      }}>
      <SafeAreaView style={styles.container}>
        {userLocation.long !== 0 ? <MapContent /> : <Welcome />}
        {/* <Notification /> */}
      </SafeAreaView>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
  },
});
