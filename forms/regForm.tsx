import React, {useState} from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import regScheme from '../schemes/regScheme'


async function regUser(login: string, password: string, name: string, navigation: any){
    let validate = await regScheme.validate( {login: login, password: password, name: name} ); 
    if(validate.error){
        alert(validate.error);
    }
    else{
        let userData = {login: login, password: password, name: name, friends: []}

        let response = await fetch('http://192.168.100.88:3000/users/reg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(userData)
        });

        let serverResponse = await response.json();       
        alert(serverResponse);
        navigation.navigation.goBack();

    }
}

type Props = {
    navigation: any
}

const window = Dimensions.get('window');

const RegForm: React.FC<Props> = (props) => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    return(
        <View style = {styles.container}>
            <View style = {{marginTop: 150}}>
                <TextInput style = {styles.input} placeholder = 'Enter your login' onChangeText = { (event) => {setLogin(event)} }/>
                <TextInput style = {styles.input} placeholder = 'Enter yout password' onChangeText = { (event) => {setPassword(event)} }/>
                <TextInput style = {styles.input} placeholder = 'Enter yout name' onChangeText = { (event) => {setName(event)} }/>
                <TouchableOpacity style = {styles.button} onPress = { () => {regUser(login, password, name, props.navigation)} }>
                    <Text style = { {color: 'white'} }>Sing Up</Text>
                </TouchableOpacity>
            </View>
            <View style = { styles.footer }>
                <View style = {styles.line}></View>
                <Text style = {{color: 'grey', textAlign: 'center'}}>
                    Already have account ? 
                    <Text style = {{color: 'blue'}} onPress = { () => {props.navigation.navigation.goBack()} } > Log In</Text>
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
        marginBottom: 10,
        padding: 5,
        paddingLeft: 10,
        width: window.width - 30,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    },
    button: {
        padding: 10,
        width: window.width - 30,
        alignItems: 'center',
        backgroundColor: 'skyblue',
        borderRadius: 10
    },
    line: {
        width: window.width,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 10
    }
});
 
export default RegForm;