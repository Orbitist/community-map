var mapId = 2459; //Orbitist Map Number

// Retrieve map info
$(document).ready(
    function(){
        $.getJSON(
            'https://orbitist.space/maps/api/v1/map.json?mapid=' + mapId,
            function(data){
                // ciclo l'array
                for(i=0; i<data.length; i++){
                    var  content  = '<img src="';
                         content +=  data[i].map_image;
                         content  += '" class="img-responsive">';
                    	 	 content  += '<div class="story-slide-content"><h4>';
                         content +=  data[i].map_title;
                         content  += '</h4>';
                         content +=  data[i].map_body;
                         content +=  '</div>';
                         cartodbkey =  'https://rtpi.carto.com/api/v2/viz/14adcc16-5f28-11e6-afb2-0e3ff518bd15/viz.json'; //Carto JS URL
                         basemapurl =  'https://api.mapbox.com/styles/v1/rtpi/cirp79zp20009g9nq28g5925m/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicnRwaSIsImEiOiJjaXIzZDRna2EwMDNmZm5ucm55NmNwdjdwIn0.RVOQGHQSVBIixBdVZP6E4A'; //Base Map URL to XYZ Tiles
                         custombasemapurl = null; // Another base layer if wanted
                         customcss = data[i].map_css;
                         googleanalytics = data[i].map_google_analytics;
                    $('div.mapinfo').append(content);
                    $('head').append('<style>' + customcss + '</style>');

					// Add cartodb layer
					cartodb.createLayer(map, cartodbkey).addTo(map);
					// Add ZXY tile layers
					if ( basemapurl.length > 10 ) {
						L.tileLayer(basemapurl, {
							attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors © <a href="http://mapbox.com/map-feedback/">Mapbox</a>'
						}).addTo(map);
					}
					if ( custombasemapurl.length > 10 ) {
						L.tileLayer(custombasemapurl).addTo(map);
					}
	//Google Analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  //If user submitted google analytics cods
	if ( googleanalytics.length > 5 ) {
		ga('create', googleanalytics, 'auto', {'name':'b'});
		ga('create', 'UA-50308061-3', 'auto');
		ga('send', 'pageview');
		ga('b.send', 'pageview');
	}
	//Otherwise just load the Orbitist Tracking code
	else {
		ga('create', 'UA-50308061-3', 'auto');
		ga('send', 'pageview');
	}

                }
            }
        );
    }
);

// Set lat/long where the map initiates and at what zoom level
var map = new L.Map('map',{maxZoom: 18});





// Get points //
var json = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'https://orbitist.space/maps/api/v1/points/' +  mapId + '.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

var orbitistGeoJson = json;

// ADVANCED: This tells the map what goes in popups.
function orbitistPopup(feature, layer) {
    // does this feature have an image?
    if (feature.properties.point_image.length > 2) {
        layer.bindPopup(
        	'<a href="' + feature.properties.point_image + '" data-lightbox="' + feature.properties.point_id + '" data-title="' + feature.properties.point_image_caption + '"><img src="' + feature.properties.point_thumbnail + '" width="301px" height="270px" class="popup-top-image"><div class="popupimage-expand"><span class="fa fa-clone"></span></div></a>' + feature.properties.point_lightbox_images + '<div class="popupbody"><div class="popuptitle"><h3>' + feature.properties.point_title + '</h3></div>' + feature.properties.point_embeds + feature.properties.point_body + feature.properties.point_links + '<div class="action-items"><div class="col-xs-6"><a href="https://www.google.com/maps/dir/Current+Location/' + feature.geometry.coordinates[1] + ',' + feature.geometry.coordinates[0] + '" target="_blank"><span class="fa fa-car center-block"></span></a></div><div class="col-xs-6"><a href="https://orbitist.space/maps/print/' + feature.properties.point_id + '" target="_blank"><span class="fa fa-print center-block"></span></a></div></div></div>',
        	{closeButton: false}
        );
    } else {
        layer.bindPopup(
        	'<div class="popupbody"><div class="popuptitle"><h3>' + feature.properties.point_title + '</h3></div>' + feature.properties.point_embeds + feature.properties.point_body + feature.properties.point_links + '<div class="action-items"><div class="col-xs-6"><a href="https://www.google.com/maps/dir/Current+Location/' + feature.geometry.coordinates[1] + ',' + feature.geometry.coordinates[0] + '" target="_blank"><span class="fa fa-car center-block"></span></a></div><div class="col-xs-6"><a href="https://orbitist.space/maps/print/' + feature.properties.point_id + '" target="_blank"><span class="fa fa-print center-block"></span></a></div></div></div>',
        	{closeButton: false}
        );
    }
}

// Set cluster var
var markers = L.markerClusterGroup({maxClusterRadius: 25});

// Add markers to map based on geojson
var geoJsonLayer = L.geoJson(orbitistGeoJson, {
	pointToLayer: function(feature, latlng) {
	   var smallIcon = L.divIcon({
className: feature.properties.point_marker_class,
iconSize: [30, 30],
iconAnchor: [15, 30],
popupAnchor: [0, -28]
	   });
	   return L.marker(latlng, {icon: smallIcon});
	},
    onEachFeature: orbitistPopup
});

markers.addLayer(geoJsonLayer);
map.addLayer(markers);
map.fitBounds(markers.getBounds());

// Use leaflet hash
var hash = new L.Hash(map);
// Use leaflet locate control
L.control.locate().addTo(map);