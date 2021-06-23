import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { API_ROOT_URL } from '../config';


// create a component
const DeletionModal = ({ visible, onClose, currentItem, idUser }) => {
    const [isFirst, setIsFirst] = useState(true)

    const reloadTableRunUser = async (idUser, idRun) => {
        console.log(isFirst)
        isFirst ? (
            await axios.put(`${API_ROOT_URL}/utilisateur/runTable/${idUser}?courses=${idRun}`)
                .then(() => {
                    console.log('Tableau des courses à jour')
                    setIsFirst(false)
                })
        ) : (
            await axios.post(`${API_ROOT_URL}/utilisateur/${idUser}?course=${idRun}`)
                .then(() => {
                    console.log('Tableau des courses à jour')
                })
        )
    }

    const getNewTableRunUser = async (idUser) => {
        await axios.get(`${API_ROOT_URL}/course/user/${idUser}`)
            .then((res) => {
                //console.log(res.data.length)
                if (res.data.length === 0) {
                    //console.log('Egal a tableau vide')
                    reloadTableRunUser(idUser, '')
                } else {
                    res.data.map((item) => {
                        reloadTableRunUser(idUser, item._id)
                    })
                }
            })
    }

    const deleteRun = async (id, idUser) => {
        await axios.delete(`${API_ROOT_URL}/course/${id}`)
            .then((res) => {
                //console.log(res)
                setIsFirst(true)
                getNewTableRunUser(idUser)
            })
            .catch(() => console.log('Il y a un blem'))
    }

    return (
        <>
            <StatusBar hidden />
            <Modal animationType='slide' transparent visible={visible}>
                <View style={styles.modal}>
                    <Text style={styles.title} numberOfLines={2}>{currentItem}</Text>
                    <View style={styles.optionContainer}>
                        <TouchableWithoutFeedback onPress={() => {
                            deleteRun(currentItem, idUser)
                            onClose()
                        }}>
                            <Text style={styles.option}>Supprimer</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalBg}></View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
};

// define your styles
const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 100,
    },
    optionContainer: {
        padding: 40
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 0,
        color: 'grey'
    },
    option: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
        paddingVertical: 10,
        letterSpacing: 0.5,
        textAlign: 'center'
    },
    modalBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
});

export default DeletionModal;