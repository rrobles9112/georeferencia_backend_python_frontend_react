from sanic import Sanic
from sanic.response import json, file
import ibm_db
import gc
import os
import ssl

import time


app = Sanic()

conn_str='database=SIGRI;hostname=172.25.2.10;port=50000;protocol=tcpip;uid=salfamws;pwd=Us3rWebs#19;SCHEMA=SALUD'
conn = ibm_db.pconnect(conn_str,'','')

BASE = os.getcwd()
app.static('/', './dist')
#app.static('/main.js', './dist/main.js', name='main.js')


@app.route('/')
async def index(request):
    return await file('./dist/index.html')


@app.post("/visitas/municipio")
async def filter_handler(request):
    body_json = request.json
    start_time = time.time()
    dpto = body_json['dpto']
    promotor = body_json['promotor']
    where = ''
    if(promotor):
        where= "AND GEO.PROMOTOR = ?"
        params = dpto, promotor

    else:
        params = dpto,

    select = f"SELECT * FROM SALUD.SF_GEOREFERENCIACION AS GEO WHERE GEO.DPTO = ? {where} AND GEO.LATITUD  IS NOT NULL AND GEO.LONGITUD IS NOT NULL"

    stmt = ibm_db.prepare(conn, select)
    ibm_db.execute(stmt,params)

    dictionary = ibm_db.fetch_assoc(stmt)
    result = []
    while dictionary != False:
        print("The ID is : ", dictionary["LATITUD"])
        dictionary = ibm_db.fetch_assoc(stmt)
        result.append(dictionary)

    print("--- %s seconds ---" % (time.time() - start_time))

    return json(result)

@app.post("/visitas/promotores")
async def promotores_handler(request):
    body_json_promotor = request.json
    start_time = time.time()
    select = "SELECT ID,(NOMBRES ||' '||APELLIDOS) AS NOMBRES FROM SALUD.USERS WHERE ACTIVO='0' AND DPTO=? AND TIPO_USUARIO='5'"
    dpto = body_json_promotor['dpto']
    params = dpto,
    stmt = ibm_db.prepare(conn, select)
    ibm_db.execute(stmt,params)

    dictionary = ibm_db.fetch_assoc(stmt)
    result = []
    while dictionary != False:
        dictionary = ibm_db.fetch_assoc(stmt)
        result.append(dictionary)

    print("--- %s seconds ---" % (time.time() - start_time))

    return json(result)

@app.route("/dptos")
async def dptos_handler(request):
    start_time = time.time()
    sql_dpto = "SELECT ID, NOMBRE, CODIGO FROM SALUD.DPTO"
    stmt = ibm_db.exec_immediate(conn, sql_dpto)

    result = []
    dictionary = ibm_db.fetch_assoc(stmt)
    while dictionary != False:
        dictionary = ibm_db.fetch_assoc(stmt)
        result.append(dictionary)


    print("--- %s seconds ---" % (time.time() - start_time))

    return json(result)


context = ssl.create_default_context(purpose=ssl.Purpose.CLIENT_AUTH)
context.load_cert_chain("/etc/httpd/ssl/saludfamiliar.co.crt", keyfile="/etc/httpd/ssl/saludfamiliar.co.key")

if __name__ == "__main__":
    app.run(host="172.25.2.13", port=3000, ssl=context)