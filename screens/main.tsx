import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Posts from '../screens/posts'
import Chats from '../screens/chats'
import UserProfile from '../screens/userProfile'
import People from '../screens/people'

const Tab = createMaterialBottomTabNavigator();

type MainProps = {
    navigation: any,
    userData: { login: string, friends: string[] },
    setUserData: any
}

const Main: React.FC<MainProps> = (props) => {
    return(
        <Tab.Navigator initialRouteName = 'userProfile'>
             
            <Tab.Screen name = 'userProfile'>
                { () => <UserProfile userData = {props.userData} /> }
            </Tab.Screen>

            <Tab.Screen name = 'posts'>
                { (navigation) => <Posts navigation = {navigation} userData = {props.userData}/> }
            </Tab.Screen>

            <Tab.Screen name = 'people'>
                { () => <People userData = {props.userData} setUserData = {props.setUserData}/> }
            </Tab.Screen>

            <Tab.Screen name = 'chats'>
                { () => <Chats /> }
            </Tab.Screen>

            

        </Tab.Navigator>
    )
}



export default Main;