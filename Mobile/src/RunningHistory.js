import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { API_ROOT_URL } from '../config'
import { useIsFocused } from "@react-navigation/native"
import DeletionModal from './DeletionModal'


const RunningHistory = (props) => {
    //const [duree, setDuree] = useState([]);
    //const [kilometres, setKilometres] = useState([]);
    //const [date, setDate] = useState([]);
    const [courses, setCourses] = useState([])
    const [idUser, setIdUser] = useState('')

    const [isVisible, setIsVisible] = useState(false)
    const [currentItem, setCurrentItem] = useState('')

    const isFocused = useIsFocused()

    const InfoCourse = async (id) => {
        await axios.get(`${API_ROOT_URL}/course/${id}`)
            .then((response) => {
                //setDuree(duree => [...duree, response.data.duree]);
                //setKilometres(kilometres => [...kilometres, response.data.kilometres]);
                //setDate(date => [...date, (response.data.date).slice(0, 10)]);
                console.log(response.data)
                setCourses(courses => [...courses, { id: id, duree: response.data.duree, distance: response.data.kilometres, date: response.data.date }])
            })
    }

    const fetchInfo = async (email) => {
        await axios.get(`${API_ROOT_URL}/utilisateur/${email}`)
            .then((response) => {
                setIdUser(response.data._id)
                response.data.tableauCourse.map((prop, key) => {
                    //console.log(prop)
                    if (prop != '')
                        InfoCourse(prop)

                })
            })

    }

    useEffect(() => {
        if (isFocused) {
            //console.log('email = ' + JSON.stringify(props.route.params.email))
            //setDuree([])
            //setKilometres([])
            //setDate([])
            setCourses([])
            fetchInfo(props.route.params.email)
        }
    }, [isFocused])

    return (
        <ScrollView style={styles.background}>
            <Text style={styles.title}>Tableau des courses</Text>
            <View style={styles.container}>
                <Text style={styles.text}>Courses</Text>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', borderTopWidth:1, borderBottomWidth:1 }}>
                    <Text style={styles.tableHeader}>Durée</Text>
                    <Text style={styles.tableHeaderMiddle}>Distance</Text>
                    <Text style={styles.tableHeader}>Date</Text>
                </View>
                {
                    courses.map((item) => {
                        return (
                            <View 
                                style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomLeftRadius: 10,
                                    borderBottomRightRadius: 10
                                }}
                                onTouchEndCapture={() => {
                                    setCurrentItem(item.id)
                                    setIsVisible(true)
                                }}
                            >
                                <Text style={styles.tableTimeRows} key={item.id}>{(item.duree / 3600).toFixed(0) * 1} h {(item.duree / 60).toFixed(0) * 1} min {item.duree % 60} s</Text>
                                <Text style={styles.tableDistRows} key={item.id}>{item.distance} m</Text>
                                <Text style={styles.tableDateRows} key={item.id}>{item.date}</Text>
                            </View>
                        );
                    })
                }
            </View>
            {/* <DeletionModal
                onClose={() => setIsVisible(false)}
                visible={isVisible}
                currentItem={currentItem}
                idUser={idUser}
            /> */}
        </ScrollView>
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
        backgroundColor: '#e00974',
        marginHorizontal: '2.5%',
        borderLeftWidth: 1, 
        borderRightWidth: 1, 
        borderTopWidth:1,
        borderRadius: 10
    },
    text: {
        marginVertical: '2.5%',
        fontSize: 20,
        color: 'white',
        alignItems: 'center',
        fontWeight: 'bold',
        backgroundColor: '#e00974'
    },
    tableHeader: {
        paddingVertical: '2%',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        width: '37.5%',
        fontWeight: 'bold',
        backgroundColor: '#1abc9c'
    },
    tableHeaderMiddle: {
        paddingVertical: '2%',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        width: '25%',
        fontWeight: 'bold',
        borderRightWidth: 1,
        borderLeftWidth: 1
    },
    tableTimeRows: {
        paddingVertical: '2%',
        fontSize: 20,
        textAlign: 'center',
        width: '37.5%',
        backgroundColor: 'white',
        borderBottomLeftRadius: 10
    },
    tableDistRows: {
        paddingVertical: '2%',
        fontSize: 20,
        textAlign: 'center',
        //backgroundColor: 'white',
        color: 'white',
        width: '25%',
        borderRightWidth: 1,
        borderLeftWidth: 1
    },
    tableDateRows: {
        paddingVertical: '2%',
        fontSize: 20,
        textAlign: 'center',
        width: '37.5%',
        backgroundColor: 'white',
        borderBottomRightRadius: 10
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