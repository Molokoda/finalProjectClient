import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Posts from '../screens/posts'
import Chats from '../screens/chats'
import UserProfile from '../screens/userProfile'
import People from '../screens/people'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const profile = require('../assets/profile.png');

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
        <Tab.Navigator initialRouteName = 'userProfile' shifting={false} >
             
            <Tab.Screen 
                name = 'userProfile' 
                options = { { tabBarLabel: 'Profile', tabBarIcon: ({ color }) => ( <MaterialCommunityIcons name="account" color={color} size={26} /> ) } 
            } >
                { () => <UserProfile navigation = {props.navigation}  userData = {props.userData} setArrayOfComments = {props.setArrayOfComments}/> }
            </Tab.Screen>

            <Tab.Screen 
                name = 'posts' 
                options = { { tabBarLabel: 'Posts', tabBarIcon: ({ color }) => ( <MaterialCommunityIcons name="post" color={color} size={26} /> ) } 
            } >
                { () => <Posts navigation = {props.navigation} userData = {props.userData} setArrayOfComments = {props.setArrayOfComments}/> }
            </Tab.Screen>

            
            <Tab.Screen 
                name = 'people' 
                options = { { tabBarLabel: 'People', tabBarIcon: ({ color }) => ( <MaterialCommunityIcons name="account-group" color={color} size={26} /> ) } 
            } >
                { () => <People userData = {props.userData} setUserData = {props.setUserData} setChatInfo = {props.setChatInfo} navigation = {props.navigation}/> }
            </Tab.Screen>

            <Tab.Screen 
                name = 'chats' 
                options = { { tabBarLabel: 'Chats', tabBarIcon: ({ color }) => ( <MaterialCommunityIcons name="chat" color={color} size={26} /> ) } 
            } >
                { () => <Chats userData = {props.userData} setUserData = {props.setUserData} setChatInfo = {props.setChatInfo} navigation = {props.navigation}/> }
            </Tab.Screen>

        </Tab.Navigator>
    )
}



export default Main;