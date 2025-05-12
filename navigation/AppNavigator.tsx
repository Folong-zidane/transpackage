import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';

import DetailsScreen from '../screens/DetailsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import HomeScreen from '../screens/HomeScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />


      {/**
       *   c'est ici que tu ajoutes les autres lien vers les ecrans
       */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
