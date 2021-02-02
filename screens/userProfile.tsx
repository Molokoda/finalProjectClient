import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Button, Platform, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
const axios = require('axios').default;


function getCurrentDate(){
  let time = new Date();
  let currentTime = `${time.getFullYear()}-${ Number(time.getMonth() ) + 1 }-${time.getDate()}-${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}`
  return currentTime;
}

function uuidv4() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

type MainProps = {
    userData: {login: string}
}

const UserProfile: React.FC<MainProps> = (props) => {

  const [arrayOfPosts, setArrayOfPosts] = useState([{id: '', uri: '', date: '', author: ''}]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();

    if(isLoading){
      ( async() => {
          let response = await fetch(`http://192.168.100.88:3000/users/posts/user?login=${props.userData.login}`, {
            method: 'GET'
          })
        let arrayofData = await response.json();
        let correctFiledArray = [{id: '', uri: '', date: '', author: ''}];
        arrayofData.forEach( (element: {_id: string, author: string, date: string, path: string }, index: number) => {
          correctFiledArray[index] = {
            id: element._id,
            uri: ('http://192.168.100.88:3000/public/images/' +  element.path.slice(42)),
            date: element.date,
            author: element.author

          }
        })
        setArrayOfPosts(correctFiledArray);
        setIsLoading(false);
      })();
      
    }
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
    let formData = new FormData();    
    if(!result.cancelled && arrayOfPosts[0].uri === ''){
      tempArray = [ {id: uuidv4().slice(0, 24), uri: result.uri, date: getCurrentDate(), author: props.userData.login } ]
      setArrayOfPosts(tempArray);
      let postData = {id: tempArray[tempArray.length - 1].id, date: tempArray[tempArray.length - 1].date, author: tempArray[tempArray.length - 1].author };
      for(let key in postData){
        formData.append(`${key}`, postData[key] )
      }
      formData.append( 'filedata', { type:'image/jpg', uri: result.uri , name:'userPost.jpg'  });
      fetch('http://192.168.100.88:3000/users/posts/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          
          body: formData
      })                
    }
    else if(!result.cancelled){
      tempArray.push( { id: uuidv4().slice(0, 24), uri: result.uri, date: getCurrentDate(), author: props.userData.login } );
      let postData = {id: tempArray[tempArray.length - 1].id, date: tempArray[tempArray.length - 1].date, author: tempArray[tempArray.length - 1].author };
      for(let key in postData){
        formData.append(`${key}`, postData[key] )
      }
      formData.append( 'filedata', { type:'image/jpg', uri: result.uri , name:'userPost.jpg'  });
      fetch('http://192.168.100.88:3000/users/posts/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          
          body: formData
      })  
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
    let formData = new FormData();   
    let tempArray = arrayOfPosts;
    if(!result.cancelled && arrayOfPosts[0].uri === ''){
      tempArray = [ {id: uuidv4().slice(0, 24), uri: result.uri, date: getCurrentDate(), author: props.userData.login } ]
      setArrayOfPosts(tempArray);
      let postData = {id: tempArray[tempArray.length - 1].id, date: tempArray[tempArray.length - 1].date, author: tempArray[tempArray.length - 1].author };
      for(let key in postData){
        formData.append(`${key}`, postData[key] )
      }
      formData.append( 'filedata', { type:'image/jpg', uri: result.uri , name:'userPost.jpg'  });
      fetch('http://192.168.100.88:3000/users/posts/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          
          body: formData
      })                
    }
    else if(!result.cancelled){
      tempArray.push( { id: uuidv4().slice(0, 24), uri: result.uri, date: getCurrentDate(), author: props.userData.login } );
      let postData = {id: tempArray[tempArray.length - 1].id, date: tempArray[tempArray.length - 1].date, author: tempArray[tempArray.length - 1].author };
      for(let key in postData){
        formData.append(`${key}`, postData[key] )
      }
      formData.append( 'filedata', { type:'image/jpg', uri: result.uri , name:'userPost.jpg'  });
      fetch('http://192.168.100.88:3000/users/posts/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          
          body: formData
      })  
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
              arrayOfPosts.slice(0).reverse().map( (post, index) => {
                  if(arrayOfPosts[0].uri === ''){
                    return(
                      <View key = {index} ></View>
                    )
                  }
                  else{
                    return(
                      <View key = {index}>
                        <Text>Author: {post.author}, date: { post.date }, id {post.id}</Text>
                        <Image  style = {{ width: 200, height: 100, resizeMode: 'cover'}} source={ {uri: post.uri} }/>
                      </View>
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