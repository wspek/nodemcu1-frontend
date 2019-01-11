var intervalHandler;

$(document).ready(() => { 
    console.log('Desde jquery');

    $('#btnRefresh').click( () => {
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
    });

    //intervalHandler = window.setInterval(() => {console.log('Hola');}, 5000);
});

$( window ).on( "load", function() { intervalHandler = window.setInterval(() => {document.getElementById("btnRefresh").click();}, 5000); });
$( window ).on( "unload", function() { window.clearInterval(intervalHandler); });