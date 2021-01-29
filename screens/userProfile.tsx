import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Button, Platform, Image } from 'react-native'
//import ImagePicker from 'react-native-image-crop-picker';

import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
type MainProps = {
    
}

const UserProfile: React.FC<MainProps> = (props) => {

    const [arrayOfPosts, setArrayOfPosts] = useState(['']);

    useEffect(() => {
      (async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }, []);

    useEffect(() => {
      (async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }, []);

    const takePhotoFromLibrary = async() => {
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      let tempArray = arrayOfPosts;
      if(!result.cancelled && arrayOfPosts[0] === ''){
        setArrayOfPosts([result.uri]);
        
      }
      else if(!result.cancelled){
        tempArray.push(result.uri);
        setArrayOfPosts(tempArray);
      }
    }

    const takePhotoFromCamera = async() => {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      let tempArray = arrayOfPosts;
      if(!result.cancelled && arrayOfPosts[0] === ''){
        setArrayOfPosts([result.uri]);        
      }
      else if(!result.cancelled){
        tempArray.push(result.uri);
        setArrayOfPosts(tempArray);
      }

      
    }
    
    
    return(
      <ScrollView>
        <View style = {styles.container}>
            <Text>It will be UserProfile </Text>
            <Button title = 'add post from gallery' onPress = { takePhotoFromLibrary }/>
            <Button title = 'add post from camera' onPress = { takePhotoFromCamera }/>
            <View>
                { 
                arrayOfPosts.map( (post, index) => {
                    if(arrayOfPosts[0] === ''){
                      return(
                        <View key = {index} ></View>
                      )
                    }
                    else{
                      return(
                        <Image key = {index} style = {{ width: 200, height: 100, resizeMode: 'cover'}} source={ {uri: post} }/>
                      )
                    }
                    
                  })
                }
            </View>
        </View>
      </ScrollView>
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

export default UserProfile;