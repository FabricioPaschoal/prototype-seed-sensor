#include <SoftwareSerial.h> //INCLUSÃO DE BIBLIOTECA PARA TRABALHAR COM MÓDULO DE BLUETOOTH(HC-05)

int pinoSensor = 8; //PINO DIGITAL UTILIZADO PELO SENSOR IR
const int pinoRX = 0; //PINO DIGITAL 0 (RX)
const int pinoTX = 1; //PINO DIGITAL 1 (TX)
 
SoftwareSerial bluetooth(pinoRX, pinoTX); //PINOS QUE EMULAM A SERIAL
 

void setup(){
  pinMode(pinoSensor, INPUT); //DEFINE O PINO COMO ENTRADA
  Serial.begin(9600); // TAXA DE TRANSMISSÃO NA SERIAL
  bluetooth.begin(9600); // TAXA DE TRANSMISSÃO DO MÓDULO
}

void loop(){
  if(bluetooth.available() > 0){ //SE A CONEXÃO BLUETOOTH ESTIVER HABILITADA, FAZ
      if(digitalRead(pinoSensor) == LOW){ //SE A LEITURA DO SENSOR IR FOR IGUAL A LOW(OU SEJA, NÃO CONSEGUIU RETORNAR A EMISSÃO IR, SIGNIFICANDO QUE PASSOU UMA SEMENTE), FAZ
          Serial.println("CROSSED");  //ENVIA A STRING AO APP VIA BLUETOOTH
          /*PARA MULTIPLAS LINHAS(SENSORES IR) DE MONITORAMENTO, É NECESSARIO ENVIAR TAMBÉM QUAL LINHA RECEBEU O DADO*/
          delay(100);
      }
  }
}
