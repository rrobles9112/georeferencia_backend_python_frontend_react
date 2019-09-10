import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import {useGoogleMap, useMap} from "./maps_hooks";
import {useDispatch, useSelector} from "react-redux";

const API_KEY = "AIzaSyB_EnMHR2IUG_SjC_ZInE1sfcTuYdY8qPo";


// hookを利用して表示するコンポーネント
const Gmap = (props) => {
    console.log('maps props', props);
    const {visitas} = useSelector(state => ({
        ...state.reducer
    }));
    const googleMap = useGoogleMap(API_KEY);



    const [initialConfig, setSenter] = useState({
        zoom: 11,
        center: {lat: 10.479766, lng: -75.455080}
    });

    useEffect(() => {
        const {center:{latlng}} = props;
        console.log('chanaged center=', latlng)
        setSenter(prev=>{
            console.log(prev)
            return{
                ...prev,
                center: latlng
            }
        })


    },[props.center]);
    const dispatch = useDispatch();
    const mapContainerRef = useRef(null);
    useMap({googleMap, mapContainerRef, initialConfig, visitas});
    return (
        <div
            style={{
                height: "70vh",
                width: "100%"
            }}
            ref={mapContainerRef}
        />
    );
};

export default Gmap;
