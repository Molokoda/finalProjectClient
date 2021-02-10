import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './forms/loginForm'
import RegForm from './forms/regForm'
import Main from './screens/main'
import Chat from './components/chat'

const Stack = createStackNavigator();

export default function App() {

  const [userData, setUserData] = useState( {login: '', friends: [''], chats: [ { _id: '', users: [''] } ], avatar: '' } );
  const [chatInfo, setChatInfo] = useState( { _id: '', users: [''] } )

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName = { 'login' } 
        screenOptions = {{
          headerStyle: {
            backgroundColor: '#009387',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
      }} >

        <Stack.Screen name = 'login'>
          { (navigation) => <LoginForm navigation = {navigation} setUserData = {setUserData}/> }
        </Stack.Screen>

        <Stack.Screen  name = 'reg'>
          { (navigation) => <RegForm navigation = {navigation}/> }
        </Stack.Screen>

        <Stack.Screen  name = 'main'>
          { (navigation) => <Main navigation = {navigation} userData = {userData} setUserData = {setUserData} setChatInfo = {setChatInfo} /> }
        </Stack.Screen>

        <Stack.Screen name = 'chat'>
          { (navigation) => <Chat chatInfo = {chatInfo} userData = {userData}/> }
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
