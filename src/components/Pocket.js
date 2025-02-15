import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../constants/Colors';
import Pile from './Pile';
import {useDispatch} from 'react-redux';
import {
  unfreezeDice,
  updatePlayerPieceValue,
} from '../redux/reducers/gameSlice';
import {startingPoints} from '../helper/PlotData';

const Pocket = React.memo(({data, color, player}) => {
  const dispatch = useDispatch();

  const handlePress = async value => {
    let playerNo = value?.id[0];
    switch (playerNo) {
      case 'A':
        playerNo = 'player1';
        break;
      case 'B':
        playerNo = 'player2';
        break;
      case 'C':
        playerNo = 'player3';
        break;
      case 'D':
        playerNo = 'player4';
        break;
      default:
        break;
    }
    dispatch(
      updatePlayerPieceValue({
        playerNo: playerNo,
        pieceId: value.id,
        pos: startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1],
        travelCount: 1,
      }),
    );
    dispatch(unfreezeDice());
  };

  return (
    <View style={[styles.container, {backgroundColor: color}]}>
      <View style={styles.childFrame}>
        <View style={styles.flexRow}>
          <Plot
            pieceNo={0}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          />
          <Plot
            pieceNo={1}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          />
        </View>
        <View style={[styles.flexRow, {marginTop: 18}]}>
          <Plot
            pieceNo={2}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          />
          <Plot
            pieceNo={3}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          />
        </View>
      </View>
    </View>
  );
});

const Plot = ({data, onPress, pieceNo, player, color}) => {
  return (
    <View style={[styles.plot, {backgroundColor: color}]}>
      {data && data[pieceNo]?.pos === 0 && (
        <Pile
          color={color}
          player={player}
          onPress={() => onPress(data[pieceNo])}
        />
      )}
    </View>
  );
};

export default React.memo(Pocket);

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: '100%',
  },
  childFrame: {
    width: '70%',
    height: '70%',
    backgroundColor: 'white',
    borderColor: Colors.borderColor,
    padding: 15,
    borderWidth: 0.5,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '40%',
  },
  plot: {
    width: '35%',
    height: '80%',
    borderRadius: 120,
  },
});
