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
import {useDispatch, useSelector} from 'react-redux';
import {
  selectCurrentPlayerChance,
  selectDiceNo,
  selectDiceRolled,
} from '../redux/reducers/gameSelectors';
import {
  enableCellSelection,
  enablePileSelection,
  updateDiceNo,
  updatePlayerChance,
} from '../redux/reducers/gameSlice';
import {playSound} from '../helper/SoundUtility';

const Dice = React.memo(({color, rotate, player, data}) => {
  const dispatch = useDispatch();
  const currentPlayerChance = useSelector(selectCurrentPlayerChance);
  const isDiceRolled = useSelector(selectDiceRolled);
  const diceNo = useSelector(selectDiceNo);
  const playerPieces = useSelector(
    state => state.game[`player${currentPlayerChance}`],
  );

  const pileIcon = BackgroundImage.GetImage(color);
  const diceIcon = BackgroundImage.GetImage(diceNo);

  const arroAnim = useRef(new Animated.Value(0)).current;

  const [diceRolling, setDiceRolling] = useState(false);

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const handleDicePress = async () => {
    // roll the dice and update the dice number
    const newDiceNo = Math.floor(Math.random() * 6) + 1;
    playSound('dice_roll');
    setDiceRolling(true);
    await delay(800);
    dispatch(updateDiceNo({diceNo: newDiceNo}));
    setDiceRolling(false);

    // check if any piece is alive means koi goti khuli? (0 means goti is locked and 57 means goti is in home)
    const isAnyPieceAlive = data?.findIndex(i => i.pos !== 57 && i.pos !== 0);
    const isAnyPieceLocked = data?.findIndex(i => i.pos !== 0);

    if (isAnyPieceAlive === -1) {
      if (newDiceNo === 6) {
        dispatch(enablePileSelection({playerNo: player}));
      } else {
        const chancePlayer = player + 1;
        if (chancePlayer > 4) {
          chancePlayer = 1;
        }
        await delay(600);
        console.log('chancePlayer', chancePlayer);
        dispatch(updatePlayerChance({chancePlayer: chancePlayer}));
      }
    } else {
      // hamari koi ek bhi goti khuli hui hai
      const canMove = playerPieces.some(
        pile => pile.travelCount + newDiceNo <= 57 && pile.pos != 0,
      );
      if (
        (!canMove && newDiceNo === 6 && isAnyPieceLocked == -1) ||
        (!canMove && newDiceNo != 6 && isAnyPieceLocked != -1) ||
        (!canMove && newDiceNo != 6 && isAnyPieceLocked == -1)
      ) {
        const chancePlayer = player + 1;
        if (chancePlayer > 4) {
          chancePlayer = 1;
        }
        await delay(600);
        dispatch(updatePlayerChance({chancePlayer: chancePlayer}));
        return;
      }

      if (newDiceNo === 6) {
        dispatch(enablePileSelection({playerNo: player}));
      }
      dispatch(enableCellSelection({playerNo: player}));
    }
  };

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
            {currentPlayerChance === player && !diceRolling && (
              <TouchableOpacity
                disabled={isDiceRolled}
                activeOpacity={0.4}
                onPress={handleDicePress}>
                <Image source={diceIcon} style={styles.dice} />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>

      {currentPlayerChance === player && !diceRolling && (
        <Animated.View style={{transform: [{translateX: arroAnim}]}}>
          <Image
            source={require('../assets/images/arrow.png')}
            style={{height: 30, width: 50}}
          />
        </Animated.View>
      )}

      {currentPlayerChance === player && diceRolling && (
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
    // borderWidth: 3,
    // borderLeftWidth: 3,
    backgroundColor: '#f0ce2c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    height: 45,
    width: 45,
  },
});
