const mysql = require("mysql");
const connString = "mysql://urser-tp2:AVNS_K1Z7ax2UdEVbfuAtfQv@mysql-tp2-sm-tr-monptitdoigt29-4875.aivencloud.com:16151/tp2bd?ssl-mode=REQUIRED";

let conn = mysql.createConnection(connString);
let sql;

var express = require('express');
var app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log("");
    console.log("requete recu !!!")
    next(); // permet de renvoyer la réponse et ainsi appeller la fonction ici-bas 
});


conn.connect(err => {
    if (err) throw err;
    console.log("Connexion à la base de données tp2 !");

    //DROP TABLE IF EXISTS
    sql = "DROP TABLE IF EXISTS evenements";
    conn.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Table Evenements détruite ❌");
    })

    sql = "DROP TABLE IF EXISTS utilisateurs";
    conn.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Table Utilisateurs détruite ❌");
    })


    //CREATE TABLE
    sql = "CREATE TABLE utilisateurs" +
        " (Id INT not null AUTO_INCREMENT, " +
        " Full_Name VARCHAR(255), " +
        " Mot_De_Passe VARCHAR(255), " +
        " PRIMARY KEY (Id) )";
    conn.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Table Utilisateurs créée 👍");
    })

    sql = "CREATE TABLE evenements" +
        " (Id INT not null AUTO_INCREMENT, " +
        " Titre VARCHAR(255), " +
        " Date_event DATE, " +
        " Id_Utilisateur INT, " +
        " PRIMARY KEY (Id), " +
        " FOREIGN KEY (Id_Utilisateur) REFERENCES utilisateurs (Id) ON DELETE CASCADE)";
    conn.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Table Evenements créée 👍");
    })

    // Endpoint GET pour obtenir tous les événements
    app.get('/events', (req, res) => {
        const query = 'SELECT * FROM evenements';
        conn.query(query, (err, results) => {
            if (err) {
                console.error('Erreur lors de la récupération des événements : ' + err);
                res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
                return;
            }
            res.json(results);
        });
    });

    // Endpoint POST pour ajouter un nouvel événement
    app.post('/events', (req, res) => {
        const query = "INSERT INTO evenements (Titre, Date_event) VALUES ('"+req.query.titre+"', STR_TO_DATE('"+req.query.date+"', '%d/%m/%Y'))";
        conn.query(query, (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'ajout de lévénement : ' + err);
                res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'événement' });
                return;
            }
            res.status(201).json({result});
        });
    });

    // Endpoint DELETE pour supprimer un événement par son ID
    app.delete('/events/:id', (req, res) => {
        const eventId = req.params.id;
        const query = 'DELETE FROM evenements WHERE id = ?';
        conn.query(query, [eventId], (err, result) => {
            if (err) {
                console.error('Erreur lors de la suppression de l\'événement : ' + err);
                res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
                return;
            }
            res.status(204).send();
        });
    });




});
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})