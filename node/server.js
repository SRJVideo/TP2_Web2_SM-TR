const mysql = require("mysql");
const connString = "mysql://urser-tp2:AVNS_K1Z7ax2UdEVbfuAtfQv@mysql-tp2-sm-tr-monptitdoigt29-4875.aivencloud.com:16151/tp2bd?ssl-mode=REQUIRED";

let conn=mysql.createConnection(connString);
let sql;

conn.connect(err => {
    if(err) throw err;
    console.log("Connexion à la base de données tp2 !");

    //DROP TABLE IF EXISTS
    sql = "DROP TABLE IF EXISTS evenements";
    conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log("Table Evenements détruite ❌");
    })

     sql = "DROP TABLE IF EXISTS utilisateurs";
    conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log("Table Utilisateurs détruite ❌");
    })


    //CREATE TABLE
    sql = "CREATE TABLE utilisateurs"+
        " (Id INT not null AUTO_INCREMENT, "+
        " Full_Name VARCHAR(255), "+
        " Mot_De_Passe VARCHAR(255), "+
        " PRIMARY KEY (Id) )";
    conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log("Table Utilisateurs créée 👍");
    })

    sql = "CREATE TABLE evenements"+
        " (Id INT not null AUTO_INCREMENT, "+
        " Titre VARCHAR(255), "+
        " Date_event DATE, "+
        " Id_Utilisateur INT, "+
        " PRIMARY KEY (Id), "+
        " FOREIGN KEY (Id_Utilisateur) REFERENCES utilisateurs (Id) ON DELETE CASCADE)";
    conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log("Table Evenements créée 👍");
    })


});