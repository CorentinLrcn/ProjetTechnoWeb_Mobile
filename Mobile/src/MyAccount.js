import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, ScrollView, Picker } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { API_ROOT_URL } from '../config'
import { useIsFocused } from "@react-navigation/native"

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

    const isFocused = useIsFocused()

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
        if (isFocused) fetchInfo(props.route.params.email)
    }, [isFocused])

    return (
        <ScrollView style={styles.background}>
            <Text style={styles.title}>Informations profil</Text>
            <View style={styles.border}>
                <View style={styles.container}>
                    <Text style={styles.label}>Nom</Text>
                    <Text style={styles.text}>{nom}</Text>
                    <View style={{ paddingTop: '2.5%', width: '100%', alignItems: 'center' }}>
                        <Text style={styles.label}>Prénom</Text>
                        <Text style={styles.text}>{prenom}</Text>
                    </View>
                    <View style={{ paddingTop: '2.5%', width: '100%', alignItems: 'center' }}>
                        <Text style={styles.label}>Date de Naissance</Text>
                        <Text style={styles.text}>{dateNaissance.slice(0,10)}</Text>
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
                        {/*<TextInput style={styles.textInput} value={sexe} onChangeText={setSexe} />*/}
                        <View style={{ borderWidth: 1, paddingLeft: '21.5%', borderColor: 'black' }}>
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
                    saveOnDB(taille, poids, sexe, id)
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