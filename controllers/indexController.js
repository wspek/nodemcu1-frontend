const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

/* Autenticación cuando se trata de un servidor propio */ 
/* Ver mas en: https://firebase.google.com/docs/firestore/quickstart?authuser=0 */
const admin = require('firebase-admin');
var serviceAccount = require('../e-charger-218218-d5c2a7ff0d3b.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://e-charger-218218.firebaseio.com"
});
var db = admin.firestore();
// La siguiente linea evita el mensaje largo de rutura y comportamiento....
db.settings({timestampsInSnapshots: true});



exports.index = function(req, res, next) {   

    /*
    async.parallel({
        lista: function(callback) {
            var measurementsRef = db.collection("devices").doc("nodemcu1").collection("measurements");

            measurementsRef.get()
            .then((snapshot) => {
                //console.log(snapshot);
                snapshot.forEach((doc) => {
                    console.log(doc.id, '=>', doc.data());
                });
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, doc_list: results });
    });
    */

      var measurementsRef = db.collection("devices").doc("nodemcu1").collection("measurements");

      measurementsRef.get()
      .then((snapshot) => {
          res.render('index', {title: "Documentos Firebase", doc_list: snapshot.docs});
          //console.log(snapshot);
          snapshot.forEach((doc) => {
              console.log(doc.id, '=>', doc.data());
          });
      })
      .catch((err) => {
          console.log('Error getting documents', err);
      });

};
