// @flow

import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getMessages: null,
  getMessagesSuccess: ['messages'],
  getMessagesFail: ['errorMessage'],

  sendMessage: null,
  sendMessageSuccess: null,
  sendMessageFail: ['errorMessage'],

  initEmailAccount: ['emailAccount'],
  initEmailAccountSuccess: ['emailAccount'],
  initEmailAccountFail: ['errorMessage']
})

export const ImapStorageTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  messages: [],

  emailAccountInited : false,
  emailAccount: null,

  brandList: ['126.com', '163.com', 'gmail.com'],

  fetching: false,
  errorMessage: ''
})

/* ------------- Reducers ------------- */
const getMessages = state => state.merge({fetching: true})
const getMessagesSuccess = (state, {messages}) => state.merge({fetching: false, messages})
const getMessagesFail = (state, {errorMessage}) => state.merge({fetching: false, errorMessage})

const sendMessage = state => state.merge({fetching: true})
const sendMessageSuccess = state => state.merge({fetching: false})
const sendMessageFail = (state, {errorMessage}) => state.merge({fetching: false, errorMessage})

const initEmailAccount = state => state.merge({fetching: true})
const initEmailAccountSuccess = (state, {emailAccount}) => state.merge({emailAccount, emailAccountInited: true})
const initEmailAccountFail = (state, {errorMessage}) => state.merge({errorMessage, emailAccountInited: false})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_MESSAGES]: getMessages,
  [Types.GET_MESSAGES_SUCCESS]: getMessagesSuccess,
  [Types.GET_MESSAGES_FAIL]: getMessagesFail,

  [Types.SEND_MESSAGE]: sendMessage,
  [Types.SEND_MESSAGE_SUCCESS]: sendMessageSuccess,
  [Types.SEND_MESSAGE_FAIL]: sendMessageFail,

  [Types.INIT_EMAIL_ACCOUNT]: initEmailAccount,
  [Types.INIT_EMAIL_ACCOUNT_SUCCESS]: initEmailAccountSuccess,
  [Types.INIT_EMAIL_ACCOUNT_FAIL]: initEmailAccountFail
})
