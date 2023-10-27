import { NavLink } from 'react-router-dom';
function Navbar() {
    return (
        <nav className="navBar">
            <ul>
                <li><NavLink exact to="/">Accueil</NavLink></li>
                <li><NavLink to="/connect">Se connecter</NavLink></li>

            </ul>
        </nav>
    );
}

export default Navbar;