// @flow

import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  toggleAddModal: null,
  toggleMenu: null,
  addTranslation: ['translation', 'messageId'],
  exportToClipboard: null,
  clearList: null,
  deleteTranslation: ['translation'],
  moveToTop: ['translation'],
  toggleCollapsed: ['translation'],
  toggleChecked: ['translation']
})

export const TranslationListTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  addModalVisible: false,
  menuVisible: false,
  messageId: '',
  translationList: [
    {
      en: 'He really aggravates me when he yells at me like that.',
      ch: '他这样吼我，实在太让我恼火了。',
      remarks: 'when',
      collapsed: true,
      checked: false
    }
  ]
})

/* ------------- Reducers ------------- */
const toggleAddModal = state => state.merge({
  addModalVisible: !state.addModalVisible
})

const toggleMenu = state => state.merge({
  menuVisible: !state.menuVisible
})

const addTranslation = (state, {translation, messageId}) => {
  let translationList = state.translationList.asMutable()
  Array.isArray(translation) ? translationList = translationList.concat(translation) : translationList.push(translation)
  return state.merge({translationList, messageId: messageId || state.messageId})
}

const deleteTranslation = (state, {translation}) => {
  let translationList = state.translationList.asMutable()
  let index = translationList.indexOf(translation)
  if(index > -1) {
    translationList.splice(index, 1)
    return state.merge({translationList})
  }
  return state
}

const moveToTop = (state, {translation}) => {
  let translationList = state.translationList.asMutable()
  let index = translationList.indexOf(translation)
  if(index > -1) {
    translationList.splice(index, 1)
  }
  translationList.unshift(translation)
  return state.merge({translationList})
}

const toggleCollapsed = (state, {translation}) => {
  let translationList = state.translationList.asMutable()
  let index = translationList.indexOf(translation)
  if(index > -1) {
    translationList.splice(index, 1)
    translation = translation.set('collapsed', !translation.collapsed)
    translationList.splice(index, 0, translation)
    return state.merge({translationList})
  }
  return state
}

const toggleChecked = (state, {translation}) => {
  let translationList = state.translationList.asMutable()
  let index = translationList.indexOf(translation)
  if(index > -1) {
    translationList.splice(index, 1)
    translation = translation.set('checked', !translation.checked)
    translationList.splice(index, 0, translation)
    return state.merge({translationList})
  }
  return state
}

const clearList = state => state.merge({translationList: [], messageId: ''})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TOGGLE_ADD_MODAL]: toggleAddModal,
  [Types.ADD_TRANSLATION]: addTranslation,
  [Types.TOGGLE_MENU]: toggleMenu,
  [Types.CLEAR_LIST]: clearList,
  [Types.DELETE_TRANSLATION]: deleteTranslation,
  [Types.MOVE_TO_TOP]: moveToTop,
  [Types.TOGGLE_COLLAPSED]: toggleCollapsed,
  [Types.TOGGLE_CHECKED]: toggleChecked
})
