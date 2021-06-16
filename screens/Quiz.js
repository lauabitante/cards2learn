import React, { Component, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Button
} from 'react-native';
import uuid from 'react-native-uuid'

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import store from 'react-native-simple-store';

import TinderCard from 'react-tinder-card';
import Card from '../widgets/Card.js';

export default class Quiz extends Component {

  constructor(props) {
    super(props)

    this.state = {
      deck: props.route.params.deck,
      toReview: [],
      answered: [],
      isReviewing: false
    }
  }

  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', () => {
      this._reloadData()
    });
  }

  _reloadData = () => {
    store.get("decks").then(res => {
      const deck = Object.values(res).filter(d => d.id == this.state.deck.id)[0]
      this.setState({ deck })
    }).catch(err => console.log(err));
  }

  _remove = (dir) => {
    const cardsLeft = this.state.isReviewing 
    ? this._dataSource()
    : this._dataSource().filter(card => !this.state.answered.find(c => c.id === card.id))

    if (cardsLeft.length) {
      const card = cardsLeft[cardsLeft.length - 1]
      const index = this._dataSource().map(c => c.id).indexOf(card.id) 
      this._onSwipe(dir, card)
      this._dataSource()[index].current.swipe(dir)
    }
  }

  _onSwipe = (direction, card) => {
    const filteredCardsToReview = this.state.toReview.filter(c => c.id !== card.id)
    if (direction === 'left') {
      this.setState({ toReview: [card, ...filteredCardsToReview], answered: [...this.state.answered, card]  })
    } else if (this.state.isReviewing) {
      this.setState({ toReview: [...filteredCardsToReview]})
    } else {
      this.setState({ answered: [...this.state.answered, card]})
    }
  }

  _toggleReview = () => {
    this.setState({ isReviewing: !this.state.isReviewing, answered: [] })
  }

  _dataSource = () => {
    return this.state.isReviewing
      ? this.state.toReview
      : this.state.deck.questions
  }

  _hasNoQuestions = () => !this.state.isReviewing && (this._dataSource() && this._dataSource().length == 0)

  _navigateToDetails = () => {
    this.props.navigation.navigate('DeckDetails', {
      deck: this.state.deck,
      name: this.state.deck.name
    })
  }

  _content = () => {
    if (this._hasNoQuestions()) {
      return (
        <View style={styles.noQuestionsContainer}>
          <Text style={styles.centeredText}>Sem perguntas cadastradas!</Text>
          <Button
            onPress={this._navigateToDetails}
            title={"Toque para cadastrar"} />
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          {this._dataSource() && this._dataSource().map((card, index) =>
            <TinderCard
              ref={this._dataSource()[index]}
              key={this.state.isReviewing ? `r_${index}_${card.id}` : card.id}
              onSwipe={(dir) => this._onSwipe(dir, card)}
              preventSwipe={['up', 'down']}>
              <Card style={styles.card}
                key={this.state.isReviewing ? `r_${index}_${card.id}` : card.id}
                card={card}
              />
            </TinderCard>)
          }
        </View >
      )
    }
  }

  _reviewButton = () => {
    if (this._hasNoQuestions()) { return }

    return (
      <Button
        style={styles.reviewButton}
        onPress={this._toggleReview}
        title={this.state.isReviewing
          ? "Responder questões"
          : "Revisar"} />)
  }

  render() {
    return (
      <SafeAreaView style={styles.screen}>
        {this._content()}
        <View style={{ flex: 1 }}>
        <View style={styles.buttons}>
            <Button onPress={() => this._remove('left')} title='Não sei!' />
            <View style={{ flex: 1 }} />
            <Button onPress={() => this._remove('right')} title='Já sei!' />
          </View>
          {this._reviewButton()}
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
  container: {
    flex: 3
  },
  centeredText: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center'
  },
  noQuestionsContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20
  },
  reviewButton: {
    alignItems: 'flex-end',
    padding: 20
  }
});