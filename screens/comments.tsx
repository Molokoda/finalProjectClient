import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const window = Dimensions.get('window');

function getCurrentDate(){
    let time = new Date();
    let currentTime = `${time.getFullYear()}-${ Number(time.getMonth() ) + 1 }-${time.getDate()}-${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}`
    return currentTime;
}

type CommentProps = {
    arrayOfComments:  { comments: {author: string, data: string,  text: string, avatar: string}[], postID: string  },
    userData: { login: string, friends: string[], chats: { _id: string, users: string[] }[], avatar: string },
}

const Comments: React.FC<CommentProps> = (props) => {
    let reset: any;
    const [comment, setComment] = useState('');
    const [comments,  setComments] = useState(props.arrayOfComments.comments);

    useEffect( () => {
        console.log(comments);
    },[comments])

    const addNewComment = async( newComment: string ) => {
        if(newComment === ''){
            alert('Empty comment is not allowed');
        }
        else{
            let newFullCommnet = {author: props.userData.login, data: getCurrentDate(), text: newComment, avatar: ''} 
            await fetch('http://192.168.100.88:3000/users/posts/addcomment', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json;charset=utf-8'
                },
                body: JSON.stringify( { id: props.arrayOfComments.postID, comment: newFullCommnet } )
            });
            let temp = comments;
            temp.push(newFullCommnet);
            setComments(temp);
            console.log(comments);
            reset.clear();
        }
        
    }

    return(
            <View style = {styles.container} >
                 <ScrollView>
                    <View style = {styles.container}>
                        { comments.map( ( comment, index ) => {
                            return(
                                <View key = {index} style = {styles.commentContainer}>
                                    <View>

                                    </View>

                                    <View>
                                        <View style = {styles.commentHeader}>
                                            <Text> Author: {comment.author} </Text>
                                            <Text> Date: {comment.data}</Text>
                                        </View>
                                        <Text> Comment: {comment.text}</Text>
                                    </View>
                                </View>
                            )
                        }) }
                    </View>
                </ScrollView>
                <View style = {styles.inputWrapper}>
                    <TextInput ref = { input => reset = input}  style = { styles.input } placeholder = {'Your comment'} onChangeText = { (event) => { setComment(event) } }/>
                    <TouchableOpacity style = { styles.button } onPress = { () => { addNewComment( comment ) } } >
                        <Text>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
      
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: window.width   
    },
    

    inputWrapper: {
        flexDirection: 'row',
    },

    input: {
        backgroundColor: '#fff',
        width: '80%',
        paddingLeft: 5
    },

    commentContainer: {
        padding: 10,
        borderBottomWidth: 1
    },

    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    button: {
        width: '20%',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'skyblue',
    }
});

export default Comments;