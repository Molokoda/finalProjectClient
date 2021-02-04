import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

type MainProps = {
    navigation: any,
    userData: { login: string, friends: string[] }
}

const Posts: React.FC<MainProps> = (props) => {

    const [arrayOfPosts, setArrayOfPosts] = useState([ {id: '', uri: '', date: '', author: '' } ]);
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
            let correctFiledArray = [{id: '', uri: '', date: '', author: '' }];
            arrayOfPosts.forEach( (element: {_id: string, author: string, date: string, path: string }, index: number) => {
                correctFiledArray[index] = {
                  id: element._id,
                  uri: ('http://192.168.100.88:3000/public/images/' +  element.path.slice(42)),
                  date: element.date,
                  author: element.author
                }   
            });
            setArrayOfPosts( correctFiledArray );
            setIsLoading( false );
        })()
    });

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
                            return(
                                <View key = {index}>
                                <Text>Author: {post.author}, date: { post.date }, id {post.id}</Text>
                                <Image  style = {{ width: 200, height: 100, resizeMode: 'cover'}} source={ {uri: post.uri} }/>
                                </View>
                            )
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
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default Posts;