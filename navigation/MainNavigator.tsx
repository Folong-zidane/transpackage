import React from 'react';
import AppNavigator from './AppNavigator';
import {View} from 'react-native';

const MainNavigator = () => {
  return (
    <View style={{flex: 1}}>
      <AppNavigator />
    </View>
  );
};

export default MainNavigator;
