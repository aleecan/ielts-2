import { put, select } from 'redux-saga/effects'
import {
  Clipboard,
  Alert
} from 'react-native'
import { translation2text } from '../Lib/TranslationFormat'

export function * exportToClipboard (action) {
  const translationList = yield select(state => state.translationlist.translationList)
  let text = ''
  translationList.forEach( translation => {
    text += translation2text(translation) + '\n'
  })
  // console.info(text)
  Clipboard.setString(text)
  Alert.alert('','Already Exported To Clipboard')
}
