2019-02-13

# Running locally

To run the application locally, perform the following steps:

* Install Google Cloud SDK. See: https://cloud.google.com/sdk/install
* Install the necessary NodeJS packages, by executing a `npm install` in the folder containing package.json.
* To run the app locally in debug mode, execute the custom shell script `devstart.sh`.
* The application can be accessed by http://localhost:3000

# API

The `{deviceId}` is the same used in gcp, ie `nodemcu1` in this case.
All endpoints returns a JSON and on the case of `POST` endpoint with a field called result with `OK` or `ERROR`, and other information that isn't used at the moment.

## GET last Device State endpoint

`https://e-charger-218218.appspot.com/api/lastState/{deviceId}`

This function retrieve the last state directly from Google Cloud Platform IoT core.

Ex: `https://e-charger-218218.appspot.com/api/lastState/nodemcu1`


## POST new configuration or new Device State endpoint

`https://e-charger-218218.appspot.com/api/lastState/{deviceId}`

This function send a new configuration directly to Google IoT Core. The body of the `POST` request must be the JSON parsed by prototype, in this case:

```json
{
    "greenLedState": 0(Off) or 1(On),
    "bicolorLedState": 0(Off) or 1(Green) or 2(Red),
    "msInterval": 0-(2^32 -1)
}
```

`msInterval` is a 32bits unsigned integer that counts represent the milliseconds between sends of measurement values. Typically 300000 ms = (300000/(1000*60)) = 5 minutes


## GET last Device Measurement endpoint

`https://e-charger-218218.appspot.com/api/lastMeasurement/{deviceId}`

This function retrieve the last record from Firebase in `devices/nodemcu1/mesurements` collection.

Ex: `https://e-charger-218218.appspot.com/api/lastMeasurement/nodemcu1`




