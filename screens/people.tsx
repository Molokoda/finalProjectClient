import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'

type MainProps = {
    userData: {login: string, friends: string[] },
    setUserData: any
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

    useEffect( () => {
        if(isLoading){
            (async() => {
                let response = await fetch('http://192.168.100.88:3000/users/allusers', {method: 'GET'});
                let arrayOfUser = await response.json();
                let arrayOfOtherUsers = arrayOfUser.filter( (user: {login: string}) => {
                    let answer = true;
                    if(props.userData.friends){
                        
                        let isFriend = props.userData.friends.find( (friend) => friend === user.login )
                        if(isFriend){
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
            <View style = {styles.container}>
                <View>
                    <Text>Friends: </Text>
                    { 
                        
                            props.userData.friends.map( (friend: string, index: number) => {
                                return(
                                    <View key = {index}>
                                        <Text key = {index}>{friend}</Text> 
                                        <Button title = 'delete' onPress = { () => { changeFriends( friend ) } } />
                                     </View>
                                )
                            } )
                        
                    }      
                </View>
                <View>
                    <Text>Other Users: </Text>
                    { 
                        arrayOfOtherUsers.map( (user: {login: string}, index: number) => {
                            return(
                                <View key = {index}>
                                    <Text key = {index}>{user.login}</Text> 
                                    <Button title = 'add' onPress = { () => { changeFriends( user.login ) } } />
                                </View>
                            )
                        } )
                    }       
                </View>
            </View>
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
});

export default People;