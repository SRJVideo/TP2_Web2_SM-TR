import React from 'react';
import Form from 'react-bootstrap/Form';
import {Button, Col} from "react-bootstrap";
import {NavLink} from "react-router-dom";

//  https://codewithhugo.com/pass-cookies-axios-fetch-requests/
class Connecter extends React.Component {

    state = {
        username: '',
        password: ''
    }
    procederConnexion =  async () => {
        // samba-taha-node-tp2.onrender.com
        await fetch("http://localhost:8081/loginUser", {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({nom: this.state.username, motdepasse: this.state.password})
        }).then( async res =>  await res.json())
            .then(async succ => await  console.log(  succ) )

    };


    handleChange =(e)=> {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.procederConnexion().catch(error => console.log(error));
    };


    render() {
        return (
            <div>
                <h1>Se Connecter</h1>
                <p>Connecter un utilisateur existant</p>
                <Form noValidate  onSubmit={this.handleSubmit} >
                    <Form.Group as={Col} className="mb-3">
                        <Form.Label htmlFor="username">Nom d'utilisateur</Form.Label>
                        <Form.Control name="username"
                                      type="text"
                                      onError={() => this.state.username.length < 1}
                                      onChange={this.handleChange}
                                      required></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="password">Mot de passe</Form.Label>
                        <Form.Control name="password"
                                      type="password"
                                      onError={() => this.state.password.length < 4}
                                      onChange={this.handleChange}
                                      required></Form.Control>
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