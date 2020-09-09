var geojson;
let startCoords = [64.853337, 96.519000];
let startZoom = 3;

const data = d3.json('data/states_ru.json')
.then(function(data) {
    
    console.log(data);

    var map = L.map('mapid').setView(startCoords, startZoom);
    let zoomState = 0;


    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: '© George Volichenko',
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    
    function style(feature) {
        return {
            fillColor: "#75d99f",
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function highlightFeature(e) {
        
        var layer = e.target;

        if(zoomState == 0){
           
            
            layer.setStyle({
                weight: 5,
                color: '#e1fa91',
                dashArray: '',
                fillOpacity: 0.7,
                fillColor: "#0c992b"
            });
        
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
            info.update(layer.feature.properties);
        }
        
    }
    
    function zoomToFeature(e) {
        // if the previous state was not-zoomed
        if(zoomState==0){
            map.fitBounds(e.target.getBounds());
            var layer = e.target;
            info.updateClick(layer.feature.properties);
            // make the state zoomed
            zoomState=1;
        }
        // if the previous state was zoomed
        else { // ISSUE: to unzoom click needs to be within the geojson
            map.setView(startCoords, startZoom);
            // make the state unzoomed
            zoomState=0;
            geojson.resetStyle();
        }
    }
    

    function resetHighlight(e) {
        if(zoomState==0){
            geojson.resetStyle(e.target);
            info.update();
        }
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    geojson = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        if(props){
            this._div.classList.remove("hovering");
            this._div.innerHTML = `${props.name_en}` ;
        }
        else{
            this._div.classList.add("hovering");
            this._div.innerHTML =  '• Hover to see region name <br /> • Click for more detail'  ;
        }
    };

    info.updateClick = function (props) {
        this._div.innerHTML = `${props.name_ru}`;
    };

    info.addTo(map);



});