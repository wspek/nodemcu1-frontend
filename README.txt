To run the application in debug mode:
On Linux: DEBUG=nodemcu1-frontend:* npm run devstart


2019-02-13
API:
The {deviceId} is the same used in gcp, ie nodemcu1 in this case.
All endpoints returns a JSON and on the case of POST endpoint with a field called result with OK or ERROR, and other information that isn't used at the moment.


GET last Device State endpoint:
===============================
https://e-charger-218218.appspot.com/api/lastState/{deviceId}
This function retrieve the last state directly from Google Cloud Platform IoT core.
Ex: https://e-charger-218218.appspot.com/api/lastState/nodemcu1


POST new configuration or new Device State endpoint:
====================================================
https://e-charger-218218.appspot.com/api/lastState/{deviceId}
This function send a new configuration directly to Google IoT Core. The body of the POST request must be the JSON parsed by prototype, in this case:

{
"greenLedState": 0(Off) or 1(On),
"bicolorLedState": 0(Off) or 1(Green) or 2(Red),
"msInterval": 0-(2^32 -1)
}

msInterval is a 32bits unsigned integer that counts represent the milliseconds between sends of measurement values. Tipically 300000 ms = (300000/(1000*60)) = 5 minutes


GET last Device Measurement endpoint:
=====================================
https://e-charger-218218.appspot.com/api/lastMeasurement/{deviceId}
This function retrieve the last record from Firebase in devices/nodemcu1/mesurements collection
Ex: https://e-charger-218218.appspot.com/api/lastMeasurement/nodemcu1




