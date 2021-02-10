import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

const messageButton = require('../assets/comment.png');
const deleteButton = require('../assets/delete.png');
const addButton = require('../assets/add.png');

type MainProps = {
    userData: { login: string, friends: string[], chats: { _id: string, users: string[] }[], avatar: string },
    setUserData: any
}
const window = Dimensions.get('window');

function uuidv4() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }



const People: React.FC<MainProps> = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [arrayOfOtherUsers, setArrayOfOtherUsers] = useState([]);

    const changeFriends = ( friend: string) => {
 
        fetch('http://192.168.100.88:3000/users/friends', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify( { login: props.userData.login, friend: friend} )
        });
        let isFriend = props.userData.friends.find( (userFriend) => userFriend === friend);
        if(isFriend){
            let temp = props.userData.friends;
            let isDeleteFriendFind = false;
            for(let i = 0; i < temp.length - 1; i++){
                if( temp[i] === friend || isDeleteFriendFind){
                    temp[i] = temp[ i + 1 ];
                    isDeleteFriendFind = true;
                }
            }
            temp.length = temp.length - 1;
            setIsLoading(true);
            props.setUserData( {...props.userData, friends: temp } );
        }
        else{
            let temp = props.userData.friends;
            temp.push(friend);
            setIsLoading(true);
            props.setUserData( {...props.userData, friends: temp } );
        }
        
    }

    const startChat = async(login: string) => {
        let isExist = false;
        console.log(props.userData.chats.length);
        props.userData.chats.forEach( (chat) => {
            if( chat.users.find( (user) => user === login) ){
                isExist = true;
            }
        });

        if( isExist ){
            console.log('We here');

        }
        else{
            console.log('We here 2');
            let response = await fetch('http://192.168.100.88:3000/users/chats/create', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json;charset=utf-8'
                },
                body: JSON.stringify( {users: [props.userData.login, login], id: uuidv4().slice(0, 24) } ) 
            })

            let newChat = await response.json();
            response = await fetch('http://192.168.100.88:3000/users/addchat', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json;charset=utf-8'
                },
                body: JSON.stringify( { users: [props.userData.login, login], chat: newChat } ) 
            })
            let old = props.userData;
            old.chats.push(newChat);
            props.setUserData( old );
        }
    }

    useEffect( () => {
        if(isLoading){
            (async() => {
                console.log(props.userData);
                let response = await fetch('http://192.168.100.88:3000/users/allusers', {method: 'GET'});
                let arrayOfUser = await response.json();
                let arrayOfOtherUsers = arrayOfUser.filter( (user: {login: string}) => {
                    let answer = true;
                    if(props.userData.friends){
                        
                        let isFriend = props.userData.friends.find( (friend) => friend === user.login )
                        if(isFriend || user.login === props.userData.login){
                            answer = false;
                        }
                        else{
                            answer = true;
                        }
                    }
                    else{
                        props.setUserData( { ...props.userData, friends: [] } );
                    }
                    return answer
                })
                setIsLoading(false);
                setArrayOfOtherUsers( arrayOfOtherUsers );
                
            })()

            
        }
        
    })

    if(isLoading){
        return(
            <Text>Is loading</Text>
        )
    }
    else{
        return(
            <ScrollView>
                <View style = {styles.container}>
                    <View style = {styles.friendsContainer}>
                        <Text style = {styles.title}>Friends: </Text>
                        { 
                            
                            props.userData.friends.map( (friend: string, index: number) => {
                                return(
                                    <View key = {index} style = {styles.frinedContainer}>
                                        <Text key = {index}>{friend}</Text> 
                                        <View style = {styles.buttonContainer}>
                                            <TouchableOpacity onPress = { () => { startChat(friend) } }>
                                                <Image source = {messageButton} style = { styles.button }/>
                                            </TouchableOpacity>
                                            <TouchableOpacity style = {styles.button} onPress = { () => { changeFriends( friend ) } }>
                                                <Image source = {deleteButton} style = { styles.button }/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            } )
                            
                        }      
                    </View>
                    <View style = {styles.friendsContainer}>
                        <Text style = {styles.title}>Other Users: </Text>
                        { 
                            arrayOfOtherUsers.map( (user: {login: string}, index: number) => {
                                return(
                                    <View key = {index} style = {styles.frinedContainer}>
                                        <Text key = {index}>{user.login}</Text> 
                                        <View style = {styles.buttonContainer}>
                                                <TouchableOpacity onPress = { () => { startChat(user.login) } } >
                                                    <Image source = {messageButton} style = { styles.button }/>
                                                </TouchableOpacity>
                                                <TouchableOpacity style = {styles.button} onPress = { () => { changeFriends( user.login ) } }>
                                                    <Image source = {addButton} style = { styles.button }/>
                                                </TouchableOpacity>
                                            </View>
                                    </View>
                                )
                            } )
                        }       
                    </View>
                </View>
            </ScrollView>
        )
    }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    friendsContainer: {
        width: window.width
    },

    frinedContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: window.width,
        borderBottomWidth: 1,
    },

    title: {
        fontSize: 16
    },

    button: {
        width: 32, 
        height: 32,
        marginLeft: 5
    },

    buttonContainer: {
        flexDirection: 'row'
    }
});

export default People;