var geoJsonAPI = 'http://live-westfield-ny.pantheonsite.io/api/geojson/points';

// Create Markercluster Group
var markers = L.markerClusterGroup();

// Initialize the map
var map = L.map('map');

// Define the orbitistIcon
var orbitistIcon = L.icon({
    iconUrl: 'img/orbitist-icon-blue.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -40]
});

var updateMap = function(mapJSON) {

// Go get it!! The GeoJSON that is!
var communityGeoJSON = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': mapJSON,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();
  
// Add a tile layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.light'
}).addTo(map);

// Function for rendering the popups. This is where they are styled yo!
function onEachFeature(feature, layer) {
  var baseUrl = 'http://live-westfield-ny.pantheonsite.io'
  // Check for featured image, then image gallery. If neither, don't use an image in popup
  if (feature.properties.field_featured_image.length > 2) {
    layer.bindPopup(
    	'<img src="' + baseUrl + feature.properties.field_featured_image + '" width="301px" class="popup-top-image">' + 
      '<div class="popupbody"><div class="popuptitle"><h3>' + feature.properties.name + '</h3></div>' + 
      feature.properties.description + 
      '<p><a href="' + baseUrl + feature.properties.path + '" class="btn btn-default orbitist-btn"><span class="fa fa-link center-block"></span> Learn More</a></p>' +
      '<p><a href="https://www.google.com/maps/dir/Current+Location/' + feature.geometry.coordinates[1] + ',' + feature.geometry.coordinates[0] + '" target="_blank" class="btn btn-default orbitist-btn"><span class="fa fa-car center-block"></span> Driving Directions</a></p>',
    	{closeButton: true}
    );
  } else if (feature.properties.field_featured_image.length == 0 && feature.properties.field_image_gallery.length > 2) {
    layer.bindPopup(
      '<img src="' + baseUrl + feature.properties.field_image_gallery + '" width="301px" class="popup-top-image">' + 
      '<div class="popupbody"><div class="popuptitle"><h3>' + feature.properties.name + '</h3></div>' + 
      feature.properties.description + 
      '<p><a href="' + baseUrl + feature.properties.path + '" class="btn btn-default orbitist-btn"><span class="fa fa-link center-block"></span> Learn More</a></p>' +
      '<p><a href="https://www.google.com/maps/dir/Current+Location/' + feature.geometry.coordinates[1] + ',' + feature.geometry.coordinates[0] + '" target="_blank" class="btn btn-default orbitist-btn"><span class="fa fa-car center-block"></span> Driving Directions</a></p>',
    	{closeButton: true}
    );
  } else {
    layer.bindPopup(
      '<div class="popupbody"><div class="popuptitle"><h3>' + feature.properties.name + '</h3></div>' + 
      feature.properties.description + 
      '<p><a href="' + baseUrl + feature.properties.path + '" class="btn btn-default orbitist-btn"><span class="fa fa-link center-block"></span> Learn More</a></p>' +
      '<p><a href="https://www.google.com/maps/dir/Current+Location/' + feature.geometry.coordinates[1] + ',' + feature.geometry.coordinates[0] + '" target="_blank" class="btn btn-default orbitist-btn"><span class="fa fa-car center-block"></span> Driving Directions</a></p>',
      {closeButton: true}
    );
  }
}

// Put layer into markercluster group.
markers.addLayer(
  L.geoJSON(communityGeoJSON, {
    style: function (feature) {
      return feature.properties && feature.properties.style;
    },
    onEachFeature: onEachFeature,

    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {icon: orbitistIcon});
    }
  })
);

// Add markercluster layer to the map.
map.addLayer(markers);

// Fit bounds to markers layer
map.fitBounds(markers.getBounds());

} // End updateMap variable function

// Run the entire functional map code
updateMap(geoJsonAPI);

// Remove Spinner Function
function removeSpinner() {
  $(document).find(".spinner").delay(2000).fadeOut(500, function () {
    $(this).remove();
  });
}

// Show Spinner Function
function showSpinner() {
  $("body").append("<div class='spinner'><div class='sk-spinner sk-spinner-pulse'></div></div>");
}

// FILTER FUNCTIONS FROM BUTTON PUSHES
// Filter Events
function renderEvents() {
  markers.clearLayers();
  var eventsGeoJsonAPI = 'http://live-westfield-ny.pantheonsite.io/api/geojson/events';
  updateMap(eventsGeoJsonAPI);
  removeSpinner();
}
async function filterEvents() {
  showSpinner();
  renderEvents();
}

// Filter Points of interest
function renderPointsOfInterest() {
  markers.clearLayers();
  var pointsGeoJsonAPI = 'http://live-westfield-ny.pantheonsite.io/api/geojson/points';
  updateMap(pointsGeoJsonAPI);
  removeSpinner();
}
async function filterPointsOfInterest() {
  showSpinner();
  renderPointsOfInterest();
}

// Filter Organizations
function renderOrganizations() {
  markers.clearLayers();
  var orgsGeoJsonAPI = 'http://live-westfield-ny.pantheonsite.io/api/geojson/organizations';
  updateMap(orgsGeoJsonAPI);
  removeSpinner();
}
async function filterOrganizations() {
  showSpinner();
  renderOrganizations();
}

// Remove spinner when the document is ready the first time
$(document).ready(function() {
  removeSpinner();
});