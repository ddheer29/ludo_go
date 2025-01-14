import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../constants/Colors';
import Pile from './Pile';

const Pocket = React.memo(({color, player}) => {
  return (
    <View style={[styles.container, {backgroundColor: color}]}>
      <View style={styles.childFrame}>
        <View style={styles.flexRow}>
          <Plot pieceNo={0} player={player} color={color} />
          <Plot pieceNo={2} player={player} color={color} />
        </View>
        <View style={[styles.flexRow, {marginTop: 18}]}>
          <Plot pieceNo={3} player={player} color={color} />
          <Plot pieceNo={4} player={player} color={color} />
        </View>
      </View>
    </View>
  );
});

const Plot = ({pieceNo, player, color}) => {
  return (
    <View style={[styles.plot, {backgroundColor: color}]}>
      <Pile color={color} player={player} />
    </View>
  );
};

export default Pocket;

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
