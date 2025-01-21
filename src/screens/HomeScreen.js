import {
  Alert,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import Wrapper from '../components/Wrapper';
import Logo from '../assets/images/logo.png';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import GradientButton from '../components/GradientButton';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentPosition} from '../redux/reducers/gameSelectors';
import {useIsFocused} from '@react-navigation/native';
import {playSound} from '../helper/SoundUtility';
import SoundPlayer from 'react-native-sound-player';
import {resetGame} from '../redux/reducers/gameSlice';
import {navigate} from '../helper/NavigationUtil';
import LottieView from 'lottie-react-native';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const currenPosition = useSelector(selectCurrentPosition);
  const isFocused = useIsFocused();

  const witchAnim = useRef(new Animated.Value(-deviceWidth)).current;
  const scaleXAnim = useRef(new Animated.Value(-1)).current;

  const renderButton = useCallback((title, onPress) => {
    return <GradientButton title={title} onPress={onPress} />;
  }, []);

  const startGame = async (isNew = false) => {
    SoundPlayer.stop();
    if (isNew) {
      dispatch(resetGame());
    }
    navigate('LudoBoardScreen');
    playSound('game_start');
  };

  const handleNewGamePress = useCallback(() => {
    startGame(true);
  }, []);

  const handleResumePress = useCallback(() => {
    startGame();
  }, []);

  const loopAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(witchAnim, {
            toValue: deviceWidth * 0.02,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleXAnim, {
            toValue: -1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),

        Animated.delay(3000),

        Animated.parallel([
          Animated.timing(witchAnim, {
            toValue: deviceWidth * 2,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleXAnim, {
            toValue: -1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(witchAnim, {
            toValue: -deviceWidth * 0.05,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleXAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),

        Animated.delay(3000),

        Animated.parallel([
          Animated.timing(witchAnim, {
            toValue: -deviceWidth * 0.02,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleXAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  };

  useEffect(() => {
    if (isFocused) {
      playSound('home');
    }
  }, [isFocused]);

  useEffect(() => {
    const cleanUpAnimation = () => {
      Animated.timing(witchAnim).stop();
      Animated.timing(scaleXAnim).stop();
    };

    loopAnimation();

    return () => cleanUpAnimation();
  }, [witchAnim, scaleXAnim]);

  return (
    <Wrapper style={{justifyContent: 'flex-start'}}>
      <Animated.View style={styles.imgContainer}>
        <Image source={Logo} style={styles.img} />
      </Animated.View>
      {currenPosition !== 0 && renderButton('RESUME GAME', handleResumePress)}
      {renderButton('NEW GAME', handleNewGamePress)}
      {renderButton('Vs CPU', () => Alert.alert('Coming Soon'))}
      {renderButton('2 vs 2', () => Alert.alert('Coming Soon'))}

      <Animated.View
        style={[
          styles.witchContainer,
          {transform: [{translateX: witchAnim}, {scaleX: scaleXAnim}]},
        ]}>
        <Pressable
          onPress={() => {
            const random = Math.floor(Math.random() * 3) + 1;
            playSound(`girl${random}`);
          }}>
          <LottieView
            source={require('../assets/animation/witch.json')}
            hardwareAccelerationAndroid
            autoPlay
            loop
            style={styles.witch}
            speed={1}
          />
        </Pressable>
      </Animated.View>

      <Text style={styles.artish}>Made by - Divyang Dheer</Text>
    </Wrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imgContainer: {
    width: deviceWidth * 0.6,
    height: deviceHeight * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    alignSelf: 'center',
  },
  artish: {
    position: 'absolute',
    bottom: 40,
    color: '#fff',
    fontWeight: 800,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  witchContainer: {
    position: 'absolute',
    top: '70%',
    left: '24%',
  },
  witch: {
    width: 250,
    height: 250,
    transform: [{rotate: '25deg'}],
  },
});
