const async = require('async');

/* Necesario para Google */
const {google} = require('googleapis');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const API_VERSION = 'v1';
const DISCOVERY_API = 'https://cloudiot.googleapis.com/$discovery/rest';


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

var handler = setInterval(() =>
async.parallel(stack,
  function(err, results) {
    if(err) {
      console.log("ERROR: ", err);
    } else {
      console.log("OK: ", results);
    }
  }
)
, 5000);






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
 
