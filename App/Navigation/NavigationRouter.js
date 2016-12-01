// @flow

import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import { connect } from 'react-redux'

import Styles from './Styles/NavigationContainerStyle'
import NavigationDrawer from './NavigationDrawer'
import NavItems from './NavItems'
import CustomNavBar from '../Components/CustomNavBar'

// screens identified by the router
import TranslationListScreen from '../Containers/TranslationListScreen'
import ImapStorageScreen from '../Containers/ImapStorageScreen'

//Actions
import TranslationListActions from '../Redux/TranslationListRedux'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    const {toggleMenu} = this.props
    return (
      <Router>
        <Scene key='drawer' component={NavigationDrawer} open={false}>
          <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
            <Scene key='translationListScreen' component={TranslationListScreen} title='Translation' renderRightButton={()=>NavItems.menuButton(toggleMenu)} />
            <Scene initial key='imapStorageScreen' component={ImapStorageScreen} title='Saved List' type='replace' />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMenu: () => dispatch(TranslationListActions.toggleMenu()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationRouter)
