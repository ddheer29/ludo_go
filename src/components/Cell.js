import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {Colors} from '../constants/Colors';
import Pile from './Pile';
import {ArrowSpots, SafeSpots, StarSpots} from '../helper/PlotData';
import {ArrowRightIcon, StarIcon} from 'react-native-heroicons/outline';
import RFValue from 'react-native-responsive-fontsize';

const Cell = ({color, id}) => {
  const isSafeSpot = useMemo(() => SafeSpots.includes(id), [id]);
  const isStarSpot = useMemo(() => StarSpots.includes(id), [id]);
  const isArrowSpot = useMemo(() => ArrowSpots.includes(id), [id]);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isSafeSpot ? color : '#fff'},
      ]}>
      {isStarSpot && <StarIcon color="grey" size={20} />}
      {isArrowSpot && (
        <ArrowRightIcon
          size={16}
          color={color}
          style={{
            transform: [
              {
                rotate:
                  id === 38
                    ? '180deg'
                    : id === 25
                    ? '90deg'
                    : id === 51
                    ? '270deg'
                    : '0deg',
              },
            ],
          }}
        />
      )}
      {/* <Pile
        color={Colors.green}
        cell={true}
        player={2}
        onPress={() => {}}
        pieceId={1}
      /> */}
      {/* <Text>{id}</Text> */}
    </View>
  );
};

export default React.memo(Cell);

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.4,
    borderColor: Colors.borderColor,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieceContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 99,
  },
});
