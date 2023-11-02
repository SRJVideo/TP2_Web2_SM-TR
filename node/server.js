const mysql = require("mysql");
const express = require('express');
const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

let sql;
const saltRounds = 10;
const connString = "mysql://urser-tp2:AVNS_K1Z7ax2UdEVbfuAtfQv@mysql-tp2-sm-tr-monptitdoigt29-4875.aivencloud.com:16151/tp2bd?ssl-mode=REQUIRED";
let conn = mysql.createConnection(connString);

const app = express();
app.use(express.json());
app.use(cors({
    origin:["http://localhost:8081"],
    methods:["GET","POST","DELETE"],
    credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    key: "userID",
    secret: "secret du groupe !",
    // https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session
    resave:false,
    saveUninitialized: false,
    cookie:{expires: 60*60*24}
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log("");
    console.log("requete recu !!!")
    next();
});

// POST un nouvel utilisateur
app.post('/addUser', (req, res) => {
    const nom = req.body.nom;
    const motdepasse = req.body.motdepasse;
    console.log("Ajout d'utilisateur")

    conn.connect(err => {
        if (err) throw err;

        const query = "INSERT INTO utilisateurs (Full_Name, Mot_De_Passe) VALUES (?,?);";
        bcrypt.hash(motdepasse, saltRounds, (er, hash) => {
            if (er) console.log(er);

            conn.query(query, [nom, hash], (err, result) => {
                if (err) throw err;
                res.status(201).json({result});
            });
        });
    });
});

//  GET pour obtenir tous les événements
app.get('/events', (req, res) => {
    conn.connect(err => {
        if (err) throw err;

        const query = 'SELECT * FROM evenements';
        conn.query(query, (err, results) => {
            if (err) {
                console.error('Erreur lors de la récupération des événements : ' + err);
                res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
                return;
            }
            res.json(results);
        });
    })
});

//  POST pour ajouter un nouvel événement
app.post('/addEvents', (req, res) => {
    conn.connect(err => {
        if (err) throw err;

        const query = "INSERT INTO evenements (Titre, Date_event) VALUES ('"+req.query.titre+"', STR_TO_DATE('"+req.query.date+"', '%d/%m/%Y'))";
        conn.query(query, (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'ajout de lévénement : ' + err);
                res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'événement' });
                return;
            }
            res.status(201).json({result});
        });
    })
});

//  DELETE pour supprimer un événement par son ID
app.delete('/deleteEvents/:id', (req, res) => {
    const eventId = req.params.id;

    conn.connect(err => {
        if (err) throw err;

        const query = 'DELETE FROM evenements WHERE id = ?';
        conn.query(query, [eventId], (err, result) => {
            if (err) {
                console.error('Erreur lors de la suppression de l\'événement : ' + err);
                res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
                return;
            }
            res.status(204).send();
        });
    })

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
});

const server = app.listen(8081, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("TP2 Samba-Taha http://%s:%s", host, port)
});