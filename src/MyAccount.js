import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, ScrollView, Picker, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { API_ROOT_URL } from '../config'
import { useIsFocused } from "@react-navigation/native"
import * as ImagePicker from 'expo-image-picker'

const saveOnDB = async (taille, poids, sexe, photo, id) => {
    if (photo.uri === 'https://cdn.discordapp.com/attachments/771665604977491978/857562721758609449/image_base_profile.png') {
        await axios.put(`${API_ROOT_URL}/utilisateur/${id}?taille=${taille}&poids=${poids}&sexe=${sexe}`, { "photo": "" })
            .then((response) => console.log(JSON.stringify(response)))
    } else {
        await axios.put(`${API_ROOT_URL}/utilisateur/${id}?taille=${taille}&poids=${poids}&sexe=${sexe}`, { "photo": photo })
            .then((response) => console.log(JSON.stringify(response)))
    }
}

const MyAccount = (props) => {
    const [id, setID] = useState(null)
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [taille, setTaille] = useState(10)
    const [poids, setPoids] = useState(0)
    const [sexe, setSexe] = useState('')
    const [dateNaissance, setDateNaissance] = useState('')
    const [avatar, setAvatar] = useState({ uri: 'https://cdn.discordapp.com/attachments/771665604977491978/857562721758609449/image_base_profile.png' })
    const isFocused = useIsFocused()

    const fetchInfo = async (email) => {
        await axios.get(`${API_ROOT_URL}/utilisateur/${email}`)
            .then((response) => {
                setID(response.data._id)
                setNom(response.data.nom)
                setPrenom(response.data.prenom)
                setDateNaissance(response.data.dateDeNaissance)
                setTaille(response.data.taille)
                setPoids(response.data.poids)
                setSexe(response.data.sexe)
                if (response.data.photo !== '') setAvatar({ uri: response.data.photo })
            })
    }

    const avatarClicked = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!permissionResult.granted) {
            alert("Permission to access camera roll is required !")
            return
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync()

        if (pickerResult.cancelled) return;

        setAvatar({ uri: pickerResult.uri })
    }

    useEffect(() => {
        if (isFocused) {
            fetchInfo(props.route.params.email)
        }
    }, [isFocused])

    return (
        <ScrollView style={styles.background}>
            <Text style={styles.title}>Informations profil</Text>
            <View style={styles.border}>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={avatarClicked}
                    >
                        <Image
                            style={{ height: 300, width: 300, marginVertical: '2.5%' }}
                            source={avatar}
                        />
                    </TouchableOpacity>
                    <Text style={styles.label}>Nom</Text>
                    <Text style={styles.text}>{nom}</Text>
                    <View style={{ paddingTop: '2.5%', width: '100%', alignItems: 'center' }}>
                        <Text style={styles.label}>Prénom</Text>
                        <Text style={styles.text}>{prenom}</Text>
                    </View>
                    <View style={{ paddingTop: '2.5%', width: '100%', alignItems: 'center' }}>
                        <Text style={styles.label}>Date de Naissance</Text>
                        <Text style={styles.text}>{dateNaissance.slice(0, 10)}</Text>
                    </View>
                    <View style={{ paddingTop: '2.5%', width: '100%', alignItems: 'center' }}>
                        <Text style={styles.label}>E-mail</Text>
                        <Text style={styles.text}>{props.route.params.email}</Text>
                    </View>
                    <View style={{ paddingTop: '2.5%', width: '100%', alignItems: 'center' }}>
                        <Text style={styles.label}>Taille</Text>
                        <View style={styles.block}>
                            <TextInput style={styles.textInput} value={taille.toString()} onChangeText={setTaille} keyboardType='numeric' />
                            <Text style={styles.textUnit}> cm</Text>
                        </View>
                    </View>
                    <View style={{ paddingTop: '2.5%', width: '100%', alignItems: 'center' }}>
                        <Text style={styles.label}>Poids</Text>
                        <View style={styles.block}>
                            <TextInput style={styles.textInput} value={poids.toString()} onChangeText={setPoids} keyboardType='numeric' />
                            <Text style={styles.textUnit}> kg</Text>
                        </View>
                    </View>
                    <View style={{ paddingTop: '2.5%', width: '100%', alignItems: 'center' }}>
                        <Text style={styles.label}>Sexe</Text>
                        <View style={{ borderWidth: 1, paddingLeft: '21.5%', borderColor: 'black', marginBottom: '2.5%' }}>
                            <Picker
                                selectedValue={sexe}
                                style={{ height: 50, width: 150, color: 'black' }}
                                onValueChange={(itemValue) => setSexe(itemValue)}
                            >
                                <Picker.Item label="      ..." value="" />
                                <Picker.Item label="Homme" value="Homme" />
                                <Picker.Item label="Femme" value="Femme" />
                            </Picker>
                        </View>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                    saveOnDB(taille, poids, sexe, avatar, id)
                }}
            >
                <Text style={styles.saveText}>Enregistrer</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.logOutBtn}
                onPress={() => {
                    props.navigation.popToTop()
                }}
            >
                <Text style={styles.saveText}>Se Déconnecter</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        height: '100%'
    },
    title: {
        borderRadius: 10,
        marginTop: '15%',
        color: '#e00974',
        fontSize: 40,
        textAlign: 'center'
    },
    border: {
        marginTop: '10%',
        marginBottom: '15%',
        marginHorizontal: '5%',
        borderWidth: 7.5,
        borderTopColor: '#e00974',
        borderLeftColor: '#e00974',
        borderRightColor: '#1abc9c',
        borderBottomColor: '#1abc9c',
        borderRadius: 10
    },
    container: {
        alignItems: 'center',
        paddingVertical: '2.5%',
        width: '100%',
    },
    label: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },
    text: {
        marginBottom: '2.5%',
        fontSize: 20,
        color: 'black'
    },
    textUnit: {
        fontSize: 20,
        color: 'black'
    },
    textInput: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    block: {
        flexDirection: 'row',
        marginBottom: '2.5%'
    },
    saveBtn: {
        width: "80%",
        borderRadius: 5,
        height: 50,
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "#1abc9c",
        paddingHorizontal: "10%",
    },
    logOutBtn: {
        width: "80%",
        borderRadius: 5,
        height: 50,
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "red",
        paddingHorizontal: "10%",
        marginTop: '2.5%',
        marginBottom: '5%'
    },
    saveText: {
        fontWeight: "bold",
        color: 'white',
        textAlign: 'center',
        fontSize: 20
    },
    picker: {
        marginVertical: '10%',
        borderWidth: 1
    }
})

export default MyAccount