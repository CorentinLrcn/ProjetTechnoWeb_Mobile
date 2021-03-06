import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { API_ROOT_URL } from '../config'
import { useIsFocused } from "@react-navigation/native"
import DeletionModal from './DeletionModal'


const RunningHistory = (props) => {
    const [courses, setCourses] = useState([])
    const [idUser, setIdUser] = useState('')

    const [isVisible, setIsVisible] = useState(false)
    const [currentItem, setCurrentItem] = useState('')

    const isFocused = useIsFocused()

    const InfoCourse = async (id, key) => {
        await axios.get(`${API_ROOT_URL}/course/${id}`)
            .then((response) => {
                setCourses(courses => [...courses, { id: id, key: key, duree: response.data.duree, distance: response.data.metres, date: response.data.date.slice(0, 10) }])
            })
    }

    const fetchInfo = async (email) => {
        await axios.get(`${API_ROOT_URL}/utilisateur/${email}`)
            .then((response) => {
                setIdUser(response.data._id)
                response.data.tableauCourse.map((prop, key) => {
                    if (prop != '')
                        InfoCourse(prop, key)

                })
            })

    }

    useEffect(() => {
        if (isFocused) {
            setCourses([])
            fetchInfo(props.route.params.email)
        }
    }, [isFocused])

    useEffect(() => {
        if (!isVisible) {
            setTimeout(() => {
                setCourses([])
                fetchInfo(props.route.params.email)
            }, 5000);
        }
    }, [isVisible])

    return (
        <ScrollView style={styles.background}>
            <Text style={styles.title}>Tableau des courses</Text>
            <View style={styles.border}>
                <View style={styles.container}>
                    <Text style={styles.text}>Courses</Text>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', borderTopWidth: 1 }}>
                        <Text style={styles.tableHeaderTime}>Dur??e</Text>
                        <Text style={styles.tableHeaderMiddle}>Distance</Text>
                        <Text style={styles.tableHeaderDate}>Date</Text>
                    </View>
                    {
                        courses.map((item) => {
                            return (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        justifyContent: 'center',
                                        borderTopWidth: 1,
                                    }}
                                    onTouchEndCapture={() => {
                                        setCurrentItem(item.id)
                                        setIsVisible(true)
                                    }}
                                    key={item.key}
                                >
                                    <Text style={styles.tableTimeRows} >{(item.duree / 3600).toFixed(0) * 1} h {(item.duree / 60).toFixed(0) * 1} min {item.duree % 60} s</Text>
                                    <Text style={styles.tableDistRows} >{item.distance} m</Text>
                                    <Text style={styles.tableDateRows} >{item.date}</Text>
                                </View>
                            );
                        })
                    }
                </View>
            </View>
            <DeletionModal
                onClose={() => setIsVisible(false)}
                visible={isVisible}
                currentItem={currentItem}
                idUser={idUser}
            />
        </ScrollView>
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
    border: {
        alignItems: 'center',
        marginVertical: '15%',
        backgroundColor: 'white',
        marginHorizontal: '2.5%',
        borderWidth: 7.5,
        borderRadius: 10,
        borderTopColor: '#e00974',
        borderLeftColor: '#e00974',
        borderRightColor: '#1abc9c',
        borderBottomColor: '#1abc9c'
    },
    container: {
        backgroundColor: 'white',
    },
    text: {
        paddingVertical: '2.5%',
        fontSize: 20,
        color: '#e00974',
        alignItems: 'center',
        fontWeight: 'bold',
        minWidth: '100%',
        textAlign: 'center'
    },
    tableHeaderTime: {
        paddingVertical: '2%',
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        width: '37.5%',
        fontWeight: 'bold'
    },
    tableHeaderDate: {
        paddingVertical: '2%',
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        width: '35%',
        fontWeight: 'bold'
    },
    tableHeaderMiddle: {
        paddingVertical: '2%',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        width: '27.5%',
        fontWeight: 'bold',
        backgroundColor: '#e00974'
    },
    tableTimeRows: {
        paddingVertical: '2.5%',
        fontSize: 20,
        textAlign: 'center',
        width: '37.5%',
    },
    tableDistRows: {
        paddingVertical: '2%',
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: '#e00974',
        color: 'white',
        width: '27.5%'
    },
    tableDateRows: {
        paddingVertical: '2%',
        fontSize: 20,
        textAlign: 'center',
        width: '35%'
    }
})

export default RunningHistory