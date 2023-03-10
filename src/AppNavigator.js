import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from '../screens/Splash';
import MainScreen from '../screens/MainScreen';
import EnterJournal from '../screens/EnterJournal';
import MyJournals from '../screens/MyJournals';
import JournalsCustomView from '../screens/JournalsCustomView';
import UpdateCustom from '../screens/UpdateCustom';
import ClosedTradeView from '../screens/ClosedTradeView';
import FlashMessage from "react-native-flash-message";

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="EnterJournal" component={EnterJournal} options={{headerShown:false}}/>
        <Stack.Screen name="MyJournals" component={MyJournals} options={{headerShown:false}}/>
        <Stack.Screen name="JournalsCustomView" component={JournalsCustomView} options={{headerShown:false}}/>
        <Stack.Screen name="UpdateCustom" component={UpdateCustom} options={{headerShown:false}}/>
         <Stack.Screen name="ClosedTradeView" component={ClosedTradeView} options={{headerShown:false}}/>
      </Stack.Navigator>
        <FlashMessage position="top" />
    </NavigationContainer>
  );
};

export default AppNavigator;