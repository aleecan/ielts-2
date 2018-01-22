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
import Immutable from 'seamless-immutable'
import { Images, Colors, Metrics } from '../Themes'
import ImapStorageActions from '../Redux/ImapStorageRedux'
import TranslationListActions from '../Redux/TranslationListRedux'
import { text2translation } from '../Lib/TranslationFormat'
import EmailAccountInput from '../Components/EmailAccountInput'
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
    const {rowId, secId, rowData, rowMap, handleDelete} = this.props
    return(
      <View style={[{flex:1, justifyContent:'flex-end', flexDirection:'row'}, Styles.hiddenRow, rowId == 0 ? {marginTop: Metrics.baseMargin} : {marginTop: 0}]}>
        <TouchableOpacity onPress={() => {
          rowMap[`${secId}${rowId}`].closeRow()
          handleDelete(rowData)
        }} style={{alignItems: 'flex-end', justifyContent: 'center', marginRight: 10}}>
          <Icon name='trash-o' size={34} color={Colors.c1} />
        </TouchableOpacity>
      </View>
    )
  }
}

class ImapStorageScreen extends React.Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => Immutable.is(r1, r2)})
    this.state = {
      ds: ds,
      dataSource: ds.cloneWithRows(props.messages),
    }
  }

  componentDidMount() {
    // this._getMessages()
  }

  componentWillReceiveProps(props) {
    const {ds} = this.state
    this.setState({
      dataSource: ds.cloneWithRows(props.messages)
    })
    this._getMessages()
  }

  _getMessages = () => {
    const { emailAccountInited } = this.props
    if(emailAccountInited) {
       setTimeout(()=>this.props.getMessages(), 2000)
    }
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
    const { deleteMessage } = this.props
    return (
      <HiddenRow rowData={rowData} secId={secId} rowId={rowId} rowMap={rowMap}
        handleDelete={() => deleteMessage(rowData.messageId)}/>
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
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        enableEmptySections={true}
        renderHeader={this._renderHeader}
        renderRow={this._renderRow}
        disableRightSwipe={true}
        previewFirstRow={false}
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
    deleteMessage: (messageId) => dispatch(ImapStorageActions.deleteMessage(messageId)),
    initEmailAccount: (emailAccount) => dispatch(ImapStorageActions.initEmailAccount(emailAccount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImapStorageScreen)
