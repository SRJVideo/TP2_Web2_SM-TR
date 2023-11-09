import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Container } from "react-bootstrap";
import Accueil from "./components/Accueil";
import Inscrire from "./components/Inscrire";
import Connecter from "./components/Connecter";
import Calendrier from "./components/Calendrier";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { useEffect, useState } from "react";
import Axios from "axios";

//deploiement : https://tp2-deploiement-react-sm-tr.vercel.app/
function App() {
    const [currPathname, setCurrPathname ] = useState("")
    const [loggedUser, setLooggedUser] = useState(undefined)
    Axios.defaults.withCredentials = true;
    useEffect(() => {
        // NE PAS OUBLIER DE CHANGER LA FIN DU TP !!!  URL deploy node == https://samba-taha-node-tp2.onrender.com
        Axios.get("http://localhost:8081/login").then((response) => {
            setLooggedUser(response.data.estConnecte === true ? response.data.utilisateur : undefined);
            if(loggedUser !== undefined) setCurrPathname("/calendrier");
        })
     
    }, [loggedUser])

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar user={loggedUser} path={currPathname} />
                <Container className='navBar'>
                    <Routes>
                        <Route exact path="/inscrire" element={<Inscrire />} />
                        <Route exact path="/connecter" element={<Connecter />} />
                        <Route exact path="/" element={<Accueil />} />
                        <Route path="/calendrier" element={<Calendrier user={loggedUser} />} />
                    </Routes>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;
