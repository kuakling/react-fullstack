import config from 'kit/config';

import counter from './counter'
import media, { updateMedia } from './media'
import dialogMessage from './dialogMessage'
import toastMessages from './toastMessages'

const reducers = [
  { name: 'counter', fnc: counter, init: { count: 0 } },
  { name: 'media', fnc: media, init: !SERVER ? updateMedia() : {} },
  { name: 'dialogMessage', fnc: dialogMessage, init: {} },
  { name: 'toastMessages', fnc: toastMessages, init: [] },
]

reducers.map(reducer => {
  config.addReducer(reducer.name, reducer.fnc, reducer.init);
})