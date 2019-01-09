
function setUpdate() {
    intervalHandler = setInterval(window.alert('Hola'), 3000);
}

function clearState() {
    clearInterval(intervalHandler);
}

//var intervalHandler = setInterval(window.alert('Hola'), 3000);

//window.onload=setUpdate();
//window.onunload=clearUpdate();