import React, { useEffect, useState } from "react";
import { useAppContext } from "../libs/contextLib";
import Nav from "react-bootstrap/Nav";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import { LinkContainer } from "react-router-bootstrap";
import "./ListUsers.css";


export default function ListUsers() {
    const { contractMUT } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState(true);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        try {
            const users = await contractMUT.methods.getUsers().call();
            setUsers(users);
            console.log("users=", users);
            console.log("users[usersCount].emailHash=", users[users.length - 1].emailHash);
        }
        catch (e) {

            alert(e);
        }
        setIsLoading(false);
    }

    return (!isLoading &&
        <div className="ListUsers">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '100%' }}>
                    <Card.Header><strong>Liste des utilisateurs inscrits ({users.length})</strong></Card.Header>
                    <Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>@ WALLET</th>
                                            <th>EUR dépensés</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users !== null &&
                                            users.map((p) => <tr key={p.account}><td>{p.account}</td><td>{p.totalSpentEUR}</td></tr>)
                                        }
                                    </tbody>
                                </Table>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </div>
            <LinkContainer to="/">
                <Nav.Link><p>Retour</p></Nav.Link>
            </LinkContainer>
        </div>
    );
}