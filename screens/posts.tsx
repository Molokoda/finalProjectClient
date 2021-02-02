import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type MainProps = {
    navigation: any,
    userData: { login: string}
}

const Posts: React.FC<MainProps> = (props) => {
    return(
        <View style = {styles.container}>
                <Text>Hello, { props.userData.login } </Text>
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

export default Posts;