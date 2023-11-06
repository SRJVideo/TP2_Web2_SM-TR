import { NavLink } from 'react-router-dom';
import {Button, Card} from "react-bootstrap";
import Axios from "axios";
function Navbar(props) {
    Axios.defaults.withCredentials = true;
    const procederDeconnexion= () => {
        fetch("http://localhost:8081/logout").then(res => res.json())
            .then(succ => console.log(succ)).catch(error => console.log(error));

        Axios.get("http://localhost:8081/logout")
    }

    return (
        <nav className="navBar">
            <ul>
                <NavLink exact to="/">Accueil</NavLink>
                {(props.logged !== undefined) ?
                    <NavLink to="/calendrier">Calendrier</NavLink>:
                    <NavLink to="/inscrire">S'inscrire</NavLink>
                }
                {(props.logged !== undefined) ?
                    <Button variant="danger" onClick={procederDeconnexion}>Déconnexion</Button>:
                    <NavLink to="/connecter">Se connecter</NavLink>
                }
                <li><Card variant='info' style={{ width: '9rem', marginLeft:'10ch'}} >
                    <Card.Body>
                        <Card.Text> {(props.logged !== undefined) ? props.logged.Full_Name : "Non Connecté"}</Card.Text>
                    </Card.Body>
                  </Card></li>
            </ul>
        </nav>
    );
}

export default Navbar;