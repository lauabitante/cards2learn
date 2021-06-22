import React, { Component } from 'react';
import { StyleSheet } from "react-native";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DeckList from './screens/DeckList';
import DeckDetails from './screens/DeckDetails';
import Quiz from './screens/Quiz';
import store from 'react-native-simple-store';
import { Icon } from 'react-native-elements'
import defaultDecks from './default_decks.json';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
export default class App extends Component {

    componentDidMount() {
        // store.save("preferences", null)

        store.get("preferences").then(res => {    
            if (res == null) {
                console.log("Ainda nao carregou perguntas default")
                store.save('decks', defaultDecks)
                store.save("preferences", { loadedDefaultDecks: true })
            }
          }).catch(err => console.log(err));
        
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
                            headerRight: () => <Icon
                                iconStyle={{ marginRight: 8 }}
                                name="gear"
                                size={30}
                                type='evilicon'
                                onPress={() => navigation.navigate('DeckDetails', {
                                    deck: route.params.deck,
                                    name: route.params.deck.name
                                })} />
                        })}
                    />
                    <Stack.Screen name="DeckDetails"
                        component={DeckDetails}
                        options={({ route, navigation }) => ({
                            title: route.params.name,
                            headerRight: () => <Icon
                                iconStyle={{ marginRight: 8 }}
                                name="trash"
                                size={30}
                                type='evilicon'
                                onPress={() => {
                                    
                                    store.get("decks").then(res => {
                                        const remainingDecks = Object.values(res).filter(d => d.id !== route.params.deck.id)
                                        store.save('decks', remainingDecks)
                                    }).then(() => navigation.navigate('DeckList'))
                                }} />
                        })}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
};

const styles = StyleSheet.create({});