import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LudoBoardScreen from './src/screens/LudoboardScreen';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import Navigation from './src/navigation/Navigation';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation>
          <LudoBoardScreen />
        </Navigation>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
