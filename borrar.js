var async = require('async');

var StackOfFunctions = [];

var funcionUno = function(callback) {
    callback(null, 'Resultado Uno');
}

var funcionDos = function(callback) {
    callback(null, 'Resultado Dos');
}

var funcionTres = function(callback) {
    callback(null, 'Resultado Tres');
}

StackOfFunctions.push(funcionUno);
StackOfFunctions.push(funcionDos);
StackOfFunctions.push(funcionTres);

async.series(StackOfFunctions, 
    function(err, result) {
        if(err) {
            console.err(err);
            return;
        }

        console.log(result);
    }
);

