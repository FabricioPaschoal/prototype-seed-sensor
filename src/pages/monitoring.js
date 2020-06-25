import React, { Component } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  Switch, 
  Button, 
  FlatList, 
  TouchableOpacity, 
  TextInput
} from 'react-native';
import Modal, { ModalContent, ModalButton } from 'react-native-modals';
import BluetoothSerial from 'react-native-bluetooth-serial';
import { DotsLoader, TextLoader } from 'react-native-indicator';

export default class List extends Component {
  constructor(){
    super()

    this.state = {
      visible: false,
      isEnabled: false,
      discovering: false,
      lines:[
        { id: 0, name: "1", textStyle: styles.lineNameConect, containerStyle: styles.containerLineConect },
        { id: 1, name: "2", textStyle: styles.lineNameConect, containerStyle: styles.containerLineConect },
        { id: 2, name: "3", textStyle: styles.lineNameConect, containerStyle: styles.containerLineConect },
        { id: 3, name: "4", textStyle: styles.lineNameConect, containerStyle: styles.containerLineConect },
        { id: 4, name: "5", textStyle: styles.lineNameConect, containerStyle: styles.containerLineConect },
        { id: 5, name: "6", textStyle: styles.lineNameConect, containerStyle: styles.containerLineConect },
      ],
      unpariedDevices: [],
      connected: false,
      visibleConected: false,
      sensorParams: 0,
      meters: "1",
      seeds: "10",
    }
  }
  
  componentDidMount() {
    
  }

  async writeHCModule(message){
    BluetoothSerial.write(message)
    .then((res) => {
      console.log(res);
      console.log('Successfuly wrote to device')
      this.setState({ connected: true })
    })
    .catch((err) => console.log(err.message))
  }

  async readHCModule(){
    console.log('read');
    
    BluetoothSerial.readFromDevice()
    .then((res) => {
      console.log(res);
      console.log('Successfuly wrote to device')
      this.setState({ connected: true })
    })
    .catch((err) => console.log(err.message))
  }

  async readHCModule(){
    setTimeout(() => {
      BluetoothSerial.readFromDevice()
    .then((res) => {
      console.log(res);
      console.log('Successfuly wrote to device')
      this.setState({ connected: true, sensorParams: res })
    })
    .catch((err) => console.log(err.message))
    }, 100)
  }

  _renderItem(item){
    
    return(<TouchableOpacity>
            <View style={item.item.containerStyle}>
              <Text style={item.item.textStyle}>{ item.item.name }</Text>
            </View>
          </TouchableOpacity>)
  }
  render() {
    this.readHCModule();
    return (
      <View style={styles.container}>
      <View style={styles.toolbar}>
            <Text style={styles.toolbarTitle}>LINHAS MONITORADAS</Text>
      </View>
        <View style={styles.containerMonitoring}>
            <FlatList
            data={this.state.lines}
            numColumns={3}
            keyExtractor={item => item.id}
            renderItem={(item) => this._renderItem(item)}
            />
        </View>
        <View style={styles.containerInformations}>
            <Text style={styles.textInputInformations}>Metros:</Text>
            <TextInput
                style={styles.inputNumber}
                onChangeText={text => this.setState({ meters: text })}
                keyboardType="numeric"
                value={this.state.meters}
            />
            <Text style={styles.textInputInformations}>Quantidade de sementes por metro:</Text>
            <TextInput
                style={styles.inputNumber}
                onChangeText={text => this.setState({ seeds: text })}
                keyboardType="numeric"
                value={this.state.seeds}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    containerInformations: {
        padding: 20,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: 80,
        margin: 5,
        borderRadius: 15, 
        backgroundColor: '#e0e0e0',
    },
    textInputInformations: {
        fontSize: 15,
        marginLeft: 6,
    },  
    inputNumber: {
        textAlign: 'center',
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,
        margin: 5, 
        borderRadius: 25,
    },
    containerMonitoring:{
        alignItems: 'center',
        marginTop: 30
    },
    containerLineTrue: {
        margin: 20,
        borderRightWidth: 8,
        borderTopWidth: 8,
        borderLeftWidth: 8,
        borderBottomWidth: 8,
        borderColor: '#00695c',
        borderRadius: 5
    },
    lineNameTrue: {
        backgroundColor: '#00695c',
        fontSize: 20,
        color: "#fff"
    },
    containerLineFalse: {
        margin: 20,
        borderRightWidth: 8,
        borderTopWidth: 8,
        borderLeftWidth: 8,
        borderBottomWidth: 8,
        borderColor: '#e53935',
        borderRadius: 5
    },
    lineNameFalse: {
        backgroundColor: '#e53935',
        fontSize: 20,
        color: "#fff"
    },  
    containerLineConect: {
        margin: 20,
        borderRightWidth: 8,
        borderTopWidth: 8,
        borderLeftWidth: 8,
        borderBottomWidth: 8,
        borderColor: '#1565c0',
        borderRadius: 5
    },
    lineNameConect: {
        backgroundColor: '#1565c0',
        fontSize: 20,
        color: "#fff"
    },
    loader: {
        marginTop: -25,
        fontSize: 18,
        fontStyle: 'italic',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    toolbar:{
        paddingTop:30,
        paddingBottom:30,
        flexDirection:'row',
        backgroundColor: '#00695c',
        fontStyle: 'italic',
        borderRadius: 2,
        borderColor: '#dddddd',
        borderBottomWidth: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 1,
        marginTop: -5
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
});

  
//   render(){
//     return (
//       <View style={styles.containerHome}>
//         <Text style={styles.containerTextHome}>MONITORADOR DE PLANTADEIRAS</Text>
//         <Modal
//           visible={this.state.visible}
//           onTouchOutside={() => {
//             this.setState({ visible: false });
//           }}
//           modalStyle={styles.borderModal}
//         >
//           <ModalContent>
//             <Text style={styles.containerTextModal}>Por favor abilite o bluetooth e a localização de seu aparelho.</Text>
//           </ModalContent>
//         </Modal>
//       </View>
//     );
//   }
  
// }



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
