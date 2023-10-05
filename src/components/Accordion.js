import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {lightTheme} from "../Theme.js";

export default class Accordion extends Component{

  constructor(props) {
    super(props);
    this.state = { 
      data: props.data,
      expanded : false,
    }

    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }
  
  render() {

    return (
      <View>
        <TouchableOpacity ref={this.accordian} style={styles.row} onPress={()=>this.toggleExpand()}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={lightTheme.textAlt} />
        </TouchableOpacity>
        <View style={styles.parentHr}/>
        {
          this.state.expanded &&
                <View style={styles.child}>
                  <Text>{this.props.data}</Text>    
                </View>
        }
            
      </View>
    )
  }

  toggleExpand=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({expanded : !this.state.expanded})
  }

}

const styles = StyleSheet.create({
  child:{
    backgroundColor: lightTheme.background,
    padding:16,
  },
  parentHr:{
    color: 'white',
    height:1,
    width:'100%'
  },
  row:{
    alignItems:'center',
    backgroundColor: lightTheme.backgroundFocused,
    flexDirection: 'row',
    height:56,
    justifyContent:'space-between',
    paddingLeft:25,
    paddingRight:18,
  },
  title:{
    color: lightTheme.textAlt,
    fontSize: 14,
    fontWeight:'bold',
  }
    
});