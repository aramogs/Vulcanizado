//Conexion a base de datos
const controller = {};
var amqp = require('amqplib/callback_api');
const jwt = require('jsonwebtoken');
//Require Redis
const redis = require('redis');
//Require Funciones
const funcion = require('../public/js/functions/controllerFunctions');


controller.index_GET = (req, res) => {
    user = req.connection.user
    res.render('index.ejs', {
        user
    });
}

controller.login = (req, res) => {
    res.render('login.ejs', {
    });
}

controller.accesoDenegado_GET = (req, res) => {
    user = req.connection.user
    res.render('acceso_denegado.ejs', {
        user
    });
}



controller.mainMenu_GET = (req, res) => {
    
    let user_id = req.res.locals.authData.id.id
    let user_name = req.res.locals.authData.id.username
    res.render('main_menu.ejs', {
        user_id,
        user_name
    })
}

controller.userAccess_POST = (req, res) => {
    let user_id = req.body.user
    funcion.getUsers(user_id)
        .then((result) => {
            if (result.length == 1) {
                emp_nombre = result[0].emp_name

                accessToken(user_id, emp_nombre)
                    .then((result) => {
                        cookieSet(req, res, result)
                    })
                    .catch((err) => { res.json(err); })

            } else {
                res.json("unathorized")
            }
        })
        .catch((err) => {
            console.error(err);
            res.json(err)
        })
}

function accessToken(user_id, user_name) {
    return new Promise((resolve, reject) => {
        const id = { id: `${user_id}`, username: `${user_name}` }
        jwt.sign({ id }, `tristone`, {/*expiresIn: '1h'*/}, (err, token) => {
            resolve(token)
            reject(err)
        })
    })
}


function cookieSet(req, res, result) {

    let minutes = 15;
    const time = minutes * 60 * 1000;
    res.cookie('accessToken', result,
        {
            maxAge: time,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production' ? true : false
        })
    res.json(result)

}


controller.auditoriaProduccion_GET = (req, res) => {
    let estacion = req.res.locals.macIP.mac
    let user_id = req.res.locals.authData.id.id
    let user_name = req.res.locals.authData.id.username
    res.render('auditoria_produccion.ejs', {
        user_id,
        user_name,
        estacion
    });
}

controller.auditoriaExt_POST = (req, res) => {
    let estacion = req.res.locals.macIP.mac
    let serial = req.body.serial
    let proceso = req.body.proceso
    let user_id = req.res.locals.authData.id.id



    let send = `{
            "station":"${estacion}",
            "serial_num":"${serial}",
            "process":"${proceso}", 
            "user_id":"${user_id}"
        }`

    amqpRequest(send, "rpc_vul")
        .then((result) => { res.json(result) })
        .catch((err) => { res.json(err) })
}


controller.verify_hashRedis_POST = (req, res) => {

    let estacion_hash = (req.body.estacion).replace(/:/g, "-")
    async function getStatus() {
        const redis_client = redis.createClient({host: `${process.env.DB_REDIS_SERVER}`});
        redis_client.on('error',err=>(console.log("error",err)))
        redis_client.get(estacion_hash, function(err, reply) { res.json(reply)});
        redis_client.quit()
        
    }
    getStatus()
}

function amqpRequest(send, queue) {
    return new Promise((resolve, reject) => {
        var args = process.argv.slice(2);
        if (args.length == 0) {
            // console.log("Usage: rpc_client.js num");
            // process.exit(1);
        }

        amqp.connect(`amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_SERVER}`, function (error0, connection) {
            if (error0) {
                // throw error0;
                reject(error0)
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    // throw error1;
                    reject(error1)
                }
                channel.assertQueue('', {
                    exclusive: true
                }, function (error2, q) {
                    if (error2) {
                        // throw error2;
                        reject(error2)
                    }
                    var correlationId = send.estacion;
                    console.log(' [x] Requesting: ', send);

                    channel.consume(q.queue, function (msg) {
                        if (msg.properties.correlationId == correlationId) {
                            console.log(' [x] Response:   ', msg.content.toString());
                            resolve(msg.content.toString())
                            setTimeout(function () {
                                connection.close();
                                // process.exit(0)
                            }, 500);

                        }
                    }, {
                        noAck: true
                    });

                    channel.sendToQueue(queue, Buffer.from(send.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue
                    });
                });
            });
        });
    })
}


module.exports = controller;