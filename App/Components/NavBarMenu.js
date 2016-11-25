import React from 'react'
import { ScrollView,
  Text,
  Image,
  View,
  ListView,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  TextInput
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Images, Colors, Metrics } from '../Themes'
import * as Animatable from 'react-native-animatable'

export default class NavBarMenu extends React.Component {

  _renderItem(item, index) {
    return (
      <TouchableOpacity key={index} style={Styles.menuItem} onPress={item.handlePress}>
        <Icon name={item.icon}
          size={Metrics.icons.tiny}
          color={Colors.snow}
        />
        <Text style={Styles.menuText}>{item.text}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Animatable.View animation='slideInDown' duration={200} easing="ease-out" direction="alternate" style={Styles.menuContainer}>
          {this.props.items.map((item, index) => this._renderItem(item, index))}
      </Animatable.View>
    )
  }
}

const Styles = {
  menuContainer: {
    backgroundColor: Colors.c5,
    width: Metrics.screenWidth,
    position: 'absolute',
    top: 0,
    flexDirection: 'row'
  },

  menuItem: {
    padding: 10,
    flexDirection: 'row',
    flex: 1,
    alignItems:'center',
    justifyContent:'center'
  },

  menuText: {
    color: Colors.snow,
    alignSelf: 'center',
    marginLeft: 3
  }
}
