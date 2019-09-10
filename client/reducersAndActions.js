import { combineReducers } from "redux";

//REDUCER
// Set up reducer and switch

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const CHANGE_STATUS = 'CHANGE_STATUS'
const reducer = (
  state = {
    result: "buffy",
    count: 0,
    loading:false,
    visitas:[
      { latLng: { lat: 10.994742, lng: -74.798193 }, direccion: '', gestante: '', rcv: '', cancer: '' }
    ],
    field: "whaddup",
    form: {
      name: "bob",
      age: 21,
      home: "UT"
    }
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
  console.log('receivePosts',json);

  return {
    type: RECEIVE_POSTS,
    payload: json,
  }
}

const changeLoading=(state)=>({type:CHANGE_STATUS,payload:state});

function fetchPosts(payload){



  return (dispatch)=>{
    dispatch(changeLoading(true));


    return fetch(`https://172.25.2.13:3000/visitas/municipio`,{
      method:'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        dpto:payload.dp,
        promotor:payload.promotor
      })
    })
      .then(response=>response.json())
      .then(json =>{
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        console.log(json);
        const markers = [];
        json.forEach((v,k)=>{
          //let commaPos = v.LATITUD.indexOf('');
          //let coordinatesLat = parseFloat(v.LATITUD.substring(0, commaPos));
          if(v.LATITUD && v.LONGITUD){
            let latlng = {latlng:{lat:parseFloat(v.LATITUD), lng:parseFloat(v.LONGITUD)},direccion:v.DIRECCION,gestante:v.GESTANTES,cancer:v.CANCER,rcv:v.RCV};
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

export { simpleAction, increaseCount, updateField, updateForm, fetchPosts };

//COMBINE REDUCERS
// added combine reducers to this file to easily develop little projects like this one
export default combineReducers({
  reducer
});
