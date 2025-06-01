import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import {BlurView} from 'expo-blur';

import HomeScreen from './HomeScreen';
import CartScreen from './screens/CartScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import TestScreen from './test/TestScreen';
 
import Icon from 'react-native-vector-icons/MaterialIcons'; // ✅ Exemple


const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBarStyle,
      tabBarBackground: () => <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />,
    }}>
    <Tab.Screen name="Home" component={HomeScreen}
    options={{
      tabBarIcon: ({focused}) => (
        <Icon name="home" size={24} color={focused ? 'red' : 'gray'} />
      ),
    }} />
    <Tab.Screen name="Cart" component={CartScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <Icon name="shopping-cart" size={24} color={focused ? 'red' : 'gray'} />
        ),
      }}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <Icon name="favorite" size={24} color={focused ? 'red' : 'gray'} />
        ),
      }}
    />
    <Tab.Screen
      name="History"
      component={OrderHistoryScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <Icon name="history" size={24} color={focused ? 'red' : 'gray'} />
        ),
      }}
    />

    <Tab.Screen name="Test" component={TestScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <Icon name="settings" size={24} color={focused ? 'red' : 'gray'} />
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 75,
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
});

export default TabNavigator;
