import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {Colors} from '../constants/Colors';
import Pile from './Pile';
import {ArrowSpots, SafeSpots, StarSpots} from '../helper/PlotData';
import {ArrowRightIcon, StarIcon} from 'react-native-heroicons/outline';
import RFValue from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentPosition} from '../redux/reducers/gameSelectors';
import {handleForwardThunk} from '../redux/reducers/gameAction';

const Cell = ({color, id}) => {
  const dispatch = useDispatch();
  const plottedPieces = useSelector(selectCurrentPosition);

  const isSafeSpot = useMemo(() => SafeSpots.includes(id), [id]);
  const isStarSpot = useMemo(() => StarSpots.includes(id), [id]);
  const isArrowSpot = useMemo(() => ArrowSpots.includes(id), [id]);

  const peicesAtPosition = useMemo(
    () => plottedPieces.filter(p => p.pos === id),
    [plottedPieces, id],
  );

  const handlePress = useCallback(
    (playerNo, pieceId) => {
      dispatch(handleForwardThunk(playerNo, pieceId, id));
    },
    [dispatch, id],
  );

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
      {peicesAtPosition?.map((piece, index) => {
        const playerNo =
          piece.id[0] === 'A'
            ? 1
            : piece.id[0] === 'B'
            ? 2
            : piece.id[0] === 'C'
            ? 3
            : 4;

        const pieceColor =
          playerNo === 1
            ? Colors.red
            : playerNo === 2
            ? Colors.green
            : playerNo === 3
            ? Colors.yellow
            : Colors.blue;

        return (
          <View
            key={piece.id}
            style={[
              styles.pieceContainer,
              {
                transform: [
                  {scale: peicesAtPosition.length === 1 ? 1 : 0.7},
                  {
                    translateX:
                      peicesAtPosition.length === 1
                        ? 0
                        : index % 2 === 0
                        ? -6
                        : 6,
                  },
                  {
                    translateY:
                      peicesAtPosition.length === 1 ? 0 : index < 2 ? -6 : 6,
                  },
                ],
              },
            ]}>
            <Pile
              cell={true}
              color={pieceColor}
              player={playerNo}
              onPress={() => handlePress(playerNo, piece.id)}
              pieceId={piece.id}
            />
          </View>
        );
      })}
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
