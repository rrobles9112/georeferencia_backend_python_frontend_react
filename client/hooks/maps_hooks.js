import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import GoogleMapsApiLoader from "google-maps-api-loader";
import {createInfoBoxPanel} from "../helpers/functions";
import {useSelector} from "react-redux";

const removeAccents = require('remove-accents-diacritics');

const useGoogleMap = apiKey => {
    const [googleMap, setGoogleMap] = useState(null);
    useEffect(() => {
        GoogleMapsApiLoader({
            libraries: ['places', 'visualization'],
            apiKey: apiKey // optional
        }).then(google => {
            setGoogleMap(google);
        });
    }, []);
    return googleMap;
};

const useMap = ({googleMap, mapContainerRef, initialConfig, visitas}) => {
    const [map, setMap] = useState(null);
    useEffect(
        () => {
            console.log('new center = ', initialConfig);
            if (!googleMap || !mapContainerRef.current) {
                return;
            }
            // 初始化
            const map = new googleMap.maps.Map(
                mapContainerRef.current,
                initialConfig
            );

            const request = {
                query: 'Cartagena, Colombia',
                fields: ['name', 'geometry'],
            };


            const service = new googleMap.maps.places.PlacesService(map);
            const geocoder = new googleMap.maps.Geocoder();

            geocoder.geocode({'address': 'Cartagena, Colombia'}, function ({results}, status) {
                if (status === 'OK') {
                    console.log('Geocode', results);
                    /*resultsMap.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: resultsMap,
                        position: results[0].geometry.location
                    });*/
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });

            const getPoints = () => {
                let points = [];

                visitas.forEach((item, k) => {

                    const {latlng: {lat = 0} = {lat}, latlng: {lng = 0} = {lng}, direccion, gestante, rcv, cancer} = item;
                    // console.log('point=',Number(lat.toString().substring(0, lat.toString().indexOf('.')+4)), Number(lng.toString().substring(0, lng.toString().indexOf('.')+4)));
                    let p = {
                        location: new googleMap.maps.LatLng(Number(lat.toString().substring(0, lat.toString().indexOf('.') + 4)), Number(lng.toString().substring(0, lng.toString().indexOf('.') + 4))),
                        weight: 3
                    };

                    console.log(p);
                    points.push(p)

                })
                return points;
            };


            /*const heatmap = new googleMap.maps.visualization.HeatmapLayer({
                data: getPoints(),
                map:map,
                opacity:1,
                radius:10
            });*/


            service.findPlaceFromQuery(request, function (results, status) {

                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        console.log(results[i]);
                        // createMarker(results[i]);
                    }

                    // map.setCenter(results[0].geometry.location);
                }
            });


            visitas.forEach(({latlng, direccion, rcv, gestante, cancer}, k) => {
                console.log('markers=', latlng, direccion, rcv, gestante, cancer);

                let icon = {
                    scaledSize: new google.maps.Size(8, 8), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                };
                let riesgo = ''

                if (rcv == "1") {
                    riesgo = 'RCV';
                    icon.url = "https://172.25.3.53:3000/circle_red.svg";
                } else if (gestante == "1") {
                    riesgo = 'GESTANTE';
                    icon.url = "https://172.25.3.53:3000/circle_green.svg";
                } else if (cancer == "1") {
                    riesgo = 'CANCER';
                    icon.url = "https://172.25.3.53:3000/circle_orange.svg";
                } else {
                    riesgo = 'NO TIENE';
                    icon.url = "https://172.25.3.53:3000/circle_black.svg";
                }


                const marker = new googleMap.maps.Marker({
                    position: latlng,
                    icon: icon,
                    map: map
                });


                const InfoWindow = new googleMap.maps.InfoWindow({
                    content: `<div id="content">
                                    <p><b>Direccion: </b>${direccion}</p>
                                    <p><b>Riesgo: </b>${riesgo}</p>
                              </div>`
                });

                // marker

                marker.addListener("click", () => {
                    InfoWindow.open(map, marker);
                });

            })

            setMap(map);
        },
        [googleMap, mapContainerRef, visitas, initialConfig]
    );
    return map;
};

const useMapWithHeatMap = ({googleMap, mapContainerRef, initialConfig, visitas}) => {
    const [map, setMap] = useState(null);
    const {ipss} = useSelector(state => ({
        ...state.reducer
    }));
    console.log('Ips from redux', ipss)
    useEffect(
        () => {
            console.log('new center = ', initialConfig);
            if (!googleMap || !mapContainerRef.current) {
                return;
            }
            // 初始化
            const map = new googleMap.maps.Map(
                mapContainerRef.current,
                initialConfig
            );

            const request = {
                query: 'Cartagena, Colombia',
                fields: ['name', 'geometry'],
            };


            const service = new googleMap.maps.places.PlacesService(map);
            const geocoder = new googleMap.maps.Geocoder();

            ipss.forEach(item=>{
                 console.log('Geocode',item && item, item.DIRECCION && item.DIRECCION, `${item.DIRECCION}, ${item.MUNICIPIO}, ${item.SURCURSAL}`);
                geocoder.geocode({'address': item.DIRECCION && item.DIRECCION}, function (results, status) {

                if (status === 'OK') {
                    console.log('Geocode', results, status);
                    /*resultsMap.setCenter(results[0].geometry.location);*/

                    /*var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });

                    const InfoWindow = new googleMap.maps.InfoWindow({
                    content: `<div id="content">
                                    
                                    <p><b>Ips: </b>${item && item.NOMBRE && item.NOMBRE}</p>
                                    <p><b>Sucursal: </b>${item && item.SUCURSAL && item.SUCURSAL}</p>
                              
                              </div>`
                     });*/

                // marker

                marker.addListener("click", () => {
                    InfoWindow.open(map, marker);
                });


                } else {
                    console.warn('Geocode was not successful for the following reason: ' + status);
                }
            });
            });



            const getPoints = () => {
                let points = [];


                visitas.forEach((item, k) => {

                    const {latlng: {lat = 0} = {lat}, latlng: {lng = 0} = {lng}, direccion, gestante, rcv, cancer} = item;
                    // console.log('point=',Number(lat.toString().substring(0, lat.toString().indexOf('.')+4)), Number(lng.toString().substring(0, lng.toString().indexOf('.')+4)));
                    let p = {
                        location: new googleMap.maps.LatLng(Number(lat.toString().substring(0, lat.toString().indexOf('.') + 4)), Number(lng.toString().substring(0, lng.toString().indexOf('.') + 4))),
                        weight: 3
                    };

                    console.log(p);
                    points.push(p)

                })
                return points;
            };


            let gradient = [
                  'rgba(0, 255, 255, 0)',
                  'rgba(0, 255, 255, 1)',
                  'rgba(0, 191, 255, 1)',
                  'rgba(0, 127, 255, 1)',
                  'rgba(0, 63, 255, 1)',
                  'rgba(0, 0, 255, 1)',
                  'rgba(0, 0, 223, 1)',
                  'rgba(0, 0, 191, 1)',
                  'rgba(0, 0, 159, 1)',
                  'rgba(0, 0, 127, 1)',
                  'rgba(63, 0, 91, 1)',
                  'rgba(127, 0, 63, 1)',
                  'rgba(191, 0, 31, 1)',
                  'rgba(255, 0, 0, 1)'
                ];
            /*const heatmap = new googleMap.maps.visualization.HeatmapLayer({
                data: getPoints(),
                map:map,
                opacity:1,
                radius:0.2,
                dissipating:false
            });*/

            service.findPlaceFromQuery(request, function (results, status) {

                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        console.log(results[i]);
                        // createMarker(results[i]);
                    }

                    // map.setCenter(results[0].geometry.location);
                }
            });


            visitas.forEach(({latlng, direccion, nombre1, nombre2, apellido1, apellido2, rcv, gestante, cancer}, k) => {
                console.log('markers=', latlng, direccion, rcv, gestante, cancer);

                let icon = {
                    scaledSize: new google.maps.Size(14,14),
                    size: new google.maps.Size(14,14),
                    url:"https://172.25.3.53:3000/circle_red.png",
                };

                let riesgo = '';
/*

                if (rcv == "1") {
                    riesgo = 'RCV';
                    icon.url = "https://172.25.3.53:3000/circle_red.svg";
                } else if (gestante == "1") {
                    riesgo = 'GESTANTE';
                    icon.url = "https://172.25.3.53:3000/circle_green.svg";
                } else if (cancer == "1") {
                    riesgo = 'CANCER';
                    icon.url = "https://172.25.3.53:3000/circle_orange.svg";
                } else {
                    riesgo = 'NO TIENE';
                    icon.url = "https://172.25.3.53:3000/circle_black.svg";
                }

*/

                const marker = new googleMap.maps.Marker({
                    position: latlng,
                    icon: icon,
                    map: map
                });


                const InfoWindow = new googleMap.maps.InfoWindow({
                    content: `<div id="content">
                                    <p><b>Direccion: </b>${direccion}</p>
                                    <p><b>Nombres: </b>${nombre1} ${nombre2}</p>
                                    <p><b>Apellidos: </b>${apellido1} ${apellido2}</p>
                                    <p><b>Riesgo: </b>${riesgo}</p>
                              </div>`
                });

                // marker

                marker.addListener("click", () => {
                    InfoWindow.open(map, marker);
                });

            })
            setMap(map);
        },
        [googleMap, mapContainerRef, visitas, initialConfig]
    );
    return map;
};

const useMapWithBounds = ({googleMap, mapContainerRef, initialConfig, visitas, riesgosPorDepartamento}) => {

    const [map, setMap] = useState(null);
    useEffect(
        () => {
            console.log('new center = ', initialConfig);
            if (!googleMap || !mapContainerRef.current) {
                return;
            }
            // 初始化
            const map = new googleMap.maps.Map(
                mapContainerRef.current,
                initialConfig
            );

            const request = {
                query: 'Cartagena, Colombia',
                fields: ['name', 'geometry'],
            };

            const service = new googleMap.maps.places.PlacesService(map);
            const geocoder = new googleMap.maps.Geocoder();

            geocoder.geocode({'address': 'Cartagena, Colombia'}, function ({results}, status) {
                if (status === 'OK') {
                    console.log('Geocode', results);
                    /*resultsMap.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: resultsMap,
                        position: results[0].geometry.location
                    });*/
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });

            const getPoints = () => {
                let points = [];

                visitas.forEach((item, k) => {

                    const {latlng: {lat = 0} = {lat}, latlng: {lng = 0} = {lng}, direccion, gestante, rcv, cancer} = item;
                    // console.log('point=',Number(lat.toString().substring(0, lat.toString().indexOf('.')+4)), Number(lng.toString().substring(0, lng.toString().indexOf('.')+4)));
                    let p = {
                        location: new googleMap.maps.LatLng(Number(lat.toString().substring(0, lat.toString().indexOf('.') + 4)), Number(lng.toString().substring(0, lng.toString().indexOf('.') + 4))),
                        weight: 3
                    };

                    console.log(p);
                    points.push(p)

                })
                return points;
            };


            /*const heatmap = new googleMap.maps.visualization.HeatmapLayer({
                data: getPoints(),
                map:map,
                opacity:1,
                radius:10
            });*/


            const data_layer_nacional = new google.maps.Data({map: map});
            const data_layer_departamental = new google.maps.Data({map: map});
            const data_layer_municipal = new google.maps.Data({map: map});

            data_layer_nacional.loadGeoJson(
                'https://samplehosting-82d42.firebaseapp.com/nacional.geojson');


            data_layer_nacional.setStyle({
                fillColor: 'red',
                strokeWeight: 3,
                strokeColor: 'red',
                zIndex: 70,
                fillOpacity: 0.1
            });

            data_layer_departamental.loadGeoJson(
                'https://samplehosting-82d42.firebaseapp.com/departamental.geojson');

            data_layer_departamental.setStyle({
                fillColor: 'blue',
                strokeWeight: 1,
                strokeColor: 'blue',
                zIndex: 100,
                fillOpacity: 0.0
            });


            data_layer_departamental.addListener('mouseover', function (event) {
                console.log(map.controls);
                const name_dpto_layer = removeAccents.remove(event.feature.getProperty('Name'));


                if (name_dpto_layer) {

                    data_layer_departamental.overrideStyle(event.feature, {strokeWeight: 3});
                    let controlUI = createInfoBoxPanel(true, riesgosPorDepartamento.filter(o => o.Etiqueta ===name_dpto_layer)[0]);
                    console.log('controls=',map.controls[google.maps.ControlPosition.LEFT_CENTER]);
                    if (!map.controls[google.maps.ControlPosition.LEFT_CENTER]){

                    }
                    map.controls[google.maps.ControlPosition.LEFT_CENTER].clear();
                        map.controls[google.maps.ControlPosition.LEFT_CENTER].push(controlUI);


                }


            });

            data_layer_departamental.addListener('mouseout', function (event) {

                data_layer_departamental.revertStyle();
                if(map.controls[google.maps.ControlPosition.LEFT_CENTER]){
                    map.controls[google.maps.ControlPosition.LEFT_CENTER].clear();
                }


            });


            data_layer_municipal.loadGeoJson(
                'https://samplehosting-82d42.firebaseapp.com/municipal.geojson');

            data_layer_municipal.setStyle({
                fillColor: 'slateblue',
                strokeWeight: 0.5,
                strokeColor: 'slateblue',
                zIndex: 50,
                fillOpacity: 0.2
            });


            /*service.findPlaceFromQuery(request, function (results, status) {

                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        console.log(results[i]);
                        // createMarker(results[i]);
                    }

                    // map.setCenter(results[0].geometry.location);
                }
            });*/


            /*visitas.forEach(({latlng, direccion, rcv, gestante, cancer}, k) => {
                console.log('markers=', latlng, direccion, rcv, gestante, cancer);

                let icon = {
                    scaledSize: new google.maps.Size(8, 8), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                };
                let riesgo = ''

                if (rcv == "1") {
                    riesgo = 'RCV';
                    icon.url = "https://172.25.3.53:3000/circle_red.svg";
                } else if (gestante == "1") {
                    riesgo = 'GESTANTE';
                    icon.url = "https://172.25.3.53:3000/circle_green.svg";
                } else if (cancer == "1") {
                    riesgo = 'CANCER';
                    icon.url = "https://172.25.3.53:3000/circle_orange.svg";
                } else {
                    riesgo = 'NO TIENE';
                    icon.url = "https://172.25.3.53:3000/circle_black.svg";
                }


                const marker = new googleMap.maps.Marker({
                    position: latlng,
                    icon: icon,
                    map: map
                });


                const InfoWindow = new googleMap.maps.InfoWindow({
                    content: `<div id="content">
                                    <p><b>Direccion: </b>${direccion}</p>
                                    <p><b>Riesgo: </b>${riesgo}</p>
                              </div>`
                });

                // marker

                marker.addListener("click", () => {
                    InfoWindow.open(map, marker);
                });

            })*/

            setMap(map);
        },
        [googleMap, mapContainerRef, visitas, initialConfig]
    );
    return map;
};

export {useGoogleMap, useMapWithBounds, useMap, useMapWithHeatMap};
