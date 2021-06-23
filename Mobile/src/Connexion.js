import axios from "axios";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { API_ROOT_URL } from "../config";

const Verif = async (email, motDePasse, navigation) => {
  axios.get(`${API_ROOT_URL}/utilisateur/connexionMobile?email=${email}&motDePasse=${motDePasse}`)
    .then((response) => {
      const _id = response.data._id
      navigation.navigate('Application', { email, _id })
    })
    .catch((err) => {
      showMessage({
        message: "Email ou mot de passe incorrect",
        type: "danger"
      })
    })
}

const Connexion = (props) => {
  const [motDePasse, setMotDePasse] = useState("");
  const [email, setEmail] = useState("");

  const { navigation } = props

  return (
    <View style={styles.container}>
      <Image
        style={{ height: 150, width: '100%', marginTop: '-25%', marginBottom: '10%' }}
        source={{
          uri: 'https://cdn.discordapp.com/attachments/771665604977491978/840167041507655680/logo_small_mobile.png'
        }} />
      <View style={styles.form}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="gray"
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Mot de passe"
            placeholderTextColor="gray"
            secureTextEntry={true}
            onChangeText={(motDePasse) => setMotDePasse(motDePasse)}
          />
        </View>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            Verif(email, motDePasse, navigation)
          }}
        >
          <Text style={styles.loginText}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.navigate('Inscription')}
        >
          <Text style={styles.loginText}>Inscription</Text>
        </TouchableOpacity>
      </View>
      <FlashMessage position="top" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: '80%',
    paddingVertical: '5%',
    backgroundColor: '#eeeeee',
    borderRadius: 10
  },

  image: {
    marginBottom: 40,
  },

  inputView: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "70%",
    height: 40,
    marginBottom: 20,
    justifyContent: "center",
  },

  TextInput: {
    textAlign: "center",
    color: 'black'
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
})

export default Connexion;