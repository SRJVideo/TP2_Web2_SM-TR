const mysql = require("mysql");
const connString = "mysql://urser-tp2:AVNS_K1Z7ax2UdEVbfuAtfQv@mysql-tp2-sm-tr-monptitdoigt29-4875.aivencloud.com:16151/tp2bd?ssl-mode=REQUIRED";

let conn=mysql.createConnection(connString);

conn.connect(err => {
    if(err) throw err;
    console.log("Connexion à la base de données tp2 !");

});