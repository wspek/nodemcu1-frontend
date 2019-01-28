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

function createGraphic() {
    var ctx = document.getElementById("temperatureChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: 'Temperatura EJEMPLO',
                data: [6, 6, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}



$(document).ready(() => { 
    createGraphic();    
});



$( window ).on( "load", function() { intervalHandler1 = window.setInterval(() => {loadLastMeasurement();}, 5000); });
$( window ).on( "unload", function() { window.clearInterval(intervalHandler1); });