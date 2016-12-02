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
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'
import { Images, Colors, Metrics } from '../Themes'
import { text2translation } from '../Lib/TranslationFormat'

export default class EmailAccountInput extends React.Component {
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
    this.props.handleSubmit({brand, usermail: usermail.indexOf('@') > -1 ? usermail : usermail + '@' + brand , password, folderName})
  }
  render() {
    const { brandList } = this.props
    return (
      <Animatable.View animation='fadeInDown' style={{backgroundColor: Colors.c1, padding: Metrics.baseMargin}}>
        <View>
            <Text style={{fontSize: Metrics.fs1}}>Input Your Email Account</Text>
        </View>

        <View style={{flexDirection: 'row', flex: 1, height: 50}}>
          <View style={{flex: 1}}>
            <TextInput
               style={{textAlign: 'right'}}
               value={this.state.usermail}
               onChangeText={(usermail) => this.setState({usermail})}
               returnKeyType='next'
               placeholder="your email address"/>
          </View>
          <View style={{width: 20, justifyContent: 'center', alignItems:'center'}}>
            <Text>@</Text>
          </View>
          <View style={{flex: 1}}>
            <Picker style={{height: 50}}
              selectedValue={this.state.brand}
              onValueChange={(brand) => this.setState({brand})}>
              {brandList.map( brand => <Picker.Item key={brand} label={brand} value={brand} />)}
            </Picker>
          </View>
        </View>

        <View style={{height: 40}}>
          <TextInput style={{textAlign: 'center'}}
            value={this.state.password}
            onChangeText={(password) => this.setState({password})}
            secureTextEntry={true}
            returnKeyType='done'
            placeholder="your email password"/>
        </View>

        <View>
          <TouchableOpacity style={{backgroundColor: Colors.c4, margin: 10, height: 30, justifyContent:'center', alignItems:'center'}}
            onPress={this._handleSubmit}>
            <Text style={{color: Colors.c1}}>OK</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    )
  }
}
