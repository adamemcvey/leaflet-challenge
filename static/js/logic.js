var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// function to return the color based on magnitude
function markerColor(depth) {
  if (depth > 9) {
    return "#FF5733"
  } else if (depth > 6) {
    return "#FF9C33"
  } else if (depth > 3) {
    return "#F0FF33"
  } else {
    return "#A8FF33"
  }
}

// GET request, and function to handle returned JSON data
d3.json(queryUrl, function(data) {
  
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature : addPopup,
    pointToLayer: addMarker
  });

// call function to create map
  createMap(earthquakes);

});

function addMarker(feature, location) {
  var options = {
    stroke: false,
    color: markerColor(feature.geometry.coordinates[2]),
    fillColor: markerColor(feature.geometry.coordinates[2]),
    radius: markerSize(feature.properties.mag),
    fillOpacity: 0.75
  }

  return L.circleMarker(location, options);

}

// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
    
    return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <p><b> Depth: ${feature.geometry.coordinates[2]}</b></p> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <p> ${Date(feature.properties.time)} </p>`);
}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes) {

    // Define streetmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      maxZoom: 12,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    
    var baseMaps = {
      "Street Map": streetmap
    };
  
    
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [41.8781, -87.6298],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    }).addTo(myMap);

  
    // creating the legend
    var legend = L.control({position: 'bottomright'});

    // add legend to map
    legend.onAdd = function () {
    
        var div = L.DomUtil.create('div', 'info legend')
        
        div.innerHTML = "<legend><table>"
        +"<tr><th>Depth</th><th>Color</th></tr>"
        +"<tr><th>>9km</th><td id=cell1></td>"
        +"</tr><tr><th>>6km & <9m</th><td id=cell2></td></tr>"
        +"<tr><th>>3m & <6km</th><td id=cell3></td></tr>"
        +"<tr><th><3km</th><td id=cell4></td></tr></table></legend>";
        
        return div;
    };
    
    legend.addTo(myMap);

    
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  }
