// @flow

import {StyleSheet} from 'react-native'
import {Metrics, ApplicationStyles, Colors} from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  row: {
    backgroundColor: Colors.c2,
    marginBottom: 5,
    marginHorizontal: 8,
    borderRadius: 3,
    padding: 10
  },

  hiddenRow: {
    backgroundColor: Colors.windowTint,
    marginBottom: 5,
    marginHorizontal: 8,
    borderRadius: 3
  },
})
