const fs = require('fs');
const XLSX = require('xlsx');


export async function fetchMunicipios(value) {
  // eslint-disable-next-line no-undef

  const response = await fetch(`https://172.25.3.53:3000/municipios/dpto/${value}`, { method: "get" })
  const data = await response.json();
  return data;
}

export async function fetchDpto() {
  // eslint-disable-next-line no-undef
  const response = await fetch(`https://172.25.3.53:3000/dptos`, { method: "get" })
  const data = await response.json();
  return data;
}


export async function fetchVisita(dpto,mun) {
  // eslint-disable-next-line no-undef
  const response = await fetch(`https://172.25.3.53:3000/visitas/municipio/${mun}/${dpto}`, { method: "get" })
  const data = await response.json();
  return data;
}

export async function fetchPromotoresByDpto(dpto) {

  console.log('fetchPromotoresByDpto=',dpto);
  const response = await fetch(`https://172.25.3.53:3000/visitas/promotores`, { method: "POST",body:JSON.stringify({dpto:dpto}), headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, })
  const data = await response.json();
  return data;
}

export async function obtenerAfiliadosParaConcentracion(dpto) {

  const response = await fetch(`https://172.25.16.53:3000/visitas/concentracion`, { method: "POST",body:JSON.stringify({dpto:dpto}), headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, })
  const data = await response.json();
  return data;
}


export function createInfoBoxPanel(visibility, datos){

            console.log('Visibility',datos);

            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#fff';
            controlUI.style.border = '2px solid #fff';
            controlUI.id = 'panel-info';
            controlUI.style.borderRadius = '3px';
            controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            controlUI.style.cursor = 'pointer';
            controlUI.style.marginBottom = '22px';
            controlUI.style.textAlign = 'center';
            controlUI.style.zIndex = '1';
            controlUI.style.width = '30%';
            controlUI.style.display = visibility ? 'block':'none';
            controlUI.title = 'Click to recenter the map';


            // Set CSS for the control interior.
            const controlText = document.createElement('div');
            controlText.style.color = 'rgb(25,25,25)';
            controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlText.style.fontSize = '16px';
            controlText.style.lineHeight = '38px';

            controlText.style.paddingLeft = '5px';
            controlText.style.paddingRight = '5px';
            controlText.innerHTML = `
            <h2>Riesgo Departamental para: ${datos.Etiqueta}</h2>
              <dl class="row justify-content-center align-content-start">
                 <dt class="col-5 align-self-center">HIPERTENSIÓN RIESGO LATENTE</dt>
                    <dd class="col-5">
                        ${datos.HipertencionRiegoLatetnte}
                    </dd>

                    <dt class="col-5 align-self-center">NEFROPROTECCION</dt>
                    <dd class="col-5">${datos.Nefroproteccion}</dd>

                    <dt class="col-5 align-self-center">RENAL</dt>
                    <dd class="col-5">${datos.Renal}</dd>

                    <dt class="col-5 align-self-center">DIABETES</dt>
                    <dd class="col-5">${datos.Diabetes}</dd>

                    <dt class="col-5 align-self-center">HIPERTENSION RIESGO ALTO</dt>
                    <dd class="col-5">${datos.HipertensionRiesgoAlto}</dd>
              </dl>
            `;
            controlUI.appendChild(controlText);

            return controlUI;

}




