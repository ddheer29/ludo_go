import {createSlice} from '@reduxjs/toolkit';
import {initialState} from './initialState';

export const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    resetGame: () => initialState,
    updateDiceNo: (state, action) => {
      state.diceNo = action.payload.diceNo;
      state.isDiceRolled = true;
    },
    // kis bande ko pile select karne ka chance diya jaye
    enablePileSelection: (state, action) => {
      state.touchDiceBlock = true;
      state.pileSelectionPlayer = action.payload.playerNo;
    },
    // kis bande ko cell select karne ka chance diya jaye
    enableCellSelection: (state, action) => {
      state.touchDiceBlock = true;
      state.cellSelectionPlayer = action.payload.playerNo;
    },
    // touch disable krna means piles move krne ka time
    disableTouch: state => {
      state.touchDiceBlock = true;
      state.cellSelectionPlayer = -1;
      state.pileSelectionPlayer = -1;
    },
    // dice disable krne ke baad firse enable krne kyoki aapnse kisi ki goti kati hai ab aapko firse chance milega
    unfreezeDice: state => {
      state.touchDiceBlock = false;
      state.isDiceRolled = false;
    },
    updateFireworks: (state, action) => {
      state.fireworks = action.payload;
    },
    announceWinner: (state, action) => {
      state.winner = action.payload;
    },
    // naye bande ki bari
    updatePlayerChance: (state, action) => {
      state.chancePlayer = action.payload.chancePlayer;
      state.touchDiceBlock = false;
      state.isDiceRolled = false;
    },

    // update goti vlaue
    updatePlayerPieceValue: (state, action) => {
      const {playerNo, pieceId, pos, travelCount} = action.payload;
      const playerPieces = state[playerNo];
      const piece = playerPieces.find(p => p.id === pieceId);
      state.pileSelectionPlayer = -1;

      if (piece) {
        piece.pos = pos;
        piece.travelCount = travelCount;
        const currentPositionIndex = state.currentPositions.findIndex(
          p => p.id === pieceId,
        );

        // pos 0 means goti ghar me hai
        if (pos == 0) {
          if (currentPositionIndex != -1) {
            state.currentPositions.splice(currentPositionIndex, 1);
          }
        }
        // pos 0 nhi hai means wo path pr hai
        else {
          if (currentPositionIndex != -1) {
            state.currentPositions[currentPositionIndex] = {id: pieceId, pos};
          } else {
            state.currentPositions.push({id: pieceId, pos});
          }
        }
      }
    },
  },
});

export const {
  resetGame,
  updateDiceNo,
  enablePileSelection,
  enableCellSelection,
  disableTouch,
  unfreezeDice,
  updateFireworks,
  announceWinner,
  updatePlayerChance,
  updatePlayerPieceValue,
} = gameSlice.actions;

export default gameSlice.reducer;
