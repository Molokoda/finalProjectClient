import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Button, Platform, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

const like = require('../assets/like.png');
const liked = require('../assets/liked.png');
const comment = require('../assets/comment.png');
const close = require('../assets/delete.png');


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
  userData: { login: string, friends: string[], chats: { _id: string, users: string[] }[], avatar: string },
  setArrayOfComments: any,
  navigation: any,
}

const UserProfile: React.FC<MainProps> = (props) => {

  const [arrayOfPosts, setArrayOfPosts] = useState( [ {id: '', uri: '', date: '', author: '', likes: [''], comments: [ {author: '', date: '', text: ''} ] } ] );
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
        let correctFiledArray = [ {id: '', uri: '', date: '', author: '', likes: [''], comments: [ {author: '', date: '', text: ''} ] } ];
        arrayofData.forEach( (element: {_id: string, author: string, date: string, path: string, likes: string[], comments: [ {author: string, date: string, text: string} ] }, index: number) => {
          correctFiledArray[index] = {
            id: element._id,
            uri: ('http://192.168.100.88:3000/public/images/' +  element.path.slice(42)),
            date: element.date,
            author: element.author,
            likes: element.likes,
            comments: element.comments
          }
        })
        setArrayOfPosts(correctFiledArray);
        setIsLoading(false);
      })();
      
    }
  }, [isLoading]);

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
      tempArray = [ {
        id: uuidv4().slice(0, 24), 
        uri: result.uri, 
        date: getCurrentDate(), 
        author: props.userData.login,
        likes: [],
        comments: []
      } ]
      setArrayOfPosts(tempArray);
      let postData = {
        id: tempArray[tempArray.length - 1].id, 
        date: tempArray[tempArray.length - 1].date, 
        author: tempArray[tempArray.length - 1].author,
        likes: tempArray[tempArray.length - 1].likes,
        comments: tempArray[tempArray.length - 1].comments,
      };
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
      tempArray.push( { 
        id: uuidv4().slice(0, 24), 
        uri: result.uri, 
        date: getCurrentDate(), 
        author: props.userData.login,
        likes: [],
        comments: []
      } );
      let postData = {
        id: tempArray[tempArray.length - 1].id, 
        date: tempArray[tempArray.length - 1].date, 
        author: tempArray[tempArray.length - 1].author,
        likes: tempArray[tempArray.length - 1].likes,
        comments: tempArray[tempArray.length - 1].comments,
      };
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
      setIsLoading(true);
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
      tempArray = [ {
        id: uuidv4().slice(0, 24),
        uri: result.uri, 
        date: getCurrentDate(), 
        author: props.userData.login, 
        likes: [],
        comments: []
      }]  
      setArrayOfPosts(tempArray);
      let postData = {
        id: tempArray[tempArray.length - 1].id, 
        date: tempArray[tempArray.length - 1].date, 
        author: tempArray[tempArray.length - 1].author,
        likes: tempArray[tempArray.length - 1].likes,
        comments: tempArray[tempArray.length - 1].comments,
      };
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
      tempArray.push( { 
        id: uuidv4().slice(0, 24), 
        uri: result.uri, 
        date: getCurrentDate(), 
        author: props.userData.login,
        likes: [],
        comments: []
      } );
      let postData = {
        id: tempArray[tempArray.length - 1].id, 
        date: tempArray[tempArray.length - 1].date, 
        author: tempArray[tempArray.length - 1].author,
        likes: tempArray[tempArray.length - 1].likes,
        comments: tempArray[tempArray.length - 1].comments,
      };
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
      setIsLoading(true);
      setArrayOfPosts(tempArray);
    }

  }
  
  const deletePost = async(postIDForDelete: string, path: string) => {
    console.log(postIDForDelete);
    let temp = arrayOfPosts;
    let isDeleteFriendFind = false;
    for(let i = 0; i < temp.length - 1; i++){
        if( temp[i].id === postIDForDelete || isDeleteFriendFind){
          temp[i] = temp[ i + 1 ];
          isDeleteFriendFind = true;
        }
    }
    temp.length = temp.length - 1;
    await fetch('http://192.168.100.88:3000/users/posts/delete', {
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json;charset=utf-8'
      },

      body: JSON.stringify( { id: postIDForDelete, path: path} )
    })
    setArrayOfPosts(temp);
  }

  const likePost = async( arrayOfUsers: string[], postNumber: number) => {
    let temp = arrayOfPosts;
    postNumber = temp.length - postNumber - 1;
    if( arrayOfUsers.find( (user) => props.userData.login === user)){
      let isDeleteFind = false;
      for( let i = 0; i < temp[postNumber].likes.length - 1; i++){
        if( temp[postNumber].likes[i] === props.userData.login || isDeleteFind){
          temp[postNumber].likes[i] = temp[postNumber].likes[ i + 1 ];
          isDeleteFind = true;
        }
      }
      temp[postNumber].likes.length -= 1;
    }
    else{
      temp[postNumber].likes.push(props.userData.login);
      
      
    }
    await fetch( 'http://192.168.100.88:3000/users/posts/dislike', {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json; charset = utf-8'
        },
        body: JSON.stringify( {id: temp[postNumber].id, likes: temp[postNumber].likes} )
    })
    setArrayOfPosts( temp );
    setIsLoading(true);
  }

  const goToComments = (comments: { author: string, data: string, text: string}[], postID: string) => {
    props.setArrayOfComments( { comments: comments, postID: postID} );
    props.navigation.navigation.navigate('comments');
  }

  return(
    <ScrollView>
      <View style = {styles.container}>
          <Text>{props.userData.login}</Text>
          <Button title = 'add post from gallery' onPress = { takePhotoFromLibrary }/>
          <Button title = 'add post from camera' onPress = { takePhotoFromCamera }/>
          <View>
              { 
              arrayOfPosts.slice(0).reverse().map( (post, index) => {
                  let picture;
                  if( post.likes.find( (user) => {return props.userData.login === user} ) ){
                    picture = liked;
                  }
                  else{
                    picture = like;
                  }
                  if(arrayOfPosts[0].uri === ''){
                    return(
                      <View key = {index} ></View>
                    )
                  }
                  else{
                    return(
                      <View key = {index} style = {styles.containerPost}>
                        <View style = { styles.postHeader}>
                          <Text>{post.author}</Text>
                          <TouchableOpacity onPress = { () => { deletePost( post.id, post.uri ) } } >
                            <Image style = { { width: 16, height: 16 } } source = { close } />
                          </TouchableOpacity>
                        </View>
                        <Image  style = {{ width: 200, height: 100, resizeMode: 'cover'}} source={ {uri: post.uri} }/>
                        <View style = {styles.postFooter}>
                          <Text>{ post.date } </Text>
                          <View style = {styles.like}>
                            <TouchableOpacity onPress = { () => { likePost( post.likes, index ) } }>
                              <Image 
                                style = { { width: 16, height: 16}} 
                                source = { picture }
                              />
                            </TouchableOpacity>
                            <Text> { post.likes.length } </Text>
                            <TouchableOpacity onPress = { () => { goToComments(post.comments, post.id) } } >
                              <Image 
                                style = { { width: 24, height: 16} } 
                                source = {  comment } 
                              />
                            </TouchableOpacity >
                            <Text> { post.comments.length } </Text>
                          </View>
                        </View>
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
      paddingBottom: 100,
      backgroundColor: '#fff',
      alignItems: 'center',
      
    },
    
    postHeader: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 200,
    },

    containerPost: {
      flex: 1,
      paddingLeft: 0,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
    },

    postFooter: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignContent: 'center',
      alignItems: 'center',
      width: 200,
      justifyContent: 'space-between'
    },

    like: {
      flex: 1,
      flexDirection: 'row',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }
});

export default UserProfile;