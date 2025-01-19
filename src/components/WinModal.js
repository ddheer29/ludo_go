import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {announceWinner, resetGame} from '../redux/reducers/gameSlice';
import {playSound} from '../helper/SoundUtility';
import HeartGirl from '../assets/animation/girl.json';
import Trophy from '../assets/animation/trophy.json';
import FireWork from '../assets/animation/firework.json';
import {resetAndNavigate} from '../helper/NavigationUtil';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import Pile from './Pile';
import {colorPlayer} from '../helper/PlotData';
import LottieView from 'lottie-react-native';
import GradientButton from './GradientButton';

const WinModal = ({winner}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(!!winner);

  useEffect(() => {
    setVisible(!!winner);
  }, [winner]);

  const handleNewGame = () => {
    dispatch(resetGame());
    dispatch(announceWinner(null));
    playSound('game_start');
  };

  const handleHome = () => {
    dispatch(resetGame());
    dispatch(announceWinner(null));
    resetAndNavigate('HomeScreen');
  };

  return (
    <Modal
      style={styles.modal}
      isVisible={visible}
      backdropColor="#000"
      backdropOpacity={0.8}
      onBackdropPress={() => {}}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      onBackButtonPress={() => {}}>
      <LinearGradient
        style={styles.gradientContainer}
        colors={['#0f0c29', '#302b63', '#24243e']}>
        <View style={styles.content}>
          <View style={styles.pileContainer}>
            <Pile player={1} color={colorPlayer[winner - 1]} />
          </View>
          <View style={styles.congratsText}>
            🥳 Congratulations! PLAYER {winner}
          </View>
          <LottieView
            autoPlay
            hardwareAccelerationAndroid
            loop={false}
            source={Trophy}
            style={styles.trophyAnimation}
          />
          <LottieView
            autoPlay
            hardwareAccelerationAndroid
            loop={true}
            source={FireWork}
            style={styles.fireworkAnimation}
          />
          <GradientButton title="NEW GAME" onPress={handleNewGame} />
          <GradientButton title="HOME" onPress={handleHome} />
        </View>
      </LinearGradient>
      <LottieView
        autoPlay
        hardwareAccelerationAndroid
        loop={true}
        source={HeartGirl}
        style={styles.girlAnimation}
      />
    </Modal>
  );
};

export default WinModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  gradientContainer: {
    borderRadius: 20,
    padding: 20,
    width: '96%',
    borderWidth: 2,
    borderColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  pileContainer: {
    width: 90,
    height: 40,
  },
  congratsText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Philosopher-Bold',
    marginTop: 10,
  },
  trophyAnimation: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  fireworkAnimation: {
    width: 500,
    height: 200,
    position: 'absolute',
    zIndex: -1,
    marginTop: 20,
  },
  girlAnimation: {
    width: 500,
    height: 380,
    position: 'absolute',
    bottom: -200,
    right: -120,
    zIndex: 99,
  },
});
