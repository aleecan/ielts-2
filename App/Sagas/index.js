import { takeLatest } from 'redux-saga'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugSettings from '../Config/DebugSettings'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { TranslationListTypes } from '../Redux/TranslationListRedux'
import { ImapStorageTypes } from '../Redux/ImapStorageRedux'
/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { exportToClipboard } from './TranslationListSagas'
import { initEmailAccount, getMessages, sendMessage } from './ImapStorageSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugSettings.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    // takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(TranslationListTypes.EXPORT_TO_CLIPBOARD, exportToClipboard),

    takeLatest(ImapStorageTypes.INIT_EMAIL_ACCOUNT, initEmailAccount),
    takeLatest(ImapStorageTypes.GET_MESSAGES, getMessages),
    takeLatest(ImapStorageTypes.SEND_MESSAGE, sendMessage),
  ]
}
