import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, Button, Text, TextInput, View, Alert, Platform } from "react-native";
import { Overlay } from 'react-native-elements';
import store from 'react-native-simple-store';
import uuid from 'react-native-uuid'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';

export default class DeckDetails extends Component {

    constructor(props) {
        super(props)

        this.state = {
            deck: props.route.params.deck,
            showForm: false,
            question: '',
            answer: ''
        }
    }

    componentDidMount() {
        const unsubscribe = this.props.navigation.addListener('focus', () => {
            this._reloadData()
        });
    }

    // componentWillUnmount() { unsubscribe }

    _reloadData = () => {
        store.get("decks").then(res => {
            const deck = Object.values(res).filter(d => d.id == this.state.deck.id)[0]
            this.setState({ deck })
        }).catch(err => console.log(err));
    }

    _toggleForm = () => {
        this.setState({ showForm: !this.state.showForm })
    }

    _saveNewQuestion = () => {
        if (this.state.question.length == 0 || this.state.answer.length == 0) {
            Alert.alert(
                "Erro",
                "Preencha os campos do formulário!"
            );

            return
        }

        const updatedDeck = {
            ...this.state.deck,
            questions: [
                ...this.state.deck.questions,
                {
                    id: uuid.v1(),
                    question: this.state.question,
                    answer: this.state.answer
                }
            ]
        }

        this._updateDecks(updatedDeck)
    }

    _updateDecks = updatedDeck => {
        store.get("decks").then(res => {
            const filteredDecks = Object.values(res).filter(d => d.id !== updatedDeck.id)
            const updatedDecks = [...filteredDecks, updatedDeck]
            store
                .save('decks', updatedDecks)
                .then(() =>
                    this.setState({
                        question: '',
                        answer: '',
                        showForm: false,
                        deck: updatedDeck
                    })
                )
        }).catch(err => console.log(err))
    }

    _deleteRow = data => {
        const updatedQuestions = this.state.deck.questions.filter(q => q.id != data.item.id)

        const updatedDeck = {
            ...this.state.deck,
            questions: updatedQuestions
        }

        this._updateDecks(updatedDeck)
    }

    render() {
        const { container, question, answer, input, largeInput, modal, title, cell, button } = styles
        return (
            <SafeAreaView style={container}>
                <SwipeListView
                    style={question}
                    disableRightSwipe
                    rightOpenValue={-75}
                    data={this.state.deck.questions}
                    renderItem={({ item }) =>
                        <View style={cell}>
                            <Text style={question}>Pergunta: {item.question}</Text>
                            <Text style={answer}>Resposta: {item.answer}</Text>
                            <View style={{backgroundColor: '#eeeeee', height: 0.5 }}/>
                        </View>
                    }
                    renderHiddenItem={ (data) => (
                        <View style={styles.rowBack}>
                        <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                            <Button 
                                color={Platform.OS === 'ios' ? 'white' : 'transparent'}
                                title={"Deletar"} 
                                onPress={() => this._deleteRow(data)} />
                        </View>
                    </View>
                    )}
                />
                <Button
                    onPress={this._toggleForm}
                    title="Novo"
                    color="#778899"
                />
                <Overlay
                    overlayStyle={modal}
                    isVisible={this.state.showForm}
                    onBackdropPress={this._toggleForm}>
                    <Text style={title}>Novo cartão</Text>
                    <TextInput
                        placeholder={'Pergunta'}
                        onChangeText={text => this.setState({ question: text })}
                        style={input} />
                    <TextInput
                        placeholder={'Resposta'}
                        multiline
                        onChangeText={text => this.setState({ answer: text })}
                        style={largeInput} />
                    <View style={{ flexDirection: 'row' }}>
                        {Platform.OS === 'ios' &&
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <TouchableOpacity onPressIn={this._toggleForm}>
                                    <Button title={"Cancelar"} color="#778899"/>
                                </TouchableOpacity>
                                <View style={{ flex: 1 }} />
                                <TouchableOpacity onPressIn={this._saveNewQuestion}>
                                    <Button title={"Salvar"} color="#778899"/>
                                </TouchableOpacity>
                            </View>
                        }
                        {Platform.OS === 'android' &&
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Button title={"Cancelar"} onPress={this._toggleForm} color="#778899"/>
                                <View style={{ flex: 1 }} />
                                <Button title={"Salvar"} onPress={this._saveNewQuestion} color="#778899"/>
                            </View>
                        }

                    </View>
                </Overlay>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    question: {
        fontSize: 18,
        height: 44,
        fontWeight: '600'
    },
    answer: {
        fontSize: 16,
        height: 44,
    },
    input: {
        height: 40,
        borderWidth: 0.5,
        width: 300,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
    },
    largeInput: {
        height: 40,
        borderWidth: 0.5,
        width: 300,
        height: 100,
        padding: 12,
        marginBottom: 10,
        borderRadius: 5
    },
    modal: {
        borderRadius: 10
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        marginVertical: 16
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#ff9999',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#ff9999',
        right: 0,
    },
    cell: { 
        paddingTop: 16,
        backgroundColor: 'white', 
        paddingHorizontal: 8 
    }
});