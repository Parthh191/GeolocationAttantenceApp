import { View, Text, Image,StyleSheet, Button } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

export default function startScreen() {
  return (
    <View style={{backgroundColor:'rgba(19, 18, 18, 0.98)',flex:1}}>
        <View style={{marginTop:50,justifyContent:'center', alignItems:'center',gap:70}}>
            <Image source={require("../../assets/images/image.png")} style={styles.image}/>
            <Text style={styles.text}>
                Welocome to the CoderWizard Geolaction Attendance App
            </Text>
            <Text title="START" onPress={() => router.push('/login/login')} style={styles.btn}>
                Let's start
            </Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    image:{
        width: 300,
        height: 400,
        alignSelf: 'center',
        borderRadius:15,
    },
    text:{
        color:'white',
        fontSize:20,
        textAlign:'center',
    }
    ,
    btn:{
        width:200,
        height:50,
        backgroundColor:'#4285F4',
        borderRadius:10,
        textAlign:'center',
        padding:10,
        color:'white',
        fontSize:20,
        fontWeight:'bold',
        marginBottom:10,
    }
})