import {combineReducers} from 'redux';
import gameSlice from './reducers/gameSlice'; // Import the reducer

const rootReducer = combineReducers({
  game: gameSlice, // Use the reducer function
});

export default rootReducer;
