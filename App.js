import React, { Component } from 'react';
import { StyleSheet, Button } from "react-native";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DeckList from './screens/DeckList';
import DeckDetails from './screens/DeckDetails';
import Quiz from './screens/Quiz';
import store from 'react-native-simple-store';
import { RotationGestureHandler } from 'react-native-gesture-handler';

const Stack = createStackNavigator();
export default class App extends Component {

    componentDidMount() {
        // store.delete("decks");
    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="DeckList"
                        component={DeckList}
                        options={{ title: 'Cards2Learn' }}
                    />
                    <Stack.Screen name="Quiz" 
                        component={Quiz} 
                        options={({ route, navigation }) => ({ 
                            title: route.params.name, 
                            headerRight: () => <Button 
                                                    title={"Detalhes"} 
                                                    onPress={() => navigation.navigate('DeckDetails', {
                                                        deck: route.params.deck,
                                                        name: route.params.deck.name
                                                    })}/>
                            })}
                    />
                    <Stack.Screen name="DeckDetails" 
                        component={DeckDetails} 
                        options={({ route, navigation }) => ({ 
                            title: route.params.name,
                            headerRight: () => <Button 
                            title={"Deletar"} 
                            onPress={() => {
                                store.get("decks").then(res => {
                                    if (res) { 
                                        const decks = Object.values(res).filter(d => d.id != route.params.deck.id)
                                        store.save('decks', decks)
                                        navigation.popToTop()
                                    }
                                });
                            }}/>
                        })}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
};

const styles = StyleSheet.create({ });