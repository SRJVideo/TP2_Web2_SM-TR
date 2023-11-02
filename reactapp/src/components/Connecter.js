import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import {Button} from "react-bootstrap";
import {NavLink} from "react-router-dom";

class Connecter extends Component {
    render() {
        return (
            <div>
                <h1>Se Connecter</h1>
                <p>Entrez vos identifiants</p>

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="username">Nom d'utilisateur</Form.Label>
                        <Form.Control name="username" type="text"></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="password">Mot de passe</Form.Label>
                        <Form.Control name="password" type="password"></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Text muted>Vons n'avez pas de compte ?&nbsp;
                           <NavLink to="/inscrire">Inscrivez-vous</NavLink>
                            &nbsp;ici</Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Continuer
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Connecter;