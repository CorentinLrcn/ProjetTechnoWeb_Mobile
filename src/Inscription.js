import axios from "axios";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { API_ROOT_URL } from "../config";

const Ajout = async (prenom, nom, email, dateDeNaissance, motDePasse) => {
  try {
    const res = axios.post(`${API_ROOT_URL}/utilisateur/inscriptionMobile?nom=${nom}&prenom=${prenom}&email=${email}&dateDeNaissance=${dateDeNaissance}&motDePasse=${motDePasse}`)
    return (await res.catch()).data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};



const Inscription = (props) => {
  const [prenom, setPrenom] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [jourNaissance, setJourN] = useState("");
  const [moisNaissance, setMoisN] = useState("");
  const [anneeNaissance, setAnneeN] = useState("");

  const { navigation } = props;

  const VerifNotEmpty = () => {
    if (nom === '') showMessage({ message: "Nom non rempli", type: "warning" })
    else if (prenom === '') showMessage({ message: "Prénom non rempli", type: "warning" })
    else if (jourNaissance === '' || moisNaissance === '' || anneeNaissance === '') showMessage({ message: "Date de naissance non remplie", type: "warning" })
    else if (email === '') showMessage({ message: "E-mail non rempli", type: "warning" })
    else if (motDePasse === '') showMessage({ message: "Mot de passe non rempli", type: "warning" })
    else if (motDePasse.length < 8) showMessage({ message: "Le mot de passe doit faire au moins 8 caractères", type: "warning" })
    else VerifIfEmailTaken()
  }

  const VerifIfEmailTaken = async () => {
    await axios.get(`${API_ROOT_URL}/utilisateur/${email}`)
      .then((response) => {
        if (response.data !== '') {
          showMessage({
            message: `Un compte existe déjà pour ${email}`,
            type: 'danger'
          })
        } else {
          Ajout(prenom, nom, email, new Date(`${anneeNaissance}-${moisNaissance}-${jourNaissance}`), motDePasse)
          navigation.navigate('Connexion')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <View style={styles.container}>
      <Image
        style={{ height: 150, width: '100%', marginTop: '-25%' }}
        source={{
          uri: 'https://cdn.discordapp.com/attachments/771665604977491978/840167041507655680/logo_small_mobile.png'
        }} />
      <View style={styles.form}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Nom"
            placeholderTextColor="gray"
            onChangeText={(nom) => setNom(nom)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Prenom"
            placeholderTextColor="gray"
            onChangeText={(prenom) => setPrenom(prenom)}
          />
        </View>
        <View style={styles.inputView2}>
          <View style={styles.inputViewJM}>
            <TextInput
              style={styles.textInput}
              placeholder="Jour"
              placeholderTextColor="gray"
              onChangeText={(jourNaissance) => setJourN(jourNaissance)}
              keyboardType='numeric'
              maxLength={2}
            />
          </View>

          <View style={styles.inputViewJM}>
            <TextInput
              style={styles.textInput}
              placeholder="Mois"
              placeholderTextColor="gray"
              onChangeText={(moisNaissance) => setMoisN(moisNaissance)}
              keyboardType='numeric'
              maxLength={2}
            />
          </View>

          <View style={styles.inputViewAnnee}>
            <TextInput
              style={styles.textInput}
              placeholder="Annee"
              placeholderTextColor="gray"
              onChangeText={(anneeNaissance) => setAnneeN(anneeNaissance)}
              keyboardType='numeric'
              maxLength={4}
            />
          </View>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor="gray"
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Mot de passe"
            placeholderTextColor="gray"
            secureTextEntry={true}
            onChangeText={(motDePasse) => setMotDePasse(motDePasse)}
          />
        </View>

        <TouchableOpacity
          style={styles.signinBtn}
          onPress={() => {
            VerifNotEmpty()
          }}
        >
          <Text style={styles.loginText}>Inscription</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            navigation.navigate('Connexion')
          }}
        >
          <Text style={styles.loginText}>Connexion</Text>
        </TouchableOpacity>
      </View>
      <FlashMessage position="top" />
    </View >
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: '10%'
  },

  form: {
    alignItems: "center",
    justifyContent: "center",
    width: '80%',
    paddingVertical: '5%',
    backgroundColor: '#eeeeee',
    borderRadius: 10
  },

  inputView: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    width: "70%",
    height: 40,
    marginBottom: 20,
    justifyContent: "center"
  },

  inputView2: {
    borderRadius: 10,
    width: "70%",
    height: 40,
    marginBottom: 20,
    flexDirection: 'row'
  },

  inputViewJM: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    width: "20%",
    height: 40,
    marginRight: 20,
    justifyContent: 'center'
  },

  inputViewAnnee: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    width: "40%",
    height: 40,
    marginLeft: 5,
    justifyContent: 'center'
  },

  textInput: {
    textAlign: "center",
    color: 'black'
  },

  signinBtn: {
    width: "100%",
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#1abc9c",
    paddingHorizontal: "10%",
  },

  loginBtn: {
    width: "100%",
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#1abc9c",
    paddingHorizontal: "10%",
  },

  loginText: {
    fontWeight: "bold",
    color: "white",
  },
});

export default Inscription;
