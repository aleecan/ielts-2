// @flow

import React, { Component } from 'react'
import { ScrollView, Image, BackAndroid } from 'react-native'
import styles from './Styles/DrawerContentStyle'
import { Images } from '../Themes'
import DrawerButton from '../Components/DrawerButton'
import { Actions as NavigationActions } from 'react-native-router-flux'

class DrawerContent extends Component {

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.context.drawer.props.open) {
        this.toggleDrawer()
        return true
      }
      return false
    })
  }

  toggleDrawer () {
    this.context.drawer.toggle()
  }

  handlePressComponents = () => {
    this.toggleDrawer()
    NavigationActions.componentExamples()
  }

  handlePressDevice = () => {
    this.toggleDrawer()
    NavigationActions.deviceInfo()
  }

  handleTranslation = () => {
    this.toggleDrawer()
    NavigationActions.translationListScreen()
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        {/* <Image source={Images.logo} style={styles.logo} /> */}
        {/* <DrawerButton text='Component Examples' onPress={this.handlePressComponents} /> */}
        {/* <DrawerButton text='Device Info' onPress={this.handlePressDevice} /> */}
        <DrawerButton text='Translation' onPress={this.handleTranslation} />
      </ScrollView>
    )
  }

}

DrawerContent.contextTypes = {
  drawer: React.PropTypes.object
}

export default DrawerContent
