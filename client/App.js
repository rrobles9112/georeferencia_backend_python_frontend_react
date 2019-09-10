import React, {useEffect, useState, useCallback} from 'react';
import logo from './logo.svg';
import {useSelector, useDispatch} from "react-redux";
import {simpleAction, increaseCount, fetchPosts} from "./reducersAndActions.js";
import {Button, Row, Col, Form, Select, Input, Spin, Tabs} from 'antd';
import Gmap from "./hooks/Maps";
import {fetchMunicipios, fetchDpto, fetchVisita, fetchPromotoresByDpto} from './functions';
import Error from './Error'
import qs from 'query-string';

const {TabPane} = Tabs;

function callback(key) {
    console.log(key);
}

import './App.css';

const Option = Select.Option;


const App = () => {


    const {result, count, loading} = useSelector(state => ({
        ...state.reducer
    }));
    const dispatch = useDispatch();
    const increase = useCallback(() => dispatch(increaseCount()), [dispatch]);

    const position = [51.505, -0.09];
    const [municipios, setMunicipios] = useState([]);
    const [promotores, setPromotores] = useState([]);
    const [optionPromotorSelected, setOptionPromotorSelected] = useState('');
    const [promotor, setPromotor] = useState([]);
    const [queryString, setQueryString] = useState({});
    const [visitas, setVisita] = useState([]);
    const [dptos, setDptos] = useState([]);
    const [mun, setMum] = useState(1);
    const [dp, setDP] = useState("13");
    // 3.436865, -76.524991
    const [markersData, setMarkersData] = useState([
        {latlng: {lat: 10.399890, lng: -75.501829}, title: 1, dpto: 13},
        {latlng: {lat: 3.436865, lng: -76.524991}, title: 1, dpto: 76}
    ]);

    const createGPX = () => {

        (async () => {
            dispatch(fetchPosts({mun: mun, dp: dp, promotor:promotor, filter: queryString}));
        })();

    }

    useEffect(() => {

        // Actualiza el título del documento usando la API del navegador
        document.title = `Informacion Riesgo para la ciudad de cartagena`;
        let search = qs.parse(window.location.search);
        console.log('qs=', search);
        if (search != null) {
            setQueryString(search);
        }


        (async () => {
            setDptos([])
            setMunicipios([])
            // dispatch(fetchPosts({mun:mun,dp:dp,filter:queryString}));
            const dptos = await fetchDpto();

            setDptos(dptos.filter((item) => item.CODIGO == "13" || item.CODIGO == "76"))

        })()


    }, []);


    return (
        <div className="App">
            <Row>
                <header className="App-header">
                    <Col>
                        <img src={logo} className="App-logo" alt="logo"/>
                    </Col>
                    <Col>
                        <h1 className="App-title">INFORMACION RIESGO AFILIADOS GEOREFERENCIADA</h1>
                    </Col>


                </header>
            </Row>
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="Georeferenciacion (fuentes externas)" key="1">


                    <Row justify="center" style={{width: '70%', margin: '0 auto'}}>
                        <Form layout="vertical">
                            <Form.Item label=""></Form.Item>
                            <Row type={`flex`}>
                                <Col xs={24} md={12}>

                                    <Form.Item label="Departamento">
                                        <Select size={`large`} style={{width: '100%'}} disabled={false}
                                                placeholder={`Seleccione el Departamento`} onChange={(value) => {
                                            setDP(value);
                                            (async () => {
                                                const promotores_data = await fetchPromotoresByDpto(value);
                                                setPromotores(promotores_data)

                                            })()


                                        }}>
                                            {dptos && dptos.map((v, k) => {
                                                return (<Option key={`dpto_${k}_${v.CODIGO}`}
                                                                value={v.CODIGO}>{v.NOMBRE}</Option>)
                                            })}
                                        </Select>
                                    </Form.Item>

                                </Col>
                                {/*<Col xs={24} md={12}>
              <Form.Item label="Municipio">
                <select size={`large`} aria-readonly={true} disabled={true} className='ant-select-custom' style={{ width: '100%' }} placeholder={`Seleccione el municipio`} onChange={(e) => {
                  let val = parseInt(e.target.value);
                  setMum(val);
                }}>
                  {municipios && municipios.map((v, k) => {
                    return (<option key={`municipio_${k}_${v.CODIGO}_${v.ID_DPTO}`} value={v.CODIGO}>{v.NOMBRE}</option>)
                  })}
                </select>
              </Form.Item>
            </Col>*/}
                                <Col xs={12} md={12}>
                                    <Form.Item label="Promotores">
                                        <Select size={`large`} aria-readonly={true} disabled={false}
                                                className='ant-select-custom' style={{width: '100%'}} value={optionPromotorSelected}
                                                placeholder={`Seleccione el promotor`} onChange={(value) => {
                                            let val = parseInt(value);
                                            setPromotor(val);
                                            setOptionPromotorSelected(val);
                                        }}>
                                            {promotores && promotores.map((v, k) => {
                                                return (<Option key={`promotor_${k}_${v.ID}_${v.NOMBRES}`}
                                                                value={v.ID}>{v.NOMBRES}</Option>)
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item>
                                <Button type="primary" onClick={createGPX} disabled={false}>Filtrar</Button>
                            </Form.Item>

                        </Form>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Spin spinning={loading}/>
                        </Col>
                    </Row>
                    <div className='map-container'>
                        {/*<Map markersData={markersData} />*/}
                        <Gmap filter={queryString} center={markersData.filter(item => item.dpto == dp)[0]}/>
                    </div>
                </TabPane>
                <TabPane tab="Georeferenciacion (fuentes internas)" key="2">
                    NO DATA
                </TabPane>
            </Tabs>


        </div>
    );
};

export default App;
