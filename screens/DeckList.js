import React, { Component } from 'react';
import { StyleSheet, Alert, SafeAreaView, FlatList, Platform } from "react-native";
import Deck from "../widgets/Deck.js"
import uuid from 'react-native-uuid'
import store from 'react-native-simple-store';
import Dialog from "react-native-dialog";
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class DeckList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            decks: [{ addNew: true }],
            isAdding: false,
            newDeckName: ''
        }
        // store.delete("decks");
    }

    componentDidMount() {
        this._reloadData()

        const unsubscribe = this.props.navigation.addListener('focus', () => {
            this._reloadData()
        });
    }

    // componentWillUnmount() { unsubscribe }

    _reloadData = () => {
        store.get("decks").then(res =>
            this.setState({
                decks: [...res, { addNew: true }],
                newDeckName: '',
                isAdding: false
            })
        );
    }

    _saveDeck = (name) => {
        if (name.length == 0) {
            Alert.alert(
                "Erro",
                "Informe um nome válido!"
            );

            return
        }

        store
            .push('decks', { id: uuid.v1(), name, questions: [] })
            .then(() => this._reloadData())
    }

    _tapAddNewDeck = () => {
        if (Platform.OS === 'ios') {
            Alert.prompt(
                "Novo baralho",
                "",
                [
                  {
                    text: "Cancelar",
                    style: "cancel"
                  },
                  {
                    text: "Salvar",
                    onPress: name => this._saveDeck(name)
                  }
                ],
              );
        } else {
            this.setState({ isAdding: true })
        }
    }

    //Android Alert ----
    _handleSubmit = () => {
        this._saveDeck(this.state.newDeckName)
    }

    _handleCancel = () => {
        this.setState({ isAdding: false, newDeckName: '' })
    };
    //-----------------

    render() {
        const { container, item } = styles
        return (
            <SafeAreaView style={container}>
                <Dialog.Container visible={this.state.isAdding} onBackdropPress={this._handleCancel}>
                <Dialog.Title>Novo baralho</Dialog.Title>
                <Dialog.Input
                    value={this.state.newDeckName}
                    onChangeText={name => this.setState({ newDeckName: name })} />
                <Dialog.Button label="Cancelar" onPress={this._handleCancel} />
                <Dialog.Button label="Salvar" onPress={this._handleSubmit} />
            </Dialog.Container>
                <FlatList
                    numColumns={2}
                    style={item}
                    data={this.state.decks}
                    renderItem={({ item }) => {
                        if (item.addNew) {
                            return (
                                <Deck
                                    name={"Criar baralho"}
                                    deckStyle={{ backgroundColor: "#b0c4de" }}
                                    details={" "}
                                    onPress={this._tapAddNewDeck} />
                            );
                        }
                        return (
                            <Deck
                                name={item.name}
                                details={`Perguntas: ${item.questions.length}`}
                                onPress={() => this.props.navigation.navigate('Quiz', {
                                    deck: item,
                                    name: item.name
                                })} />
                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            </SafeAreaView>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});