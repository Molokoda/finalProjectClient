import React, {useState} from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Dimensions, Touchable } from 'react-native';
import loginScheme from '../schemes/loginScheme'

async function loginUser(login: string, password: string, setUserData: any, navigation: any ){
    let validate = await loginScheme.validate( {login: login, password: password} ); 
    if(validate.error){
        alert(validate.error);
    }
    else{
        let userData = {login: login, password: password};

        let response = await fetch('http://192.168.100.88:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(userData)
        });
        let userDataFromServer = await response.json();
        if(userDataFromServer === 'login or password wrong'){
            alert(userDataFromServer);
        }
        else{
            setUserData( {login: userDataFromServer[0].login, friends: userDataFromServer[0].friends} );
            navigation.navigation.navigate('main');
        }
    }

    

}


type Props = {
    navigation: any,
    setUserData: any
}

const window = Dimensions.get('window');

const LoginForm: React.FC<Props> = (props) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    return(
        <View style = {styles.container}>
            <View style = {{marginTop: 150}}>
                <TextInput style = {styles.input} placeholder = 'Enter your login' onChangeText = { (event) => {setLogin(event)} }/>
                <TextInput style = {styles.input} placeholder = 'Enter yout password' onChangeText = { (event) => {setPassword(event)} }/>
                <TouchableOpacity style = {styles.button} onPress = { () => { loginUser(login, password, props.setUserData, props.navigation) } } >
                    <Text style = { {color: 'white'} } >Log in</Text>
                </TouchableOpacity>
            </View>
            <View style = { styles.footer }>
                <View style = {styles.line}></View>
                <Text style = {{color: 'grey', textAlign: 'center'}}> 
                    Don't have account ? 
                    <Text onPress = { () => {props.navigation.navigation.navigate('reg')} } style = {{color: 'blue'}} > Sing Up</Text>
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
 
export default LoginForm;