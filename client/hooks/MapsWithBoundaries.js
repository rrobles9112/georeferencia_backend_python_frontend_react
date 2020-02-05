import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import {useGoogleMap, useMapWithBounds} from "./maps_hooks";
import {useDispatch, useSelector} from "react-redux";

const API_KEY = "AIzaSyB_EnMHR2IUG_SjC_ZInE1sfcTuYdY8qPo";


// hookを利用して表示するコンポーネント
const MapsWithBoundaries = (props) => {
    console.log('maps props', props);
    const {visitas, riesgosPorDepartamento} = useSelector(state => ({
        ...state.reducer
    }));
    const googleMap = useGoogleMap(API_KEY);


    const [initialConfig, setSenter] = useState({
        zoom: 5,
        center: {lat: 10.479766, lng: -75.455080}
    });

    useEffect(() => {
        const {center: {latlng}} = props;
        console.log('chanaged center=', latlng)
        setSenter(prev => {
            console.log(prev)
            return {
                ...prev,
                center: latlng
            }
        })


    }, [props.center]);
    const dispatch = useDispatch();
    const mapContainerRef = useRef(null);
    useMapWithBounds({googleMap, mapContainerRef, initialConfig, visitas, riesgosPorDepartamento});
    return (
        <>
            <div
                style={{
                    height: "100vh",
                    width: "100%"
                }}
                ref={mapContainerRef}
            />
            <div id="info-riesgo">
                <dl className="row">
                    <dt className="col-sm-3">Bolivar</dt>
                    <dd className="col-sm-9">Total poblacion: 295350</dd>

                    <dt className="col-sm-3">Usuarios con HIPERTENSIÓN RIESGO LATENTE</dt>
                    <dd className="col-sm-9">
                        <p>
                            10427
                        </p>
                    </dd>

                    <dt className="col-sm-3">Usuarios con NEFROPROTECCION</dt>
                    <dd className="col-sm-9">2526</dd>

                    <dt className="col-sm-3">Usuarios con RENAL</dt>
                    <dd className="col-sm-9">4991</dd>

                    <dt className="col-sm-3">Usuarios con DIABETES</dt>
                    <dd className="col-sm-9">8776</dd>

                    <dt className="col-sm-3">Usuarios con HIPERTENSION RIESGO ALTO</dt>
                    <dd className="col-sm-9">3</dd>


                </dl>
            </div>
        </>
    );
};

export default MapsWithBoundaries;
