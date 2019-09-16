import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import GoogleMapsApiLoader from "google-maps-api-loader";

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
                    let p = {location: new googleMap.maps.LatLng(Number(lat.toString().substring(0, lat.toString().indexOf('.')+4)), Number(lng.toString().substring(0, lng.toString().indexOf('.')+4))), weight:3};

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
                             console.log('markers=',latlng, direccion, rcv, gestante, cancer);
                            
                            let icon = {
                                scaledSize: new google.maps.Size(8, 8), // scaled size
                                origin: new google.maps.Point(0,0), // origin
                                anchor: new google.maps.Point(0, 0) // anchor
                            };
                            let riesgo = ''

                            if (rcv == "1") {
                                riesgo = 'RCV';
                                icon.url = "https://127.0.0.1:3000/circle_red.svg";
                            } else if (gestante == "1") {
                                riesgo = 'GESTANTE';
                                icon.url = "https://127.0.0.1:3000/circle_green.svg";
                            } else if (cancer == "1") {
                                riesgo = 'CANCER';
                                icon.url = "https://127.0.0.1:3000/circle_orange.svg";
                            }else{
                                riesgo = 'NO TIENE';
                                icon.url = "https://127.0.0.1:3000/circle_black.svg";
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

export {useGoogleMap, useMap};
