var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log('XHR-TEST RESPONSE ' + xhttp.responseText);
    }
};
xhttp.open("GET", "?pge=okela.js", true);
xhttp.send();
