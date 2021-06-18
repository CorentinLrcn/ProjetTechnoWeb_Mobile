import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const Accueil = (props) => {

    const { navigation } = props;

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={{
                    uri: 'https://cdn.discordapp.com/attachments/771665604977491978/832541002581016606/logo_small_icon_only_inverted.png',
                }} />
            <Image
                style={styles.logoName}
                source={{
                    uri: 'https://media.discordapp.net/attachments/771665604977491978/835961487256190996/logo_white_large.png?width=400&height=162',
                }} />
            <TouchableOpacity
                style={styles.Btn}
                onPress={() => navigation.navigate('Inscription')}
            >
                <Text style={styles.txtBtn}>Inscription</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.Btn}
                onPress={() => navigation.navigate('Connexion')}
            >
                <Text style={styles.txtBtn}>Connexion</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1abc9c'
    },
    logo: {
        marginLeft: '35%',
        marginTop: '35%',
        height: 125,
        width: 125
    },
    logoName: {
        marginTop: '5%',
        height: 125,
        width: '100%'
    },
    Btn: {
        backgroundColor: 'white',
        marginTop: '10%',
        width: '75%',
        alignSelf: 'center',
        paddingVertical: '2.5%',
        borderRadius: 5
    },
    txtBtn: {
        textAlign: 'center',
        //fontFamily: 'Verdana',
        fontSize: 20
    }
})

export default Accueil