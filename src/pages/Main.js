import React, { useState, useEffect} from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity} from 'react-native';
import MapView, { Marker,Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';
import {MaterialIcons} from '@expo/vector-icons';
import api from '../services/api'



function Main({ navigation }){
    const [techs, setTechs] = useState([])
    const [devs, setDevs] = useState([])
    const [currentRegion, setCurrentRegion] = useState(null);
    useEffect(()=>{
        async function loadInitialPosition(){
            const {granted} = await requestPermissionsAsync();

            if(granted){
                const {coords} = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const {latitude, longitude} = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                })
            }
        };

        loadInitialPosition();
    },[]);

    async function loadDevs(){
        const { longitude, latitude } = currentRegion;

        const response = await api.get('/search',{
            params: {
                latitude,
                longitude,
                techs
            }
        });

        setDevs(response.data.devs)
    }

    function handleRegionChange(region) {
        setCurrentRegion(region)
    }

    if(!currentRegion){
        return null;
    }
    return (
        <>
            <MapView onRegionChangeComplete={handleRegionChange} initialRegion={currentRegion} style={style.map} >
                {devs.map(dev=>(
                    <Marker 
                        key={dev._id} 
                        coordinate={{
                            latitude: dev.location.coordinates[1] , 
                            longitude:dev.location.coordinates[0]
                            }} 
                    >
                    <Image style={style.avatar} source={{uri:dev.avatar_url}} />
                    <Callout onPress={()=>{
                        navigation.navigate('Profile', { github_username: dev.github_username})
                    }}>
                        <View style={style.callout}>
                <Text style={style.devName}>{dev.name}</Text>
                            <Text style={style.devBio}>{dev.bio}</Text>
                            <Text style={style.devTechs}>{dev.techs.join(", ")}</Text>
                        </View>
                    </Callout>
                </Marker>
                ))}
            </MapView>
            <View style={style.searchForm}>
            <TextInput 
                style={style.searchInput}
                placeholder="Buscar por tecnologias..."
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoCorrect={false}
                value={techs}
                onChangeText={setTechs}
            />
            <TouchableOpacity style={style.loadButton} onPress={loadDevs}>
                <MaterialIcons name='my-location' size={20} color='#fff'/>
            </TouchableOpacity>
        </View>
        </>
    )
}

const style = StyleSheet.create({
    map:{
        flex:1
    },
    avatar:{
        width: 54,
        height:54,
        borderRadius:100,
        borderWidth: 4,
        borderColor: '#ff0000'
    },
    callout:{
        width: 260,
    },
    devName:{
        fontWeight:'bold'
    },
    devBio:{
        marginTop: 5,
        color:'#666'
    },
    devTechs:{
        marginTop: 5,
    },
    searchForm:{
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: "row"
    },
    searchInput: {
        flex: 1,
        height:50,
        backgroundColor: '#fff',
        color: "#333",
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 4,
            width: 4,
        },
        elevation: 5

    },
    loadButton:{
        width: 50,
        height: 50,
        backgroundColor: "#f65f43",
        borderRadius:25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15
    }
})

export default Main;