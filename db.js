var mysql = require('mysql');
var db_config={
    host : '127.0.0.1',
    user : 'root',
    password : 'MohitDave@1994',
    database : 'webapp'
}

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config);
    connection.connect(function(err){
        if(err){
            console.error('error creating connection', err);
            setTimeout(handleDisconnect,2000);
        }
    })
    connection.on('error', function(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleDisconnect();
        }else{
            throw err;
        }
    })
}
handleDisconnect();

module.exports = connection;