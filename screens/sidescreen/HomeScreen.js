import {View, Text, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../bottom/Home';
import Dashboard from '../bottom/Dashboard';
import Performance from '../bottom/Performance';

const Bottom = createBottomTabNavigator();

const Homescreen = () => {
  return (
    <Bottom.Navigator sceneContainerStyle={{backgroundColor:`rgba(53, 52, 53, 1)`}}>
      <Bottom.Screen
        
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          
          tabBarIcon: ({}) => (
            <Image
              source={require('./icons/home.png')}
              style={{width: 24, height: 24}}
            />
          ),
        }}
      />
      <Bottom.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
          tabBarIcon: ({}) => (
            <Image
              source={require('./icons/dashboards.png')}
              style={{width: 24, height: 24}}
            />
          ),
        }}
      />
      <Bottom.Screen
        name="Trade Analyse Charts"
        component={Performance}
        options={{
          headerShown: false,
          tabBarIcon: ({}) => (
            <Image
              source={require('./icons/performance.png')}
              style={{width: 24, height: 24}}
            />
          ),
        }}
      />
    </Bottom.Navigator>
  );
};

export default Homescreen;
