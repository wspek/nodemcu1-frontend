const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const request = require('request');
const async = require('async');


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


exports.index = function(req, res, next) {

//    res.render('dashboard_estado', {estado: {"greenLedState": 1, "bicolorLedState": 0, "msInterval": 30000}});

  //Step 1 - Set the headers
var headers = {
  'User-Agent':       'Super Agent/0.0.1',
  'Content-Type':     'application/json'
}

//Step 2 - Configure the request
var options = {
  url     : 'http://localhost:3000/api/lastState/nodemcu1',
  method  : 'GET',
  jar     : false,
  headers : headers
}

//Step 3 - do the request
request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
      console.log(body);
      res.render('dashboard_estado', {estado: JSON.parse(body)});
  }
});

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

        var newConfig = {"greenLedState": req.body.led_state, "bicolorLedState": 0, "msInterval": (req.body.interval*1000)};

        const cb = function (client) {
        setDeviceConfig(
            client,
            'nodemcu1',
            'kaizenIT-test',
            'e-charger-218218',
            'us-central1',
            JSON.stringify(newConfig), // '{"ledState": ' + req.body.led_state + ', "msInterval": ' + (req.body.led_state * 1000) + '}',
            0
            );
        };
        getClient('../e-charger-218218-serviceaccount.json', cb);






        //console.log(req.body.led_state);
        //res.send("Led State Required: ", req.body.led_state);
        //res.status(status).send(body)

        // // Create a BookInstance object with escaped and trimmed data.
        // var bookinstance = new BookInstance(
        //   { book: req.body.book,
        //     imprint: req.body.imprint,
        //     status: req.body.status,
        //     due_back: req.body.due_back
        //    });

        if (!errors.isEmpty()) {
            // // There are errors. Render form again with sanitized values and error messages.
            // Book.find({},'title')
            //     .exec(function (err, books) {
            //         if (err) { return next(err); }
            //         // Successful, so render.
            //         res.render('bookinstance_form', { title: 'Create BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
            // });

            //res.send("ERROR ");
            return;
        }
        else {

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