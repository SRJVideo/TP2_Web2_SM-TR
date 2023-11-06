import {NavLink, useNavigate} from 'react-router-dom';
import {Button, Card} from "react-bootstrap";
import Axios from "axios";
function Navbar(props) {
    const nav = useNavigate();
    Axios.defaults.withCredentials = true;
    const procederDeconnexion= () => {
        Axios.get("http://localhost:8081/logout").catch(er => console.log(er))
        nav("/")
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
                        <Card.Text> {(props.logged !== undefined) ? <strong>{props.logged.Full_Name}</strong> :<i>Non Connecté</i> }</Card.Text>
                    </Card.Body>
                  </Card></li>
            </ul>
        </nav>
    );
}

export default Navbar;