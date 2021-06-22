/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import store from 'react-native-simple-store';
import defaultDecks from './default_decks.json';

AppRegistry.registerRunnable(appName, async initialProps => {
    try {

        // store.save("didLoadDefaultDecks", null) // uncomment to reset default decks
        store.get("didLoadDefaultDecks").then(res => {    
            if (res == null) {
                store.save('decks', defaultDecks)
                store.save("didLoadDefaultDecks", true)
            }
          })
          .then(() => {
            AppRegistry.registerComponent(appName, () => App);
            AppRegistry.runApplication(appName, initialProps);
          })
          .catch(err => console.log(err));
    
    } catch (err) {
      console.log(err);
    }
  });
