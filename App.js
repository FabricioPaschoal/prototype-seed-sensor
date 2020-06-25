import React, { Component } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  Switch, 
  Button, 
  FlatList, 
  TouchableOpacity, 
} from 'react-native';
import Modal, { ModalContent, ModalButton } from 'react-native-modals';
import BluetoothSerial from 'react-native-bluetooth-serial';

export default class App extends Component {
  constructor(){
    super()

    this.state = {
      visible: false,
      isEnabled: false,
      discovering: false,
      devices: [],
      unpariedDevices: [],
      connected: false,
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
      this.setState({ connecting: true })
      BluetoothSerial.connect(device.id)
      .then(async (res) => {
        console.log(`Connected to device ${device.name}`);
        await this.writeHCModule("Conexão estabilizada");
        await this.writeHCModule(".");
      })
      .catch((err) => console.log((err.message)))
    }else{
      this.setState({ visible: true });
    }
  }
  _renderItem(item){
 
    return(<TouchableOpacity onPress={() => this.connect(item.item)}>
            <View style={styles.deviceNameWrap}>
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
        <FlatList
          style={{flex:1}}
          data={this.state.devices}
          keyExtractor={item => item.id}
          renderItem={(item) => this._renderItem(item)}
        />
        <Button
          onPress={this.readHCModule.bind(this)}
          title="Ler dados do módulo"
          color="#004d40"
        />
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
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
