var intervalHandler;

function loadLastState() {
    $.ajax({
        url: 'api/lastState/nodemcu1',
        type: 'GET',
        datatype: 'json',
        success: function( result ) {
            strLedState = ['Apagado', 'Encendido'];

            $('#greenLedState').html(strLedState[result.greenLedState]);
            $('#msInterval').html(result.msInterval/1000.0);
            console.log(result);
        }
    });
}


$(document).ready(() => { 
    
});

$( window ).on( "load", function() { intervalHandler = window.setInterval(() => {loadLastState();}, 5000); });
$( window ).on( "unload", function() { window.clearInterval(intervalHandler); });