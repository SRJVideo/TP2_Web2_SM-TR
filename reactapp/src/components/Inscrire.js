import React, {Component, useState} from 'react';
import {NavLink} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";

function Inscrire() {


        return (
            <div>
                <h1>S'inscrire</h1>
                <p>Créer un nouvel utilisateur</p>


                <Form >
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="username">Nom d'utilisateur</Form.Label>
                        <Form.Control name="username" type="text" required></Form.Control>
                        <Form.Control.Feedback type="invalid">Veuillez entrez au moins un caractère alphanumérique</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="password">Mot de passe</Form.Label>
                        <Form.Control name="password" type="password"required></Form.Control>
                        <Form.Control.Feedback type="invalid">Veullez entrer un mot de passe avec au moins 4 caractères</Form.Control.Feedback>
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