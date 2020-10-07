import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, Image, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import AppContext from '../context/index';

export default function Welcome() {
  const {updateDangerLevel, updateUserLocation} = useContext(AppContext);

  useEffect(() => {
    (async function () {
      try {
        const permission = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        const granted =
          permission['android.permission.ACCESS_COARSE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          permission['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED;

        if (granted) {
          Geolocation.getCurrentPosition(
            (position) => {
              fetch(
                `https://us-central1-vandycloudfires.cloudfunctions.net/shouldEvacuate?lon=${position.coords.longitude}&lat=${position.coords.latitude}`,
              )
                .then((res) => res.json())
                .then((data) => {
                  updateUserLocation({
                    long: position.coords.longitude,
                    lat: position.coords.latitude,
                  });
                  updateDangerLevel(data.shouldEvacuate);
                  console.log(position);
                })
                .catch((err) => console.error(err));
            },
            (error) => {
              console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.welcomeView}>
      <Image source={require('./appLogo.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    maxWidth: '70%',
    maxHeight: '50%',
  },
});
