import { put, select } from 'redux-saga/effects'
import {
  Clipboard,
  Alert
} from 'react-native'

export function * exportToClipboard (action) {
  const translationList = yield select(state => state.translationlist.translationList)
  let text = ''
  translationList.forEach( translation => {
    text += `${translation.ch}\n${translation.en}\n${translation.remarks}\n\n`
  })
  console.info(text)
  Clipboard.setString(text)
  Alert.alert('','Already Exported To Clipboard')
}
