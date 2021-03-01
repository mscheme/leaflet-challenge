

// Create the map
let map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
});

// create base layer
let baseLayer = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
        attribution:
          "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY,
      }
).addTo(map);


// get data from url - all earthquakes last 30 days
url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

d3.json(url, function(data) {
    let features = data.features;
    
    // function to show pop-up with additional info
    function onEachFeature(feature,layer){
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + 
            "</p></p>Magnitue: "+ feature.properties.mag+ "</p>");
    }

    let geojsonMarkerOptions = {
        radius: 3,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }

    L.geoJSON(features, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng, geojsonMarkerOptions)
        },
        onEachFeature: onEachFeature
    }).addTo(map);

    
});

  