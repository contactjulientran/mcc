import React from "react";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

export default function Home() {
  return (
    <div className="App">
      <h3>3 Smart Contract sont utilisés :</h3>
      <ul>
        <li><b>MCCUserToken</b>: MUT est un Token ERC721, représente un utilisateur (email, montant total de ses dépenses).</li>
        <p className="App-desc">Il permet de valoriser la start-up MCC: plus il y a de tokens, plus il y a d'utilisateurs. Il offre de la <u>transparence et de la traçabilité</u> sur le nombre d'utilisateurs inscrits sur la plateforme et le CA généré.</p>
        <li><b>FidelityToken</b>: FTK est un Token ERC20, représente un point de fidélité.</li>
        <p className="App-desc">Il est utilisé pour récompenser les utilisateurs, qui pourront ensuite les dépenser à la place de l'EURO. 1 FTK = 1 EURO.</p>
        <li><b>MccAuction</b>: est un Smart Contract pour vendre aux enchères la société MCC. <br></br>Il n'est pas dans le périmètre de la DEMO.</li>
      </ul>
      <h3>Liste des user stories implémentées (périmètre de la DEMO) :</h3>
      <ol>
        <li>
          <LinkContainer to="/subscribe">
            <Nav.Link>Inscription d'un utilisateur</Nav.Link>
          </LinkContainer>
        </li>
        <p className="App-desc">Interaction avec le Smart Contract <b>MCCUserToken</b> (création d'un ERC721 MUT) et <b>FidelityToken</b> (initialisation de la balance en ERC20 FTK)</p>
        <li>
          <LinkContainer to="/listusers">
            <Nav.Link>Visualisation du wallet utilisateur</Nav.Link>
          </LinkContainer>
        </li>
        <p className="App-desc">Interaction avec les Smart Contract <b>FidelityToken</b> (balance en ERC20 FTK)</p>
        <li>
          <LinkContainer to="/payeuro">
            <Nav.Link>Paiement en EURO, rewarding FTK</Nav.Link>
          </LinkContainer>
        </li>
        <p className="App-desc">Interaction avec le Smart Contract <b>FidelityToken</b> (création de plusieurs ERC20 FTK et transfert sur le compte de l'utilisateur) et <b>MCCUserToken</b> (traçage du paiement)</p>
        <li>
          <LinkContainer to="/payftk">
            <Nav.Link>Paiement en FTK</Nav.Link>
          </LinkContainer>
        </li>
        <p className="App-desc">Interaction avec le Smart Contract <b>FidelityToken</b> (burn des ERC20 FTK utilisés)</p>
      </ol>
      <h3>Autre user stories (hors-périmètre) :</h3>
      <ol>
        <li>Vente aux enchères de la start-up MCC</li>
        <p className="App-desc">Interaction avec le Smart Contract <b>MccAuction</b></p>
      </ol>
    </div>
  );
}