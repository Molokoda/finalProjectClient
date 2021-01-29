import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type MainProps = {
    
}

const Chats: React.FC<MainProps> = (props) => {
    return(
        <View style = {styles.container}>
            <Text>It will be Chats </Text>
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
});

export default Chats;