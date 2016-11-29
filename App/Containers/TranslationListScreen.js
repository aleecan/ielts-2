// @flow

import React from 'react'
import { ScrollView,
  Text,
  Image,
  View,
  ListView,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  TextInput,
  Clipboard,
  Alert,
  LayoutAnimation,
  RecyclerViewBackedScrollView
} from 'react-native'
import Checkbox from 'react-native-custom-checkbox'
import { SwipeListView } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { Images, Colors, Metrics } from '../Themes'
import TranslationListActions from '../Redux/TranslationListRedux'
import NavBarMenu from '../Components/NavBarMenu'
import TranslationInputDialog from '../Components/TranslationInputDialog'

import Styles from './Styles/TranslationListScreenStyle'

class Row extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: props.collapsed,
      checked: props.checked
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      collapsed: nextProps.collapsed,
      checked: nextProps.checked
    })
  }

  _handleRowPress = () => {
    const { toggleCollapsed, rowData } = this.props
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    toggleCollapsed(rowData)
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  _handleCheckboxPress = () => {
    const { toggleChecked, rowData } = this.props
    toggleChecked(rowData)
    this.setState({
      checked: this.state.checked
    })
  }

  render() {
    const {collapsed, checked} = this.state
    const {ch, en, remarks, rowId} = this.props
    return (
      <TouchableHighlight key={rowId} style={[Styles.row, rowId == 0 ? {marginTop: Metrics.baseMargin} : {marginTop: 0}]} underlayColor={Colors.c1} onPress={this._handleRowPress}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{width: 30}} onPress={this._handleCheckboxPress}>
            <Checkbox
              checked={checked}
              style={{backgroundColor: Colors.transparent, color:Colors.c3, borderRadius: 3}}
              onChange={this._handleCheckboxPress}/>
          </TouchableOpacity>
          <View style={{flex:1}}>
            <Text style={Styles.textRow1}>{parseInt(rowId, 10) + 1}.{ch}</Text>
            {collapsed ? null : <Animatable.Text animation='fadeInDown' duration={200} style={Styles.textRow2}>{en}</Animatable.Text>}
            <Text style={Styles.textRow3}>{remarks}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

class TranslationListScreen extends React.Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      ds: ds,
      dataSource: ds.cloneWithRows(props.translationList),
    }
  }

  componentWillReceiveProps(props) {
    const {ds} = this.state
    this.setState({
      dataSource: ds.cloneWithRows(props.translationList)
    })

  }

  _renderRow = (rowData, secId, rowId, rowMap) => {
    const { toggleCollapsed, toggleChecked } = this.props
    return (
      <Row rowData={rowData} {...rowData}
        rowId={rowId}
        toggleCollapsed={toggleCollapsed}
        toggleChecked={toggleChecked} />
    )
  }

  _handleDelete(rowData) {
    const { deleteTranslation } = this.props
    Alert.alert(
      '',
      'Delete this item?',
      [
        {text: 'OK', onPress: () => deleteTranslation(rowData)},
        {text: 'Cancel', onPress: () => {}},
      ]
    )
  }

  _renderHiddenRow = (rowData, secId, rowId, rowMap) => {
    const { moveToTop } = this.props
    return (
      <View style={[{flex:1, justifyContent:'flex-end', flexDirection:'row'}, Styles.hiddenRow, rowId == 0 ? {marginTop: Metrics.baseMargin} : {marginTop: 0}]}>
        <TouchableOpacity onPress={() => {
          moveToTop(rowData)
          rowMap[`${secId}${rowId}`].closeRow()
        }} style={{alignItems: 'flex-end', justifyContent: 'center', marginRight: 10}}>
          <Icon name='angle-double-up' size={34} color={Colors.c1} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          this._handleDelete(rowData)
          rowMap[`${secId}${rowId}`].closeRow()
        }} style={{alignItems: 'flex-end', justifyContent: 'center', marginRight: 10}}>
          <Icon name='trash-o' size={34} color={Colors.c1} />
        </TouchableOpacity>
      </View>
    )
  }

  _renderMenu = () => {
    const {menuVisible, toggleAddModal, toggleMenu, exportToClipboard, clearList} = this.props
    const items = [{
      icon: 'plus',
      text: 'Add',
      handlePress: () => {
        toggleAddModal()
        toggleMenu()
      }
    }, {
      icon: 'clipboard',
      text: 'Export',
      handlePress: () => {
        exportToClipboard()
        toggleMenu()
      }
    },{
        icon: 'eraser',
        text: 'Clear',
        handlePress: () => {
          clearList()
          toggleMenu()
        }
    }]
    return (
      menuVisible ? <NavBarMenu items={items} /> : null
    )
  }

  _toggleModalVisible = () => {
    this.props.toggleAddModal()
  }

  _handleAdd = (translation) => {
    if(translation) {
      this.props.addTranslation(translation)
    }
    this._toggleModalVisible()
  }

  _renderAddModal = () => {
    return (
      <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.props.addModalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={[Styles.mainContainer, {backgroundColor: Colors.windowTint, flex: 1}]}>
           <TranslationInputDialog handlePress={this._handleAdd}/>
         </View>
      </Modal>
    )
  }

  render () {
    return (
      <View style={{flex:1}}>
        <Image source={Images.bgWood01} style={Styles.backgroundImage} resizeMode='cover' />
        <View style={[Styles.mainContainer]}>
            <SwipeListView
              dataSource={this.state.dataSource}
              // renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
              enableEmptySections={true}
              renderRow={this._renderRow}
              disableRightSwipe={true}
              previewFirstRow={true}
              previewOpenValue={-100}
              renderHiddenRow={this._renderHiddenRow}
              rightOpenValue={-100}/>
          {this._renderMenu()}
          {this._renderAddModal()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.translationlist
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddModal: () => dispatch(TranslationListActions.toggleAddModal()),
    toggleMenu: () => dispatch(TranslationListActions.toggleMenu()),
    addTranslation: (translation) => dispatch(TranslationListActions.addTranslation(translation)),
    exportToClipboard: () => dispatch(TranslationListActions.exportToClipboard()),
    clearList: () => dispatch(TranslationListActions.clearList()),
    deleteTranslation: (translation) => dispatch(TranslationListActions.deleteTranslation(translation)),
    moveToTop: (translation) => dispatch(TranslationListActions.moveToTop(translation)),
    toggleCollapsed: (translation) => dispatch(TranslationListActions.toggleCollapsed(translation)),
    toggleChecked: (translation) => dispatch(TranslationListActions.toggleChecked(translation)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslationListScreen)
