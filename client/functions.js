export async function fetchMunicipios(value) {
  // eslint-disable-next-line no-undef

  const response = await fetch(`https://127.0.0.1:3000/municipios/dpto/${value}`, { method: "get" })
  const data = await response.json();
  return data;
}

export async function fetchDpto() {
  // eslint-disable-next-line no-undef
  const response = await fetch(`https://127.0.0.1:3000/dptos`, { method: "get" })
  const data = await response.json();
  return data;
}


export async function fetchVisita(dpto,mun) {
  // eslint-disable-next-line no-undef
  const response = await fetch(`https://127.0.0.1:3000/visitas/municipio/${mun}/${dpto}`, { method: "get" })
  const data = await response.json();
  return data;
}

export async function fetchPromotoresByDpto(dpto) {

  console.log('fetchPromotoresByDpto=',dpto);
  const response = await fetch(`https://127.0.0.1:3000/visitas/promotores`, { method: "POST",body:JSON.stringify({dpto:dpto}), headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, })
  const data = await response.json();
  return data;
}
