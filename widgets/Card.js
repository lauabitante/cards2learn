import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import FlipCard from 'react-native-flip-card'

export default class Card extends Component {

    state = { reveal: false }

    _onPressButton = () => {
        this.setState({ reveal: !this.state.reveal })
    }

    render() {
        const { container, questionText, answerText, button } = styles
        const { question, answer } = this.props.card
        return (
            <View style={container}>
                <FlipCard
                    flip={this.state.reveal}
                    flipHorizontal={true}
                    flipVertical={false}>
                    <View style={styles.face}>
                        <Text style={questionText}>{question}</Text>
                        <TouchableOpacity onPressIn={this._onPressButton}>
                            <Text style={button}>Revelar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.back}>
                        <Text style={answerText}>{answer}</Text>
                        <TouchableOpacity onPressIn={this._onPressButton}>
                            <Text style={button}>Esconder</Text>
                        </TouchableOpacity>
                    </View>
                </FlipCard>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        position: 'absolute',
        width: '100%',
        height: 400,
    },
    questionText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    answerText: {
        fontSize: 20,
    },
    face: {
        flex: 1,
        padding: 20,
        backgroundColor: "#E8E8E8",
        borderColor: '#A8A8A8',
        borderWidth: 1,
        borderRadius: 10
    },
    back: {
        flex: 1,
        padding: 20,
        backgroundColor: "#E8E8E8",
        borderColor: '#A8A8A8',
        borderWidth: 1,
        borderRadius: 10
    },
    button: {
        paddingVertical: 10, 
        color: '#555'
    }
});