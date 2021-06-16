import React, { Component } from 'react';
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class Deck extends Component {

    render() {
        const { container, cell, title } = styles
        return (
            <View style={container}>
                <TouchableOpacity 
                    onPress={this.props.onPress}
                    style={cell}>
                    <Text style={title}>{this.props.name}</Text>
                    <Text>{this.props.details}</Text>
                </TouchableOpacity>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        width: "50%",
        height: 100,
        padding: 1
    },
    cell: {
        backgroundColor: Colors.light,
        margin: 2,
        padding: 30
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});