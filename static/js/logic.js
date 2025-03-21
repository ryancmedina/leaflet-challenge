// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map


// Create the map object with center and zoom options.
let map = L.map("map", {
  center : [35, -95],
  zoom: 5
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map);
// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {

    //console.log(feature)
    //console.log(feature.geometry.coordinates[2])
    return {
      
      fillColor : getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      opacity : 1,
      fillOpacity: 1,
      weight: .5
    }
  }
  console.log(data);
  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    //return "#ff7800";

    if(depth >= 90)
    {
      return "#db3030";
    }
    else if(depth >= 70)
    {
      return "#e36230";
    }
    else if(depth >= 50)
    {
      return "#e3822d";
    }
    else if(depth >= 30)
    {
      return "#edc540";
    }
    else if(depth >= 10)
    {
      return "#d4e635";
    }
    else
    {
      return "#97e33b";
    }
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return magnitude * 6.2;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, feature);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: function(feature) {
      return styleInfo(feature);
      
    }, 
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h2> Magnitude: " + feature.properties.mag + "</h2> <hr> <h2> Coordinates: " + feature.geometry.coordinates[0] + ", " + feature.geometry.coordinates[1] + "</h2>" + "</h2> <hr> <h2> Depth: " + feature.geometry.coordinates[2]);
    }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(map);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
    let colors = ["#97e33b", "#d4e635", "#edc540", "#e3822d", "#e36230", "#db3030"];
    let limits = ["-10 - 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "90+"];
    let labels = [];

    let legendInfo = "<h1>Legend</h1>" +
      "<div class=\"labels\">" +
        //"<div class=\"min\">" + limits[0] + "</div>" +
        //"<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\">" + limits[index] + "</li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";

    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(map);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.


    // Then add the tectonic_plates layer to the map.

  });
});
