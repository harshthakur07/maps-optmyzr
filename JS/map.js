
var initialLocation;
var map, infoWindow,marker;
var dateAndTime;
var pos = {};

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
       console.log(dateAndTime)
        // getWeather(clickLat, clickLon);
        infoWindow.setPosition(initialLocation)
        // infoWindow.setContent('<div><h6>Date And Time:' + dateAndTime + '</h6></div>');
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
     console.log(initialLocation)
     map.setCenter(initialLocation);
     map.setZoom(4);
     infoWindow.setPosition(initialLocation);
     let d = new Date(position.timestamp)
     d = d.toLocaleString()
     infoWindow.setContent('<div><h6>Date And Time:' + d + '</h6></div>');

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
     console.log("apicall", apicall);

     var xhr = new XMLHttpRequest()
     xhr.open('GET', apicall)
     xhr.onload = function () {
         if (xhr.status === 200) {
             var output = JSON.parse(xhr.responseText)
             console.log(output.status)
             if (output.status == 'OK') {
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
     let apicall = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng;
     let xhr = new XMLHttpRequest()
     xhr.open('GET', apicall)
     xhr.onload = function () {
         if (xhr.status === 200) {
             var output = JSON.parse(xhr.responseText)
             console.log(output.status)
             if (output.status == 'OK') {
                 console.log(output)
             }
         } else {
             alert('Request failed.  Returned status of ' + xhr.status)
         }
     }
     xhr.send()
     infoWindow.setContent('<div><h6>Date And Time:' + dateAndTime + '</h6></div>');
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
     console.log("error")
     map.setCenter(new google.maps.LatLng(28.7041, 77.1025)); // New Delhi
     map.setZoom(5);
 }