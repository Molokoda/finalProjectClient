import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Posts from '../screens/posts'
import Chats from '../screens/chats'
import UserProfile from '../screens/userProfile'

const Tab = createMaterialBottomTabNavigator();

type MainProps = {
    navigation: any,
    userData: { name: string}
}

const Main: React.FC<MainProps> = (props) => {
    return(
        <Tab.Navigator initialRouteName = 'posts'>
             
            <Tab.Screen name = 'posts'>
                { (navigation) => <Posts navigation = {navigation} userData = {props.userData}/> }
            </Tab.Screen>

            <Tab.Screen name = 'chats'>
                { () => <Chats /> }
            </Tab.Screen>

            <Tab.Screen name = 'userProfile'>
                { () => <UserProfile /> }
            </Tab.Screen>

        </Tab.Navigator>
    )
}



export default Main;