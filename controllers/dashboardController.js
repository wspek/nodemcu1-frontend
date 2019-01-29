const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const request = require('request');
const async = require('async');

const Chart = require('chart.js');
//var myChart = new Chart(ctx, {...});


// /* Autenticación cuando se trata de un servidor propio */ 
// /* Ver mas en: https://firebase.google.com/docs/firestore/quickstart?authuser=0 */
// const admin = require('firebase-admin');
// var serviceAccount = require('../e-charger-218218-serviceaccount.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://e-charger-218218.firebaseio.com"
// });
// var db = admin.firestore();
// // La siguiente linea evita el mensaje largo de rutura y comportamiento....
// db.settings({timestampsInSnapshots: true});


exports.index = function(req, res, next) {

    // Para que funcione en Google app debe enviarse solamente la pagina
    // y dejar la actualizacion a la misma.
    res.render('dashboard', {estado: {"greenLedState": 0, "bicolorLedState": 0, "msInterval": 0}, lastMeasurement: {"timestamp": 0, "temperature": 0, "humity": 0, "wifiSignal": 0}});

//   //Step 1 - Set the headers
// var headers = {
//   'User-Agent':       'Super Agent/0.0.1',
//   'Content-Type':     'application/json'
// }

// //Step 2 - Configure the request
// var options = {
//   url     : 'http://localhost:3000/api/lastState/nodemcu1',
//   method  : 'GET',
//   jar     : false,
//   headers : headers
// }

// //Step 3 - do the request
// request(options, function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//       console.log(body);
//       res.render('dashboard_estado', {estado: JSON.parse(body)});
//   }
// });

    // // Lo siguiente funciona, lo deshabilito para seguir desarrollando
    //   var measurementsRef = db.collection("devices").doc("nodemcu1").collection("measurements").orderBy('timestamp', "desc").limit(1);

    //   measurementsRef.get()
    //   .then((snapshot) => {
    //       res.render('dashboard_index', {title: "Panel de Control - PRUEBA", estado: ultimoEstado, doc_list: snapshot.docs});
    //       //console.log(snapshot);
    //       snapshot.forEach((doc) => {
    //           console.log(doc.id, '=>', doc.data());
    //       });
    //   })
    //   .catch((err) => {
    //       console.log('Error getting documents', err);
    //   });

};


exports.config_form_post = [
    // Validate fields.
    body('interval', 'Debe ingresar un valor en segundos del intervalo').isLength({ min: 1 }).trim(),
    
    // Sanitize fields.
    sanitizeBody('led_state').trim().escape(),
    sanitizeBody('interval').trim().escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // // There are errors. Render form again with sanitized values and error messages.
            // Book.find({},'title')
            //     .exec(function (err, books) {
            //         if (err) { return next(err); }
            //         // Successful, so render.
            //         res.render('bookinstance_form', { title: 'Create BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
            // });

            //res.send("ERROR ");
        } else {
            res.send("TODO OK ");
            // // Data from form is valid.
            // bookinstance.save(function (err) {
            //     if (err) { return next(err); }
            //        // Successful - redirect to new record.
            //        res.redirect(bookinstance.url);
            //     });
        }
    }
    
];