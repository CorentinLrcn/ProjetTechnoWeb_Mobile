import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Running from './Running'
import RunningHistory from './RunningHistory'
import MyAccount from './MyAccount'
import { Ionicons } from '@expo/vector-icons'

const Tabs = createBottomTabNavigator()

const TabNavigation = (props) => {
    const {route, navigation} = props

    return (
        <Tabs.Navigator
            tabBarOptions={{
                //activeTintColor: '#e00974',
                //inactiveTintColor: 'white',
                activeBackgroundColor: '#1abc9c',
                inactiveBackgroundColor: '#e00974',
                labelStyle: {
                    fontSize: 13,
                    color: 'white'
                }
            }}
            initialRouteName = "Running"
        >

            <Tabs.Screen name="Running" component={Running} initialParams={{ _id: route.params._id }} options={{
                tabBarIcon: () => <Ionicons name="timer-outline" size={25} color='white' />,
            }} />

            <Tabs.Screen name="Historique" component={RunningHistory} initialParams={{ email: route.params.email }} options={{
                tabBarIcon: () => <Ionicons name="file-tray-full-outline" size={25} color='white' />,
            }} />

            <Tabs.Screen name="Mon Compte" component={MyAccount} initialParams={{ email: route.params.email }} options={{
                tabBarIcon: () => <Ionicons name="person-outline" size={25} color='white' />,
            }} />

        </Tabs.Navigator >
    )
}

export default TabNavigation