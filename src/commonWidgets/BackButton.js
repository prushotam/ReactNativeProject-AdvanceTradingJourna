import { StyleSheet, Text, View,Image, Pressable } from 'react-native'
import React from 'react'

const BackButton = props => {
    const {onPress}=props
  return (
    <Pressable onPress={onPress}>
    <View>
      <Image source={require('../../screens/sidescreen/icons/back.png')} style={{height:45,width:45,margin:3}}></Image>
    </View>
    </Pressable>
  )
}

export default BackButton

const styles = StyleSheet.create({

})