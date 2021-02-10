import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import { RawButton, TouchableOpacity } from 'react-native-gesture-handler';


const toChat = require('../assets/toChat.png');
const window = Dimensions.get('window');

type MainProps = {
    userData: { login: string, friends: string[], chats: { _id: string, users: string[] }[], avatar: string },
    setUserData: any,
    setChatInfo: any,
    navigation: any
}

const Chats: React.FC<MainProps> = (props) => {

    const goToChat = (chat: { _id: string, users: string[] }) => {
        props.setChatInfo( chat );
        props.navigation.navigation.navigate('chat');
    }

    return(
        <View style = {styles.container}>
            <View style = {styles.chatsPreviewContainer}>
                {
                    props.userData.chats.map( (chat, index) => {
                        return(
                            
                            <View style = {styles.chatPreviewContainer} key = {index}>
                                <Text>Members: {chat.users[0] } , { chat.users[1] }</Text>
                                <TouchableOpacity onPress = { () => { goToChat( chat ) } } >
                                    <Image source = {toChat} style = { styles.button } />
                                </TouchableOpacity>
                            </View>
                        
                        )
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        width: window.width
    },

    chatsPreviewContainer: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        width: window.width
    },

    chatPreviewContainer: {
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: window.width,
        borderBottomWidth: 1,
    },

    button: {
        width: 32, 
        height: 32,
    },
});

export default Chats;