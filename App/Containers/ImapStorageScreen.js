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
  RecyclerViewBackedScrollView,
  Picker
} from 'react-native'
import Checkbox from 'react-native-custom-checkbox'
import { SwipeListView } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { Images, Colors, Metrics } from '../Themes'
import ImapStorageActions from '../Redux/ImapStorageRedux'
import TranslationListActions from '../Redux/TranslationListRedux'
import { text2translation } from '../Lib/TranslationFormat'

import Styles from './Styles/ImapStorageScreenStyle'

class Row extends React.Component {
  render() {
    const {subject, content, messageId, rowId, rowData, handlePress} = this.props
    return (
      <TouchableHighlight key={rowId} style={[Styles.row, rowId == 0 ? {marginTop: Metrics.baseMargin} : {marginTop: 0}]} underlayColor={Colors.c1}
         onPress={handlePress}>
        <View style={{flexDirection: 'row'}}>
            <Text>{subject}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

class HiddenRow extends React.Component {
  render() {
    const {rowId, rowData, handleDelete} = this.props
    return(
      <View style={[{flex:1, justifyContent:'flex-end', flexDirection:'row'}, Styles.hiddenRow, rowId == 0 ? {marginTop: Metrics.baseMargin} : {marginTop: 0}]}>
        <TouchableOpacity onPress={() => {
          handleDelete(rowData)
          rowMap[`${secId}${rowId}`].closeRow()
        }} style={{alignItems: 'flex-end', justifyContent: 'center', marginRight: 10}}>
          <Icon name='trash-o' size={34} color={Colors.c1} />
        </TouchableOpacity>
      </View>
    )
  }
}

class EmailAccountInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      brand: props.brandList[0],
      usermail: '',
      password: '',
      folderName: 'ielts'
    }
  }
  _handleSubmit = () => {
    const {brand, usermail, password, folderName} = this.state
    if(!brand) {
      Alert.alert('', 'Please Choose Your Email Provider')
      return
    }
    if(!usermail) {
      Alert.alert('', 'Please Input Your Email Address')
      return
    }
    if(!password) {
      Alert.alert('', 'Please Input Your Email Password')
      return
    }
    this.props.handleSubmit({brand, usermail, password, folderName})
  }
  render() {
    const { brandList } = this.props
    return (
      <View style={{backgroundColor: Colors.c1, padding: Metrics.baseMargin}}>
        <Text style={{fontSize: Metrics.fs1}}>Input Your Email Account</Text>
        <Picker
          selectedValue={this.state.brand}
          onValueChange={(brand) => this.setState({brand})}>
          {brandList.map( brand => <Picker.Item key={brand} label={brand} value={brand} />)}
        </Picker>
        <TextInput value={this.state.usermail} onChangeText={(usermail) => this.setState({usermail})}
          placeholder="your email address"/>
        <TextInput value={this.state.password} onChangeText={(password) => this.setState({password})} secureTextEntry={true}
          placeholder="your email password"/>
        <TouchableOpacity style={{backgroundColor: Colors.c4, margin: 10, height: 30, justifyContent:'center', alignItems:'center'}}
          onPress={this._handleSubmit}>
          <Text>OK</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class ImapStorageScreen extends React.Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      ds: ds,
      dataSource: ds.cloneWithRows(props.messages),
    }
  }

  componentDidMount() {
    // this.props.getMessages()
  }

  componentWillReceiveProps(props) {
    const {ds} = this.state
    this.setState({
      dataSource: ds.cloneWithRows(props.messages)
    })
  }

  _renderRow = (rowData, secId, rowId, rowMap) => {
    const {addTranslation, clearList, sendMessage} = this.props
    return (
      <Row rowData={rowData} {...rowData}
        rowId={rowId} handlePress={()=> {
          clearList()
          addTranslation(text2translation(rowData.content), rowData.messageId)
          NavigationActions.translationListScreen()
        }} />
    )
  }

  _renderHiddenRow = (rowData, secId, rowId, rowMap) => {
    return (
      <HiddenRow rowData={rowData} rowId={rowId} rowMap={rowMap} />
    )
  }

  _renderHeader = () => {
    const {usermail} = this.props.emailAccount
    return (
      <View style={{marginHorizontal: Metrics.baseMargin, marginTop: 5, flexDirection: 'row'}}>
        <TouchableOpacity style={{backgroundColor: Colors.c1, borderRadius: 3, paddingHorizontal: 5}} onPress={()=>this.props.getMessages()}>
          <Text>Get {usermail}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderEmailAccountInput() {
    const {brandList, initEmailAccount} = this.props
    return (
      <EmailAccountInput brandList={brandList} handleSubmit={ emailAccount => initEmailAccount(emailAccount)} />
    )
  }

  _renderListView() {
    return (
      <SwipeListView
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        renderHeader={this._renderHeader}
        renderRow={this._renderRow}
        disableRightSwipe={true}
        previewFirstRow={true}
        previewOpenValue={-100}
        renderHiddenRow={this._renderHiddenRow}
        rightOpenValue={-100}/>
    )
  }

  render() {
    const {emailAccountInited} = this.props
    return (
      <View style={{flex:1}}>
        <Image source={Images.bgWood01} style={Styles.backgroundImage} resizeMode='cover' />
        <View style={[Styles.mainContainer]}>
          {emailAccountInited ? this._renderListView() : this._renderEmailAccountInput()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.imapstorage,
    imapstorage: state.imapstorage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMessages: () => dispatch(ImapStorageActions.getMessages()),
    addTranslation: (translation, messageId) => dispatch(TranslationListActions.addTranslation(translation, messageId)),
    clearList: () => dispatch(TranslationListActions.clearList()),
    sendMessage: () => dispatch(ImapStorageActions.sendMessage()),
    initEmailAccount: (emailAccount) => dispatch(ImapStorageActions.initEmailAccount(emailAccount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImapStorageScreen)
