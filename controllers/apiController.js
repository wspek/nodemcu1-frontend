const async = require('async');

/* Necesario para Google */
const {google} = require('googleapis');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const API_VERSION = 'v1';
const DISCOVERY_API = 'https://cloudiot.googleapis.com/$discovery/rest';

const PROJECT_ID = 'e-charger-218218'
const REGISTRY_ID = 'kaizenIT-test';
const CLOUD_REGION = 'us-central1';



// Returns an authorized API client by discovering the Cloud IoT Core API with
// the provided API key.
function getClient (serviceAccountJson, callback) {
    console.log("Inicio en getClient...");
    // Usa Promise...
    google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    }).then((authClient) => {
      const discoveryUrl = `${DISCOVERY_API}?version=${API_VERSION}`;
  
      google.options({
        auth: authClient
      });
  
      google.discoverAPI(discoveryUrl).then((client) => {
        callback(client);
      }).catch((err) => {
        console.log('Error during API discovery.', err);
      });
    });

    console.log("FINAL en getClient...");
}


var stack = [];
var ultimoEstado = function (callback) {
  console.log("Solicitando Credenciales...");
  // Usa Promise...
  google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  }).then((authClient) => {
    const discoveryUrl = `${DISCOVERY_API}?version=${API_VERSION}`;

    google.options({
      auth: authClient
    });

    google.discoverAPI(discoveryUrl).then((client) => {
      // Tenemos la credencial, ahora llamamos a la api de lista
      getDeviceState(
        client,
        'nodemcu1',
        'kaizenIT-test',
        'e-charger-218218',
        'us-central1',
        (err, lastState) => {
            if(err) {
                console.err("Error obteniendo estados del dispositivo");
                callback(err, null)
            } else {
                //console.log(lastState);
                callback(null, lastState);
            }
        }
        );


      //console.log("ANTES FINAL en getClient...");
      //callback(null, client);
    
    
    }).catch((err) => {
      console.log('Error during API discovery.', err);
    });
  });
}
stack.push(ultimoEstado);





// Retrieve the given device's state from the registry.
function getDeviceState (
    client,
    deviceId,
    registryId,
    projectId,
    cloudRegion,
    callbackState
  ) {
    // [START iot_get_device_state]
    // Client retrieved in callback
    // getClient(serviceAccountJson, function(client) {...});
    // const cloudRegion = 'us-central1';
    // const deviceId = 'my-device';
    // const projectId = 'adjective-noun-123';
    // const registryId = 'my-registry';
    const parentName = `projects/${projectId}/locations/${cloudRegion}`;
    const registryName = `${parentName}/registries/${registryId}`;
    const request = {
      name: `${registryName}/devices/${deviceId}`
    };
  
    client.projects.locations.registries.devices.states.list(request,
      (err, data) => {
        if (err) {
          console.err('Could not find device:', deviceId);
          console.err(err);
          callbackState(err, null);

        } else {
          //console.log('State:', data.data);

          var estado1 = Buffer.from(data.data['deviceStates'][0]['binaryData'], 'base64');
          var estado = JSON.parse(estado1);

          callbackState(null, estado);
        }
      });
    // [END iot_get_device_state]
  }
  
// Send configuration data to device.
function setDeviceConfig (
    client,
    deviceId,
    registryId,
    projectId,
    cloudRegion,
    data,
    version
  ) {
    // [START iot_set_device_config]
    // Client retrieved in callback
    // getClient(serviceAccountJson, function(client) {...});
    // const cloudRegion = 'us-central1';
    // const deviceId = 'my-device';
    // const projectId = 'adjective-noun-123';
    // const registryId = 'my-registry';
    // const data = 'test-data';
    // const version = 0;
    const parentName = `projects/${projectId}/locations/${cloudRegion}`;
    const registryName = `${parentName}/registries/${registryId}`;
  
    const binaryData = Buffer.from(data).toString('base64');
    const request = {
      name: `${registryName}/devices/${deviceId}`,
      versionToUpdate: version,
      binaryData: binaryData
    };
  
    client.projects.locations.registries.devices.modifyCloudToDeviceConfig(request,
      (err, data) => {
        if (err) {
          console.err('Could not update config:', deviceId);
          console.err('Message: ', err);
        } else {
          console.log('Success :', data);
        }
      });
    // [END iot_set_device_config]
  }
  




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

