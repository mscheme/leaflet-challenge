

// Create the map
let map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
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

    // function to determine marker style
    function magStyle(feature){
        style = {
        radius: magnitude(feature.properties.mag),
        fillColor: color(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
        }

        return style
    }

    // function to calculate magnitude
    function magnitude(mag){
        if ((mag===0)|(mag == null)){
            return 0.5;
        }
        else{
            return mag * 3;
        }
    }

    // create scale for color
    function color(mag){
        if ((mag < 1) | (mag == null)){
            return "#4CD341";
        }
        else if (mag < 2){
            return "#B4D92F";
        }
        else if (mag < 3){
            return "#F8ED17";
        }
        else if (mag < 4){
            return "#F2BD23";
        }
        else if (mag < 5){
            return "#F08F2E";
        }
        else{
            return "#F43A3A";
        }
    
    }

    L.geoJSON(features, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng)
        },
        onEachFeature: onEachFeature,
        style: magStyle
    }).addTo(map);

    // create and add legend
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        colors = [
            "#4CD341",
            "#B4D92F",
            "#F8ED17",
            "#F2BD23",
            "#F08F2E",
            "#F43A3A"
          ];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    }
    
    // add legend to map
    legend.addTo(map);
    
});

  