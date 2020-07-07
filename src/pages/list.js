import React, { Component } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  Switch, 
  Button, 
  FlatList, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import Modal, { ModalContent, ModalButton } from 'react-native-modals';
import BluetoothSerial from 'react-native-bluetooth-serial';

export default class List extends Component {
  constructor(){
    super()

    this.state = {
      visible: false,
      isEnabled: false,
      discovering: false,
      devices: [],
      unpariedDevices: [],
      connected: false,
      visibleConected: false,
    }
  }
  
  componentDidMount() {
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ]).then((values) => {
      const [isEnabled, devices] = values;
      this.setState({ isEnabled, devices });
    })
    BluetoothSerial.on('bluetoothEnabled', () => {
      Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list()
      ]).then((values) => {
        const [isEnabled, devices] = values;
        this.setState({ devices });
      })
      BluetoothSerial.on('bluetoothDisabled', () => {
        this.setState({ devices: [] });
      })
      BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
    })
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

  async connect (device) {
    if(device.name === 'HC-05'){
      this.setState({ connecting: true, visibleConected: true })
      BluetoothSerial.connect(device.id)
      .then(async (res) => {
        console.log(`Connected to device ${device.name}`);
        await this.writeHCModule("Conexão estabilizada");
        await this.writeHCModule(".");
      })
      .catch((err) => console.log((err.message)))
      setTimeout(() => {
        this.props.navigation.navigate('Monitoring');
      }, 1500)
    }else{
      this.setState({ visible: true });
    }

  }
  _renderItem(item){
    return(<TouchableOpacity onPress={() => this.connect(item.item)}>
            <View style={item.index % 2 === 0 ? styles.deviceNameWrap : styles.deviceNameWrapAlt}>
              <Text style={styles.deviceName}>{ item.item.name ? item.item.name : item.item.id }</Text>
            </View>
          </TouchableOpacity>)
  }
  enable () {
    BluetoothSerial.enable()
    .then((res) => this.setState({ isEnabled: true }))
    .catch((err) => Toast.showShortBottom(err.message))
  }
 
  disable () {
    BluetoothSerial.disable()
    .then((res) => this.setState({ isEnabled: false }))
    .catch((err) => Toast.showShortBottom(err.message))
  }
 
  toggleBluetooth (value) {
    if (value === true) {
      this.enable()
    } else {
      this.disable()
    }
  }
  discoverAvailableDevices () {
    
    if (this.state.discovering) {
      return false
    } else {
      this.setState({ discovering: true })
      BluetoothSerial.discoverUnpairedDevices()
      .then((unpairedDevices) => {
        const uniqueDevices = _.uniqBy(unpairedDevices, 'id');
        console.log(uniqueDevices);
        this.setState({ unpairedDevices: uniqueDevices, discovering: false })
      })
      .catch((err) => console.log(err.message))
    }
  }

  render() {

    return (
      <View style={styles.container}>
      <View style={styles.toolbar}>
            <Text style={styles.toolbarTitle}>LISTA DE DISPOSITIVOS</Text>
            <View style={styles.toolbarButton}>
              <Switch
                value={this.state.isEnabled}
                onValueChange={(val) => this.toggleBluetooth(val)}
              />
            </View>
      </View>
        <ScrollView>
          <FlatList
            style={styles.list}
            data={this.state.devices}
            keyExtractor={item => item.id}
            renderItem={(item) => this._renderItem(item)}
          />
        </ScrollView>
        <View
          style={styles.footer}
        >
          <Text style={styles.footerText}>₢ CCT/UENP - 2020</Text>
        </View>
        <Modal
          visible={this.state.visible}
          onTouchOutside={() => {
            this.setState({ visible: false });
          }}
          modalStyle={styles.borderModal}
        >
          <ModalContent>
            <Text style={styles.containerTextModal}>O nome do sensor é HC-05. Caso não esteja listado reinicie o bluetooth e o aplicativo.</Text>
          </ModalContent>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 15,
  },
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
    fontSize: 20,
    flex:1,
    marginTop:6,
    color: '#fff',
  },
  deviceName: {
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'Avenir'
  },
  deviceNameWrap: {
    flex: 1,
    paddingVertical:15,
    paddingHorizontal:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#bebebe'
  },
  deviceNameWrapAlt: {
    flex: 1,
    paddingVertical:15,
    paddingHorizontal:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#bebebe',
    backgroundColor: '#e0e0e0'
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
