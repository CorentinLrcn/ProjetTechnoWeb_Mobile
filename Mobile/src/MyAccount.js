import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Picker from '@react-native-picker/picker'
import { API_ROOT_URL } from '../config'

const saveOnDB = async (taille, poids, sexe, id) => {
    const data = await axios.put(`${API_ROOT_URL}/utilisateur/${id}?taille=${taille}&poids=${poids}&sexe=${sexe}`)
        .then((response) => console.log(JSON.stringify(response)))
}

const MyAccount = (props) => {
    const [id, setID] = useState(null)
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [taille, setTaille] = useState(10)
    const [poids, setPoids] = useState(0)
    const [sexe, setSexe] = useState('')
    const [dateNaissance, setDateNaissance] = useState('01-01-2000')

    const fetchInfo = async (email) => {
        console.log('bonjour')
        const data = await axios.get(`${API_ROOT_URL}/utilisateur/${email}`)
            .then((response) => {
                console.log('response.data : ' + response.data._id)
                setID(response.data._id)
                setNom(response.data.nom)
                setPrenom(response.data.prenom)
                setDateNaissance(response.data.dateDeNaissance)
                setTaille(response.data.taille)
                setPoids(response.data.poids)
                setSexe(response.data.sexe)
            })
    }

    useEffect(() => {
        console.log('email = ' + JSON.stringify(props.route.params.email))
        fetchInfo(props.route.params.email)
    }, [])

    return (
        <View style={styles.background}>
            <Text style={styles.title}>Informations profil</Text>
            <View style={styles.container}>
                <Text style={styles.text}>Nom : {nom}</Text>
                <Text style={styles.text}>Prénom : {prenom}</Text>
                <Text style={styles.text}>Date de Naissance : {dateNaissance}</Text>
                <Text style={styles.text}>E-mail : {props.route.params.email}</Text>
                <View style={styles.block}>
                    <Text style={styles.text}>Taille : </Text>
                    <TextInput style={styles.textInput} value={taille.toString()} onChangeText={setTaille} keyboardType='numeric' />
                    <Text style={styles.text}> cm</Text>
                </View>
                <View style={styles.block}>
                    <Text style={styles.text}>Poids : </Text>
                    <TextInput style={styles.textInput} value={poids.toString()} onChangeText={setPoids} keyboardType='numeric' />
                    <Text style={styles.text}> kg</Text>
                </View>
                <View style={styles.block}>
                    <Text style={styles.text}>Sexe : </Text>
                    <TextInput style={styles.textInput} value={sexe} onChangeText={setSexe} />
                </View>
            </View>
            <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                    saveOnDB(taille, poids, sexe, id)
                }}
            >
                <Text style={styles.loginText}>Enregistrer</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        height: '100%'
    },
    title: {
        marginTop: '20%',
        color: '#1abc9c',
        fontSize: 40,
        textAlign: 'center'
    },
    container: {
        alignItems: 'center',
        marginVertical: '15%',
        backgroundColor: '#1abc9c',
        marginHorizontal: '5%',
        borderRadius: 10
    },
    text: {
        marginVertical: '2.5%',
        fontSize: 20,
        color: 'white'
    },
    textInput: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    block: {
        flexDirection: 'row'
    },
    loginBtn: {
        width: "80%",
        borderRadius: 5,
        height: 50,
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "#1abc9c",
        paddingHorizontal: "10%",
    },
    loginText: {
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