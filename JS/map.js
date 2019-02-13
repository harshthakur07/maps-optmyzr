var initialLocation;
var map, infoWindow, marker;
var dateAndTime;
var pos = {};
var weatherCondition={}


function initMap() {
    infoWindow = new google.maps.InfoWindow;

    map = new google.maps.Map(document.getElementById('map'));

    google.maps.event.addListener(map, "click", function (event) {

        var clickLat = event.latLng.lat();
        var clickLon = event.latLng.lng();
        initialLocation = new google.maps.LatLng(clickLat, clickLon);
        map.setCenter(initialLocation);
        map.setZoom(4);
        getDateAndTime(clickLat, clickLon)
        infoWindow.setPosition(initialLocation)
        if (marker && marker.setMap) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(clickLat, clickLon),
            map: map
        });
        marker.addListener('click', () => {
            infoWindow.open(map)
        })
    });


    //Get Initial Location

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCurrentLocation, positionError);
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}


function getCurrentLocation(position) {
    initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map.setCenter(initialLocation);
    map.setZoom(4);
    infoWindow.setPosition(initialLocation);
    let d = new Date(position.timestamp)
    d = d.toLocaleString()
    // infoWindow.setContent('<div><h6>Date And Time:' + d + '</h6></div>');
    getDateAndTime(position.coords.latitude, position.coords.longitude);
    marker = new google.maps.Marker({
        position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        },
        map: map
    })
    marker.addListener('click', () => {
        infoWindow.open(map)
    })
}


function getDateAndTime(lat, lng) {
    var loc = lat + ', ' + lng
    var targetDate = new Date()
    var timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60
    var apikey = 'AIzaSyCW5tYUfHKZ_r4R8aeuBrirWmx2XL-Cm5Q'
    var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + timestamp + '&key=' + apikey

    var xhr = new XMLHttpRequest()
    xhr.open('GET', apicall)
    xhr.onload = function () {
        if (xhr.status === 200) {
            var output = JSON.parse(xhr.responseText)
            if(output.status =='ZERO_RESULTS'){
                infoWindow.setContent('<div><h6> No Record</h6></div>');
            }
            else if (output.status == 'OK') {
                var offsets = output.dstOffset * 1000 + output.rawOffset * 1000
                var localdate = new Date(timestamp * 1000 + offsets)
                dateAndTime = localdate.toLocaleString()
                getWeatherCondition(dateAndTime, lat, lng)
            }
        } else {
            alert('Request failed.  Returned status of ' + xhr.status)
        }
    }
    xhr.send()
}


function getWeatherCondition(dateAndTime, lat, lng) {
    let apiKey = '0ff1502b464421808a1228b260a2da69'
    let apicall = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=' + apiKey;
    let xhr = new XMLHttpRequest()
    xhr.open('GET', apicall)
    xhr.onload = function () {
        if (xhr.status === 200) {
            var output = JSON.parse(xhr.responseText)
           
            if (output.base== "stations") {
                weatherCondition['clouds'] = output.weather[0].description,
                weatherCondition['wind speed'] = output.wind.speed
                weatherCondition['humidity'] = output.main.humidity
                weatherCondition['tempMax'] = (parseInt(output.main.temp_max) - 273.15).toFixed(2);
                weatherCondition['tempMin'] = (parseInt(output.main.temp_min) - 273.15).toFixed(2);

            }
        } else {
            alert('Request failed.  Returned status of ' + xhr.status)
        }
    }

    xhr.send()
    setTimeout(() => {
        
        infoWindow.setContent('<div><h6>Date And Time:' + dateAndTime + '</h6>'
        +
        '<h5>Weahter Conditions--</h5>'
        +
        '<h6>Humidity: ' + weatherCondition['humidity'] + '</h6>'
        +
            '<h6>Clouds: ' + weatherCondition['clouds'] + '</h6>'
            +
            '<h6>Wind Speed: ' + weatherCondition['wind speed'] + ' Kph'+'</h6>'
            +
            '<h6>Maximum Temperature(in &#8451): ' + weatherCondition['tempMax']+'</h6>'
            +
            '<h6>Minimum Temperature(in &#8451): ' + weatherCondition['tempMin'] + '</h6>'
            +
        '</div>');

    }, 1000);
   
}

// Not Required

//  function getCityName(lat, lng) {
//      let apiKey = 'AIzaSyDjV5eaWScF7ah3Kx29XoBarmTSmhcXnbw'
//      let apicall = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ', ' + lng + '&key=' + apiKey
//      let xhr = new XMLHttpRequest()
//      xhr.open('GET', apicall)
//      xhr.onload = function () {
//          if (xhr.status === 200) {
//              var output = JSON.parse(xhr.responseText)
//              console.log(output.status)
//              if (output.status == 'OK') {
//                  console.log(output)
//              }
//          } else {
//              alert('Request failed.  Returned status of ' + xhr.status)
//          }
//      }
//      xhr.send()
//  }

function positionError(position) {
    map.setCenter(new google.maps.LatLng(28.7041, 77.1025)); // New Delhi
    map.setZoom(5);
}