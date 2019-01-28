const async = require('async');


/* Necesario para Google */
const {google} = require('googleapis');
//const jwt = require('jsonwebtoken');
//const fs = require('fs');
const API_VERSION = 'v1';
const DISCOVERY_API = 'https://cloudiot.googleapis.com/$discovery/rest';
const PROJECT_ID = 'e-charger-218218'
const REGISTRY_ID = 'kaizenIT-test';
const CLOUD_REGION = 'us-central1';


/* Necesario para Firebase */
/* Autenticación cuando se trata de un servidor propio */ 
/* Ver mas en: https://firebase.google.com/docs/firestore/quickstart?authuser=0 */
const admin = require('firebase-admin');
var serviceAccount = require('../e-charger-218218-serviceaccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://e-charger-218218.firebaseio.com"
});
var db = admin.firestore();
// La siguiente linea evita el mensaje largo de rutura y comportamiento....
db.settings({timestampsInSnapshots: true});


/* Read From Google Cloud IoT Core the last State */
exports.lastState = function(req, res, next) {
    const deviceId = req.params.deviceId;
    const parentName = `projects/${PROJECT_ID}/locations/${CLOUD_REGION}`;
    const registryName = `${parentName}/registries/${REGISTRY_ID}`;
    const request = {
      name: `${registryName}/devices/${deviceId}`
    };

    google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      }).then((authClient) => {
        const discoveryUrl = `${DISCOVERY_API}?version=${API_VERSION}`;
    
        google.options({
          auth: authClient
        });
    
        google.discoverAPI(discoveryUrl).then((client) => {
          // Tenemos la credencial, ahora llamamos a la api de lista de estados
          client.projects.locations.registries.devices.states.list(request,
            (err, data) => {
              if (err) {
                console.log('Could not find device:', deviceId);
                console.log(err);
                res.json( { error: `Could not find device: ${deviceId}` } );
              } else {
                if(data.data.hasOwnProperty('deviceStates')) {
                    var estado1 = Buffer.from(data.data['deviceStates'][0]['binaryData'], 'base64');
                    var estado = JSON.parse(estado1);
                    res.json(estado);
                } else {
                    console.log(`API: Sin estados para el dispositivo ${deviceId}`);
                    res.json( {} );
                }
              }
            });
        
        }).catch((err) => {
          console.log('Error during API discovery.', err);
          res.json( { error: `Error during API discovery: ${err}` } );
        });
      });
};


/* Send to Google Cloud IoT Core a new device configuration */
exports.lastState_post = function(req, res, next) {
  const deviceId = req.params.deviceId;
  const parentName = `projects/${PROJECT_ID}/locations/${CLOUD_REGION}`;
  const registryName = `${parentName}/registries/${REGISTRY_ID}`;

  const data = { 
    greenLedState: req.body.greenLedState,
    bicolorLedState: req.body.bicolorLedState,
    msInterval: req.body.msInterval 
  };

  google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    }).then((authClient) => {
      const discoveryUrl = `${DISCOVERY_API}?version=${API_VERSION}`;
  
      google.options({
        auth: authClient
      });
  
      google.discoverAPI(discoveryUrl).then((client) => {
        // Tenemos la credencial, ahora llamamos a la api de lista de estados
        const binaryData = Buffer.from(JSON.stringify(data)).toString('base64');
        const request = {
          name: `${registryName}/devices/${deviceId}`,
          versionToUpdate: 0,
          'binaryData': binaryData
        };
      
        client.projects.locations.registries.devices.modifyCloudToDeviceConfig(request,
          (err, data) => {
            if (err) {
              console.log('Could not update config:', deviceId);
              console.log('Message: ', err);
              res.json( { error: `Could not update config: ${err}` } );
            } else {
              console.log('Success :', data);
              res.json({ "result": 'OK', "error": 0, "data": data.data });
            }
          });

      }).catch((err) => {
        console.log('Error during API discovery.', err);
        res.json( { error: `Error during API discovery: ${err}` } );
      });
    });
};


/* Read From Google Cloud IoT Core the last State */
exports.lastMeasurement = function(req, res, next) {
  const deviceId = req.params.deviceId;
  var measurementsRef = db.collection("devices").doc(deviceId).collection("measurements").orderBy("timestamp", "desc").limit(1);

  measurementsRef.get()
    .then((snapshot) => {
      // Only would be one record
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        //res.json(doc);
        res.json(doc.data());
      });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
        res.json( { error: `${err}` } );
    });
}      


