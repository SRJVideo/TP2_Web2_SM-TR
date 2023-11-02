import React, {useState} from 'react';
import {NavLink} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";

function Inscrire() {
   // https://react-bootstrap.github.io/docs/forms/validation/
        const [validated, setValidated] = useState(false);
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");

        const handleSubmit = (event) => {
            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                console.log("Tout est null");
            }
            console.log(username+" : "+password);

            procederInscription();
            setValidated(true);
        };

        const procederInscription = () => {
            fetch("http://localhost:8081/addUser", {
                method: "POST",
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({"nom": username, "motdepasse": password})
            }).then( res => res.json())
                .then(succes => console.log("Succes :",succes))
                .catch(error => console.log(error));
        }

        return (
            <div>
                <h1>S'inscrire</h1>
                <p>Créer un nouvel utilisateur</p>


                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="username">Nom d'utilisateur</Form.Label>
                        <Form.Control name="username"  type="text" isInvalid={username.length < 1} onChange={e => setUsername(e.target.value)} required></Form.Control>
                        <Form.Control.Feedback type="invalid">Veuillez entrez au moins un caractère alphanumérique</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="password">Mot de passe</Form.Label>
                        <Form.Control name="password" type="password" isInvalid={password.length < 4} onChange={e => setPassword(e.target.value)} required></Form.Control>
                        <Form.Control.Feedback type="invalid">Votre mot de passe doit contenir au moins 4 caractères</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Text>
                            Si votre compte existe déjà,&nbsp;
                            <NavLink to="/connecter">Connectez-vous</NavLink>
                            &nbsp;ici
                        </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Continuer
                    </Button>
                </Form>
            </div>
        );

}

export default Inscrire;