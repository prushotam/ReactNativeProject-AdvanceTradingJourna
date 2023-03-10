import {View, Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './sidescreen/HomeScreen';
import Sidebar from './sidescreen/Sidebar';


const Drawer = createDrawerNavigator();

const MainScreen = () => {
  return (
    <Drawer.Navigator  drawerContent={props => <Sidebar {...props}/>}>
      <Drawer.Screen
        name="Homescreen"
        component={HomeScreen}
        options={{headerShown:false}}
      />
    </Drawer.Navigator>
  );
};

export default MainScreen;
