import React, { Component } from 'react';
import { 
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DotsLoader } from 'react-native-indicator';


export default class Home extends Component {
  constructor(){
    super()

    this.state = {
      
    }
  }

  redirectToList(){
    setTimeout(() => {
      //this.props.navigation.navigate('Monitoring');
      this.props.navigation.navigate('List');
    }, 2500)
  }
    
  render(){
    
    return (
      <View style={styles.containerHome}>
        <Text style={styles.containerTextHome}>MONITORADOR DE PLANTADEIRAS</Text>
        <View style={styles.containerLoading} >
        <DotsLoader  color="#00695c" size={15}/>
        {this.redirectToList()}
        </View>
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  containerLoading:{
    marginTop: 20,
  },
  toolbar:{
    paddingTop:30,
    paddingBottom:30,
    flexDirection:'row',
    backgroundColor: '#00695c',
    fontStyle: 'italic'
  },
  toolbarButton:{
    width: 50,
    marginTop: 8,
    marginRight: 5,
    marginLeft: -25,
    backgroundColor: '#fff',
    borderRadius: 15
  },
  toolbarTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    flex:1,
    marginTop:6,
    color: '#fff',
  },
  deviceName: {
    fontSize: 17,
    color: "black"
  },
  deviceNameWrap: {
    margin: 10,
    borderBottomWidth:1
  },
  containerHome: {
    flex: 1,
    backgroundColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderModal: {
    borderRadius: 30
  },
  containerTextHome: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 50,
    paddingTop: 50,
    borderRadius: 30,
    fontStyle: 'italic',
    borderColor: '#004d40',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    backgroundColor: '#00695c',
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerTextModal: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 50,
    borderRadius: 30,
    paddingTop: 50,
    fontStyle: 'italic',
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
});




// const styles = StyleSheet.create({
//   containerHome: {
//     flex: 1,
//     backgroundColor: '#cccccc',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   borderModal: {
//     borderRadius: 30
//   },
//   containerTextHome: {
//     paddingLeft: 25,
//     paddingRight: 25,
//     paddingBottom: 50,
//     paddingTop: 50,
//     borderRadius: 30,
//     fontStyle: 'italic',
//     borderColor: '#004d40',
//     borderTopWidth: 3,
//     borderLeftWidth: 3,
//     borderRightWidth: 3,
//     borderBottomWidth: 3,
//     backgroundColor: '#00695c',
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   containerTextModal: {
//     paddingLeft: 25,
//     paddingRight: 25,
//     paddingBottom: 50,
//     borderRadius: 30,
//     paddingTop: 50,
//     fontStyle: 'italic',
//     fontSize: 18,
//     color: '#000',
//     fontWeight: 'bold',
//     alignItems: 'center',
//     justifyContent: 'center',
//   }
// });
