const player1InitialState = [
  {id: 'A1', pos: 0, travelCount: 0},
  {id: 'A2', pos: 0, travelCount: 0},
  {id: 'A3', pos: 0, travelCount: 0},
  {id: 'A4', pos: 0, travelCount: 0},
];
const player2InitialState = [
  {id: 'B1', pos: 0, travelCount: 0},
  {id: 'B2', pos: 0, travelCount: 0},
  {id: 'B3', pos: 0, travelCount: 0},
  {id: 'B4', pos: 0, travelCount: 0},
];
const player3InitialState = [
  {id: 'C1', pos: 0, travelCount: 0},
  {id: 'C2', pos: 0, travelCount: 0},
  {id: 'C3', pos: 0, travelCount: 0},
  {id: 'C4', pos: 0, travelCount: 0},
];
const player4InitialState = [
  {id: 'D1', pos: 0, travelCount: 0},
  {id: 'D2', pos: 0, travelCount: 0},
  {id: 'D3', pos: 0, travelCount: 0},
  {id: 'D4', pos: 0, travelCount: 0},
];

export const initialState = {
  player1: player1InitialState,
  player2: player2InitialState,
  player3: player3InitialState,
  player4: player4InitialState,
  chnacePlayer: 1, // whose player turn
  diceNo: 0, // dice number
  isDiceRolled: false, // dice rolled or not
  pileSelectionPlayer: -1, // which players is allowed to select pile, others touch will be disabled
  cellSelectionPlayer: -1, // cells enable for selection, and pile selection animation will be enabled
  touchDiceBlock: false, // touch dice block
  currentPositions: [], // current positions of all players on board
  fireworks: false, // fireworks animation on winning
  winner: null, // any player whose travel count is 57 will be winner
};
