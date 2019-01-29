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

function sendNewConfig() {
var newConfig = { greenLedState: 0, bicolorLedState: 0, msInterval: 60000 };
    
    newConfig.greenLedState = $("#led_state").val();
    newConfig.msInterval = $("#interval").val() * 1000;

    if(confirm("¿Está seguro de enviar la configuración?")) {
        console.log("SendNewConfig() => ", newConfig);
        $.ajax({
            type: 'POST',
            data: JSON.stringify(newConfig),
            contentType: 'application/json',
            url: 'api/lastState/nodemcu1',						
            success: function(result, status, xhr) {
                console.log('New Config success: ', JSON.stringify(result));
                alert("Se envio la nueva configuracion correctamente.");
            }
        });
    }

    return;
}

// Espera a que el DOM este disponible
$(document).ready(() => {
    // Agregamos un handler al metodo submit
    $("#configForm").submit(
        function(event){
            // Previene que se envie el formulario y se cambie de url
            event.preventDefault();
            //
            // A partir de aqui se debe efectuar lo que se quiere
            sendNewConfig();
        }
    );  
});


$( window ).on( "load", function() { intervalHandler = window.setInterval(() => {loadLastState();}, 5000); });
$( window ).on( "unload", function() { window.clearInterval(intervalHandler); });