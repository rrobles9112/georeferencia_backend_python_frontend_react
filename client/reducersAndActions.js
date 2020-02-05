import {combineReducers} from "redux";

//REDUCER
// Set up reducer and switch

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const CHANGE_STATUS = 'CHANGE_STATUS'
const reducer = (
    state = {
        result: "buffy",
        count: 0,
        loading: false,
        visitas: [
            {latLng: {lat: 10.994742, lng: -74.798193}, direccion: '', gestante: '', rcv: '', cancer: ''}
        ],
        ipss:require('./helpers/ips'),
        field: "whaddup",
        form: {
            name: "bob",
            age: 21,
            home: "UT"
        },
        riesgosPorDepartamento: [
            {
                Etiqueta: "Antioquia",
                Total: "339126",
                HipertencionRiegoLatetnte: "9365",
                Nefroproteccion: "354",
                Renal: "4266",
                Diabetes: "6260",
                HipertensionRiesgoAlto: "150"
            },
            {
                Etiqueta: "Arauca",
                Total: "5699",
                HipertencionRiegoLatetnte: "37",
                Nefroproteccion: "0",
                Renal: "3",
                Diabetes: "14",
                HipertensionRiesgoAlto: "1"
            },
            {
                Etiqueta: "Atlantico",
                Total: "267516",
                HipertencionRiegoLatetnte: "13578",
                Nefroproteccion: "319",
                Renal: "4182",
                Diabetes: "6634",
                HipertensionRiesgoAlto: "579"
            },
            {
                Etiqueta: "Bolivar",
                Total: "295350",
                HipertencionRiegoLatetnte: "10427",
                Nefroproteccion: "2526",
                Renal: "4991",
                Diabetes: "8776",
                HipertensionRiesgoAlto: "3"
            },
            {
                Etiqueta: "Boyaca",
                Total: "48995",
                HipertencionRiegoLatetnte: "2509",
                Nefroproteccion: "47",
                Renal: "786",
                Diabetes: "850",
                HipertensionRiesgoAlto: "4"
            },
            {
                Etiqueta: "Cesar",
                Total: "86191",
                HipertencionRiegoLatetnte: "3372",
                Nefroproteccion: "87",
                Renal: "1169",
                Diabetes: "489",
                HipertensionRiesgoAlto: "316"
            },
            {
                Etiqueta: "Cordoba",
                Total: "108910",
                HipertencionRiegoLatetnte: "1817",
                Nefroproteccion: "41",
                Renal: "576",
                Diabetes: "788",
                HipertensionRiesgoAlto: "48"
            },
            {
                Etiqueta: "Cundinamarca",
                Total: "30966",
                HipertencionRiegoLatetnte: "1063",
                Nefroproteccion: "1",
                Renal: "3",
                Diabetes: "379",
                HipertensionRiesgoAlto: "0"
            },
            {
                Etiqueta: "Guainia",
                Total: "41493",
                HipertencionRiegoLatetnte: "150",
                Nefroproteccion: "0",
                Renal: "12",
                Diabetes: "80",
                HipertensionRiesgoAlto: "50"
            },
            {
                Etiqueta: "Magdalena",
                Total: "229829",
                HipertencionRiegoLatetnte: "5596",
                Nefroproteccion: "81",
                Renal: "1314",
                Diabetes: "3004",
                HipertensionRiesgoAlto: "2265"
            },
            {
                Etiqueta: "Norte de santander",
                Total: "139790",
                HipertencionRiegoLatetnte: "4224",
                Nefroproteccion: "59",
                Renal: "2136",
                Diabetes: "3074",
                HipertensionRiesgoAlto: "37"
            },
            {
                Etiqueta: "Risaralda",
                Total: "3575",
                HipertencionRiegoLatetnte: "2",
                Nefroproteccion: "0",
                Renal: "1",
                Diabetes: "2",
                HipertensionRiesgoAlto: "0"
            },
            {
                Etiqueta: "Santander",
                Total: "217750",
                HipertencionRiegoLatetnte: "7885",
                Nefroproteccion: "490",
                Renal: "6045",
                Diabetes: "5317",
                HipertensionRiesgoAlto: "178"
            },
            {
                Etiqueta: "Sucre",
                Total: "71143",
                HipertencionRiegoLatetnte: "2238",
                Nefroproteccion: "89",
                Renal: "824",
                Diabetes: "1287",
                HipertensionRiesgoAlto: "2"
            },
            {
                Etiqueta: "Valle del cauca",
                Total: "343248",
                HipertencionRiegoLatetnte: "19321",
                Nefroproteccion: "786",
                Renal: "11157",
                Diabetes: "6060",
                HipertensionRiesgoAlto: "237"
            }
        ]
    },
    action
) => {
    switch (action.type) {
        case "SIMPLE_ACTION":
            return {
                ...state,
                result: state.result === "the slayer" ? "buffy" : "the slayer"
            };
        case CHANGE_STATUS:
            return {
                ...state,
                loading: action.payload
            };
        case RECEIVE_POSTS:
            return {
                ...state,
                visitas: action.payload
            };
        case "INCREASE_COUNT":
            return {
                ...state,
                count: state.count + 1
            };
        case "UPDATE_FIELD":
            return {
                ...state,
                field: action.payload
            };
        case "UPDATE_FORM":
            return {
                ...state,
                form: {
                    ...state.form,
                    ...action.payload
                }
            };
        default:
            return state;
    }
};

// ACTIONS
// combined action and reducer files to easily develop little projects like this one


const simpleAction = () => dispatch => {
    dispatch({
        type: "SIMPLE_ACTION",
        payload: "result_of_simple_action"
    });
};

function receivePosts(json) {
    console.log('receivePosts', json);

    return {
        type: RECEIVE_POSTS,
        payload: json,
    }
}

const changeLoading = (state) => ({type: CHANGE_STATUS, payload: state});

function fetchPosts(payload) {


    return (dispatch) => {
        dispatch(changeLoading(true));


        return fetch(`https://172.25.3.53:3000/visitas/municipio`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dpto: payload.dp,
                promotor: payload.promotor
            })
        })
            .then(response => response.json())
            .then(json => {
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.
                console.log(json);
                const markers = [];
                json.forEach((v, k) => {
                    //let commaPos = v.LATITUD.indexOf('');
                    //let coordinatesLat = parseFloat(v.LATITUD.substring(0, commaPos));
                    if (v.LATITUD && v.LONGITUD) {
                        let latlng = {
                            latlng: {lat: parseFloat(v.LATITUD), lng: parseFloat(v.LONGITUD)},
                            direccion: v.DIRECCION,
                            gestante: v.GESTANTES,
                            cancer: v.CANCER,
                            rcv: v.RCV
                        };
                        markers.push(latlng);
                    }
                    //  points.push(new Point(parseFloat(v.LATITUD),parseFloat(v.LONGITUD),{}));
                });

                dispatch(receivePosts(markers))
                dispatch(changeLoading(false));
            })
    }
}

function actionFetchConcentration(payload) {
    return (dispatch) => {
        dispatch(changeLoading(true));


        return fetch(`https://172.25.3.53:3000/visitas/concentracion`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          /*  body: JSON.stringify({
                dpto: payload.dp,
                promotor: payload.promotor
            })*/
        })
            .then(response => response.json())
            .then(json => {

                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.
                console.log(json);
                const markers = [];
                json.forEach((v, k) => {
                    //let commaPos = v.LATITUD.indexOf('');
                    //let coordinatesLat = parseFloat(v.LATITUD.substring(0, commaPos));
                    if (v.LATITUD && v.LONGITUD) {
                        let latlng = {
                            latlng: {lat: parseFloat(v.LATITUD), lng: parseFloat(v.LONGITUD)},
                            direccion: v.DIRECCION,
                            nombre1: v.NOMBRE1,
                            nombre2: v.NOMBRE2,
                            apellido1: v.APELLIDO1,
                            apellido2: v.APELLIDO2,
                            gestante: v.GESTANTES,
                            cancer: v.CANCER,
                            rcv: v.RCV
                        };
                        markers.push(latlng);
                    }
                    //  points.push(new Point(parseFloat(v.LATITUD),parseFloat(v.LONGITUD),{}));
                });

                dispatch(receivePosts(markers))
                dispatch(changeLoading(false));
            })
    }
}

const increaseCount = () => dispatch => {
    dispatch({
        type: "INCREASE_COUNT"
    });
};

const updateField = field => dispatch => {
    dispatch({
        type: "UPDATE_FIELD",
        payload: field
    });
};

const updateForm = form => dispatch => {
    dispatch({
        type: "UPDATE_FORM",
        payload: form
    });
};

export {simpleAction, increaseCount, updateField, updateForm, fetchPosts, actionFetchConcentration};

//COMBINE REDUCERS
// added combine reducers to this file to easily develop little projects like this one
export default combineReducers({
    reducer
});
