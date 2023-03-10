import { View, Text, Image } from 'react-native'
import React, {useEffect} from 'react'
import { useIsFocused } from '@react-navigation/native'

const Splash = ({navigation}) => {
  const isFocused = useIsFocused()
    useEffect(()=>{
        setTimeout(()=>{
            navigation.navigate('MainScreen')
        },3000)
    },[isFocused])
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
    <Image source={require('../images/logo_bgcolor.png')} style={{height:'100%',width:'100%'}}/>
    </View>
  )
}

export default Splash