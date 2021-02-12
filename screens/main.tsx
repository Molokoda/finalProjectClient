import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Posts from '../screens/posts'
import Chats from '../screens/chats'
import UserProfile from '../screens/userProfile'
import People from '../screens/people'


const Tab = createMaterialBottomTabNavigator();

type MainProps = {
    navigation: any,
    userData: { login: string, friends: string[], chats: { _id: string, users: string[] }[], avatar: string },
    setUserData: any,
    setChatInfo: any,
    setArrayOfComments: any
}

const Main: React.FC<MainProps> = (props) => {
    return(
        <Tab.Navigator initialRouteName = 'userProfile'>
             
            <Tab.Screen name = 'userProfile'>
                { () => <UserProfile navigation = {props.navigation}  userData = {props.userData} setArrayOfComments = {props.setArrayOfComments}/> }
            </Tab.Screen>

            <Tab.Screen name = 'posts'>
                { () => <Posts navigation = {props.navigation} userData = {props.userData} setArrayOfComments = {props.setArrayOfComments}/> }
            </Tab.Screen>

            <Tab.Screen name = 'people'>
                { () => <People userData = {props.userData} setUserData = {props.setUserData}/> }
            </Tab.Screen>

            <Tab.Screen name = 'chats'>
                { () => <Chats userData = {props.userData} setUserData = {props.setUserData} setChatInfo = {props.setChatInfo} navigation = {props.navigation}/> }
            </Tab.Screen>

        </Tab.Navigator>
    )
}



export default Main;