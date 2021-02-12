import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {io} from 'socket.io-client'

const socket = io('http://192.168.100.88:3000');



type ChatProps = {
    chatInfo: { _id: string, users: string[] },
    userData: { login: string, friends: string[], chats: { _id: string, users: string[] }[], avatar: string },
}

const Chat: React.FC<ChatProps> = (props) => {
  const [messages, setMessages] = useState([ { _id: 0, text: '', createdAt: new Date(), user: { _id: 1, name: '', avatar: ''}} ]);
  const [isMessagesGet, setIsMessagesGet] = useState(false);

  
  useEffect(() => {      
    socket.on(`${props.chatInfo._id}::${props.userData.login}`, (data) => {
      console.log('somedata', data);
      setMessages(previousMessages => GiftedChat.append(previousMessages, data.message));
      socket.removeListener(`${props.chatInfo._id}::${props.userData.login}`, data); 
    } ); 

    if( !isMessagesGet){
      
      ( async() => {
        let response = await fetch(`http://192.168.100.88:3000/users/chats/getchat?_id=${props.chatInfo._id}`, {
          method: 'GET',
        });
        let arrayOfMessages = await response.json();
        console.log(arrayOfMessages.messages);
        if(arrayOfMessages.messages.length > 0){
          arrayOfMessages.messages.map( ( message ) => {
            setMessages(previousMessages => GiftedChat.append(previousMessages, message))
          })
        }
        setIsMessagesGet(true);
      } )()
    }
  }, [])
  
  const onSend = useCallback((messages = []) => {
    console.log(messages);
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    ( async() => {
      await fetch('http://192.168.100.88:3000/users/chats/addmessage', {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json;charset=utf-8'
        },
        body: JSON.stringify( {_id: props.chatInfo._id, message: messages} )  
      })
    })();
    console.log('send');
    socket.emit( 'private', { 
        _id: props.chatInfo._id, 
        to: (props.userData.login === props.chatInfo.users[1] ? props.chatInfo.users[0] : props.chatInfo.users[1] ),
        message: messages 
      } );
  }, [])
  
  return (
    <GiftedChat
      messages = {messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: props.userData.login,
      }}
    />
  )
}

  export default Chat;