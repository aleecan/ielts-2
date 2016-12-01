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
  LayoutAnimation
} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { Images, Colors, Metrics } from '../Themes'
import { text2translation } from '../Lib/TranslationFormat'

export default class TranslationInputDialog extends React.Component {
  constructor() {
    super()
    this.state = {
      input: ''
    }
  }

  _handlePress =  () => {
    const {input} = this.state
    if(!input) {
      this.props.handlePress()
      return
    }
    const list = text2translation(input)
    this.props.handlePress(list)
  }

  _handlePaste = async () => {
    let content = await Clipboard.getString()
    this.setState({
      input: !!this.state.input ? this.state.input + '\n' + content : content
    })
  }

  render() {
    return (
      <View style={Styles.dialog}>
        <View style={{backgroundColor: Colors.clear, height: 45, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.c1 }}>
          <TouchableOpacity onPress={this._handlePaste} style={{flex:1, alignItems: 'center', justifyContent: 'center',}}>
            <Icon name='paste' size={34} color={Colors.charcoal} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handlePress} style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
            <Icon name='check' size={34} color={Colors.charcoal} />
          </TouchableOpacity>
        </View>
        <TextInput
          editable = {true}
          autoFocus = {true}
          onChangeText = {(input) => this.setState({input})}
          placeholder = 'input your little steps here'
          multiline = {true}
          underlineColorAndroid = 'transparent'
          style = {{flex:1, borderBottomWidth: 1, borderBottomColor: Colors.steel, padding: 15, textAlignVertical: 'top'}}
          value = {this.state.input}
        />
      </View>
    )
  }
}

const Styles = {

    dialog: {
      backgroundColor: Colors.snow,
      height: 200,
      width: Metrics.screenWidth - 40,
      position: 'absolute',
      top: Metrics.screenHeight / 7,
      left: 20,
      borderRadius: 10
    }
}
