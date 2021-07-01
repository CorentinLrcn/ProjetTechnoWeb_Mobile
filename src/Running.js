import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Image, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import MapView, { Marker, Polyline } from "react-native-maps"
import * as Location from 'expo-location'
import axios from 'axios'
import { API_ROOT_URL } from '../config'

const Running = (props) => {
    const [locationServiceEnabled, setLocationServiceEnabled] = useState(false)
    const [timerOn, setTimerOn] = useState(false)
    const [restart, setRestart] = useState(false)
    const [counter, setCounter] = useState(0)
    const [timer, setTimer] = useState()
    const latitudeDelta = 0.003
    const longitudeDelta = 0.003
    const day = new Date().getDate()
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    const [distanceCourse, setDistCourse] = useState(0)
    const [coordinates, setCoordinates] = useState([])
    const [areHoursShown, setAreHoursShown] = useState(false)
    const [areMinutesShown, setAreMinutesShown] = useState(false)
    const [widthLine, setWidthLine] = useState(0)

    const [region, setRegion] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
    });

    const [newRegion, setNewRegion] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
    });

    const LOCATION_SETTINGS = {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 0
    }

    const start = () => {
        if (timerOn == false) {
            if (restart == true) {
                setCounter(0)
                setDistCourse(0)
                setRestart(false)
                setCoordinates([])
                setAreHoursShown(false)
                setAreMinutesShown(false)
            }
            setTimerOn(true)
            setTimer(setInterval(() => {
                setCounter(counter => counter + 1)
            }, 1000))
            GetEvolutiveLocation()
        }
        setWidthLine(3)
    }

    const pause = () => {
        if (timerOn == true) {
            setTimerOn(false)
            clearInterval(timer)
        }
    }

    const stop = () => {
        if (timerOn == true) {
            setTimerOn(false)
            setRestart(true)
            clearInterval(timer)
        }
        createRun(distanceCourse, counter, day, month, year, props.route.params._id)
    }

    const createRun = async (distance, duree, jour, mois, annee, id) => {
        const date = `${annee}-${mois}-${jour}`
        const body = {
            metres: distance / 1000,
            duree: duree,
            date: date,
        }
        await axios.post(`${API_ROOT_URL}/course?metres=${distance}&duree=${duree}&date=${date}&idRunner=${id}`, body)
            .then((res) => {
                addRun(res.data.idRunner, res.data._id)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const addRun = async (idRunner, id) => {
        await axios.post(`${API_ROOT_URL}/utilisateur/${idRunner}?course=${id}`)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        CheckIfLocationEnabled()
        GetCurrentLocation()
    }, [])

    useEffect(() => {
        if ((counter / 3600) >= 1) setAreHoursShown(true)
        if ((counter / 60) >= 1) setAreMinutesShown(true)
    }, [counter])

    useEffect(() => {
        CalcKm()
    }, [newRegion])

    const CheckIfLocationEnabled = async () => {
        let enabled = await Location.hasServicesEnabledAsync()
        if (!enabled) {
            Alert.alert(
                'Services de localisation non activés',
                'Merci de les activés pour continuer',
                [{ text: 'OK' }],
                { cancelable: false }
            )
        } else {
            setLocationServiceEnabled(enabled)
        }
    }

    const GetCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert(
                'Permission non accordée',
                "Autorisez l'application à utiliser les services de localisation",
                [{ text: 'OK' }],
                { cancelable: false }
            )
        }
        const { coords } = await Location.getCurrentPositionAsync()
        if (coords) {
            const { latitude, longitude } = coords
            setRegion({ latitude, longitude, latitudeDelta, longitudeDelta })
            setNewRegion({ latitude, longitude, latitudeDelta, longitudeDelta })
            setCoordinates(coordinates => [...coordinates, { latitude: latitude, longitude: longitude }])
        }
    }

    const GetEvolutiveLocation = async () => {
        await Location.watchPositionAsync(LOCATION_SETTINGS, (loc) => GetNewLocation(loc))
    }

    const degreesToRadians = (degrees) => {
        const pi = Math.PI
        return degrees * (pi / 180)
    }

    const calcDist2Points = (lat1, long1, lat2, long2) => {
        return Math.acos(
            Math.sin(degreesToRadians(lat1))
            *
            Math.sin(degreesToRadians(lat2))
            +
            Math.cos(degreesToRadians(lat1))
            *
            Math.cos(degreesToRadians(lat2))
            *
            Math.cos(degreesToRadians(long1 - long2))
        ) * 6371000
    }

    const GetNewLocation = (geolocation) => {
        const { latitude, longitude } = geolocation.coords

        const tmpRegion = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta
        }
        setNewRegion(tmpRegion)
        setCoordinates(coordinates => [...coordinates, { latitude: latitude, longitude: longitude }])
    }

    const CalcKm = () => {
        const distance = calcDist2Points(region.latitude, region.longitude, newRegion.latitude, newRegion.longitude)
        if (!Number.isNaN(distance) && timerOn == true) {
            setDistCourse(parseInt(distanceCourse) + parseInt(distance))
            setRegion(newRegion)
        }
    }

    return (
        <View style={styles.container}>
            <Image
                style={{ height: 150, width: '100%' }}
                source={{
                    uri: 'https://cdn.discordapp.com/attachments/771665604977491978/840167041507655680/logo_small_mobile.png'
                }}
            />
            <Text style={{ fontSize: 25, color: '#e00974', marginTop: '-5%', marginBottom: '2.5%' }}>{day} / {month} / {year}</Text>
            <View
                style={{ height: '40%', width: '95%', alignItems: 'center', marginVertical: '2.5%', borderWidth: 7.5, borderRadius: 10, borderTopColor: '#e00974', borderLeftColor: '#e00974', borderRightColor: '#1abc9c', borderBottomColor: '#1abc9c' }}
                pointerEvents="none"
            >
                {region.latitude != null &&
                    <MapView
                        style={{ height: '100%', width: '100%' }}
                        region={region}
                        onRegionChangeComplete={region => setRegion(region)}
                    >
                        <Polyline coordinates={coordinates} strokeWidth={widthLine} strokeColor={'#1abc9c'} />
                        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                    </MapView>
                }
            </View>
            <Text style={styles.time}>{distanceCourse} m</Text>
            <View style={styles.timer}>
                {areHoursShown &&
                    <Text style={styles.time}>{(counter / 3600).toFixed(0) * 1} h </Text>
                }
                {areMinutesShown &&
                    <Text style={styles.time}>{(counter / 60).toFixed(0) * 1} min </Text>
                }
                <Text style={styles.time}>{counter % 60} s</Text>
            </View>
            <View style={styles.block}>
                <TouchableOpacity
                    style={styles.playBtn}
                    onPress={() => start()}
                >
                    <Ionicons name="play" size={25} color='white' />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.pauseBtn}
                    onPress={() => pause()}
                >
                    <Ionicons name="pause" size={25} color='white' />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.stopBtn}
                    onPress={() => stop()}
                >
                    <Ionicons name="stop" size={25} color='white' />
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    playBtn: {
        width: 70,
        height: 70,
        backgroundColor: '#1abc9c',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        marginHorizontal: '2.5%',
        marginTop: '5%'
    },
    pauseBtn: {
        width: 70,
        height: 70,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        marginHorizontal: '2.5%',
        marginTop: '5%'
    },
    stopBtn: {
        width: 70,
        height: 70,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        marginHorizontal: '2.5%',
        marginTop: '5%'
    },
    timer: {
        flexDirection: 'row'
    },
    time: {
        fontSize: 25,
        color: "black",
        textAlign: "center",
        marginVertical: '1.5%'
    },
    block: {
        flexDirection: 'row'
    }
});

export default Running