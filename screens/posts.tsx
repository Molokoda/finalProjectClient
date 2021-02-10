import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

type MainProps = {
    navigation: any,
    userData: { login: string, friends: string[], chats: { _id: string, users: string[] }[], avatar: string },
}

const like = require('../assets/like.png');
const liked = require('../assets/liked.png');
const comment = require('../assets/comment.png');

const Posts: React.FC<MainProps> = (props) => {

    const [arrayOfPosts, setArrayOfPosts] = useState([ {id: '', uri: '', date: '', author: '', likes: [''], comments: [ {author: '', date: '', text: ''} ] } ]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {
        ( async() => {
            let response = await fetch('http://192.168.100.88:3000/users/posts/friendsposts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(props.userData.friends)
            })
            let arrayOfPosts = await response.json();
            let correctFiledArray = [{id: '', uri: '', date: '', author: '', likes: [''], comments: [ {author: '', date: '', text: ''} ] }];
            arrayOfPosts.forEach( (element: {_id: string, author: string, date: string, path: string, likes: string[], comments: [ {author: string, date: string, text: string} ] }, index: number) => {
                correctFiledArray[index] = {
                  id: element._id,
                  uri: ('http://192.168.100.88:3000/public/images/' +  element.path.slice(42)),
                  date: element.date,
                  author: element.author,
                  likes: element.likes,
                  comments: element.comments
                }   
            });
            setArrayOfPosts( correctFiledArray );
            setIsLoading( false );
        })()
    });

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

    if(isLoading){
        return(
            <Text>Is loading</Text>
        )
    }
    else{
        return(
            <ScrollView>
                <View style = {styles.container}>
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
                                    <View key = {index}></View>
                                )
                            }
                            else{
                                return(
                                    <View key = {index} style = {styles.containerPost}>
                                        <View style = { styles.postHeader}>
                                        <Text>{post.author}</Text>
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
                                            <TouchableOpacity>
                                            <Image 
                                                style = { { width: 24, height: 16} } 
                                                source = {  comment } 
                                            />
                                            </TouchableOpacity>
                                            <Text> { post.comments.length } </Text>
                                        </View>
                                        </View>
                                    </View>
                                )
                            }
                            
                        } )
                    }
                </View>
            </ScrollView>
        )
    }
    
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

export default Posts;