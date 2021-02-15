import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, Touchable } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Checkbox } from 'react-native-paper';

const messageButton = require('../assets/comment.png');
const deleteButton = require('../assets/delete.png');
const addButton = require('../assets/add.png');
const group = require('../assets/group.png');

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
    const [arrayOfOtherUsers, setArrayOfOtherUsers] = useState( [ { name: '', isChoose: false } ] );
    const [arrayOfFriends, setArrayOfFriends] = useState( [ { name: '', isChoose: false } ] );
    const [arrayOfChoosenUsers] = useState( [''] );
    const [isRender, setIsRender] = useState(false);
    const [finder, setFinder] = useState('');

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
        props.userData.chats.forEach( (chat) => {
            if( chat.users.find( (user) => user === login) && chat.users.length == 2 ){
                isExist = true;
            }
        });

        if( isExist ){
            console.log('We here');

        }
        else{
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

    const changeCheck = ( userName: string, index: number, typeUser: string) => {
        if( arrayOfChoosenUsers.find( user => user === userName ) && typeUser === 'friend' ){
            for( let i = index; i < arrayOfChoosenUsers.length - 1; i++){
                arrayOfChoosenUsers[i] = arrayOfChoosenUsers[ i + 1 ];
            } 
            arrayOfChoosenUsers.length = arrayOfChoosenUsers.length - 1;
            let temp = arrayOfFriends;
            temp[index].isChoose = false;
            setArrayOfFriends(temp);

        }
        else if( arrayOfChoosenUsers.find( user => user === userName ) && typeUser === 'other' ){
            for( let i = index; i < arrayOfChoosenUsers.length - 1; i++){
                arrayOfChoosenUsers[i] = arrayOfChoosenUsers[ i + 1 ];
            } 
            arrayOfChoosenUsers.length = arrayOfChoosenUsers.length - 1;
            let temp = arrayOfOtherUsers;
            temp[index].isChoose = false;
            setArrayOfOtherUsers(temp);
        }
        else if( arrayOfChoosenUsers[0] === '' && typeUser === 'friend' ){
            arrayOfChoosenUsers[0] = userName;
            let temp = arrayOfFriends;
            temp[index].isChoose = true;
            setArrayOfFriends(temp);
        }
        else if( arrayOfChoosenUsers[0] === '' && typeUser === 'other' ){
            arrayOfChoosenUsers[0] = userName;
            let temp = arrayOfOtherUsers;
            temp[index].isChoose = true;
            setArrayOfOtherUsers(temp);
        }
        else if( typeUser === 'friend' ){
            arrayOfChoosenUsers.push( userName );
            let temp = arrayOfFriends;
            temp[index].isChoose = true;
            setArrayOfFriends(temp);
        }
        else{
            arrayOfChoosenUsers.push( userName );
            let temp = arrayOfOtherUsers;
            temp[index].isChoose = true;
            setArrayOfOtherUsers(temp);
        }
        setIsRender(true);
    }

    const addGroupChat = async() => {
        if( arrayOfChoosenUsers.length < 2 ){
            alert('Must be more then 2 users choosen for the group chat');
        }
        else{
            let response = await fetch('http://192.168.100.88:3000/users/chats/create', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json;charset=utf-8'
                },
                body: JSON.stringify( {users: [...arrayOfChoosenUsers, props.userData.login], id: uuidv4().slice(0, 24) } )
            })

            let newChat = await response.json();
            response = await fetch('http://192.168.100.88:3000/users/addchat', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json;charset=utf-8'
                },
                body: JSON.stringify( { users: [...arrayOfChoosenUsers, props.userData.login], chat: newChat } )
            })
            let old = props.userData;
            old.chats.push(newChat);
            props.setUserData( old );
        }
        arrayOfChoosenUsers.length = 0;
        arrayOfFriends.forEach( ( friend ) => {
            friend.isChoose = false;
        });
        arrayOfOtherUsers.forEach( (user) => {
            user.isChoose = false;
        });
        setIsRender(true);
    }
    

    useEffect( () => {
        if(isLoading){
            (async() => {
                let response = await fetch('http://192.168.100.88:3000/users/allusers', {method: 'GET'});
                let arrayOfUser = await response.json();
                let arrayOfOtherUsers = [ { name: '', isChoose: false } ] ;
                let arrayOfFriends = [ { name: '', isChoose: false } ];
                arrayOfUser.forEach( (user: string ) => {
                    let isFriend = props.userData.friends.find( (friend) => friend === user );
                    if( isFriend && arrayOfFriends[0].name === '' ){
                        arrayOfFriends[0] = { name: user, isChoose: false };
                    }
                    else if( isFriend ){
                        arrayOfFriends.push( { name: user, isChoose: false } );
                    }
                    else if( !isFriend && arrayOfOtherUsers[0].name === '' && user !== props.userData.login  ){
                        arrayOfOtherUsers[0] = { name: user, isChoose: false };
                    }
                    else if( !isFriend && user !== props.userData.login ){
                        arrayOfOtherUsers.push( { name: user, isChoose: false } );
                    }
                })
                
                if(arrayOfFriends[0].name === ''){
                    arrayOfFriends.length = 0;
                }

                if(arrayOfOtherUsers[0].name === ''){
                    arrayOfOtherUsers.length = 0;
                }

                setIsLoading(false);
                setArrayOfOtherUsers( arrayOfOtherUsers );
                setArrayOfFriends( arrayOfFriends );

            })()
        }
    })

    useEffect( () => {
        if(isRender){
            setIsRender(false);
        }
    },[isRender])
    
    if(isLoading){
        return(
            <Text>Is loading</Text>
        )
    }
    else{
        return(
            <ScrollView>
                <View style = {styles.container}>
                    <View style = {styles.header}>
                        <TextInput placeholder = {'Search user '} style = { styles.input } onChangeText = { (event) =>  { setFinder(event) } }/>
                        <TouchableOpacity onPress = { () => { addGroupChat() } } >
                            <Image source = {group} style = { styles.button } />
                        </TouchableOpacity>
                    </View>
                    <View style = {styles.friendsContainer}>
                        <Text style = {styles.title}>Friends: </Text>
                        {
                            arrayOfFriends.filter( ( friend ) => { 
                                    const reg: any =  RegExp(`^${finder}\w{0,}`); 
                                    return friend.name.match(reg) 
                                } ).map( (friend, index: number) => {
                                return(
                                    <View key = {index} style = {styles.frinedContainer}>
                                        <Text key = {index}>{friend.name}</Text>
                                        <View style = {styles.buttonContainer}>
                                            <Checkbox
                                                color={`green`}
                                                uncheckedColor={`grey`}
                                                status={ friend.isChoose ? 'checked' : 'unchecked'}
                                                onPress = { () => {changeCheck( friend.name, index, 'friend' ) } }
                                            />
                                            <TouchableOpacity onPress = { () => { startChat(friend.name) } }>
                                                <Image source = {messageButton} style = { styles.button }/>
                                            </TouchableOpacity>
                                            <TouchableOpacity style = {styles.button} onPress = { () => { changeFriends( friend.name ) } }>
                                                <Image source = {deleteButton} style = { styles.button }/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style = {styles.friendsContainer}>
                        <Text style = {styles.title}>Other Users: </Text>
                        {
                            arrayOfOtherUsers.filter( ( user ) => { 
                                const reg: any =  RegExp(`^${finder}\w{0,}`); 
                                return user.name.match(reg) 
                            } ).map( (user: {name: string, isChoose: boolean }, index: number) => {
                                return(
                                    <View key = {index} style = {styles.frinedContainer}>
                                        <Text key = {index}>{user.name}</Text>
                                        <View style = {styles.buttonContainer}>
                                            <Checkbox
                                                color={`green`}
                                                uncheckedColor={`grey`}
                                                status={ user.isChoose ? 'checked' : 'unchecked'}
                                                onPress = { () => {changeCheck( user.name, index, 'other' ) } }
                                            />
                                            <TouchableOpacity onPress = { () => { startChat(user.name) } } >
                                                <Image source = {messageButton} style = { styles.button }/>
                                            </TouchableOpacity>
                                            <TouchableOpacity style = {styles.button} onPress = { () => { changeFriends( user.name ) } }>
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

    header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        marginBottom: 5
    },

    input: {
        padding: 5,
        width: '80%',
        borderBottomWidth: 1,
        borderRightWidth: 1,
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