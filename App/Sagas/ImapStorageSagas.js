import { put, select } from 'redux-saga/effects'
import {
  Clipboard,
  Alert
} from 'react-native'
import RNMonaImap from 'react-native-mona-imap'
import ImapStorageActions from '../Redux/ImapStorageRedux'

export function * getMessages (action) {
  const { emailAccount } = yield select(state => state.imapstorage)
  if(!emailAccount) {
    return
  }
  const init = yield RNMonaImap.initEmailAccount(emailAccount)
  const messages = yield RNMonaImap.getMessages()
  // console.info(messages)
  yield put(ImapStorageActions.getMessagesSuccess(messages))
}

async function _sendMessage(message = {subject: '', content: '', messageId: ''}) {
  const resp = await RNMonaImap.sendMessage(message)
  // console.info(resp)
  resp === true ? Alert.alert('', 'Successfully Saved') : Alert.alert('', 'Save Failed')
}

export function * sendMessage (action) {
  const translationList = yield select(state => state.translationlist.translationList)
  const messageId = yield select(state => state.translationlist.messageId)
  let text = ''
  let subject = ''
  translationList.forEach( translation => {
    if(!subject) subject = translation.ch
    text += `${translation.ch}\n${translation.en}\n${translation.remarks}\n\n`
  })
  _sendMessage({
    subject: subject,
    content: text,
    messageId: messageId
  })
}

export function * initEmailAccount({emailAccount}) {
  const init = yield RNMonaImap.initEmailAccount(emailAccount)
  if( init === true ) {
    yield put(ImapStorageActions.initEmailAccountSuccess(emailAccount))
    Alert.alert('', 'Email Account Init Successfully')
  } else {
    yield put(ImapStorageActions.initEmailAccountFail(init))
    Alert.alert('', init)
  }
}

export function * deleteMessage({messageId}) {
  const resp = yield RNMonaImap.deleteMessage(messageId)
  if(resp === true) {
    yield put(ImapStorageActions.deleteMessageSuccess())
  } else {
    yield put(ImapStorageActions.deleteMessageFail(resp))
    Alert.alert('Delete Failed', resp)
  }
}
