import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type MainProps = {
    navigation: any,
    userData: { name: string}
}

const Main: React.FC<MainProps> = (props) => {
    return(
        <View style = {styles.container}>
            <Text>Hello, { props.userData.name} </Text>
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

export default Main;