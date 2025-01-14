import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import {BackgroundImage} from '../helper/GetIcon';
import LottieView from 'lottie-react-native';

const Dice = React.memo(({color, rotate, player, data}) => {
  const diceNo = 5;
  const pileIcon = BackgroundImage.GetImage(color);
  const diceIcon = BackgroundImage.GetImage(diceNo);

  const arroAnim = useRef(new Animated.Value(0)).current;

  const [diceRolling, setDiceRolling] = useState(false);

  useEffect(() => {
    const animateArrow = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arroAnim, {
            toValue: 10,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(arroAnim, {
            toValue: -10,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
          }),
        ]),
      ).start();
    };

    animateArrow();
  }, []);

  return (
    <View style={[styles.flexRow, {transform: [{scaleX: rotate ? -1 : 1}]}]}>
      <View style={styles.border1}>
        <LinearGradient
          style={styles.linearGradient}
          colors={['#0052be', '#5f9fcb', '#97c6c9']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}>
          <View style={styles.pileContainer}>
            <Image source={pileIcon} style={styles.pileIcon} />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.border2}>
        <LinearGradient
          style={styles.diceGradient}
          colors={['#aac8ab', '#aac8ab', '#aac8ab']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}>
          <View style={styles.diceContainer}>
            <TouchableOpacity>
              <Image source={diceIcon} style={styles.dice} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {diceRolling && (
        <Animated.View style={{transform: [{translateX: arroAnim}]}}>
          <Image
            source={require('../assets/images/arrow.png')}
            style={{height: 30, width: 50}}
          />
        </Animated.View>
      )}

      {diceRolling && (
        <LottieView
          source={require('../assets/animation/diceroll.json')}
          style={styles.rollingDice}
          loop={false}
          autoPlay
          cacheComposition={true}
          hardwareAccelerationAndroid={true}
        />
      )}
    </View>
  );
});

export default Dice;

const styles = StyleSheet.create({
  rollingDice: {
    height: 80,
    width: 80,
    zIndex: 99,
    top: -20,
    position: 'absolute',
    // left: 40,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border1: {
    borderWidth: 3,
    borderRightWidth: 0,
    borderColor: '#f0ce2c',
  },
  border2: {
    borderWidth: 3,
    padding: 1,
    backgroundColor: '#aac8ab',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderColor: '#aac8ab',
  },
  linearGradient: {},
  pileIcon: {
    width: 35,
    height: 35,
  },
  pileContainer: {
    paddingHorizontal: 3,
  },
  diceContainer: {
    backgroundColor: '#e8c0c1',
    borderWidth: 1,
    borderRadius: 5,
    width: 55,
    height: 55,
    paddingHorizontal: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceGradient: {
    borderWidth: 3,
    borderLeftWidth: 3,
    backgroundColor: '#f0ce2c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    height: 45,
    width: 45,
  },
});
