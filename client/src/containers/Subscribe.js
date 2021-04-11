import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAppContext } from "../libs/contextLib";
import "./Subscribe.css";

const sha256 = require('js-sha256').sha256;


export default function Subscribe() {
    const rewardFTK = "5000000000000000000"; // 5 FTK
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { accounts, contractFTK, contractMUT, usersCount, web3 } = useAppContext();
    const history = useHistory();

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        createUser();
    }

    async function createUser() {
        // The user's email address is not stored in the Token.
        // Its hash is stored instead to preserve anonimity.
        const emailHash = sha256(email);
        console.log("Génération du hash de l'email=", emailHash);

        // An Ethereum account is created for the user
        var newUserAccount = web3.eth.accounts.create();
        console.log("Génération d'une nouvelle adresse Ethereum'=", newUserAccount);
        // CHANGEME : in the final version, the private key will be stored in a secured centralized database
        localStorage.setItem(newUserAccount.address, `${email},${newUserAccount.privateKey}`);

        await contractMUT.methods.createUser(emailHash, newUserAccount.address).send({ from: accounts[0], gasPrice: 1000000 }, async function (erreur, tx) {
            if (tx) {
                console.log("[register] tx : ", tx);
                await web3.eth.getTransactionReceipt(tx, async function (erreur, receipt) {
                    console.log("[register] receipt.logs :", receipt.logs);
                });
                await contractFTK.methods.transfer(newUserAccount.address, rewardFTK).send({ from: accounts[0], gasPrice: 1000000 }, async function (erreur, tx) {
                    const balance = await contractFTK.methods.balanceOf(accounts[0]).call();
                    console.log(`balanceOf${newUserAccount.address}`, balance);
                });
                history.push({
                    pathname: "/listusers"
                });
            }
        });

    };

    return (
        <div className="Subscribe">
            <p>Nombre d'utilisateurs : {usersCount}</p>
            <h4>Formulaire d'inscription</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email (*)</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password (*)</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <div className="KYC">
                    [ Placeholder pour le KYC ]<br></br>( HORS-PERIMETRE DEMO )
                </div>
                <Button block size="lg" type="submit" disabled={!validateForm()}>
                    Confirmer
        </Button>
            </Form>

        </div>
    );
}