import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {StyleSheet, Text, View } from 'react-native';
import { API_ROOT_URL } from '../config'


const RunningHistory = (props) => {
    const [duree, setDuree] = useState([]);
    const [kilometres, setKilometres] = useState([]);
    const [date, setDate] = useState([]);
    const InfoCourse = async (id) => {
        console.log('ici')
        const data = await axios.get(`${API_ROOT_URL}/course/${id}`)
        .then((response) => {
            setDuree(duree => [...duree, response.data.duree]);
            setKilometres(kilometres => [...kilometres, response.data.kilometres]);
            setDate(date => [...date, (response.data.date).slice(0,10)]);
        })
    }

    const fetchInfo = async (email) => {        
        const data = await axios.get(`${API_ROOT_URL}/utilisateur/${email}`)
            .then((response) => {
                    response.data.tableauCourse.map((prop, key) => {
                        console.log(prop)
                        if(prop != '')
                            InfoCourse(prop)
                        
                    })
            })
            
    }

    useEffect(() => {
        console.log('email = ' + JSON.stringify(props.route.params.email))
        fetchInfo(props.route.params.email)
    }, [])

    return (
        <View style={styles.background}>
            <Text style={styles.title}>Tableau des courses</Text>
            <View style={styles.container}>
                <Text style={styles.text}>Course : </Text>
                <Text style={styles.text}>Durée    Kilomètres     Date</Text>
                {
            duree.map((prop, key) => {
                return(<Text style={styles.text} key={key}>  {prop}min         {kilometres[key]}m          {date[key]} </Text>) ;                
            })
        }
         {
           
        }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        height: '100%'
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
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
        color: 'white',
        alignItems: 'center'
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

export default RunningHistory