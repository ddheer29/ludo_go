import {ActivityIndicator, Animated, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Wrapper from '../components/Wrapper';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import {prepareNavigation, resetAndNavigate} from '../helper/NavigationUtil';
import Logo from '../assets/images/logo.png';

const SplashScreen = () => {
  const [isStop] = useState(false);
  const scale = new Animated.Value(1);

  useEffect(() => {
    prepareNavigation();
    setTimeout(() => {
      resetAndNavigate('HomeScreen');
    }, 1500);
  }, []);

  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    if (!isStop) {
      breathingAnimation.start();
    }

    return () => breathingAnimation.stop();
  }, [isStop]);

  return (
    <Wrapper>
      <Animated.View style={[styles.imgContainer, {transform: [{scale}]}]}>
        <Image source={Logo} style={styles.img} />
      </Animated.View>
      <ActivityIndicator size="small" color="#fff" />
    </Wrapper>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  imgContainer: {
    width: deviceWidth * 0.7,
    height: deviceHeight * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
