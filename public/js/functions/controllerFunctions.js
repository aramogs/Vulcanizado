const funcion = {};

const dbE = require('../../db/conn_empleados');


funcion.getUsers = (user) => {
    return new Promise((resolve, reject) => {
        dbE(`
        SELECT 
            emp_name
        FROM
            empleados
        WHERE
            emp_num = ${user}
        AND 
            emp_area = "VULC"
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


module.exports = funcion;