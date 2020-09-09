

//Width and height
var w = 1000;
var h = 800;
const padding = 10;
const margin=30;

//Create SVG element
var svg = d3.select("body")
.select(".map-container")
.append("svg")
.attr("width", w)
.attr("height", h);

console.log(svg);

// Defining zoome events
const zoom = d3.zoom()
.scaleExtent([1, 3])
//.on("wheel", event => event.preventDefault())
.on('zoom', zoomed);

// callback function for the zoom event
function zoomed() {
  g.attr('transform', 
  d3.event.transform);
};

// Click on a region event
const regionClick = (data) => {
  document.querySelector(".message").innerHTML = `${data.properties.name_ru}`
};

// define projection
const proj = d3.geoMercator()
.scale(400)
.center([92.6,76 ]);

// define geopath
const geopath = d3.geoPath().projection(proj);

const g = svg.append("g");


// import topojson
const us = d3.json('data/ru_states_places3.json')
.then(function(us) {


    // State shapes
    g.selectAll("path")
        .data(topojson.feature(us, us.objects.subunits).features)
        .call(d => console.log(d))
        .enter()
        .append("path")
        .attr("d", geopath)
        .attr("class","state")
        .attr("fill","#75d99f")
        .on("click", d=> regionClick(d))
        .append("title")
        .text(d => `${d.properties.name_ru}`)
        ;

    // Border lines
      g.append("path")
        .datum(topojson.mesh(us, us.objects.subunits, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "#e1fa91")
        .attr("stroke-linejoin", "round")
        .attr("d", geopath); 
        

    // Adding cities with simple circles
    g.selectAll("circle")
        .data(us.objects.places.geometries) // 
        .enter()
        .append("circle")
        .attr("class", "place")
        .attr("cx",d => proj(d.coordinates)[0])
        .attr("cy",d => proj(d.coordinates)[1])
        .attr("fill","#3ab555")
        .on("click", d=> regionClick(d))
        .attr("r",2)
        .append("title")
        .text(d => `${d.properties.name_ru}`);
        

});

svg.call(zoom);

