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
    // NE PAS OUBLIER DE CHANGER À LA FIN DU TP !!!  URL deploy react == https://tp2-deploiement-react-sm-tr.vercel.app/
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    key: "userID",                              //nom du cookie que l'on crée
    secret: "secret du groupe !",
    // https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session
    resave: false,                              // sauvegarde un objet cookie
    saveUninitialized: false,                   // sauvegarder une session [seulement quand il ya nouvelle modif (false)/ tout le temps (true)]
    cookie: {expires: 1000 * 60 * 60 * 24},
}));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log("\nrequete recu !!!")
    next();
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
/********************** utilisateurs ************************************/
// POST un nouvel utilisateur
app.post('/addUser', (req, res) => {
    const event = req.body;

    const query = "INSERT INTO utilisateurs (Full_Name, Mot_De_Passe) VALUES (?,?);";
    bcrypt.hash(event.motdepasse, saltRounds, (er, hash) => {
        if (er) console.log(er);

        conn.query(query, [event.nom, hash], (err, result) => {
            if (err) throw err;
            res.status(201).send(result);
        });
    });

});

//GET machine pour obtenir l'état de la connexion d'utilisateur
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.send({estConnecte: true, utilisateur: req.session.user[0]});
    } else {
        return res.send({estConnecte: false});
    }
});

app.get('/logout', (req, res) => {
        req.session.user = undefined;
        req.session.save((er) => {
            if (er) throw er

            // regenerate the session, which is good practice to help
            // guard against forms of session fixation
            req.session.regenerate(function (e) {
                if (e) throw e
            })
        })
        return res.json("Déconnexion");

})


// POST pour connecter un utilisateur
app.post('/login', express.urlencoded({extended: false}), (req, res) => {
    const event = req.body;

    const query = "SELECT * FROM utilisateurs WHERE Full_Name = ?";
    conn.query(query, event.nom, (err, result) => {
        if (err) res.send({err: err});

        if (result.length > 0) {
            bcrypt.compare(event.motdepasse, result[0].Mot_De_Passe, (error, response) => {
                console.log("Mot de Passe compare: ", response);
                if (response) {
                    // https://expressjs.com/en/resources/middleware/session.html
                    //1 - regenerate the session, which is good practice to help
                    // guard against forms of session fixation
                    req.session.regenerate((er) => {
                        if (er) throw er;

                        //2 - store user information in session, typically a user id
                        req.session.user = result;

                        //3 save the session before redirection to ensure page
                        // load does not happen before session is saved
                        req.session.save((e) => {
                            if (e) console.log(e);
                            console.log(req.session.user);
                            res.json("Un utilisateur est connecté");
                        })
                    })
                } else {
                    res.status(502).send({msg: "Mauvaise authentication du nom d'utilisateur ou du mot de passe !"})
                }
            });
        } else {
            res.status(502).send({msg: "Aucun utilisateur trouvé !"})
        }
    });
});


/********************** événements ************************************/
//  GET pour obtenir tous les événements
app.get('/events', (req, res) => {

    const query = 'SELECT * FROM evenements';
    conn.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des événements : ' + err);
            res.status(500).json({error: 'Erreur lors de la récupération des événements'});
            return;
        }
        res.json(results);
    });

});

//  POST pour ajouter un nouvel événement
app.post('/addEvents', (req, res) => {


    const query = "INSERT INTO evenements (Titre, Date_event) VALUES ('" + req.body.title + "', STR_TO_DATE('" + req.body.date + "', '%d/%m/%Y'))";
    conn.query(query, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de lévénement : ' + err);
            res.status(500).json({error: 'Erreur lors de l\'ajout de l\'événement'});
            return;
        }
        res.status(201).json({result});
    });

});

//  DELETE pour supprimer un événement par son ID
app.delete('/deleteEvents/:id', (req, res) => {
    const eventId = req.params.id;

    const query = 'DELETE FROM evenements WHERE id = ?';
    conn.query(query, [eventId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de l\'événement : ' + err);
            res.status(500).json({error: 'Erreur lors de la suppression de l\'événement'});
            return;
        }
        res.status(204).send();
    });
});


const server = app.listen(8081, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("TP2 Samba-Taha http://%s:%s", host, port)
});