var intervalHandler1;

function loadLastMeasurement() {
    $.ajax({
        url: 'api/lastMeasurement/nodemcu1',
        type: 'GET',
        datatype: 'json',
        success: function( result ) {
            var date = new Date(result.timestamp * 1000);
            $('#timestamp').html(date.toLocaleString());
            $('#temperatura').html(`${result.temperature} ºC`);
            $('#humedad').html(`${result.humity} %`);
            $('#wifiSignal').html(`${result.wifiSignal} dB`);
            console.log(result);
        }
    });
}

$( window ).on( "load", function() { intervalHandler1 = window.setInterval(() => {loadLastMeasurement();}, 5000); });
$( window ).on( "unload", function() { window.clearInterval(intervalHandler1); });