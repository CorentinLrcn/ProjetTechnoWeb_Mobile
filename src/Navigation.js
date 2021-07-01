import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Inscription from './Inscription'
import Accueil from './Accueil'
import { StyleSheet } from 'react-native'
import HeaderButton from './HeaderButton'
import Connexion from './Connexion'
import TabNavigation from './TabNavigation'

const Stack = createStackNavigator()

const Navigation = () => {
    return (
        <Stack.Navigator intialRouteName="Accueil" >

            <Stack.Screen
                name="Accueil"
                component={Accueil}
                options={{
                    headerTitleStyle: {
                        height: 0
                    },
                    headerStyle: { height: 0 }
                }} />

            <Stack.Screen name="Inscription" component={Inscription} options={({ navigation }) => ({
                headerStyle: {
                    backgroundColor: '#1abc9c'
                },
                headerTitleStyle: {
                    color: 'white'
                },
                headerLeft: () => HeaderButton(navigation)
            })} />

            <Stack.Screen name="Connexion" component={Connexion} options={({ navigation }) => ({
                headerStyle: {
                    backgroundColor: '#1abc9c'
                },
                headerTitleStyle: {
                    color: 'white'
                },
                headerLeft: () => HeaderButton(navigation)
            })} />

            <Stack.Screen name="Application" component={TabNavigation} options={() => ({
                headerStyle: { height: 0 },
                headerTitle: null,
                headerLeft: null
            })} />

        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    logoName: {
        height: 100,
        width: 100
    }
})

export default Navigation