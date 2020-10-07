import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import AppContext from '../context/index';

export default function Map() {
  const {
    userLocation,
    fireLocations,
    dangerLevel,
    updateFireLocation,
    updateDangerLevel,
    updateUserLocation,
  } = useContext(AppContext);

  // Update user location every 1 minutes
  useEffect(() => {
    setInterval(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          fetch(
            `https://us-central1-vandycloudfires.cloudfunctions.net/shouldEvacuate?lon=${position.coords.longitude}&lat=${position.coords.latitude}`,
          )
            .then((res) => res.json())
            .then((data) => {
              if (
                userLocation.long !== position.coords.longitude &&
                userLocation.lat !== position.coords.latitude
              ) {
                updateUserLocation({
                  long: position.coords.longitude,
                  lat: position.coords.latitude,
                });
              }
              if (dangerLevel !== data.shouldEvacuate) {
                updateDangerLevel(data.shouldEvacuate);
              }
            })
            .catch((err) => console.error(err));
        },
        (error) => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }, 1000 * 60 * 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the fire location every 1 minutes
  useEffect(() => {
    fetch('https://us-central1-vandycloudfires.cloudfunctions.net/getFires')
      .then((res) => res.json())
      .then((data) => {
        const locations = data.map((location: any) => {
          return {
            id: location.id,
            long: parseFloat(location.long),
            lat: parseFloat(location.lat),
          };
        });
        updateFireLocation(locations);
      })
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Throw alert if the user is close to danger
  useEffect(() => {
    if (dangerLevel) {
      Alert.alert('Evacuate now', 'You are in close vicinity of a wildfire');
    }
  });

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: userLocation.lat,
          longitude: userLocation.long,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}>
        {fireLocations.length > 1
          ? fireLocations.map((location) => (
              <Marker
                key={location.id}
                coordinate={{
                  longitude: location.long,
                  latitude: location.lat,
                }}
              />
            ))
          : null}
        {}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
