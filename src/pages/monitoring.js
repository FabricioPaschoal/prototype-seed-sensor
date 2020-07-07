import React, { Component } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  Switch, 
  Button, 
  FlatList, 
  TouchableOpacity, 
  TextInput, ScrollView
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
        ],
      unpariedDevices: [],
      connected: false,
      visibleConected: false,
      sensorParams: 0,
      meters: "1",
      seeds: "2",
      velocity: "7",
      count: 0,
      status: '',
    }
  }

  async componentWillMount(){
    await this.monitoringLines();
  }

  async monitoringLines(){
    const metersPerSecond = Math.round(this.state.velocity / 3.6);
    const seedsPerSecond = metersPerSecond * this.state.seeds;
    if(this.state.count === seedsPerSecond - 1 || this.state.count === seedsPerSecond + 1 || this.state.count === seedsPerSecond){
      this.setState({
        lines:[
          { id: 0, name: "1", textStyle: styles.lineNameTrue, containerStyle: styles.containerLineTrue },
          ],
          count: 0
      })
    }else {
      this.setState({
        lines:[
          { id: 0, name: "1", textStyle: styles.lineNameFalse, containerStyle: styles.containerLineFalse },
          ],
          count: 0
      })
    }
    setTimeout(() => {
      this.monitoringLines()
    }, 1000)
  }

  async writeHCModule(message){
    BluetoothSerial.write(message)
    .then((res) => {
      console.log(res);
      this.setState({ connected: true })
    })
    .catch((err) => console.log(err.message))
  }

  // async readHCModule(){
  //   console.log('read');
    
  //   BluetoothSerial.readFromDevice()
  //   .then((res) => {
  //     console.log(res);
  //     this.setState({ connected: true })
  //   })  
  //   .catch((err) => console.log(err.message))
  //}

  async readHCModule(){
      BluetoothSerial.readFromDevice()
    .then(async (res) => {
      if(res !== ''){
        await this.setState({ count: this.state.count+1 })
        setTimeout(() => {

        }, 200)
      }
    })
    .catch((err) => console.log(err.message))
    setTimeout(() => {
      this.readHCModule()
    }, 200)
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
        <ScrollView>
        <View style={styles.containerMonitoring}>
            <FlatList
            data={this.state.lines}
            numColumns={3}
            keyExtractor={item => item.id}
            renderItem={(item) => this._renderItem(item)}
            />
        </View>
        <Text style={styles.textInputInformations}>{this.state.count}</Text>
        <View style={styles.containerInformations}>
            <Text style={styles.textInputInformations}>Quantidade de sementes por metro:</Text>
            <TextInput
                style={styles.inputNumber}
                onChangeText={text => this.setState({ seeds: text })}
                keyboardType="numeric"
                value={this.state.seeds}
            />
            <Text style={styles.textInputInformations}>Velcidade estimada para o plantio:</Text>
            <TextInput
                style={styles.inputNumber}
                onChangeText={text => this.setState({ velocity: text })}
                keyboardType="numeric"
                value={this.state.velocity}
            />
        </View>
        </ScrollView>
        <View
          style={styles.footer}
        >
          <Text style={styles.footerText}>₢ CCT/UENP - 2020</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    footer: {
      height: 30,
      borderColor: '#00695c',
      borderTopWidth: 2,
      backgroundColor: '#00897b',
      alignItems: 'center',
    },
    footerText: {
      marginTop: 5,
      color: '#fff'
    },
    containerInformations: {
        padding: 10,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: 52,
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
      backgroundColor: '#00897b',
      fontStyle: 'italic',
      borderRadius: 2,
      borderColor: '#00695c',
      borderRightWidth: 2,
      borderLeftWidth: 2,
      borderTopWidth: 2,
      borderBottomWidth: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.8,
      shadowRadius: 5,
      elevation: 1,
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
      fontSize: 25,
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
