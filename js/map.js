// Go get it!! The GeoJSON that is!
var communityGeoJSON = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'http://live-westfield-ny.pantheonsite.io/api/geojson?type=event',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

// Initialize the map
var map = L.map('map').setView([0, 0], 0);

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
    	'<img src="' + baseUrl + feature.properties.field_featured_image + '" width="301px" height="270px" class="popup-top-image">' + 
      '<div class="popupbody"><div class="popuptitle"><h3>' + feature.properties.name + '</h3></div>' + 
      feature.properties.description + 
      '<p><a href="' + baseUrl + feature.properties.path + '" class="btn btn-default orbitist-btn"><span class="fa fa-link center-block"></span> Learn More</a></p>' +
      '<p><a href="https://www.google.com/maps/dir/Current+Location/' + feature.geometry.coordinates[1] + ',' + feature.geometry.coordinates[0] + '" target="_blank" class="btn btn-default orbitist-btn"><span class="fa fa-car center-block"></span> Driving Directions</a></p>',
    	{closeButton: true}
    );
  } else if (feature.properties.field_featured_image.length == 0 && feature.properties.field_image_gallery.length > 2) {
    layer.bindPopup(
      '<img src="' + baseUrl + feature.properties.field_image_gallery + '" width="301px" height="270px" class="popup-top-image">' + 
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

// Define the orbitistIcon
var orbitistIcon = L.icon({
    iconUrl: 'img/orbitist-icon-blue.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -40]
});

// Markercluster Group
var markers = L.markerClusterGroup();

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

// Use leaflet hash do set location
var hash = new L.Hash(map);