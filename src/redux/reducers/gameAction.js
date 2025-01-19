import {
  SafeSpots,
  StarSpots,
  startingPoints,
  turningPoints,
  victoryStart,
} from '../../helper/PlotData';
import {playSound} from '../../helper/SoundUtility';
import {selectCurrentPosition, selectDiceNo} from './gameSelectors';
import {
  announceWinner,
  disableTouch,
  unfreezeDice,
  updateFireworks,
  updatePlayerChance,
  updatePlayerPieceValue,
} from './gameSlice';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const handleForwardThunk =
  (playerNo, id, pos) => async (dispatch, getState) => {
    const state = getState();
    const plottedPices = selectCurrentPosition(state);
    const diceNo = selectDiceNo(state);

    let alpha =
      playerNo === 1 ? 'A' : playerNo === 2 ? 'B' : playerNo === 3 ? 'C' : 'D';
    const piecesAtPosition = plottedPices?.filter(item => item.pos === pos);
    const pieces =
      piecesAtPosition[
        piecesAtPosition.findIndex(item => item.id[0] === alpha)
      ];

    dispatch(disableTouch());
    let finalPath = pieces.pos;
    const beforePlayerPiece = state.game[`player${playerNo}`].find(
      item => item.id === id,
    );
    let travelCount = beforePlayerPiece.travelCount;

    for (let i = 0; i < diceNo; i++) {
      const updatedPosititon = getState();
      const playerPiece = updatedPosititon?.game[`player${playerNo}`].find(
        item => item.id === id,
      );
      let path = plottedPices.pos + 1;
      if (turningPoints.includes(path) && turningPoints[playerNo - 1] == path) {
        path = victoryStart[playerNo - 1];
      }
      if (path === 53) {
        path = 1;
      }
      finalPath = path;
      travelCount += 1;
      dispatch(
        updatePlayerPieceValue({
          playerNo: `player${playerNo}`,
          pieceId: playerPiece.id,
          pos: path,
          travelCount,
        }),
      );
      playSound('pile_move');
      await delay(200);
    }

    const updatedState = getState();
    const updatedPlottedPieces = selectCurrentPosition(updatedState);

    // checking collision
    const finalPlot = updatedPlottedPieces?.filter(
      item => item.pos === finalPath,
    );

    const ids = finalPlot.map(item => item.id[0]);
    const uniqueIds = new Set(ids);

    const areDifferentIds = uniqueIds.size > 1;
    if (SafeSpots.includes(finalPath) || StarSpots.includes(finalPath)) {
      playSound('safe_spot');
    }
    if (
      areDifferentIds &&
      !SafeSpots.includes(finalPath) &&
      !StarSpots.includes(finalPath)
    ) {
      const enemyPiece = finalPlot.find(item => item.id[0] !== id[0]);
      const enemyId = enemyPiece.id[0];
      let no =
        enemyId === 'A' ? 1 : enemyId === 'B' ? 2 : enemyId === 'C' ? 3 : 4;

      let backwaredPath = startingPoints[no - 1];
      let i = enemyPiece.pos;
      playSound('collide');
      while (i !== backwaredPath) {
        dispatch(
          updatePlayerPieceValue({
            playerNo: `player${no}`,
            pieceId: enemyPiece.id,
            pos: i,
            travelCount: 0,
          }),
        );

        await delay(200);
        i--;
        if (i === 0) {
          i = 52;
        }
      }

      dispatch(
        updatePlayerPieceValue({
          playerNo: `player${no}`,
          pieceId: enemyPiece.id,
          pos: 0,
          travelCount: 0,
        }),
      );
      dispatch(unfreezeDice());
      return;
    }

    if (diceNo === 6 || travelCount === 57) {
      dispatch(updatePlayerChance({chancePlayer: playerNo}));
      if (travelCount === 57) {
        // check winning criteria
        playSound('home_win');
        const finalPlayerState = getState();
        const playerAllPieces = finalPlayerState.game[`player${playerNo}`];
        if (checkWiningCriteria(playerAllPieces)) {
          dispatch(announceWinner(playerNo));
          playSound('cheer');
          return;
        }
        dispatch(updateFireworks(true));
        dispatch(unfreezeDice());
        return;
      }
    } else {
      let chancePlayer = playerNo + 1;
      if (chancePlayer > 4) {
        chancePlayer = 1;
      }
      dispatch(updatePlayerChance({chancePlayer}));
    }
  };

function checkWiningCriteria(pieces) {
  for (let piece of pieces) {
    if (piece.travelCount < 57) {
      return false;
    }
    return true;
  }
}
